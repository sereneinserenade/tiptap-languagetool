<template>
  <editor-content :editor="editor" />
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { LanguageTool } from './extensions'

const editor = useEditor({
  content: '<p>LanguageTool Extensioon is the best onee there shud be.</p><p><br class="ProseMirror-trailingBreak"></p><p>Atlestt I thinkk</p>',
  extensions: [
    StarterKit,
    LanguageTool
  ],
})
</script>

<style lang="scss">

.ProseMirror {
  .lt-thing {
    background-color: rgba($color: cornflowerblue, $alpha: 0.25) ;
  }

  &-focused {
    outline: none !important;
  }
}
</style>
