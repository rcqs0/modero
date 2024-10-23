<template>
  <NodeToolbar :is-visible="undefined" :position="Position.Top">
    <Button
      v-for="action of actions"
      :key="action"
      severity="contrast"
      @click="updateNodeData(props.id, { action })"
    >
      {{ action }}
    </Button>
  </NodeToolbar>

  <template v-if="data.zones?.length">
    <div
      v-for="zone in data.zones"
      class="hover:bg-surface-100 active:bg-surface-200 transition-colors rounded px-2 py-1"
    >
      {{ zone.title }}
    </div>
  </template>
  <template v-else>
    <div class="px-2 py-1">
      {{ data.label }}
    </div>
  </template>

  <Handle type="target" :position="Position.Left" />
  <Handle type="source" :position="Position.Right" />
</template>

<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { NodeToolbar } from '@vue-flow/node-toolbar'

const props = defineProps(['id', 'data'])

const actions = ['👎', '✋', '👍']

const { updateNodeData } = useVueFlow()
</script>

<style lang="postcss">
.vue-flow__node-zone {
  @apply border shadow-md rounded;
  @apply bg-white p-2 min-w-40 text-sm;
  @apply flex flex-col;
}

.vue-flow__node-zone .vue-flow__handle {
  @apply bg-black rounded;
  @apply w-2 h-4;
}
</style>
