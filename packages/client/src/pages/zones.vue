<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :fit-view-on-init="false"
    :default-viewport="{ zoom: 1 }"
    :default-edge-options="{ type: undefined }"
    @nodes-initialized="layout('LR')"
  >
    <Background />
    <MiniMap />
  </VueFlow>
  <!-- <div class="absolute top-0 right-0 h-full overflow-auto text-sm">
    <pre>{{ zones }}</pre>
  </div> -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow, Position, Node, Edge } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { MiniMap } from '@vue-flow/minimap'
import dagre from '@dagrejs/dagre'
import _ from 'lodash'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

type Zone = {
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
    templateId: 'CheckPoint1',
    choices: [
      {
        id: 'A',
        text: 'Choice A',
        zoneTriggers: 'Zone-2',
      },
      {
        id: 'B',
        text: 'Choice B',
        zoneTriggers: 'Zone-3',
      },
    ],
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
    templateId: 'CheckPoint-1',
    choices: [
      {
        id: 'A',
        text: 'Choice A',
        zoneTriggers: 'Zone-4',
      },
      {
        id: 'B',
        text: 'Choice B',
        zoneTriggers: 'Zone-5',
      },
    ],
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

function isBranch(zone: Zone) {
  return _.some(zone.choices?.map((choice) => choice.zoneTriggers))
}

type Connection = {
  owner: Node
  connection: { label: string; type: 'choice' | 'score' }
  parent?: Connection
}

function build(
  branch: Zone[],
  zones: Zone[] = branch,
  claims: { zone: Zone; owner: Zone }[] = [],
  parent: Connection | undefined = undefined,
  leaves: {
    node: Node
    fallback: Connection | undefined
  }[] = [],
  nodes: Node[] = [],
  edges: Edge[] = [],
) {
  let previous: Node | undefined = undefined

  // on the main sequence, exclude zones that are claimed by any branch
  let skip: Zone[] = []

  if (!parent) {
    zones.forEach((zone) => {
      zone.choices?.forEach((choice) => {
        if (!choice.zoneTriggers) return

        // find all included branch zone ids whether they are grouped or not
        const ids = [...choice.zoneTriggers.matchAll(/[^:,]+/g)].map(
          (result) => result[0],
        )

        ids.forEach((id) => {
          const found = zones.find((zone) => {
            return zone.id === id
          })

          if (found) {
            skip.push(found)
          }
        })
      })
    })
  }

  // main loop
  branch.forEach((zone) => {
    if (!parent && skip.includes(zone)) return

    // create the zone node and add it
    const node = {
      id: _.uniqueId(),
      label: zone.title,
      position: { x: 0, y: 0 },
      data: {
        type: isBranch(zone) ? 'branching' : 'content',
        zone,
      },
    }

    nodes.push(node)

    // find leaf nodes that should be connected to the parent branch
    const unresolved = leaves.filter((leaf) => leaf.fallback === parent)

    if (unresolved.length) {
      // connect branch leaf nodes to their fallback node
      unresolved.forEach((leaf) => {
        if (parent === leaf.fallback) {
          edges.push({
            id: `${leaf.node.id}-${node.id}`,
            source: leaf.node.id,
            target: node.id,
          })

          _.pull(leaves, leaf)
        }
      })
    } else if (parent && !previous) {
      // new branch start - add an edge to the branching node
      const edge = {
        id: `${parent.owner.id}-${node.id}`,
        source: parent.owner.id,
        target: node.id,
        label: parent.connection.label,
      }

      edges.push(edge)
    } else if (previous) {
      // add a default, sequential edge
      const edge = {
        id: `${previous.id}-${node.id}`,
        source: previous.id,
        target: node.id,
      }

      edges.push(edge)
    }

    // for branching zones, create branches from choices
    zone.choices?.forEach((choice) => {
      const children: Zone[] = []
      const destinations = _.uniq(choice.zoneTriggers?.split(','))

      destinations.forEach((destination) => {
        const child = zones.find((zone) => zone.id === destination)

        if (child) {
          const claim = claims.find((claim) => claim.zone === child)

          // ignore zones that are claimed in a previous branch
          if (claim && claim.owner !== zone) return

          children.push(child)

          if (!claim) {
            claims.push({ zone: child, owner: zone })
          }
        }
      })

      const fallback = parent

      // specify the new parent branch context
      const parent_ = {
        owner: node,
        connection: {
          label: choice.id,
          type: 'choice' as const,
        },
      }

      // for each branch, build the nodes & edges recursively
      build(children, zones, claims, parent_, leaves, nodes, edges)

      // store the last added node as a leaf, to be connected to the fallback branch later
      const end = _.last(nodes)
      if (end) {
        leaves.push({ node: end, fallback })
        console.log({ node: end, fallback })
      }
    })

    previous = node
  })

  return { nodes, edges, leaves }
}

const init = build(zones)

console.log(init.leaves)

const nodes = ref(init.nodes)
const edges = ref(init.edges)

const { findNode } = useVueFlow()

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
