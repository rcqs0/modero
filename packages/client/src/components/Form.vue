<template>
  <form @submit.prevent="onSubmit">
    <slot>
      <pre>{{ data }}</pre>
    </slot>
  </form>
</template>

<script lang="ts">
export const FORM_KEY = Symbol() as InjectionKey<{
  data: Record<string, any>
  initial: Record<string, any>
  model?: Model
  root?: typeof FORM_KEY extends InjectionKey<infer T> ? T : never
}>
</script>

<script lang="ts" setup generic="T extends Model">
import { computed, reactive, provide, inject, InjectionKey } from 'vue'
import { type Model, type Infer } from '@/lib/models'
import _ from 'lodash'

const props = defineProps<{
  name?: string
  data?: Infer<T>
  model?: T
  transient?: boolean
}>()

const emit = defineEmits(['submit'])

const parent = inject(FORM_KEY, undefined)

const data = computed<Infer<T>>(() =>
  parent && props.name ? _.get(parent.data, props.name) : props.data,
)
const initial = _.cloneDeep(props.data)!

function onSubmit() {
  if (props.model) {
    const { data: cleaned, error } = props.model.schema.safeParse(data.value)

    if (error) {
      console.log(error)
    } else {
      emit('submit', cleaned)
    }
  } else {
    emit('submit', data)
  }
}

provide(
  FORM_KEY,
  reactive({ data, initial, model: props.model, root: parent?.root || parent }),
)
</script>
