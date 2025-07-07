<template>
  <Diagram :nodes="nodes" :edges="edges" @nodes-initialized="layoutGraph" />
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { type Event, type Control, type Causality } from '@/schemas'
import { useLayout } from './useLayout'

const props = withDefaults(
  defineProps<{
    data: {
      events?: Event[]
      controls?: Control[]
      causalities?: Causality[]
    }
  }>(),
  {
    data: () => ({
      events: [],
      controls: [],
      causalities: [],
    }),
  },
)

const { fitView } = useVueFlow()
const { layout } = useLayout()

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

watch(
  () => props.data,
  () => {
    nodes.value = []
    edges.value = []

    props.data.events?.forEach((event) => {
      nodes.value.push({
        id: event.id,
        data: event,
        position: { x: 0, y: 0 },
      })
    })

    props.data.controls?.forEach((control) => {
      nodes.value.push({
        id: control.id,
        data: control,
        position: { x: 0, y: 0 },
      })
    })

    props.data.causalities?.forEach((causality) => {
      if (causality.controls.length) {
        const first = causality.controls[0]

        edges.value.push({
          id: `${causality.cause.id};${first.id}`,
          source: causality.cause.id,
          target: first.id,
        })

        causality.controls.slice(1).forEach((control, i) => {
          const previous = causality.controls[i]
          edges.value.push({
            id: `${previous.id};${control.id}`,
            source: previous.id,
            target: control.id,
          })
        })

        const last = causality.controls[causality.controls.length - 1]

        edges.value.push({
          id: `${last.id};${causality.effect.id}`,
          source: last.id,
          target: causality.effect.id,
        })
      } else {
        edges.value.push({
          id: `${causality.cause.id};${causality.effect.id}`,
          source: causality.cause.id,
          target: causality.effect.id,
        })
      }
    })
  },
  { immediate: true },
)

function layoutGraph() {
  nodes.value = layout(nodes.value, edges.value, 'LR')

  nextTick(fitView)
}
</script>
