<template>
  <div class="p-4">
    <Button @click="update">Update</Button>
    <div class="flex">
      <pre>{{ doc.course }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, isReactive } from 'vue'
import * as Y from 'yjs'
import useDocument from '@/composables/document'

export default defineComponent({
  setup() {
    const doc = useDocument({
      course: { __typename: 'Course', id: 'Course-1', title: 'Course 1' },
    })

    function update() {
      doc.course.title = 'Woooooooooooot'
      console.log(doc.course, isReactive(doc.course))
    }

    return { doc, update }
  },
})
</script>
