<template>
  <div
    :class="{
      layout: true,
      'flex overflow-auto min-w-[100px]': true,
      'flex-col': column,
      'flex-1': !size,
    }"
    :style="size ? `flex-basis: ${parseInt(size) / 4}rem` : ''"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ column?: boolean; size?: string }>()
</script>
