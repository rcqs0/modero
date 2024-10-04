<template>
  <div class="p-4">
    <DatePicker v-model="date" class="my-4" />
    <DataTable :value="result" editMode="cell" class="my-4">
      <Column class="w-2/6" sortable field="title" header="Title">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" autofocus fluid />
        </template>
      </Column>
      <Column class="w-3/6" sortable field="description" header="Description">
        <template #body="{ data }">
          {{ data.description }}
        </template>
      </Column>
      <Column class="w-1/6" sortable field="type" header="Type"></Column>
      <Column
        class="w-1/6"
        sortable
        field="effectiveness"
        header="Effectiveness"
      ></Column>
    </DataTable>
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
    const value = ref()

    return { result, date, value }
  },
})
</script>

<style lang="postcss" scoped>
:deep(td[data-p-cell-editing='true']) {
  @apply pt-0 pb-0;
}
</style>
