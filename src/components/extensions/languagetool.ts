import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet, EditorView, InlineDecorationSpec } from 'prosemirror-view'
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { findBlockNodes } from 'prosemirror-utils'
import { debounce } from 'lodash'
import { LanguageToolResponse } from '../../types'
import { NodeWithPos } from '@tiptap/vue-3'

let editorView: EditorView<any>;

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
    const pos = item.pos
    const matches = languageToolResponse.matches
    const node = item.node


    for (const match of matches) {
      const from = pos + match.offset
      const to = from + match.length

      const decoration = Decoration.inline(from, to, {
        class: 'lt-thing',
      })

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
        },
        state: {
          init: (config, state) => {
            const finalUrl = `${apiUrl}?language=${language}&text=`
            apiRequest(state.doc, finalUrl)

            return DecorationSet.create(state.doc, [])
          },
          apply: (tr, decorationSet) => {
            const { doc } = tr
            if (tr.docChanged) {
              const finalUrl = `${apiUrl}?language=${language}&text=`

              debouncedApiRequest(doc, finalUrl)
            }

            const languageToolDecorations = tr.getMeta(LanguageToolWords.TransactionMetaName)

            if (languageToolDecorations === undefined && !tr.docChanged) return decorationSet

            return DecorationSet.create(doc, languageToolDecorations)
          },
        },
        view: (view) => {
          return {
            update(view) {
              editorView = view;
            }
          }
        }
      })
    ]
  },
})
