<template>
  <div class="p-4">
    <div class="flex gap-2">
      <Button @click="log">Log</Button>
      <Button @click="update">Update</Button>
    </div>
    <div class="flex gap-4">
      <pre>{{ document.state }}</pre>
      <pre>{{ document.entities }}</pre>
      <pre>{{ document.collaborators }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import useDocument from '@/composables/document'
import { ref } from 'vue'

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
      sections: [] as any[],
    },
  },
  { channel: 'Course-1', session },
)

function log() {
  console.log(document.doc)
}

function update() {
  document.state.course.title = `Yaaaargh ${_.uniqueId()}`
  document.state.course.sections.push({
    __typename: 'Section',
    id: `Section-${_.uniqueId()}`,
    title: `Section ${_.uniqueId()}`,
  })
}
</script>
