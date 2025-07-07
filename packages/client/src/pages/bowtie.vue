<template>
  <Layout>
    <BowtieDiagram :data="{ events, controls, causalities }" />
  </Layout>
</template>

<script lang="ts" setup>
import { eventSchema, controlSchema, causalitySchema } from '@/schemas'

const events = [
  eventSchema.parse({ label: 'Event 1' }),
  eventSchema.parse({ label: 'Event 2' }),
  eventSchema.parse({ label: 'Event 3' }),
  eventSchema.parse({ label: 'Event 4' }),
  eventSchema.parse({ label: 'Event 5' }),
]

const controls = [
  controlSchema.parse({ label: 'Control 1' }),
  controlSchema.parse({ label: 'Control 2' }),
  controlSchema.parse({ label: 'Control 3' }),
]

const causalities = [
  causalitySchema.parse({
    cause: events[0],
    effect: events[2],
    controls: [controls[0]],
  }),
  causalitySchema.parse({ cause: events[1], effect: events[2] }),
  causalitySchema.parse({ cause: events[2], effect: events[3] }),
  causalitySchema.parse({
    cause: events[2],
    effect: events[4],
    controls: [controls[1], controls[2]],
  }),
]
</script>
