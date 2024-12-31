<template>
  <div
    :class="{
      flex: true,
      'flex-col': column,
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ column?: boolean }>()
</script>
