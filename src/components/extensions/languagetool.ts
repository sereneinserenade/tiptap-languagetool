import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'
import { debounce } from 'lodash'
import { LanguageToolResponse, Match } from '../../types'
import { v4 as uuidv4 } from 'uuid'

interface TextNodesWithPosition {
  text: string
  from: number
  to: number
}

let editorView: EditorView

let decorationSet: DecorationSet

let apiUrl = ''

let textNodesWithPosition: TextNodesWithPosition[] = []

let match: Match | undefined = undefined

enum LanguageToolHelpingWords {
  LanguageToolTransactionName = 'languageToolTransaction',
  MatchUpdatedTransactionName = 'matchUpdated',
}

const udpateMatch = (m?: Match) => {
  if (m) match = m
  else match = undefined

  editorView.dispatch(editorView.state.tr.setMeta('matchUpdated', true))
}

const selectElementText = (el) => {
  const range = document.createRange()
  range.selectNode(el)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

const mouseEnterEventListener = (e) => {
  selectElementText(e.target)

  const matchString = e.target.getAttribute('match')

  if (matchString) udpateMatch(JSON.parse(matchString))
  else udpateMatch()
}

const mouseLeaveEventListener = () => udpateMatch()

const addEventListenersToDecorations = () => {
  const decos = document.querySelectorAll('span.lt')

  if (decos.length) {
    decos.forEach((el) => {
      el.addEventListener('click', mouseEnterEventListener)
      el.addEventListener('mouseleave', mouseLeaveEventListener)
    })
  }
}

const proofreadAndDecorateWholeDoc = async (doc: PMNode, url: string) => {
  apiUrl = url

  textNodesWithPosition = []

  let index = 0
  doc?.descendants((node, pos) => {
    if (node.isText) {
      if (textNodesWithPosition[index]) {
        const text = textNodesWithPosition[index].text + node.text
        const from = textNodesWithPosition[index].from
        const to = from + text.length

        textNodesWithPosition[index] = { text, from, to }
      } else {
        const text = node.text
        const from = pos
        const to = pos + text.length

        textNodesWithPosition[index] = { text, from, to }
      }
    } else {
      index += 1
    }
  })

  textNodesWithPosition = textNodesWithPosition.filter(Boolean)

  let finalText = ''

  let lastPos = 1
  for (const { text, from, to } of textNodesWithPosition) {
    const diff = from - lastPos
    if (diff > 0) finalText += Array(diff + 1).join(' ')
    lastPos = to

    finalText += text
  }

  const ltRes: LanguageToolResponse = await (
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: `text=${encodeURIComponent(finalText)}&language=auto&enabledOnly=false`,
    })
  ).json()

  const { matches } = ltRes

  const decorations: Decoration[] = []

  for (const match of matches) {
    const from = 1 + match.offset
    const to = from + match.length

    const decoration = Decoration.inline(from, to, {
      class: `lt lt-${match.rule.issueType}`,
      nodeName: 'span',
      match: JSON.stringify(match),
      uuid: uuidv4(),
    })

    decorations.push(decoration)
  }

  decorationSet = DecorationSet.create(doc, decorations)

  editorView.dispatch(editorView.state.tr.setMeta(LanguageToolHelpingWords.LanguageToolTransactionName, true))

  setTimeout(addEventListenersToDecorations)
}

const debouncedProofreadAndDecorate = debounce(proofreadAndDecorateWholeDoc, 1000)

interface LanguageToolOptions {
  language: string
  apiUrl: string
}

interface LanguageToolStorage {
  match: Match
}

export const LanguageTool = Extension.create<LanguageToolOptions, LanguageToolStorage>({
  name: 'languagetool',

  addOptions() {
    return {
      language: 'auto',
      apiUrl: process.env.VUE_APP_LANGUAGE_TOOL_URL + 'check',
    }
  },

  addStorage() {
    return {
      match: match,
    }
  },

  addProseMirrorPlugins() {
    const { language, apiUrl } = this.options

    return [
      new Plugin({
        key: new PluginKey('languagetool'),
        props: {
          decorations(state) {
            return this.getState(state)
          },
          attributes: {
            spellcheck: 'false',
          },
          handleDOMEvents: {
            // TODO: check this out for the hover on current decoration
            // contextmenu: (view, event) => {
            //   const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
            //   if (pos === undefined) return
            //   const { decorations, matches } = this.getState(view.state)
            //   const deco = (decorations as DecorationSet).find(pos, pos)[0]
            //   if (!deco) return false
            //   const match = matches[deco.spec.id]
            //   const selectionTransaction = view.state.tr.setSelection(
            //     TextSelection.create(view.state.doc, deco.from, deco.to),
            //   )
            //   view.dispatch(selectionTransaction)
            //   const dialog = new DialogLT(options.editor, view, match)
            //   dialog.init()
            //   event.preventDefault()
            //   return true
            // },
          },
        },
        state: {
          init: (config, state) => {
            decorationSet = DecorationSet.create(state.doc, [])

            proofreadAndDecorateWholeDoc(state.doc, apiUrl)

            return decorationSet
          },
          apply: (tr) => {
            const matchUpdated = tr.getMeta(LanguageToolHelpingWords.MatchUpdatedTransactionName)

            if (matchUpdated) {
              this.storage.match = match
              console.log('Match Updated', match)
            }

            const languageToolDecorations = tr.getMeta(LanguageToolHelpingWords.LanguageToolTransactionName)

            if (languageToolDecorations) return decorationSet

            if (tr.docChanged) debouncedProofreadAndDecorate(tr.doc, apiUrl)

            decorationSet = decorationSet.map(tr.mapping, tr.doc)

            setTimeout(addEventListenersToDecorations)

            return decorationSet
          },
        },
        view: (view) => {
          return {
            update(view) {
              editorView = view
            },
          }
        },
      }),
    ]
  },
})
