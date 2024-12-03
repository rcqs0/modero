<template>
  <div class="p-4">
    <div class="flex gap-2">
      <Button @click="log">Log</Button>
      <Button @click="update">Update</Button>
      <Button @click="undo">Undo</Button>
      <Button @click="redo">Redo</Button>
    </div>
    <div class="flex gap-4">
      <pre>{{ state }}</pre>
      <pre>{{ entities }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useDocument from '@/composables/document'
import _ from 'lodash'

const session = ref({
  user: {
    email: 'rcq.snel@gmail.com',
  },
})

const { doc, state, entities, undo, redo, transact } = useDocument(
  {
    course: {
      __typename: 'Course',
      id: 'Course-1',
      title: 'Course 1',
      owner: {
        __typename: 'Person',
        id: 'Person-0',
        title: 'Person 0',
      },
      sections: [
        {
          __typename: 'Section',
          id: 'Section-0',
          title: 'Section 0',
        },
      ],
    },
  },
  { channel: 'Course-1', session },
)

function log() {
  console.log(state.course.owner === entities.Person['Person-0'])
  console.log({
    state: doc.getMap('state').toJSON(),
    entities: doc.getMap('entities').toJSON(),
  })
}

function update() {
  const id = _.uniqueId()

  transact(() => {
    state.course.owner = {
      __typename: 'Person',
      id: `Person-${id}`,
      title: `Person ${id}`,
    }

    state.course.sections.push({
      __typename: 'Section',
      id: `Section-${id}`,
      title: `Section ${id}`,
    })
  })
}
</script>
