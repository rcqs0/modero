<template>
  <div class="p-3 flex flex-col">
    <InputText v-model="group" />
    <TreeTable
      selection-mode="multiple"
      :selection-keys="selectionKeys"
      :value="data"
      meta-key-selection
    >
      <Column field="title" header="Title" expander class="w-1/2" />
      <Column field="profileQuery" header="Profile Query">
        <template #body="{ column, node }">
          {{ node.data.profileQuery }}
        </template>
      </Column>
    </TreeTable>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import _ from 'lodash'
import { TreeNode } from 'primevue/treenode'

defineProps<{}>()

// const profiles = {
//   mgr: ['yes', 'no'],
//   region: ['emea', 'na', 'apac'],
// }

const group = ref('region=na')

function deserializeGroup(groupString: string) {
  return groupString.split(' and ').map((expr) => {
    const [key, values] = expr.split('=')
    return { key, values: values?.split(',') || [] }
  })
}

function deserializeQuery(queryString: string) {
  return queryString.split(';').map(deserializeGroup)
}

function matchGroup(groupString: string, queryString: string) {
  const groupA = deserializeGroup(groupString)

  for (const groupB of deserializeQuery(queryString)) {
    if (
      _.every(
        groupB.map(
          ({ key, values }) =>
            _.intersection(values, _.find(groupA, { key })?.values).length,
        ),
      )
    ) {
      return true
    }
  }

  return false
}

function getNodeList(
  data: TreeNode[],
  filter: (node: TreeNode) => boolean = () => true,
  nodes: TreeNode[] = [],
) {
  nodes.push(...data.filter(filter))

  data.forEach((node) => {
    if (node.children) {
      getNodeList(node.children, filter, nodes)
    }
  })

  return nodes
}

const selectionKeys = computed(() => {
  const matches = getNodeList(data, (node) =>
    matchGroup(group.value, node.data.profileQuery),
  )

  return _.mapValues(_.keyBy(matches, 'key'), () => true)
})

const data: TreeNode[] = [
  {
    key: 'Section-A',
    data: {
      title: 'Section A',
      profileQuery:
        'mgr=no,yes and region=na,emea;mgr=no and region=na;region=apac',
    },
  },
  {
    key: 'Section-B',
    data: {
      title: 'Section B',
      profileQuery: 'mgr=yes and region=emea;mgr=no and region=na;region=apac',
    },
    children: [
      {
        key: 'Page-A',
        data: {
          title: 'Page A',
          profileQuery:
            'mgr=yes and region=emea;mgr=no and region=na;region=apac',
        },
      },
      {
        key: 'Page-B',
        data: {
          title: 'Page B',
          profileQuery:
            'mgr=yes and region=emea;mgr=no and region=na;region=apac',
        },
      },
      {
        key: 'Page-C',
        data: {
          title: 'Page C',
          profileQuery:
            'mgr=yes and region=emea;mgr=no and region=na;region=apac',
        },
      },
    ],
  },
  {
    key: 'Section-C',
    data: {
      title: 'Section C',
      profileQuery: 'mgr=yes and region=emea;mgr=no and region=na;region=apac',
    },
    children: [
      {
        key: 'Page-D',
        data: {
          title: 'Page D',
          profileQuery:
            'mgr=yes and region=emea;mgr=no and region=na;region=apac',
        },
        children: [
          {
            key: 'AssessmentCategory-A',
            data: {
              title: 'Assessment Category A',
              profileQuery:
                'mgr=yes and region=emea;mgr=no and region=na;region=apac',
            },
            children: [
              {
                key: 'AssessmentQuestion-A',
                data: {
                  title: 'Assessment Question A',
                  profileQuery:
                    'mgr=yes and region=emea;mgr=no and region=na;region=apac',
                },
              },
            ],
          },
          {
            key: 'AssessmentCategory-D',
            data: {
              title: 'Assessment Category D',
              profileQuery:
                'mgr=yes and region=emea;mgr=no and region=na;region=apac',
            },
            children: [
              {
                key: 'AssessmentQuestion-B',
                data: {
                  title: 'Assessment Question B',
                  profileQuery:
                    'mgr=yes and region=emea;mgr=no and region=na;region=apac',
                },
              },
              {
                key: 'AssessmentQuestion-C',
                data: {
                  title: 'Assessment Question C',
                  profileQuery:
                    'mgr=yes and region=emea;mgr=no and region=na;region=apac',
                },
              },
              {
                key: 'AssessmentQuestion-D',
                data: {
                  title: 'Assessment Question D',
                  profileQuery:
                    'mgr=yes and region=emea;mgr=no and region=na;region=apac',
                },
              },
            ],
          },
        ],
      },
      {
        key: 'Page-E',
        data: {
          title: 'Page E',
          profileQuery:
            'mgr=yes and region=emea;mgr=no and region=na;region=apac',
        },
      },
    ],
  },
  {
    key: 'Section-D',
    data: {
      title: 'Section D',
      profileQuery: 'mgr=yes and region=emea;mgr=no and region=na;region=apac',
    },
  },
  {
    key: 'Section-E',
    data: {
      title: 'Section E',
      profileQuery: 'mgr=yes and region=emea;mgr=no and region=na;region=apac',
    },
  },
]
</script>
