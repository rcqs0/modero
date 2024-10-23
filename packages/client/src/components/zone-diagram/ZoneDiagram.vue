<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    fit-view-on-init
    @nodes-initialized="layout('LR')"
  >
    <template #node-zone="props">
      <ZoneDiagramNode :id="props.id" :data="props.data" />
    </template>

    <Background />
    <MiniMap pannable />
    <Controls position="top-right" />
  </VueFlow>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import _ from 'lodash'
import dagre from '@dagrejs/dagre'
import { Position, VueFlow, Node, Edge, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import { Controls } from '@vue-flow/controls'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

export type Zone = {
  __typename: 'Zone'
  id: string
  title: string
  templateId: string
  choices?: {
    id: string
    text: string
    zoneTriggers?: string
  }[]
}

const props = withDefaults(defineProps<{ zones: Zone[] }>(), {
  zones: () => [],
})

function makeNode(zone: Zone) {
  return {
    id: _.uniqueId(),
    position: { x: 0, y: 0 },
    data: {
      label: zone.title,
      zones: [zone],
    },
    type: 'zone',
  }
}

function makeEdge(source: Node, target: Node) {
  return {
    id: `${source.id}-${target.id}`,
    source: source.id,
    target: target.id,
  }
}

function build(zones: Zone[]) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  zones.forEach((zone, i) => {
    const node = makeNode(zone)
    nodes.push(node)

    if (i > 0) {
      const previous = nodes[i - 1]
      edges.push(makeEdge(previous, node))
    }
  })

  return { nodes, edges }
}

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

watch(
  () => props.zones,
  (zones) => {
    const data = build(zones)

    nodes.value = data.nodes
    edges.value = data.edges
  },
  { immediate: true },
)

const { findNode } = useVueFlow()

function layout(direction: string) {
  // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
  const dagreGraph = new dagre.graphlib.Graph()

  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction, align: 'UL' })

  for (const node of nodes.value) {
    // if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
    const graphNode = findNode(node.id)

    dagreGraph.setNode(node.id, {
      width: graphNode!.dimensions.width || 150,
      height: graphNode!.dimensions.height || 50,
    })
  }

  for (const edge of edges.value) {
    dagreGraph.setEdge(edge.source, edge.target)
  }

  dagre.layout(dagreGraph)

  // set nodes with updated positions
  nodes.value = nodes.value.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
    }
  })
}
</script>

<style lang="postcss">
.vue-flow__node-toolbar {
  @apply flex gap-2 items-center;
}
</style>
