<template>
  <VueFlow
    :nodes="nodes"
    :edges="edges"
    fit-view-on-init
    :max-zoom="1"
    v-bind="$attrs"
  >
    <template v-for="(_, name) in $slots" #[name]="props">
      <slot :name="name" v-bind="props" />
    </template>

    <Background />
    <MiniMap pannable />
    <Controls position="top-right" />
  </VueFlow>
</template>

<script lang="ts" setup>
import { VueFlow, type Node, type Edge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

withDefaults(defineProps<{ nodes?: Node[]; edges?: Edge[] }>(), {
  nodes: () => [],
  edges: () => [],
})
</script>
