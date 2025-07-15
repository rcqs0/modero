<template>
  <div class="w-full flex flex-col text-left rounded-md" :class="classes">
    <Handle
      v-if="type !== 'Effect'"
      type="source"
      class="z-[1]"
      :position="node.sourcePosition"
      :style="handleStyles"
    />
    <Handle
      v-if="type !== 'Cause'"
      type="target"
      class="z-[1]"
      :position="node.targetPosition"
      :style="handleStyles"
    />

    <div
      v-if="type === 'Uncertainty'"
      class="flex-grow relative h-[12px] flex-shrink-0 border-b-2 shadow-inner shadow-current text-cyan-500 bg-cyan-200 border-current rounded-t-md"
    >
      <svg
        class="absolute top-0 left-0 h-full w-full rounded-t-md"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="diagonalHatch2"
          width="8"
          height="10"
          patternTransform="rotate(-45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="10"
            style="stroke: currentColor; stroke-width: 8"
          />
        </pattern>
        <rect fill="url(#diagonalHatch2)" width="100%" height="100%" />
      </svg>
    </div>
    <div class="flex">
      <div
        v-if="type === 'Control'"
        class="relative w-[8px] flex-shrink-0 border-r-2 shadow-inner shadow-current text-amber-500 bg-amber-200 border-current rounded-l-md"
      >
        <svg
          class="absolute top-0 left-0 h-full w-full rounded-l-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="diagonalHatch"
            width="8"
            height="10"
            patternTransform="rotate(-45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              style="stroke: currentColor; stroke-width: 8"
            />
          </pattern>
          <rect fill="url(#diagonalHatch)" width="100%" height="100%" />
        </svg>
      </div>
      <div
        v-if="type === 'Effect'"
        class="w-[8px] flex-shrink-0 border-r-2 shadow-inner shadow-current text-fuchsia-500 bg-fuchsia-200 border-current rounded-l-md"
      />
      <div class="flex-grow p-3">
        {{ label }}
      </div>
      <div
        v-if="type === 'Cause'"
        class="w-[8px] flex-shrink-0 border-l-2 shadow-inner shadow-current text-cyan-500 bg-cyan-200 border-current rounded-r-md"
      />
    </div>

    <!-- <NodeToolbar class="flex gap-2" :is-visible="true">
        <span>A</span><span>B</span><span>C</span>
      </NodeToolbar> -->
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Handle, type GraphNode } from '@vue-flow/core'
// import { NodeToolbar } from '@vue-flow/node-toolbar'

const props = defineProps<{ node: GraphNode }>()

const type = computed(() => props.node.data.__typename)

const label = computed(() => {
  if (['Cause', 'Effect'].includes(type.value)) {
    return props.node.data.event.label
  }

  return props.node.data.label
})

const classes = computed(() => {
  switch (type.value) {
    case 'Cause': {
      return // 'border-r-8 border-fuchsia-500'
    }
    case 'Effect': {
      return // 'border-l-8 border-fuchsia-500'
    }
    case 'Control': {
      return // 'border-l-8 border-neutral-200'
    }
    default: {
      return // 'border-l-8 border-r-8 border-neutral-200'
    }
  }
})

const handleStyles = computed(() => {
  return {
    top: type.value !== 'Uncertainty' ? '1.286rem' : undefined,
  }
})
</script>

<style lang="postcss" scoped>
:global(.vue-flow__node) {
  @apply border-surface-300 rounded-md shadow-sm p-0 flex;
}
</style>
