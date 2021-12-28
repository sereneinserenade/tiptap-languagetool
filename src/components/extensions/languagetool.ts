import { Extension, NodeWithPos, Predicate } from '@tiptap/core'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Node as PMNode } from 'prosemirror-model'
import { debounce } from 'lodash'
import { LanguageToolResponse } from '../../types'

let editorView: EditorView

let decorationSet: DecorationSet

let apiUrl = ''

const flatten = (node: PMNode) => {
  if (!node) throw new Error('Invalid "node" parameter')

  const result: { node: PMNode; pos: number }[] = []

  node.descendants((child, pos) => {
    result.push({ node: child, pos: pos })
  })

  return result
}

const findChildren = (node: PMNode, predicate: Predicate): NodeWithPos[] => {
  if (!node) throw new Error('Invalid "node" parameter')
  else if (!predicate) throw new Error('Invalid "predicate" parameter')

  return flatten(node).filter((child) => predicate(child.node))
}

const findBlockNodes = (node: PMNode): NodeWithPos[] => findChildren(node, (child) => child.isBlock)

enum LanguageToolWords {
  TransactionMetaName = 'languageToolDecorations',
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
      if (old.child(scan) == child) {
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
  const ltRes: LanguageToolResponse = await (await fetch(`${apiUrl}${node.textContent}`)).json()

  decorationSet = decorationSet.remove(decorationSet.find(offset, offset + node.nodeSize))

  const nodeSpecificDecorations: Decoration[] = []

  for (const match of ltRes.matches) {
    const from = match.offset + offset
    const to = from + match.length

    const decoration = Decoration.inline(from, to, {
      class: `lt lt-${match.rule.issueType}`,
      nodeName: 'span',
      match: JSON.stringify(match),
    })

    nodeSpecificDecorations.push(decoration)
  }

  decorationSet = decorationSet.add(cur, nodeSpecificDecorations)

  editorView.dispatch(editorView.state.tr.setMeta(LanguageToolWords.TransactionMetaName, true))
}

const debouncedProofreadNodeAndUpdateItsDecorations = debounce(proofreadNodeAndUpdateItsDecorations, 200)

const proofreadAndDecorateWholeDoc = async (doc: PMNode, url: string, whole = true, oldDoc?: PMNode) => {
  apiUrl = url

  let text = ''

  if (!whole && oldDoc) {
    changedDescendants(oldDoc, doc, 0, debouncedProofreadNodeAndUpdateItsDecorations)
    return
  }

  findBlockNodes(doc).forEach(({ node }) => (text += node.textContent + '  '))

  const ltRes: LanguageToolResponse = await (await fetch(`${apiUrl}${text}`)).json()

  const { matches } = ltRes

  const decorations: Decoration[] = []

  for (const match of matches) {
    const from = 1 + match.offset
    const to = from + match.length

    const decoration = Decoration.inline(from, to, {
      class: `lt lt-${match.rule.issueType}`,
      nodeName: 'span',
      match: JSON.stringify(match),
    })

    decorations.push(decoration)
  }

  decorationSet = DecorationSet.create(doc, decorations)

  editorView.dispatch(editorView.state.tr.setMeta(LanguageToolWords.TransactionMetaName, true))
}

const debouncedProofreadAndDecorate = debounce(proofreadAndDecorateWholeDoc, 1000)

interface LanguageToolOptions {
  language: string
  apiUrl: string
}

export const LanguageTool = Extension.create<LanguageToolOptions>({
  name: 'languagetool',

  addOptions() {
    return {
      language: 'auto',
      apiUrl: process.env.VUE_APP_LANGUAGE_TOOL_URL + '/check',
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
            const finalUrl = `${apiUrl}?language=${language}&text=`

            decorationSet = DecorationSet.create(state.doc, [])

            proofreadAndDecorateWholeDoc(state.doc, finalUrl)

            return decorationSet
          },
          apply: (tr, oldDecos, oldState) => {
            const languageToolDecorations = tr.getMeta(LanguageToolWords.TransactionMetaName)

            if (languageToolDecorations) return decorationSet

            if (tr.docChanged)
              debouncedProofreadAndDecorate(tr.doc, `${apiUrl}?language=${language}&text=`, false, oldState.doc)

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
