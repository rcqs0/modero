<template>
  <DiagramNode :node="node" :selected="selected">
    <BarrierPattern
      class="flex-grow h-[12px] flex-shrink-0 border-b-2 !shadow-yellow-500 text-neutral-700 bg-yellow-300 rounded-t-md"
    />
    <div class="p-3">
      {{ node.data.label }}
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
        @click="$emit('addCause', node.data)"
      />
    </NodeToolbar>
    <NodeToolbar
      class="flex gap-2 -ml-1"
      :position="Position.Right"
      :is-visible="selected"
    >
      <Button
        severity="contrast"
        rounded
        icon="ri-add-line"
        size="small"
        @click="$emit('addEffect', node.data)"
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
