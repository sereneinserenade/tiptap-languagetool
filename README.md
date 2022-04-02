# tiptap-languagetool

Extension for integrating [Languagetool](https://languagetool.org/) with [TipTap](https://tiptap.dev). You can have your self-hosted instance of LanguageTool, details are [here](https://dev.languagetool.org/http-server). 

Special thanks to https://github.com/rezaffm for sponsoring this project.

## Demo:

- You can try out a version with mocked data at https://tiptap-languagetool.vercel.app/. The code for demo is in [`mocked-demo` branch](https://github.com/sereneinserenade/tiptap-languagetool/tree/mocked-demo).

https://user-images.githubusercontent.com/45892659/148092446-86816377-82c7-40be-940f-fa37e4f5a972.mp4

## How to use

Copy the [languagetool.ts](src/components/extensions/languagetool.ts) or [languagetool.js](dist/languagetool.js) file in your project depending on whether you use TypeScript or not. Then import the extension from that file and give it to the TipTap.

```ts
import { LanguageTool, Match } from './extensions/languagetool'

const match = ref<Match>(null)

const updateMatch = (editor: Editor) => match.value = editor.extensionStorage.languagetool.match

const replacements = computed(() => match.value?.replacements || [])

const matchMessage = computed(() => match.value?.message || 'No Message')

const updateHtml = () => navigator.clipboard.writeText(editor.value.getHTML())

const acceptSuggestion = (sug) => {
  editor.value.commands.insertContent(sug.value)
}

const proofread = () => editor.value.commands.proofread()

const editor = useEditor({
  content,
  extensions: [StarterKit, LanguageTool.configure({ 
    language: 'auto', // it can detect language automatically or you can write your own language like 'en-US'
    apiUrl: YOUR_LANGUAGETOOL_SERVER_URL_HERE + 'check', // For testing purposes, you can use [Public API](https://dev.languagetool.org/public-http-api), but keep an eye on the rules that they've written there
    automaticMode: true, // if true, it will start proofreading immediately otherwise only when you execute `proofread` command of the extension.
  })],
  onUpdate({ editor }) {
    setTimeout(() => updateMatch(editor as any))
  },
  onSelectionUpdate({ editor }) {
    setTimeout(() => updateMatch(editor as any))
  },
})
```

Now showing the suggestion on click, so now in the vue component where you've implemented tiptap.

```vue
<bubble-menu
  class="bubble-menu"
  v-if="editor"
  :editor="editor"
  :tippy-options="{ placement: 'bottom', animation: 'fade' }"
>
  <section class="bubble-menu-section-container">
    <section class="message-section">
      {{ matchMessage }}
    </section>
    <section class="suggestions-section">
      <article
        v-for="(replacement, i) in replacements"
        @click="() => acceptSuggestion(replacement)"
        :key="i + replacement.value"
        class="suggestion"
      >
        {{ replacement.value }}
      </article>
    </section>
  </section>
</bubble-menu>
```

You can implement your own styles or copy the ones in [Tiptap.vue](src/components/Tiptap.vue).

-------------------------------------------------------------
-------------------------------------------------------------

## Stuff that nobody really cares about(Project setup)
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
