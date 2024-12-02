<template>
  <div class="p-4">
    <div class="flex gap-2">
      <Button @click="log">Log</Button>
      <Button @click="update">Update</Button>
    </div>
    <div class="flex gap-4">
      <pre>{{ state }}</pre>
      <pre>{{ entities }}</pre>
      <pre>{{ collaborators }}</pre>
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

const { doc, state, entities, collaborators } = useDocument(
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
      tags: ['a', 'b', 'c', 'd', 'e'],
    },
  },
  { channel: 'Course-1', session },
)

function log() {
  // console.log(doc.toJSON())
  // console.log(state.course.owner)
  // console.log(state.course.owner)
  // console.log(state.course)
}

function update() {
  const id = _.uniqueId()

  state.course.title = `Yaaaargh ${id}`

  state.course.owner = {
    __typename: 'Person',
    id: `Person-${id}`,
    title: `Person ${id}`,
  }

  state.course.sections.unshift({
    __typename: 'Section',
    id: `Section-${id}`,
    title: `Section ${id}`,
  })

  state.course.tags.reverse()
}
</script>
