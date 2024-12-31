<template>
  <Layout column class="p-4">
    <div>
      <Button
        label="Open"
        @click="router.push({ path: '/editor/course/page' })"
      />
    </div>
  </Layout>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
