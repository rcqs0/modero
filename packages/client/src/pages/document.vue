<template>
  <div class="p-4">
    <Button @click="update">Update</Button>
    <div class="flex">
      <pre>{{ doc.course }}</pre>
      <pre>{{ doc.course.tags.length }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDocument from '@/composables/document'

export default defineComponent({
  setup() {
    const doc = useDocument({
      course: {
        __typename: 'Course',
        id: 'Course-1',
        title: 'Course 1',
        tags: ['a', 'b', 'c'],
      },
    })

    let i = 0

    function update() {
      doc.course.title = 'Woooooooooooot'
      // doc.course.tags.push(`${i}`)
      // i++
      doc.course.tags.pop()
    }

    return { doc, update }
  },
})
</script>
