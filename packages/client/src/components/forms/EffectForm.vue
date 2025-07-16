<template>
  <form class="flex flex-col gap-3">
    <Field label="Label">
      <InputText v-model="data.event.label" fluid />
    </Field>
    <Field label="Description">
      <Textarea v-model="data.event.description" fluid />
    </Field>
  </form>
</template>

<script lang="ts" setup>
// import { type Effect } from '@/schemas'

withDefaults(defineProps<{ data?: Record<string, any> }>(), {
  data: () => ({}),
})
</script>
