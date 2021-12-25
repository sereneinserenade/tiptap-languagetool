<template>
  <button @click="updateHtml">html</button>
  <editor-content :editor="editor" />
  <div>
    <pre> {{ html }} </pre>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { LanguageTool } from './extensions/languagetool'
import { content } from './text'

const html = ref('');

const editor = useEditor({
  content,
  extensions: [StarterKit, LanguageTool],
})

const updateHtml = () => html.value = editor.value.getHTML().trim()
</script>

<style lang="scss">
.ProseMirror {
  .lt {
    background: rgba($color: grey, $alpha: 0.1) ;

    &-Hint {
      border-bottom: 2px solid #9d8eff;
    }

    &-misspelling {
      border-bottom: 2px solid #e86a69;

      ::hover {
        background: rgba($color: #e86a69, $alpha: 0.25) ;
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
</style>
