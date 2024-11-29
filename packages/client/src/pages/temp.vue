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
import useCollab from '@/composables/collab'

defineProps<{}>()

const user = {
  email: 'rcq.snel@gmail.com',
}

const { state, doc } = useDocument({
  course: {
    __typename: 'Course',
    id: 'Course-1',
    title: 'Course 1',
    woot: undefined,
  },
  temp: {
    arr: ['a'],
  },
})

const { session, awareness, provider } = useCollab(doc, 'Course-1', { user })

function update() {
  state.course.title = 'Yaaaaaargh'
  state.temp.arr = ['a', 'b', 'c', 'd', 'e']
}

function temp() {
  transact(state.temp.arr, () => {
    // state.temp.arr.push('f', 'g')
    // state.temp.arr.splice(1, 2, 'x')
    state.temp.arr.unshift('x')
    state.temp.arr.reverse()
  })

  // console.log(inspect(state.temp.arr)?.toJSON())
}
</script>
