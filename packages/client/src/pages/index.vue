<template>
  <div class="p-4">
    <DataTable :value="data" editMode="cell" class="my-4">
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
    <InputText />
  </div>
</template>

<script setup lang="ts">
import controls from '@/lib/content/controls'

const data = controls()
</script>

<style lang="postcss" scoped>
:deep(td[data-p-cell-editing='true']) {
  @apply pt-0 pb-0;
}
</style>
