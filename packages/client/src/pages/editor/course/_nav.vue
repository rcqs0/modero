<template>
  <Layout column size="80" class="shadow-md z-[1] bg-white px-4 py-2 gap-1">
    <Flex
      class="mb-2 p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-bold"
    >
      <i class="ri-graduation-cap-line" />
      2025 IBM Core Training
      <div class="flex-grow" />
      <i class="ri-settings-3-line font-normal text-surface-400" />
    </Flex>
    <Flex
      class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
    >
      <i class="ri-arrow-right-s-line" />
      <i class="ri-function-line" />
      Introduction
    </Flex>
    <Flex column class="gap-1 rounded-lg">
      <Flex
        class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-bold"
      >
        <i class="ri-arrow-down-s-line" />
        <i class="ri-function-line" />
        Know Your Policies
      </Flex>
      <Flex column class="pl-6 gap-1">
        <Flex
          class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
        >
          <i class="ri-align-left" />
          Sexual Harrassment
        </Flex>
        <Flex
          class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
        >
          <i class="ri-video-line" />
          Code Of Conduct
        </Flex>
        <Flex
          class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
        >
          <i class="ri-search-line" />
          GDPR
        </Flex>
        <Flex
          class="p-2 gap-2 items-center rounded-lg bg-primary-50 text-primary-500 transition-colors cursor-pointer font-bold"
        >
          <i class="ri-headphone-line" />
          Data Privacy
        </Flex>
        <Flex
          class="p-2 gap-2 items-center rounded-lg text-neutral-300 hover:text-primary-500 transition-colors cursor-pointer"
        >
          <i class="ri-add-line" />
          Add Page
        </Flex>
      </Flex>
    </Flex>
    <Flex
      class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
    >
      <i class="ri-arrow-right-s-line" />
      <i class="ri-function-line" />
      Lessons Learned
    </Flex>
    <Flex
      class="p-2 gap-2 items-center rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
    >
      <i class="ri-arrow-right-s-line" />
      <i class="ri-function-line" />
      Test Yourself
    </Flex>
    <Flex
      class="p-2 gap-2 items-center rounded-lg text-neutral-300 hover:text-primary-500 transition-colors cursor-pointer"
    >
      <i class="ri-add-line" />
      <!-- <i class="ri-function-line" /> -->
      Add Section
    </Flex>
    <!-- <Flex class="p-0">
      <Button
        icon="ri-add-line"
        label="Add Section"
        severity="secondary"
        variant="outlined"
        class="flex-grow !text-opacity-50"
      />
    </Flex> -->
  </Layout>
</template>

<style lang="postcss" scoped>
i {
  /* @apply text-surface-400; */
}
</style>
