import _ from 'lodash'
import dagre from '@dagrejs/dagre'
import { Position, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { ref } from 'vue'

const RANK_SEP = 50
const NODE_SEP = RANK_SEP
const EDGE_SEP = RANK_SEP / 2

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {
  const { findNode } = useVueFlow()

  const graph = ref(new dagre.graphlib.Graph())

  const previousDirection = ref('LR')

  function layout(nodes: Node[], edges: Edge[], direction: string) {
    // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
    const dagreGraph = new dagre.graphlib.Graph()

    graph.value = dagreGraph

    dagreGraph.setDefaultEdgeLabel(() => ({}))

    const isHorizontal = direction === 'LR'
    dagreGraph.setGraph({
      rankdir: direction,
      // ranker: 'longest-path',
      ranksep: RANK_SEP,
      nodesep: NODE_SEP,
      edgesep: EDGE_SEP,
    })

    previousDirection.value = direction

    for (const node of nodes) {
      // if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
      const graphNode = findNode(node.id)

      if (graphNode) {
        dagreGraph.setNode(node.id, {
          width: graphNode.dimensions.width || 150,
          height: graphNode.dimensions.height || 50,
        })
      }
    }

    for (const edge of edges) {
      dagreGraph.setEdge(edge.source, edge.target)
    }

    dagre.layout(dagreGraph, { disableOptimalOrderHeuristic: false })
    const dagreNodes = nodes.map((node) => graph.value.node(node.id))

    // if (isHorizontal) {
    //   const ranks = _.uniq(dagreNodes.map((dagreNode) => dagreNode.rank)).sort(
    //     (a, b) => a! - b!,
    //   )

    //   ranks.forEach((rank) => {
    //     const nodesInRank = dagreNodes
    //       .filter((dagreNode) => dagreNode.rank === rank)
    //       .sort((a, b) => a.y - b.y)

    //     nodesInRank.forEach((dagreNode, i) => {
    //       const nextNodeInRank = nodesInRank[i + 1]

    //       if (nextNodeInRank) {
    //         const ySep = nextNodeInRank.y - (dagreNode.y + dagreNode.height)

    //         if (ySep < NODE_SEP) {
    //           nodesInRank.slice(i + 1).forEach((dagreNode) => {
    //             dagreNode.y += NODE_SEP - ySep
    //           })
    //         }
    //       }
    //     })
    //   })
    // }

    // set nodes with updated positions
    return nodes.map((node, i) => {
      const dagreNode = dagreNodes[i]

      return {
        ...node,
        targetPosition: isHorizontal ? Position.Left : Position.Top,
        sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
        position: { x: dagreNode.x, y: dagreNode.y },
      }
    })
  }

  return { graph, layout, previousDirection }
}
