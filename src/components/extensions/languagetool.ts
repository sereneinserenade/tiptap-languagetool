import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'
import { debounce } from 'lodash'
import { LanguageToolResponse, Match } from '../../types'
import { v4 as uuidv4 } from 'uuid'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    languagetool: {
      /**
       * Proofreads whole document
       */
      proofread: () => ReturnType
    }
  }
}

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

let proofReadInitially = false

enum LanguageToolHelpingWords {
  LanguageToolTransactionName = 'languageToolTransaction',
  MatchUpdatedTransactionName = 'matchUpdated',
}

const updateMatch = (m?: Match) => {
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

  if (matchString) updateMatch(JSON.parse(matchString))
  else updateMatch()
}

const mouseLeaveEventListener = () => updateMatch()

const addEventListenersToDecorations = () => {
  const decos = document.querySelectorAll('span.lt')

  if (decos.length) {
    decos.forEach((el) => {
      el.addEventListener('click', mouseEnterEventListener)
      el.addEventListener('mouseleave', mouseLeaveEventListener)
    })
  }
}

export function changedDescendants(
  old: PMNode,
  cur: PMNode,
  offset: number,
  f: (node: PMNode, pos: number, cur: PMNode) => void,
): void {
  const oldSize = old.childCount,
    curSize = cur.childCount
  outer: for (let i = 0, j = 0; i < curSize; i++) {
    const child = cur.child(i)

    for (let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
      if (old.child(scan) === child) {
        j = scan + 1
        offset += child.nodeSize
        continue outer
      }
    }

    f(child, offset, cur)

    if (j < oldSize && old.child(j).sameMarkup(child)) changedDescendants(old.child(j), child, offset + 1, f)
    else child.nodesBetween(0, child.content.size, f, offset + 1)

    offset += child.nodeSize
  }
}

const proofreadNodeAndUpdateItsDecorations = async (node: PMNode, offset: number, cur: PMNode) => {
  const ltRes: LanguageToolResponse = await (
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: `text=${encodeURIComponent(node.textContent)}&language=auto&enabledOnly=false`,
    })
  ).json()

  decorationSet = decorationSet.remove(decorationSet.find(offset, offset + node.nodeSize))

  const nodeSpecificDecorations: Decoration[] = []

  for (const match of ltRes.matches) {
    const from = match.offset + offset
    const to = from + match.length

    const decoration = Decoration.inline(from, to, {
      class: `lt lt-${match.rule.issueType}`,
      nodeName: 'span',
      match: JSON.stringify(match),
      uuid: uuidv4(),
    })

    nodeSpecificDecorations.push(decoration)
  }

  decorationSet = decorationSet.add(cur, nodeSpecificDecorations)

  editorView.dispatch(editorView.state.tr.setMeta(LanguageToolHelpingWords.LanguageToolTransactionName, true))
}

const debouncedProofreadNodeAndUpdateItsDecorations = debounce(proofreadNodeAndUpdateItsDecorations, 500)

const moreThan500Words = (s: string) => s.trim().split(/\s+/).length >= 500

const getMatchAndSetDecorations = async (doc: PMNode, text: string, originalFrom: number) => {
  const ltRes: LanguageToolResponse = await (
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: `text=${encodeURIComponent(text)}&language=auto&enabledOnly=false`,
    })
  ).json()

  const { matches } = ltRes

  const decorations: Decoration[] = []

  for (const match of matches) {
    const from = match.offset + originalFrom
    const to = from + match.length

    const decoration = Decoration.inline(from, to, {
      class: `lt lt-${match.rule.issueType}`,
      nodeName: 'span',
      match: JSON.stringify(match),
      uuid: uuidv4(),
    })

    decorations.push(decoration)
  }

  decorationSet = decorationSet.remove(decorationSet.find(originalFrom, originalFrom + text.length))

  decorationSet = decorationSet.add(doc, decorations)

  editorView.dispatch(editorView.state.tr.setMeta(LanguageToolHelpingWords.LanguageToolTransactionName, true))

  setTimeout(addEventListenersToDecorations)
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

  const chunksOf500Words: { from: number; text: string }[] = []

  let upperFrom = 0
  let newDataSet = true

  let lastPos = 1

  for (const { text, from, to } of textNodesWithPosition) {
    if (!newDataSet) {
      upperFrom = from

      newDataSet = true
    } else {
      const diff = from - lastPos
      if (diff > 0) finalText += Array(diff + 1).join(' ')
    }

    lastPos = to

    finalText += text

    if (moreThan500Words(finalText)) {
      const updatedFrom = chunksOf500Words.length ? upperFrom : upperFrom + 1

      chunksOf500Words.push({
        from: updatedFrom,
        text: finalText,
      })

      finalText = ''
      newDataSet = false
    }
  }

  chunksOf500Words.push({
    from: chunksOf500Words.length ? upperFrom : 1,
    text: finalText,
  })

  for (const { from, text } of chunksOf500Words) {
    getMatchAndSetDecorations(doc, text, from)
  }

  proofReadInitially = true
}

const debouncedProofreadAndDecorate = debounce(proofreadAndDecorateWholeDoc, 1000)

interface LanguageToolOptions {
  language: string
  apiUrl: string
  automaticMode: boolean
}

interface LanguageToolStorage {
  match: Match
}

export const LanguageTool = Extension.create<LanguageToolOptions, LanguageToolStorage>({
  name: 'languagetool',

  addOptions() {
    return {
      language: 'auto',
      apiUrl: process?.env?.VUE_APP_LANGUAGE_TOOL_URL + 'check',
      automaticMode: true,
    }
  },

  addStorage() {
    return {
      match: match,
    }
  },

  addCommands() {
    return {
      proofread:
        () =>
        ({ tr }) => {
          proofreadAndDecorateWholeDoc(tr.doc, this.options.apiUrl)
          return true
        },
    }
  },

  addProseMirrorPlugins() {
    const { apiUrl } = this.options

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
        },
        state: {
          init: (config, state) => {
            decorationSet = DecorationSet.create(state.doc, [])

            if (this.options.automaticMode) proofreadAndDecorateWholeDoc(state.doc, apiUrl)

            return decorationSet
          },
          apply: (tr, oldPluginState, oldEditorState) => {
            const matchUpdated = tr.getMeta(LanguageToolHelpingWords.MatchUpdatedTransactionName)

            if (matchUpdated) this.storage.match = match

            const languageToolDecorations = tr.getMeta(LanguageToolHelpingWords.LanguageToolTransactionName)

            if (languageToolDecorations) return decorationSet

            if (tr.docChanged && this.options.automaticMode) {
              if (!proofReadInitially) debouncedProofreadAndDecorate(tr.doc, apiUrl)
              else changedDescendants(oldEditorState.doc, tr.doc, 0, debouncedProofreadNodeAndUpdateItsDecorations)
            }

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
