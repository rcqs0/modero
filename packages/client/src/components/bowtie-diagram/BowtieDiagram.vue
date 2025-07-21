<template>
  <Diagram
    :nodes="nodes"
    :edges="edges"
    :nodes-draggable="false"
    :apply-default="false"
    class="bg-neutral-50"
    @nodes-initialized="layoutGraph"
  >
    <!-- <template #node-default="node">
      <BowtieDiagramNode
        :node="node"
        :selected="selected === node.id"
        @add-effect="addEffect"
        @add-cause="addCause"
        @add-control="addControl"
      />
    </template> -->
    <template #node-Uncertainty="node">
      <UncertaintyDiagramNode
        :node="node"
        :selected="selected === node.id"
        @add-cause="addCause"
        @add-effect="addEffect"
      />
    </template>
    <template #node-Cause="node">
      <CauseDiagramNode
        :node="node"
        :selected="selected === node.id"
        @add-control="addControl"
      >
        {{ node.data.event.label }}
      </CauseDiagramNode>
    </template>
    <template #node-Effect="node">
      <EffectDiagramNode
        :node="node"
        :selected="selected === node.id"
        @add-control="addControl"
      >
        {{ node.data.event.label }}
      </EffectDiagramNode>
    </template>
    <template #node-Control="node">
      <ControlDiagramNode :node="node" :selected="selected === node.id" />
    </template>

    <Panel
      v-if="selectedNode"
      position="top-right"
      class="p-6 w-96 shadow rounded-md bg-white flex flex-col gap-6"
    >
      <div class="text-xl font-bold">
        {{ selectedNode.data.label ?? selectedNode.data.event?.label }}
      </div>
      <UncertaintyForm
        v-if="selectedNode.data.__typename === 'Uncertainty'"
        :data="selectedNode.data"
      />
      <CauseForm
        v-if="selectedNode.data.__typename === 'Cause'"
        :data="selectedNode.data"
      />
      <EffectForm
        v-if="selectedNode.data.__typename === 'Effect'"
        :data="selectedNode.data"
      />
      <ControlForm
        v-if="selectedNode.data.__typename === 'Control'"
        :data="selectedNode.data"
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
  effectSchema,
  causeSchema,
  controlSchema,
} from '@/schemas'
import { useLayout } from './useLayout'
import { transact } from '@/composables/document/utils'

type Instance = Uncertainty | Control | Cause | Effect

const props = defineProps<{
  data: {
    uncertainties: Uncertainty[]
    events: Event[]
    controls: Control[]
    causes: Cause[]
    effects: Effect[]
  }
}>()

const { fitView, zoomTo, onNodeClick, onPaneClick, findNode } = useVueFlow()
// setInteractive(false)
const { layout } = useLayout()

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

function addNode(data: Instance) {
  nodes.value.push({
    id: data.id,
    data,
    position: { x: 0, y: 0 },
    type: data.__typename,
    width: 150,
  })
}

function addEdge(source: Instance, target: Instance) {
  edges.value.push({
    id: `${source.id};${target.id}`,
    source: source.id,
    target: target.id,
  })
}

function build() {
  console.log('BUILD_DIAGRAM')
  nodes.value = []
  edges.value = []

  props.data.uncertainties.forEach((uncertainty) => {
    addNode(uncertainty)
  })

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
}

watch(
  [
    () => props.data,
    () => props.data.uncertainties.length,
    () => props.data.causes.length,
    () => props.data.effects.length,
    () => props.data.controls.length,
  ],
  build,
  {
    immediate: true,
  },
)

function layoutGraph() {
  nodes.value = layout(nodes.value, edges.value, 'LR')

  if (!selected.value) {
    nextTick(() => {
      fitView()
      zoomTo(1)
    })
  }
}

const selected = ref<string>()
const selectedNode = computed(() => findNode(selected.value))

onNodeClick(({ node }) => {
  selected.value = node.id
})

onPaneClick(() => {
  selected.value = undefined
})

function addEffect(uncertainty: Uncertainty) {
  const effect = effectSchema.parse({
    uncertainty,
    event: { label: 'Event' },
  })
  props.data.effects.push(effect)
  selected.value = effect.id
}

function addCause(uncertainty: Uncertainty) {
  const cause = causeSchema.parse({
    uncertainty,
    event: { label: 'Event' },
  })
  props.data.causes.push(cause)
  selected.value = cause.id
}

function addControl(source: Cause | Effect) {
  const control = controlSchema.parse({
    label: 'Control',
  })
  transact(props.data.controls, () => {
    props.data.controls.push(control)
    if (source.__typename === 'Effect') {
      source.controls.push(control)
    } else {
      source.controls.unshift(control)
    }
  })
  selected.value = control.id
}
</script>
