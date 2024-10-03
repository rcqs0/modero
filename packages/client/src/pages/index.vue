<template>
  <div class="p-4">
    <DatePicker v-model="date" />
    <!-- <pre>{{ result }}</pre> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import client from '@/client'

export default defineComponent({
  setup() {
    const result = ref()

    onMounted(async () => {
      result.value = await client.controls.query()
    })

    const date = ref()
    const rating = ref()

    return { result, date, rating }
  },
})
</script>
