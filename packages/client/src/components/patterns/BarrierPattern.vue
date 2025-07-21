<template>
  <div
    class="relative stroke-current border-current shadow-current shadow-inner"
  >
    <svg
      class="absolute top-0 left-0 h-full w-full rounded-t-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        :id="`barrier-${id}`"
        width="8"
        height="10"
        patternTransform="rotate(-45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line x1="0" y1="0" x2="0" y2="10" style="stroke-width: 8" />
      </pattern>
      <rect :fill="`url(#barrier-${id})`" width="100%" height="100%" />
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { nanoid } from 'nanoid'

const id = nanoid()
</script>
