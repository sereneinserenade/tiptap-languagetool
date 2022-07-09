# tiptap-languagetool

Extension for integrating [Languagetool](https://languagetool.org/) with [TipTap](https://tiptap.dev). You can have your self-hosted instance of LanguageTool, details for that are [here](https://dev.languagetool.org/http-server). 

A ⭐️ to the repo if you 👍 / ❤️  what I'm doing would be much appreciated. If you're using this extension and making money from it, it'd be very kind of you to [:heart: Sponsor me](https://github.com/sponsors/sereneinserenade). If you're looking for a **dev to work you on your project's Rich Text Editor** with or as **a frontend developer, [DM me on Discord/Twitter/LinkedIn](https://github.com/sereneinserenade)👨‍💻🤩.

I've made a bunch of extensions for Tiptap 2, some of them are **Google Docs like Commenting**, **Search and Replace**, **Resizable Images and Videos** with tiptap. You can check it our here https://github.com/sereneinserenade#a-glance-of-my-projects.

Special thanks to [@rezaffm](https://github.com/rezaffm) for sponsoring this project. 

## Live Demo

You can try out live-demo with mocked data at https://tiptap-languagetool.vercel.app/ or look at the demo-video below. The code for demo is in [`mocked-demo` branch](https://github.com/sereneinserenade/tiptap-languagetool/tree/mocked-demo).

<details>
  <summary> <b> Demo Video </b> </summary>
 
  https://user-images.githubusercontent.com/45892659/148092446-86816377-82c7-40be-940f-fa37e4f5a972.mp4
</details>

  
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

You can implement your own styles or copy the ones in [Tiptap.vue](https://github.com/sereneinserenade/tiptap-languagetool/blob/main/src/components/Tiptap.vue#L85-L191).


## Stargazers

[![Stargazers repo roster for @sereneinserenade/tiptap-languagetool](https://reporoster.com/stars/dark/sereneinserenade/tiptap-languagetool)](https://github.com/sereneinserenade/tiptap-languagetool/stargazers)

---

<details>
  <summary> Project Setup(Stuff that nobody really cares about) </summary>
  
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
</details>
