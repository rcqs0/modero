<script setup>
import { Repl } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'
// import '@vue/repl/style.css'
// ^ no longer needed after 3.0
</script>

<template>
  <Repl :editor="Monaco" />
</template>
