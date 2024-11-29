<template>
  <div class="p-4">
    <Button @click="update">Update</Button>
    <div class="flex">
      <pre>{{ course }}</pre>
      <pre>{{ page }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { defineComponent } from 'vue'
import useRepo from '@/composables/repo'

const DATA = {
  __typename: 'Course',
  id: 'Course-1',
  title: 'Course 1',
  sections: [
    {
      __typename: 'Section',
      id: 'Section-1',
      title: 'Section 1',
      pages: [
        {
          __typename: 'Page',
          id: 'Page-1',
          title: 'Page 1',
        },
        {
          __typename: 'Page',
          id: 'Page-2',
          title: 'Page 2',
        },
      ],
    },
    {
      __typename: 'Section',
      id: 'Section-2',
      title: 'Section 2',
      pages: [
        {
          __typename: 'Page',
          id: 'Page-1',
        },
      ],
    },
  ],
}

export default defineComponent({
  setup() {
    const repo = useRepo(DATA as any)

    const course = repo.resolve({
      __typename: 'Course',
      id: 'Course-1',
    })

    const page = repo.resolve({
      __typename: 'Page',
      id: 'Page-1',
    })

    function update() {
      course.title = 'Woooooooooot'

      course.sections[0].pages[0].title = 'Yaaaaaaaaaaaargh'
      course.sections[0].pages.push({
        __typename: 'Page',
        id: 'Page-3',
        title: 'Page 3',
      })
    }

    // console.log(
    //   inspect(course.sections[0].pages[0]).target ===
    //     inspect(course.sections[1].pages[0]).target,
    //   inspect(course.sections[1].pages[0]),
    //   inspect(page),
    // )

    return { course, page, update }
  },
})
</script>
