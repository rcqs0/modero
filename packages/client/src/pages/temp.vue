<template>
  <div class="p-4">
    <Button @click="update">Update</Button>
    <Button @click="temp">Temp</Button>
    <div class="flex gap-4">
      <pre>{{ state }}</pre>
      <pre>{{ session }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import useDocument, { transact } from '@/composables/document'

defineProps<{}>()

const user = {
  email: 'rcq.snel@gmail.com',
}

const { state, session } = useDocument(
  {
    course: {
      __typename: 'Course',
      id: 'Course-1',
      title: 'Course 1',
      woot: undefined,
    },
    temp: {
      arr: ['a', 'b', 'c'],
    },
  },
  { channel: 'Course-1', user },
)

function update() {
  state.value!.course.title = 'Yaaaaaargh'
  state.value!.temp.arr = ['a', 'b', 'd', 'e', 'f']
}

function temp() {
  transact(state.value!.temp.arr, () => {
    // state.value!.temp.arr.push('f', 'g')
    // state.value!.temp.arr.splice(1, 2, 'x')
    state.value!.temp.arr.unshift('x')
    state.value!.temp.arr.reverse()
  })

  // console.log(inspect(state.value!.temp.arr)?.toJSON())
}
</script>
