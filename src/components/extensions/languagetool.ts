import { Extension, } from '@tiptap/core'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { Plugin, PluginKey, TextSelection } from 'prosemirror-state'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { debounce } from 'lodash'

function renderIcon(issue: any) {
  const icon: any = document.createElement('div')

  icon.className = 'lint-icon'
  icon.title = issue.message
  icon.issue = issue

  return icon
}

function runAllLinterPlugins(doc: ProsemirrorNode, plugins: any[]) {
  const decorations: [any?] = []

  const results = plugins.map(lp => new lp(doc).scan().getResults()).flat()

  results.forEach(issue => {
    decorations.push(Decoration.inline(issue.from, issue.to, { class: 'problem', }), Decoration.widget(issue.from, renderIcon(issue)))
  })

  return DecorationSet.create(doc, decorations)
}

let editorView: EditorView<any>;

// const apiRequest = (matching) => {
//   setTimeout(() => {
//     let newDecs = decorateNodes(matching)
//     EditorView.dispatch(EditorView.state.tr.setMeta("asyncDecorations", newDecs))
//   }, 100);
// }

// let debouncedApiRequest = debounce(apiRequest, 1000);

export const LanguageTool = Extension.create<any>({
  name: 'languagetool',

  addOptions() {
    return {
      language: 'en-US',
    }
  },

  addStorage() {
    return {
      // TODO: use this to give the access of LT results outside of tiptap
    }
  },

  addProseMirrorPlugins() {

    return [
      new Plugin({
        key: new PluginKey('languagetool'),
        props: {
          decorations(state) { return this.getState(state) },
        },
        state: {
          init: (config, state) => {
            return DecorationSet.create(state.doc, [])
          },
          apply: (tr, decorationSet) => {
            if (tr.docChanged) {
              const { doc } = tr
              // Find all nodes with text to send to the spell checker
              const nodesWithText = doc.descendants((node) => {
                if (node.isText) {
                  const text = node.text

                  if (text) {
                    fetch(`http://localhost:8081/v2/check?language=en-US&text=${text}`)
                      .then((res) => console.log(res.json()))
                  }
                }
              })
              // const matching = findBlockNodes(doc).filter((item) => item.node.isTextblock && !item.node.type.spec.code);
              // debouncedApiRequest(matching);
            }

            // const asyncDecs = tr.getMeta("asyncDecorations")
            // if (asyncDecs === undefined && !tr.docChanged) {
            //   return decorationSet
            // }

            // console.log('received async decorations', asyncDecs);

            return decorationSet
          },
        },
        view: function (view) {
          return {
            update(view, prevState) {
              editorView = view;
            }
          }
        }
      })

    ]
  },
})
