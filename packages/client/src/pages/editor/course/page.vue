<template>
  <Layout column class="gap-2 rounded-lg">
    <Flex class="gap-4 items-center">
      <Avatar
        label="TTC"
        class="bg-primary-100 text-primary-500 font-bold w-auto px-2"
      />
      <div class="text-2xl font-bold">Title Page</div>
      <!-- <SplitButton
        icon="ri-align-left"
        label="TTC"
        :model="[
          { label: 'Text Only' },
          { label: 'Text And Image' },
          { label: 'Full Page Graphic' },
          { label: 'Text Two Column' },
          { label: 'Section Title' },
        ]"
        class="shrink-0"
        severity="secondary"
      /> -->
    </Flex>
    <Flex class="overflow-auto gap-4 items-center">
      <Tabs value="0" scrollable class="overflow-auto">
        <TabList class="rounded-lg">
          <Tab value="0"><i class="ri-sketching mr-2" />Design</Tab>
          <!-- <Tab value="1">
                <i class="ri-image-2-line mr-2" />
                Background
              </Tab> -->
          <Tab value="2"><i class="ri-paint-fill mr-2" />Style</Tab>
          <!-- <Tab value="3">
                <i class="ri-sticky-note-line mr-2" />Take Note
              </Tab> -->
          <!-- <Tab value="4"><i class="ri-magic-line mr-2" />Magic Buttons</Tab> -->
          <Tab value="5"> <i class="ri-git-branch-line mr-2" />Branching</Tab>
          <Tab value="6"><i class="ri-chat-2-line mr-2" />Comments</Tab>
        </TabList>
      </Tabs>
      <div class="flex-grow" />
      <ButtonGroup class="shrink-0 hidden md:inline-flex">
        <Button icon="ri-play-line" label="View" severity="secondary" />
        <Button icon="ri-external-link-line" severity="secondary" />
      </ButtonGroup>
      <Button
        class="shrink-0 md:hidden"
        icon="ri-play-line"
        severity="secondary"
      />
    </Flex>
    <ResizableLayout class="gap-2">
      <Layout column class="gap-4" style="flex-grow: 0.5">
        <Panel
          header="Page"
          toggleable
          :toggle-button-props="toggleButtonProps"
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <i class="ri-sound-module-line" />
              Page
            </Flex>
          </template>
          <Flex column class="gap-4">
            <Flex class="gap-4">
              <IconField class="flex-grow">
                <InputIcon class="ri-text" />
                <InputText placeholder="Title" fluid />
              </IconField>
              <IconField class="w-24 shrink-0">
                <InputIcon class="ri-timer-line" />
                <InputText placeholder="0:00" fluid />
              </IconField>
            </Flex>
            <SelectButton
              :options="[
                { icon: 'ri-align-left', value: 'left' },
                { icon: 'ri-align-center', value: 'center' },
                { icon: 'ri-align-right', value: 'right' },
              ]"
              option-label="value"
            >
              <template #option="{ option }">
                <i :class="option.icon" />
              </template>
            </SelectButton>
          </Flex>
        </Panel>
        <!-- <Divider><strong>Text Only</strong></Divider> -->
        <Panel
          header="Left Column"
          toggleable
          :toggle-button-props="toggleButtonProps"
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <i class="ri-align-left" />
              Left Column
            </Flex>
          </template>
          <Flex column class="gap-4">
            <IconField class="flex-grow">
              <InputIcon class="ri-heading" />
              <InputText placeholder="Header" fluid />
            </IconField>
            <div class="rounded-lg border border-surface-300 h-48" />
          </Flex>
        </Panel>
        <Panel
          header="Right Column"
          toggleable
          :toggle-button-props="toggleButtonProps"
          collapsed
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <i class="ri-align-right" />
              Right Column
            </Flex>
          </template>
          <Flex column class="gap-4">
            <IconField class="flex-grow">
              <InputIcon class="ri-heading" />
              <InputText placeholder="Header" fluid />
            </IconField>
            <div class="rounded-lg border border-surface-300 h-48" />
          </Flex>
        </Panel>
        <!-- <Divider><strong>General</strong></Divider> -->
        <Panel
          header="Page"
          toggleable
          :toggle-button-props="toggleButtonProps"
          collapsed
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <i class="ri-image-2-line" />
              Background
            </Flex>
          </template>
          <Flex column class="gap-4 h-48">&nbsp;</Flex>
        </Panel>
        <Panel
          header="Page"
          toggleable
          :toggle-button-props="toggleButtonProps"
          collapsed
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <OverlayBadge>
                <i class="ri-sticky-note-line" />
              </OverlayBadge>
              Take Note
            </Flex>
          </template>
          <Flex column class="gap-4 h-48">&nbsp;</Flex>
        </Panel>
      </Layout>
      <Layout class="rounded-lg bg-surface-50">
        <Layout
          class="bg-surface-100 items-center justify-center text-2xl font-bold text-surface-500"
        >
          Preview
        </Layout>
      </Layout>
    </ResizableLayout>
  </Layout>
</template>

<script lang="ts" setup>
const toggleButtonProps = {
  rounded: true,
  severity: 'secondary',
  variant: 'text',
  class: '-mr-1',
  style: 'transform: scale(0.8);',
}
</script>

<style lang="postcss" scoped>
:deep(.p-tablist-tab-list) {
  @apply bg-transparent border-none;
}
:deep(.p-tab) {
  /* @apply border-none py-2; */
}

:deep(.p-tablist-nav-button) {
  @apply bg-surface-50;
}

:deep(.p-divider-content) {
  @apply bg-neutral-100;
}
</style>
