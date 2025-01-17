<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :fit-view-on-init="false"
    :default-viewport="{ zoom: 1 }"
    :default-edge-options="{ type: undefined }"
    @nodes-initialized="layout('UD')"
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
        zoneTriggers: 'Zone-3',
      },
      {
        id: 'B',
        text: 'Choice B',
        zoneTriggers: 'Zone-4',
      },
      {
        id: 'C',
        text: 'Choice C',
        // zoneTriggers: 'Zone-8',
      },
    ],
  },
  // {
  //   __typename: 'Zone',
  //   id: 'Zone-2',
  //   title: 'Zone 2',
  //   templateId: 'TextOnly1',
  // },
  {
    __typename: 'Zone',
    id: 'Zone-3',
    title: 'Zone 3',
    templateId: 'Audio1',
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
  // {
  //   __typename: 'Zone',
  //   id: 'Zone-6',
  //   title: 'Zone 6',
  //   templateId: 'TextOnly1',
  // },
  // {
  //   __typename: 'Zone',
  //   id: 'Zone-7',
  //   title: 'Zone 7',
  //   templateId: 'TextOnly1',
  // },
  // {
  //   __typename: 'Zone',
  //   id: 'Zone-8',
  //   title: 'Zone 8',
  //   templateId: 'TextOnly1',
  // },
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

function makeNode(zones: Zone[], parent?: Node) {
  const id = _.uniqueId()

  return {
    id,
    type: 'default',
    data: {
      label: _.map(zones, 'title').join(','),
      type: zones.length > 1 ? 'group' : 'zone',
      branching: isBranchingZone(_.last(zones)!),
      zones,
      fallback: false,
      parent,
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

function getClaimedZones(zones: Zone[]) {
  let claimed: Zone[] = []

  zones.forEach((zone) => {
    zone.choices?.forEach((choice) => {
      if (!choice.zoneTriggers) return

      Array.from(choice.zoneTriggers.matchAll(/[^:,]+/g))
        .map((result) => result[0])
        .forEach((id) => {
          const found = zones.find((zone) => zone.id === id)

          if (found) {
            claimed.push(found)
          }
        })
    })
  })

  return claimed
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
  const unclaimed = !context ? _.difference(path, getClaimedZones(zones)) : path

  // main loop
  unclaimed.forEach((segment) => {
    // create the zone node and add it
    const node = makeNode(_.castArray(segment), context?.parent)
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
        root === nodes[0] && root.data.branching
          ? () => true
          : (edge) => edge.label === context?.branch,
      ).forEach((leaf) => {
        edges.push(makeEdge(leaf, node))
      })

      const last = _.nth(nodes, -2)!

      if (
        last.data.parent !== node.data.parent &&
        last.data.parent?.data.fallback
      ) {
        edges.push(makeEdge(last.data.parent, node))
      }
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
            // single zone sequence
            const child = zones.find((zone) => zone.id === sequence)

            if (child && makeClaim(child, zone, claims)) {
              children.push(child)
            }
          } else {
            // zone group sequence
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

const ADJUST_NODES = false

const NODE_SEP = 60
const RANK_SEP = 60
const EDGE_SEP = 20

function layout(direction: string) {
  // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
  const dagreGraph = new dagre.graphlib.Graph()

  dagreGraph.setDefaultEdgeLabel(() => ({}))

  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({
    rankdir: direction,
    align: direction === 'LR' ? 'DL' : 'DL',
    nodesep: NODE_SEP,
    ranksep: RANK_SEP,
    edgesep: EDGE_SEP,
  })

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
  const dagreNodes = nodes.value.map((node) => dagreGraph.node(node.id))

  if (ADJUST_NODES) {
    if (isHorizontal) {
      dagreNodes.forEach((dagreNode) => {
        const nodesInRank = dagreNodes.filter(
          (nodeInRank) => nodeInRank.rank === dagreNode.rank,
        )

        const i = nodesInRank.indexOf(dagreNode)
        if (i > 0) {
          const previousNodeInRank = nodesInRank[i - 1]
          const delta = -(
            dagreNode.y -
            (previousNodeInRank.y + previousNodeInRank.height) -
            NODE_SEP
          )

          const nodesInline = dagreNodes.filter(
            (nodeInline) => nodeInline.y === dagreNode.y,
          )
          nodesInline.forEach((nodeInline) => {
            nodeInline.y += delta
          })
        }
      })
    } else {
      const ranks = _.uniq(dagreNodes.map((dagreNode) => dagreNode.rank)).sort()

      ranks.forEach((rank) => {
        const rankIndex = ranks.indexOf(rank)
        if (rankIndex === ranks.length - 1) return

        const nodesInRank = dagreNodes.filter(
          (nodeInRank) => nodeInRank.rank === rank,
        )
        const nodesInNextRank = dagreNodes.filter(
          (dagreNode) => dagreNode.rank === ranks[rankIndex + 1],
        )

        const rankMaxY = _.max(
          nodesInRank.map((nodeInRank) => nodeInRank.y + nodeInRank.height),
        )!
        const nexRankMinY = _.max(
          nodesInNextRank.map((nodesInNextRank) => nodesInNextRank.y),
        )!
        const delta = -(nexRankMinY - rankMaxY - RANK_SEP)

        nodesInNextRank.map((nodeInNextRank) => (nodeInNextRank.y += delta))
      })
    }
  }

  nodes.value = nodes.value.map((node, i) => {
    const nodeWithPosition = dagreNodes[i]

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
    }
  })
}
</script>
