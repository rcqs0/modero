<template>
  <Button @click="update">Update</Button>
  <Button @click="temp">Temp</Button>
  <pre>{{ doc }}</pre>
</template>

<script lang="ts" setup>
import useDocument, { inspect, transact } from '@/composables/document'
import * as Y from 'yjs'

defineProps<{}>()

const doc = useDocument({
  course: {
    __typename: 'Course',
    id: 'Course-1',
    title: 'Course 1',
    woot: undefined,
  },
  arr: ['a', 'b', 'c', 'd', 'e'],
})

function update() {
  doc.course.title = 'Yaaaaaargh'
}

function temp() {
  transact(doc.arr, () => {
    doc.arr.push('f', 'g')
    // doc.arr.splice(1, 2, 'x')
    // doc.arr.unshift('x')
    // doc.arr.reverse()
  })

  const d = new Y.Doc()
  const a = d.getArray('arr')

  a.insert(0, [1, 2, null, 3])

  console.log(a.toJSON())

  // console.log(inspect(doc.arr)?.toJSON())
}
</script>
