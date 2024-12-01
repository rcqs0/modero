<template>
  <div class="p-4">
    <DataTable :value="document.state.controls" class="my-4">
      <Column class="w-2/6" sortable field="title" header="Title"></Column>
      <Column
        class="w-3/6"
        sortable
        field="description"
        header="Description"
      ></Column>
      <Column class="w-1/6" sortable field="type" header="Type"></Column>
      <Column
        class="w-1/6"
        sortable
        field="effectiveness"
        header="Effectiveness"
      ></Column>
      <Column class="w-24">
        <template #body="{ data }">
          <Button
            icon="ri-delete-bin-line"
            variant="text"
            severity="secondary"
            @click="remove(data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import controls from '@/lib/content/controls'
import useDocument from '@/composables/document'
import _ from 'lodash'

const document = useDocument(
  {
    controls: controls(),
  },
  {
    channel: 'controls',
  },
)

function remove(id: string) {
  _.remove(document.state.controls, { id })
}
</script>
