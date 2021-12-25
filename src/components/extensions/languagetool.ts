import { Extension, NodeWithPos, Predicate } from '@tiptap/core'
import { Decoration, DecorationSet, EditorView, InlineDecorationSpec } from 'prosemirror-view'
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { debounce } from 'lodash'
import { getChangedNodes } from '@remirror/core-utils';
import { LanguageToolResponse } from '../../types'

const possibleIssueTypes = ['addition', 'characters', 'duplication', 'formatting', 'grammar', 'inconsistency', 'inconsistententities', 'internationalization', 'legal', 'length', 'localespecificcontent', 'localeviolation', 'markup', 'misspelling', 'mistranslation', 'nonconformance', 'numbers', 'omission', 'other', 'patternproblem', 'register', 'style', 'terminology', 'typographical', 'uncategorized', 'untranslated', 'whitespace']

let editorView: EditorView<any>;

let decorationSet: DecorationSet;

const flatten = (node: ProsemirrorNode) => {
  if (!node) throw new Error('Invalid "node" parameter')
  let result: { node: ProsemirrorNode; pos: number }[] = []
  node.descendants((child, pos) => { result.push({ node: child, pos: pos }) });
  return result
};

const findChildren = (node: ProsemirrorNode, predicate: Predicate): NodeWithPos[] => {
  if (!node) throw new Error('Invalid "node" parameter')
  else if (!predicate) throw new Error('Invalid "predicate" parameter')

  return flatten(node).filter((child) => predicate(child.node))
};

const findBlockNodes = (node: ProsemirrorNode): NodeWithPos[] => findChildren(node, (child) => child.isBlock);

export function changedDescendants(old: ProsemirrorNode, cur: ProsemirrorNode, offset: number, f: (node: ProsemirrorNode, pos: number) => void) {
  let oldSize = old.childCount, curSize = cur.childCount
  outer: for (let i = 0, j = 0; i < curSize; i++) {
    let child = cur.child(i)

    for (let scan = j, e = Math.min(oldSize, i + 3); scan < e; scan++) {
      if (old.child(scan) == child) {
        j = scan + 1
        offset += child.nodeSize
        continue outer
      }
    }

    f(child, offset)

    if (j < oldSize && old.child(j).sameMarkup(child)) changedDescendants(old.child(j), child, offset + 1, f)

    else child.nodesBetween(0, child.content.size, f, offset + 1)

    offset += child.nodeSize;
  }
}

enum LanguageToolWords {
  TransactionMetaName = 'languageToolDecorations'
}

interface LanguageToolPromiseResult {
  item: NodeWithPos;
  languageToolResponse: LanguageToolResponse;
}

const createDecorationsAndUpdateState = (res: LanguageToolPromiseResult[]): void => {
  const view = editorView
  const { state } = view

  const decorations: Decoration<{ [key: string]: any } & InlineDecorationSpec>[] = [];

  res.forEach(({ languageToolResponse, item }) => {
    const pos = item.pos + 1
    const matches = languageToolResponse.matches

    for (const match of matches) {
      const from = pos + match.offset
      const to = from + match.length

      // debugger

      const decoration = Decoration.inline(from, to, { class: `lt lt-${match.rule.issueType}`, nodeName: 'span' })

      decorations.push(decoration)
    }
  })

  view.dispatch(state.tr.setMeta(LanguageToolWords.TransactionMetaName, decorations))
}

const apiRequest = (doc: ProsemirrorNode<any>, apiUrl: string) => {
  const view = editorView

  const blockNodes = findBlockNodes(doc).filter(item => item.node.isTextblock && !item.node.type.spec.code && item.node.textContent.length);

  const promises = blockNodes.map(async item => {
    const languageToolResponse: LanguageToolResponse = await (await fetch(`${apiUrl}${item.node.textContent}`)).json()
    return { item, languageToolResponse }
  })

  Promise.all(promises).then(createDecorationsAndUpdateState)
}

let debouncedApiRequest = debounce(apiRequest, 1000);

interface LanguageToolOptions {
  language: string,
  apiUrl: string
}

export const LanguageTool = Extension.create<LanguageToolOptions>({
  name: 'languagetool',

  addOptions() {
    return {
      language: 'en-US',
      apiUrl: 'http://localhost:8081/v2/check'
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
          decorations(state) { return this.getState(state) },
          attributes: {
            spellcheck: "false"
          },
          handleDOMEvents: {
            // TODO: check this out
            // contextmenu: (view, event) => {
            //   let pos = view.posAtCoords({ left: event.clientX, top: event.clientY  })?.pos

            //   if (pos === undefined) return

            //   const { decorations, matches } = this.getState(view.state)
            //   const deco = (decorations as DecorationSet).find(pos, pos)[0]

            //   if (!deco) return false

            //   const match = matches[deco.spec.id]
            //   const selectionTransaction = view.state.tr.setSelection(TextSelection.create(view.state.doc, deco.from, deco.to))
              
            //   view.dispatch(selectionTransaction)

              // const dialog = new DialogLT(options.editor, view, match)
              // dialog.init()
              // event.preventDefault()
              // return true
            // }
          },
        },
        state: {
          init: (config, state) => {
            const finalUrl = `${apiUrl}?language=${language}&text=`
            apiRequest(state.doc, finalUrl)

            decorationSet = DecorationSet.create(state.doc, [])

            return decorationSet
          },
          apply: (tr, decorationSet) => {
            const languageToolDecorations = tr.getMeta(LanguageToolWords.TransactionMetaName)

            if (languageToolDecorations) {
              decorationSet = DecorationSet.create(tr.doc, languageToolDecorations)
              return decorationSet
            }

            if (tr.docChanged) debouncedApiRequest(tr.doc, `${apiUrl}?language=${language}&text=`)

            decorationSet = decorationSet.map(tr.mapping, tr.doc)

            return decorationSet
          },
        },
        view: (view) => {
          return {
            update(view) {
              editorView = view;
            }
          }
        },
      })
    ]
  },
})
