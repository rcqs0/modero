<template>
  <div class="flex flex-col gap-0.5">
    <div v-if="label" class="font-semibold text-sm">{{ label }}</div>
    <div>
      <slot :bindings="bindings">
        <pre>{{ data }}</pre>
      </slot>
    </div>
    <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue'
import _ from 'lodash'
import { FORM_KEY } from './Form.vue'

const props = defineProps<{ name?: string; label?: string; error?: string }>()

const form = inject(FORM_KEY, undefined)

const data = computed({
  get: () => form && props.name && _.get(form.data, props.name),
  set: (value) => form && props.name && _.set(form.data, props.name, value),
})

const label = computed(
  () => props.label || (props.name && form?.model?.fields[props.name]?.label),
)

function onChange(event: any) {
  if (event instanceof Event) {
    const target = event.target as HTMLInputElement
    data.value = target.value
  } else {
    data.value = event
  }
}

const bindings = reactive({ modelValue: data, onChange })
</script>
