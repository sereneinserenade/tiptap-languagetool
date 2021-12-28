<template>
  <button @click="updateHtml">html</button>
  <editor-content v-if="editor" :editor="editor" />

  <bubble-menu class="bubble-menu" v-if="editor" :editor="editor" :tippy-options="{ placement: 'bottom' }">
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
  </bubble-menu>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
// import StarterKit from "@tiptap/starter-kit";
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import History from '@tiptap/extension-history'

import { LanguageTool, Paragraph } from './extensions'
import { content } from './text'
import { Match } from '@/types'

let activeDecoSpanEl = ref<HTMLSpanElement>(null)

const left = ref(false)

const showLTSuggestions = ref(false)

const match = ref<Match | null>(null)

const replacements = computed(() => match.value?.replacements || [])

const matchMessage = computed(() => match.value?.message || 'No Message')

function selectElementText(el) {
  const range = document.createRange()
  range.selectNode(el)

  const sel = window.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)

  console.log(match.value)
}

const mouseEnterEventListener = async (e) => {
  await new Promise((r) => setTimeout(r, 500))
  left.value = false

  activeDecoSpanEl = e.target

  !left.value && selectElementText(e.target)

  const matchString = e.target.getAttribute('match')

  if (matchString) match.value = JSON.parse(matchString)

  showLTSuggestions.value = true
}

const mouseLeaveEventListener = (e) => {
  left.value = true
  activeDecoSpanEl = null
  // match.value = null
  showLTSuggestions.value = false
}

const addEventListenersToDecorations = () => {
  const decos = document.querySelectorAll('span.lt')
  decos?.forEach((el) => el.addEventListener('mouseenter', mouseEnterEventListener))
  decos?.forEach((el) => el.addEventListener('mouseleave', mouseLeaveEventListener))
}

const editor = useEditor({
  content,
  extensions: [Document, Paragraph, Text, History, LanguageTool],
  onUpdate: () => {
    addEventListenersToDecorations()
  },
  onFocus: () => addEventListenersToDecorations(),
  onTransaction: ({ editor, transaction }) => {
    const decosUpdated = transaction.getMeta('languageToolDecorations')

    if (decosUpdated) addEventListenersToDecorations()
  },
})

const updateHtml = () => navigator.clipboard.writeText(editor.value.getHTML())

const acceptSuggestion = (sug) => {
  editor.value.commands.insertContent(sug.value)
}
</script>

<style lang="scss">
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

.bubble-menu {
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
