<template>
  <div id="app">
    <tiptap />
  </div>
</template>

<script lang="ts" setup>
import { Tiptap } from './components'
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  width: 100%;
}

body,
html {
  margin: 0;
  padding: 0;
  background: rgba(17, 24, 39, 1);
}
</style>
