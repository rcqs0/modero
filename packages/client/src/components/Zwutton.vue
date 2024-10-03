<template>
  <button class="button"><slot /></button>
</template>

<style lang="postcss" scoped>
.button {
  @apply p-3 bg-pink-500 text-white rounded;
}
</style>
