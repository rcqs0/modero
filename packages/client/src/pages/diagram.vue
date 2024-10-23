<template>
  <ZoneDiagram :zones="zones" />
</template>

<script setup lang="ts">
import { type Zone } from '@/components/zone-diagram/ZoneDiagram.vue'

const zones: Zone[] = [
  {
    __typename: 'Zone',
    id: 'Zone-0',
    title: 'Zone 0',
    templateId: 'TextOnly1',
  },
  {
    __typename: 'Zone',
    id: 'Zone-1',
    title: 'Zone 1',
    templateId: 'TextOnly1',
  },
  {
    __typename: 'Zone',
    id: 'Zone-2',
    title: 'Zone 2',
    templateId: 'TextOnly1',
  },
  {
    __typename: 'Zone',
    id: 'Zone-3',
    title: 'Zone 3',
    templateId: 'TextOnly1',
  },
  {
    __typename: 'Zone',
    id: 'Zone-4',
    title: 'Zone 4',
    templateId: 'TextOnly1',
  },
  {
    __typename: 'Zone',
    id: 'Zone-5',
    title: 'Zone 5',
    templateId: 'TextOnly1',
  },
  {
    __typename: 'Zone',
    id: 'Zone-6',
    title: 'Zone 6',
    templateId: 'TextOnly1',
  },
]
</script>

<style lang="postcss">
.vue-flow__node-toolbar {
  @apply flex gap-2 items-center;
}
</style>
