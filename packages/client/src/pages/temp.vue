<template>
  <div class="p-4">
    <div class="flex gap-2">
      <Button @click="log">Log</Button>
      <Button @click="update">Update</Button>
    </div>
    <div class="flex gap-4">
      <pre>{{ document.state }}</pre>
      <pre>{{ document.entities }}</pre>
      <!-- <pre>{{ document.collaborators }}</pre> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import useDocument from '@/composables/document'
import { ref } from 'vue'
import * as Y from 'yjs'

const doc = new Y.Doc()
const arr = doc.getArray('arr')
arr.insert(0, [0, 1, 2, 3, 4, 5])

function set(arr: Y.Array<any>, value: number) {
  const length = arr.length
  if (value < length) {
    arr.delete(value, length - value)
  } else if (value === length) {
    arr.insert(length, [null])
  } else {
    arr.insert(
      length,
      [...Array(value - length).keys()].map(() => null),
    )
  }
}

set(arr, 8)
// console.log(arr.toJSON())

defineProps<{}>()

const session = ref({
  user: {
    email: 'rcq.snel@gmail.com',
  },
})

const document = useDocument(
  {
    boss: {
      __typename: 'Person',
      id: `Person-0`,
      title: `Person 45`,
    },
    course: {
      __typename: 'Course',
      id: 'Course-1',
      title: 'Course 1',
      sections: [] as any[],
      owner: {
        __typename: 'Person',
        id: `Person-0`,
        title: `Person 0`,
      },
    },
  },
  { channel: 'Course-1', session },
)

function log() {
  // console.log(document.doc.toJSON())
  // console.log(document.state.course.owner)
  console.log(document.state.course.owner)
  // console.log(document.state.course)
}

function update() {
  // document.state.course.owner
  const id = _.uniqueId()
  document.state.course.title = `Yaaaargh ${id}`
  document.state.course.owner = {
    __typename: 'Person',
    id: `Person-${id}`,
    title: `Person ${id}`,
  }
  document.state.course.sections.push({
    __typename: 'Section',
    id: `Section-${id}`,
    title: `Section ${id}`,
  })
}
</script>
