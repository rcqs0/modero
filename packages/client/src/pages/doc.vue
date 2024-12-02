<template>
  <div class="p-4">
    <div class="flex gap-2">
      <Button @click="log">Log</Button>
      <Button @click="update">Update</Button>
    </div>
    <div class="flex gap-4">
      <pre>{{ state }}</pre>
      <pre>{{ entities }}</pre>
    </div>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import object from '@/composables/doc/object'
import * as Y from 'yjs'

const doc = new Y.Doc()

const entities = object({}, doc.getMap('entities'))

const state = object(
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
    },
  },
  doc.getMap('state'),
  doc.getMap('entities'),
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

  state.course.owner = {
    __typename: 'Person',
    id: `Person-${id}`,
    title: `Person ${id}`,
  }
}
</script>
