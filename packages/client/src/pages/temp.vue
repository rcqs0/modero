<template>
  <div class="p-4">
    <Button @click="update">Update</Button>
    <div class="flex gap-4">
      <pre>{{ document.state }}</pre>
      <pre>{{ document.collaborators }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import useDocument, { inspect } from '@/composables/document'
import { CACHE_KEY } from '@/composables/document/utils'
import { ref } from 'vue'
import * as Y from 'yjs'

const doc = new Y.Doc()
const pages = doc.getMap('pages')
const a = new Y.Map()
a.set('x', 1)
pages.set('a', a)
const b = new Y.Map()
b.set('x', 2)
pages.set('b', b)

pages.set('a', b.clone())

// console.log(pages.toJSON(), a)

defineProps<{}>()

const session = ref({
  user: {
    email: 'rcq.snel@gmail.com',
  },
})

const document = useDocument(
  {
    course: {
      __typename: 'Course',
      id: 'Course-1',
      title: 'Course 1',
      woot: undefined,
    },
    pages: { a: { x: 1 }, b: { x: 2 } },
    arr: [1, 2, 3, 4, { a: 1 }],
  },
  { channel: 'Course-1', session },
)

function update() {
  const first = document.state.pages.a
  document.state.pages.a = document.state.pages.b
  document.state.pages.b = first
  // console.log(inspect(first))

  // const pages = doc.get('pages')
  // const a = pages.get('a')
  // pages.set('b', a.clone())

  // console.log(doc.get('pages').toJSON())

  document.state.arr.reverse()
}
</script>
