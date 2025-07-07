<template>
  <Layout column class="gap-2">
    <Flex class="gap-4 items-center px-4">
      <Avatar
        icon="ri-graduation-cap-line"
        class="bg-black text-white"
        size="large"
      />
      <div class="text-2xl font-bold">2025 IBM Core Training</div>
      <div class="flex-grow" />
      <!-- <div class="text-surface-300">A00001</div> -->
    </Flex>
    <Flex class="overflow-auto gap-4 items-center pr-4">
      <Tabs value="0" scrollable class="overflow-auto">
        <TabList class="rounded-lg">
          <Tab value="0"><i class="ri-settings-3-line mr-2" />Settings</Tab>
          <Tab value="2"><i class="ri-paint-fill mr-2" />Style</Tab>
          <Tab value="5"> <i class="ri-git-branch-line mr-2" />Adaptive</Tab>
          <Tab value="6"><i class="ri-map-2-line mr-2" />Map</Tab>
        </TabList>
      </Tabs>
      <div class="flex-grow" />
      <Button icon="ri-play-fill" label="Preview" severity="secondary" />
    </Flex>
    <Layout column class="gap-4">
      <Layout>
        <Panel header="Overview" class="flex-grow border-none">
          <Panel>
            <template #header> Know Your Policies </template>
            Text Only
          </Panel>
        </Panel>
      </Layout>
      <Layout size="80">
        <Panel header="Resources" class="flex-grow border-none"> </Panel>
      </Layout>
    </Layout>
    <Layout size="80">
      <Panel header="Profiles" class="flex-grow border-none"> </Panel>
    </Layout>
  </Layout>
</template>

<style lang="postcss" scoped>
:deep(.p-tablist-tab-list) {
  @apply bg-transparent border-none;
}
:deep(.p-tab) {
  /* @apply border-none py-2; */
}

:deep(.p-tablist-nav-button) {
  /* @apply bg-white/85; */
  @apply bg-surface-50;
}

/* :deep(.p-tablist-prev-button) {
  @apply ml-4;
} */

:deep(.p-divider-horizontal) {
  @apply my-0;
}
:deep(.p-divider-content) {
  @apply bg-neutral-50 text-surface-400;
}
</style>
