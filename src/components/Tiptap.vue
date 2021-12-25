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
import { LanguageTool } from './extensions'

const html = ref('');

const editor = useEditor({
  content: '<p>LanguageTool Extensioon is the best onee there shud be.</p><p><br class="ProseMirror-trailingBreak"></p><p>Atlestt I thinkk</p>',
  extensions: [StarterKit, LanguageTool],
})

const updateHtml = () => html.value = editor.value.getHTML().trim()
</script>

<style lang="scss">
.ProseMirror {
  .lt-thing {
    background-color: rgba($color: cornflowerblue, $alpha: 0.25);
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
