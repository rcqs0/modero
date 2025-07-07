<template>
  <div class="flex p-12 gap-12">
    <Form
      :data="henk"
      :model="Person"
      @submit="log"
      class="flex flex-col gap-4"
    >
      <Button label="update" @click="update" />

      <Field name="name" #default="{ bindings }">
        <InputText v-bind="bindings" />
      </Field>
      <Field name="name" />
      <Field name="age" />
      <Field name="motto" />
      <Form v-for="(_, i) in henk.jobs" :name="`jobs.${i}`">
        <Field
          name="title"
          label="Fix me"
          error="Some error"
          #default="{ bindings }"
        >
          <InputText v-bind="bindings" />
        </Field>
      </Form>
      <!-- <Form v-for="job in henk.jobs" :data="job">
        <Field name="title" #default="{ bindings }">
          <InputText v-bind="bindings" />
        </Field>
      </Form> -->

      <Button type="submit" label="Submit" />
    </Form>

    <pre>{{ henk }}</pre>

    <pre>{{ transcribed }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import * as models from '@/lib/models'
import _ from 'lodash'
import { z } from 'zod'

const Job = models.define('Job', {
  fields: {
    title: {
      schema: z.string().min(1),
      label: 'Title',
      translatable: true,
    },
  },
})

const Person = models.define('Person', {
  fields: {
    name: {
      schema: z.string(),
      label: 'Name',
      translatable: true,
    },
    age: {
      schema: z.number(),
      label: 'Age',
    },
    motto: {
      schema: z.string().optional(),
      label: 'Motto',
      translatable: true,
    },
    jobs: {
      schema: z.array(Job.schema),
      label: 'Jobs',
    },
  },
})

const henk = reactive(
  Person.create({
    name: 'Henk',
    age: 17,
    motto: 'Lekker batsen',
    jobs: [
      {
        title: 'Janitor',
      },
      {
        title: 'CEO',
      },
    ],
  }),
)

const transcribed = computed(() => Person.transcribe(henk))

function log(data: any) {
  console.log(data)
}

function update() {
  henk.jobs = [
    Job.create({
      title: 'A',
    }),
    Job.create({
      title: 'B',
    }),
  ]
}
</script>
