<template>
  <div
    class="w-full flex flex-col text-left rounded-md shadow-sm border border-surface-300"
    :class="{ 'ring-4 ring-black border-black': selected }"
  >
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
      class="flex-grow relative h-[12px] flex-shrink-0 border-b-2 shadow-inner stroke-current shadow-yellow-500 text-neutral-700 bg-yellow-300 border-current rounded-t-md"
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
          <line x1="0" y1="0" x2="0" y2="10" style="stroke-width: 8" />
        </pattern>
        <rect fill="url(#diagonalHatch2)" width="100%" height="100%" />
      </svg>
    </div>
    <div class="flex">
      <div
        v-if="type === 'Control'"
        class="relative w-[8px] flex-shrink-0 border-r-2 shadow-inner shadow-current border-current rounded-l-md"
        :style="{
          color: colorInterpolator(node.data.effectiveness),
          backgroundColor: bgColorInterpolator(node.data.effectiveness),
        }"
      >
        <svg
          class="absolute top-0 left-0 h-full w-full rounded-l-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              :id="node.data.id"
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
          </defs>
          <rect :fill="`url(#${node.data.id})`" width="100%" height="100%" />
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

    <template v-if="selected">
      <template v-if="type === 'Uncertainty'">
        <NodeToolbar
          class="flex gap-2 ml-1"
          :position="Position.Left"
          :is-visible="true"
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
          :is-visible="true"
        >
          <Button
            severity="contrast"
            rounded
            icon="ri-add-line"
            size="small"
            @click="$emit('addEffect', node.data)"
          />
        </NodeToolbar>
      </template>
      <template v-else-if="type === 'Cause'">
        <NodeToolbar
          class="flex gap-2 -ml-1"
          :position="Position.Right"
          :is-visible="true"
        >
          <Button
            severity="contrast"
            rounded
            icon="ri-add-line"
            size="small"
            @click="$emit('addControl', node.data)"
          />
        </NodeToolbar>
      </template>
      <template v-else-if="type === 'Effect'">
        <NodeToolbar
          class="flex gap-2 ml-1"
          :position="Position.Left"
          :is-visible="true"
        >
          <Button
            severity="contrast"
            rounded
            icon="ri-add-line"
            size="small"
            @click="$emit('addControl', node.data)"
          />
        </NodeToolbar>
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Handle, Position, type GraphNode } from '@vue-flow/core'
import { piecewise, interpolate } from 'd3-interpolate'
import { NodeToolbar } from '@vue-flow/node-toolbar'

const props = defineProps<{ node: GraphNode; selected?: boolean }>()

const type = computed(() => props.node.data.__typename)

const label = computed(() => {
  if (['Cause', 'Effect'].includes(type.value)) {
    return props.node.data.event.label
  }

  return props.node.data.label
})

const handleStyles = computed(() => {
  return {
    top: type.value !== 'Uncertainty' ? '1.286rem' : undefined,
  }
})

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

<style lang="postcss" scoped>
:global(.vue-flow__node) {
  padding: 0px;
  border: none !important;
  outline: none !important;
}
</style>
