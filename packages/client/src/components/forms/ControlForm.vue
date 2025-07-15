<template>
  <form class="flex flex-col gap-3">
    <Field label="Label">
      <InputText v-model="data.label" fluid />
    </Field>
    <Field label="Description">
      <Textarea v-model="data.description" fluid />
    </Field>
    <Field label="Effectiveness">
      <div class="flex items-center gap-6">
        <Slider
          v-model="data.effectiveness"
          :color="['#ef4444', '#eab308', '#22c55e']"
          class="flex-grow"
        />
        <InputNumber v-model="data.effectiveness" class="w-16" fluid />
      </div>
    </Field>
  </form>
</template>

<script lang="ts" setup>
import { type Control } from '@/schemas'

defineProps<{ data: Control }>()
</script>
