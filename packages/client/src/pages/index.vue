<template>
  <div class="text-xs">
    <pre>{{ result }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import client from '../client'

export default defineComponent({
  setup() {
    const result = ref()

    onMounted(async () => {
      result.value = await client.controls.query()
    })

    return { result }
  },
})
</script>
