<template>
  <VueFlow :nodes="nodes" :edges="edges" v-bind="$attrs">
    <template v-for="(_, name) in slots" #[name]="props">
      <slot :name="name" v-bind="props" />
    </template>

    <slot />

    <Background />
    <MiniMap pannable position="bottom-left" />
    <Controls position="top-left" />
  </VueFlow>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import { useSlots, computed } from 'vue'
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

const slots = computed(() => _.omit(useSlots(), 'default'))
</script>
