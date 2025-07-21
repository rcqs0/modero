<template>
  <div
    class="w-full flex flex-col text-left rounded-md shadow-sm border border-neutral-300 bg-white text-[12px]"
    :class="{ 'ring-4 ring-black border-black': selected }"
  >
    <Handle
      v-if="input"
      type="source"
      :position="node.sourcePosition"
      :style="handleStyle"
    />
    <Handle
      v-if="output"
      type="target"
      :position="node.targetPosition"
      :style="handleStyle"
    />

    <slot>
      <div class="p-3">
        {{ node.data.label }}
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { type StyleValue } from 'vue'
import { Handle, type GraphNode } from '@vue-flow/core'

withDefaults(
  defineProps<{
    node: GraphNode
    selected?: boolean
    input?: boolean
    output?: boolean
    handleStyle?: StyleValue
  }>(),
  { input: true, output: true },
)
</script>
