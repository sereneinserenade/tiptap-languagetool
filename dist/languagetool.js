import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { debounce } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
let editorView
let decorationSet
let apiUrl = ''
const flatten = (node) => {
  if (!node) throw new Error('Invalid "node" parameter')
  const result = []
  node.descendants((child, pos) => {
    result.push({ node: child, pos: pos })
  })
  return result
}
const findChildren = (node, predicate) => {
  if (!node) throw new Error('Invalid "node" parameter')
  else if (!predicate) throw new Error('Invalid "predicate" parameter')
  return flatten(node).filter((child) => predicate(child.node))
}
const findBlockNodes = (node) => findChildren(node, (child) => child.isBlock)
var LanguageToolWords
;(function (LanguageToolWords) {
  LanguageToolWords['TransactionMetaName'] = 'languageToolDecorations'
})(LanguageToolWords || (LanguageToolWords = {}))
const proofreadAndDecorateWholeDoc = async (doc, url) => {
  apiUrl = url
  let text = ''
  let lastPos = 0
  findBlockNodes(doc).forEach(({ node, pos }, index) => {
    if (index === 0) {
      lastPos = 0
    } else {
      const diff = pos - lastPos
      if (diff > 0) text += Array(diff + 1).join(' ')
    }
    lastPos = pos + node.textContent.length
    text += node.textContent
  })
  const ltRes = await (
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
  const decorations = []
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
  editorView.dispatch(editorView.state.tr.setMeta(LanguageToolWords.TransactionMetaName, true))
}
const debouncedProofreadAndDecorate = debounce(proofreadAndDecorateWholeDoc, 1000)
export const LanguageTool = Extension.create({
  name: 'languagetool',
  addOptions() {
    return {
      language: 'auto',
      apiUrl: process.env.VUE_APP_LANGUAGE_TOOL_URL + 'check',
    }
  },
  addStorage() {
    return {
      // TODO: use this to give the access of LT results outside of tiptap
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
          apply: (tr, oldDecos, oldState) => {
            const languageToolDecorations = tr.getMeta(LanguageToolWords.TransactionMetaName)
            if (languageToolDecorations) return decorationSet
            if (tr.docChanged) debouncedProofreadAndDecorate(tr.doc, apiUrl)
            decorationSet = decorationSet.map(tr.mapping, tr.doc)
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
//# sourceMappingURL=languagetool.js.map
