<template>
  <DiagramNode
    :node="node"
    :selected="selected"
    :handle-style="{ top: '1.286rem' }"
  >
    <div class="flex">
      <BarrierPattern
        class="relative w-[8px] flex-shrink-0 border-r-2 rounded-l-md"
        :style="{
          color: colorInterpolator(node.data.effectiveness),
          backgroundColor: bgColorInterpolator(node.data.effectiveness),
        }"
      />
      <div class="flex-grow p-3">
        {{ node.data.label }}
      </div>
    </div>
  </DiagramNode>
</template>

<script lang="ts" setup>
import { type GraphNode } from '@vue-flow/core'
import { piecewise, interpolate } from 'd3-interpolate'

defineProps<{
  node: GraphNode
  selected?: boolean
}>()

const colorInterpolator = piecewise(interpolate, [
  '#fb2c36',
  '#fd9a00',
  '#00c951',
])
const bgColorInterpolator = piecewise(interpolate, [
  '#ffc9c9',
  '#fee685',
  '#b9f8cf',
])
</script>
