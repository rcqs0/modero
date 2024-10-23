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
    <Controls position="top-right" />
    <!-- <template #node-default="props">
      <DiagramNode :id="props.id" :data="props.data" />
    </template> -->
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
import { Controls } from '@vue-flow/controls'

import dagre from '@dagrejs/dagre'
import _ from 'lodash'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

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
        zoneTriggers: 'Zone-2:Zone-6',
      },
      {
        id: 'B',
        text: 'Choice B',
        // zoneTriggers: 'Zone-3,Zone-6',
        zoneTriggers: 'Zone-3',
        // zoneTriggers: 'Zone-3',
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
  {
    __typename: 'Zone',
    id: 'Zone-7',
    title: 'Zone 7',
    templateId: 'TextOnly1',
  },
]

function isBranchingZone(zone: Zone) {
  return _.some(zone.choices?.map((choice) => choice.zoneTriggers))
}

function getLeafNodes(
  node: Node,
  nodes: Node[],
  edges: Edge[],
  filter: (edge: Edge) => boolean = () => true,
  found: Node[] = [],
) {
  const children: Node[] = []

  edges.filter(filter).forEach((edge) => {
    if (edge.source === node.id) {
      nodes.forEach((child) => {
        if (child.data.fallback) {
          found.push(child)
        }

        if (edge.target === child.id) {
          children.push(child)
        }
      })
    }
  })

  if (children.length) {
    children.forEach((child) =>
      getLeafNodes(child, nodes, edges, () => true, found),
    )
  } else {
    found.push(node)
  }

  return _.uniq(found)
}

function makeNode(zones: Zone[]) {
  return {
    id: _.map(zones, 'id').join(','), // _.uniqueId()
    type: 'default',
    data: {
      label: _.map(zones, 'title').join(','),
      type: zones.length > 1 ? 'group' : 'zone',
      fallback: false,
      zones,
    },
    height: 40 * zones.length,
    position: { x: 0, y: 0 },
  }
}

function makeEdge(from: Node, to: Node, label?: string) {
  return {
    id: `${from.id}-${to.id}`,
    source: from.id,
    target: to.id,
    label,
  }
}

function makeClaim(
  zone: Zone,
  owner: Zone,
  claims: { zone: Zone; owner: Zone }[] = [],
) {
  const claim = claims.find((claim) => claim.zone === zone)

  if (!claim) {
    // not claimed yet, add new claim
    claims.push({ zone, owner })
    return true
  } else if (claim.owner === owner) {
    // already claimed by owner
    return true
  }

  // claimed by another zone
  return false
}

function build(
  path: (Zone | Zone[])[],
  zones: Zone[] = _.flatten(path),
  claims: { zone: Zone; owner: Zone }[] = [],
  nodes: Node[] = [],
  edges: Edge[] = [],
  context:
    | { parent: Node; branch: string; type: 'choice' | 'score' }
    | undefined = undefined,
) {
  let previous: Node | undefined = undefined

  // on the main sequence, exclude zones that are claimed by any branch
  let skip: Zone[] = []

  if (!context) {
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
  path.forEach((segment) => {
    if (!context && _.intersection(skip, _.castArray(segment)).length) return

    // create the zone node and add it
    const node = makeNode(_.castArray(segment))
    nodes.push(node)

    if (context && !previous) {
      // new branch start - add an edge to the branching node
      edges.push(makeEdge(context.parent, node, context.branch))
    } else if (previous) {
      const root = context?.parent || nodes[0]

      getLeafNodes(
        root,
        nodes,
        edges,
        (edge) => edge.label === context?.branch,
      ).forEach((leaf) => {
        if (leaf.data.fallback) {
          leaf.data.fallback = false
        }

        edges.push(makeEdge(leaf, node))
      })
    }

    // if segment has multiple zones, only the last can branch
    const zone = _.last(_.castArray(segment))!

    // for branching zones, create branches from choices
    if (isBranchingZone(zone)) {
      zone.choices?.forEach((choice) => {
        const children: (Zone | Zone[])[] = []
        const sequences = _.uniq(choice.zoneTriggers?.split(','))

        // construct branch path from zone trigger sequences
        sequences.forEach((sequence) => {
          const parts = sequence.split(':')

          if (parts.length === 1) {
            const child = zones.find((zone) => zone.id === sequence)

            if (child && makeClaim(child, zone, claims)) {
              children.push(child)
            }
          } else {
            const group = _.compact(
              parts.map((id) => zones.find((zone) => zone.id === id)),
            ).filter((child) => makeClaim(child, zone, claims))

            if (group.length) {
              children.push(group)
            }
          }
        })

        if (!children.length) {
          node.data.fallback = true
        }

        // for each branch, build the nodes & edges recursively
        build(children, zones, claims, nodes, edges, {
          parent: node,
          branch: choice.id,
          type: 'choice',
        })
      })
    }

    previous = node
  })

  return { nodes, edges }
}

const init = build(zones)

console.log(init)

const nodes = ref(init.nodes)
const edges = ref(init.edges)

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
