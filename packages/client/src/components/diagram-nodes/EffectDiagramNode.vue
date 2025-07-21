<template>
  <DiagramNode
    :node="node"
    :selected="selected"
    :input="false"
    :handle-style="{ top: '1.286rem' }"
  >
    <div class="flex">
      <div
        class="w-[8px] flex-shrink-0 border-r-2 shadow-inner shadow-current text-fuchsia-500 bg-fuchsia-300 border-current rounded-l-md"
      />
      <div class="flex-grow p-3">
        {{ node.data.event.label }}
      </div>
      <div
        class="w-[8px] flex-shrink-0 border-l-2 shadow-inner shadow-current text-neutral-300 bg-neutral-100 border-current rounded-r-md"
      />
    </div>

    <NodeToolbar
      class="flex gap-2 ml-1"
      :position="Position.Left"
      :is-visible="selected"
    >
      <Button
        severity="contrast"
        rounded
        icon="ri-add-line"
        size="small"
        @click="$emit('addControl', node.data)"
      />
    </NodeToolbar>
  </DiagramNode>
</template>

<script lang="ts" setup>
import { type GraphNode, Position } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'

defineProps<{
  node: GraphNode
  selected?: boolean
}>()
</script>
