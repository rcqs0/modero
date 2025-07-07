<template>
  <Layout column class="p-12 gap-4">
    <Layout size="12">
      <Button @click="execute">Do</Button>
    </Layout>
    <Layout> ... </Layout>
  </Layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import client from '@/client'

const response = ref()

async function execute() {
  const response = await client.chat.query()

  console.log(response)
}
</script>
