<template>
  <form class="flex flex-col gap-3">
    <Field label="Label">
      <InputText v-model="data.label" fluid />
    </Field>
    <Field label="Description">
      <Textarea v-model="data.description" fluid />
    </Field>
  </form>
</template>

<script lang="ts" setup>
import { type Uncertainty } from '@/schemas'

defineProps<{ data: Uncertainty }>()
</script>
