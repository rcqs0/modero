<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :fit-view-on-init="false"
    :default-viewport="{ zoom: 1 }"
    @nodes-initialized="layout('LR')"
  >
    <Background />
    <MiniMap />

    <template #edge-button="buttonEdgeProps">
      <BaseEdge
        :id="buttonEdgeProps.id"
        :style="buttonEdgeProps.style"
        :marker-end="buttonEdgeProps.markerEnd"
        :path="getBezierPath(buttonEdgeProps)[0]"
      />
      <EdgeLabelRenderer>
        <div
          :style="{
            pointerEvents: 'all',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${
              getBezierPath(buttonEdgeProps)[1]
            }px,${getBezierPath(buttonEdgeProps)[2]}px)`,
          }"
          class="nodrag nopan"
        >
          <Button @click="removeEdges(buttonEdgeProps.id)" size="small" rounded>
            X
          </Button>
        </div>
      </EdgeLabelRenderer>
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  VueFlow,
  useVueFlow,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import dagre from '@dagrejs/dagre'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const { findNode, removeEdges } = useVueFlow()

const position = { x: 0, y: 0 }

const nodes = ref([
  { id: '1', type: 'input', label: 'Node 1', position },
  { id: '2', label: 'Node 2', position },
  { id: '3', label: 'Node 3', position },
  { id: '4', label: 'Node 4', position },
])

const edges = ref([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    label: 'Edge',
    style: { stroke: 'orange' },
    labelBgStyle: { fill: 'orange' },
    type: 'button',
  },
  { id: 'e1-3', source: '1', target: '3' },
])

function layout(direction: string) {
  // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
  const dagreGraph = new dagre.graphlib.Graph()

  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction })

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
