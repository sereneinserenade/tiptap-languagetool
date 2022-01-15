<template>
  <section class="editor-menubar">
    <button @click="updateHtml">Copy editor html</button>
    <button @click="proofread">Proofread</button>

    <span>{{ loading ? 'Loading' : 'Done' }}</span>
  </section>

  <editor-content class="content" v-if="editor" :editor="editor" />

  <bubble-menu
    class="bubble-menu"
    v-if="editor"
    :editor="editor"
    :tippy-options="{ placement: 'bottom', animation: 'fade' }"
  >
    <section class="bubble-menu-section-container">
      <section class="message-section">
        {{ matchMessage }}

        <button class="ignore-suggestion-button" @click="ignoreSuggestion">XXX</button>
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { LanguageTool, LanguageToolHelpingWords } from './extensions'
import { content } from './text'
import { Match } from '@/types'

const match = ref<Match>(null)

const loading = ref(false)

const updateMatch = (editor: Editor) => {
  match.value = editor.extensionStorage.languagetool.match
}

const editor = useEditor({
  content,
  extensions: [StarterKit, LanguageTool.configure({ automaticMode: true, documentId: '1' })],
  onUpdate({ editor }) {
    setTimeout(() => updateMatch(editor as any))
  },
  onSelectionUpdate({ editor }) {
    setTimeout(() => updateMatch(editor as any))
  },
  onTransaction({ transaction: tr }) {
    if (tr.getMeta(LanguageToolHelpingWords.LoadingTransactionName)) loading.value = true
    else loading.value = false

    console.log(loading.value)
  },
})

const replacements = computed(() => match.value?.replacements || [])

const matchMessage = computed(() => match.value?.message || 'No Message')

const updateHtml = () => navigator.clipboard.writeText(editor.value.getHTML())

const acceptSuggestion = (sug) => {
  editor.value.commands.insertContent(sug.value)
}

const proofread = () => editor.value.commands.proofread()

const ignoreSuggestion = () => editor.value.commands.ignoreLanguageToolSuggestion(match.value)
</script>

<style lang="scss">
.editor-menubar {
  display: flex;
  gap: 1rem;

  button {
    padding: 0.5rem;
    text-transform: capitalize;
    border: none;
    background-color: white;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.25);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-weight: 500;
    font-size: 1.1em;

    &:hover {
      box-shadow: 0 0 2px rgba($color: #000000, $alpha: 0.25);
    }
  }
}

.ProseMirror {
  .lt {
    border-bottom: 2px solid #e86a69;
    transition: background 0.25s ease-in-out;

    &:hover {
      background: rgba($color: #e86a69, $alpha: 0.2);
    }

    &-style {
      border-bottom: 2px solid #9d8eff;

      &:hover {
        background: rgba($color: #9d8eff, $alpha: 0.2) !important;
      }
    }

    &-typographical,
    &-grammar {
      border-bottom: 2px solid #eeb55c;

      &:hover {
        background: rgba($color: #eeb55c, $alpha: 0.2) !important;
      }
    }

    &-misspelling {
      border-bottom: 2px solid #e86a69;

      &:hover {
        background: rgba($color: #e86a69, $alpha: 0.2) !important;
      }
    }
  }

  &-focused {
    outline: none !important;
  }
}

.flex {
  display: flex;

  div {
    width: 50%;
  }
}

.content {
  max-width: 50%;
  min-width: 50%;
}

.bubble-menu > .bubble-menu-section-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba($color: black, $alpha: 0.25);
  max-width: 400px;

  .suggestions-section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 1em;

    .suggestion {
      background-color: #229afe;
      border-radius: 4px;
      color: white;
      cursor: pointer;
      font-weight: 500;
      padding: 4px;
      display: flex;
      align-items: center;
      font-size: 1.1em;
      max-width: fit-content;
    }
  }
}
</style>
