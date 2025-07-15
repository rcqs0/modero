<template>
  <Diagram
    :nodes="nodes"
    :edges="edges"
    :nodes-draggable="true"
    :apply-default="true"
    class="bg-neutral-50"
    @nodes-initialized="layoutGraph"
  >
    <template #node-default="node">
      <BowtieDiagramNode :node="node" />
    </template>

    <Panel
      v-if="selected"
      position="top-right"
      class="p-3 shadow-md rounded-md bg-white flex flex-col"
    >
      <UncertaintyForm
        v-if="selected.data.__typename === 'Uncertainty'"
        :data="selected.data"
      />
      <CauseForm
        v-if="selected.data.__typename === 'Cause'"
        :data="selected.data"
      />
      <EffectForm
        v-if="selected.data.__typename === 'Effect'"
        :data="selected.data"
      />
      <ControlForm
        v-if="selected.data.__typename === 'Control'"
        :data="selected.data"
      />
    </Panel>
  </Diagram>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, computed } from 'vue'
import { Panel, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import {
  type Uncertainty,
  type Event,
  type Control,
  type Cause,
  type Effect,
} from '@/schemas'
import { useLayout } from './useLayout'

type Instance = Uncertainty | Control | Cause | Effect

const props = defineProps<{
  data: {
    uncertainty: Uncertainty
    events?: Event[]
    controls?: Control[]
    causes?: Cause[]
    effects?: Effect[]
  }
}>()

const { fitView, zoomTo, getSelectedNodes } = useVueFlow()
// setInteractive(false)
const { layout } = useLayout()

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

function addNode(data: Instance) {
  nodes.value.push({
    id: data.id,
    data,
    position: { x: 0, y: 0 },
    // width: 150,
  })
}

function addEdge(source: Instance, target: Instance) {
  edges.value.push({
    id: `${source.id};${target.id}`,
    source: source.id,
    target: target.id,
  })
}

watch(
  () => props.data,
  () => {
    nodes.value = []
    edges.value = []

    addNode(props.data.uncertainty)

    props.data.controls?.forEach((control) => {
      addNode(control)
    })

    props.data.causes?.forEach((cause) => {
      addNode(cause)
    })

    props.data.effects?.forEach((effect) => {
      addNode(effect)
    })

    props.data.causes?.forEach((cause) => {
      if (cause.controls.length) {
        const first = cause.controls[0]
        addEdge(cause, first)

        cause.controls.slice(1).forEach((control, i) => {
          const previous = cause.controls[i]
          addEdge(previous, control)
        })

        const last = cause.controls[cause.controls.length - 1]
        addEdge(last, cause.uncertainty)
      } else {
        addEdge(cause, cause.uncertainty)
      }
    })

    props.data.effects?.forEach((effect) => {
      if (effect.controls.length) {
        const first = effect.controls[0]
        addEdge(effect.uncertainty, first)

        effect.controls.slice(1).forEach((control, i) => {
          const previous = effect.controls[i]
          addEdge(previous, control)
        })

        const last = effect.controls[effect.controls.length - 1]
        addEdge(last, effect)
      } else {
        addEdge(effect.uncertainty, effect)
      }
    })
  },
  { immediate: true },
)

function layoutGraph() {
  nodes.value = layout(nodes.value, edges.value, 'LR')

  nextTick(() => {
    fitView()
    zoomTo(1)
  })
}

const selected = computed(() => getSelectedNodes.value[0])
</script>
