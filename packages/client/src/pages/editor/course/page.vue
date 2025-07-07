<template>
  <Layout column class="gap-2 rounded-lg">
    <Flex class="gap-4 items-center pl-4">
      <Avatar icon="ri-align-left" class="bg-black text-white" size="large" />
      <div class="text-2xl font-bold">Title Page</div>
      <SplitButton
        dropdown-icon="ri-swap-2-line"
        label="Text Two Column"
        :model="[
          { label: 'Text Only' },
          { label: 'Text And Image' },
          { label: 'Full Page Graphic' },
          { label: 'Text Two Column' },
          { label: 'Section Title' },
        ]"
        class="shrink-0"
        severity="secondary"
      />
      <div class="flex-grow" />
      <!-- <div class="text-surface-300">A00001</div> -->
    </Flex>
    <Flex class="overflow-auto gap-4 items-center pr-4">
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
        <Button icon="ri-play-fill" label="Preview" severity="secondary" />
        <Button icon="ri-external-link-line" severity="secondary" />
      </ButtonGroup>
      <Button
        class="shrink-0 md:hidden"
        icon="ri-play-line"
        severity="secondary"
      />
    </Flex>
    <ResizableLayout class="gap-2 px-4">
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
        <div class="px-4 font-bold text-surface-400">Text Two Column</div>
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
        <!-- <Panel
          header="Choice"
          toggleable
          :toggle-button-props="toggleButtonProps"
          collapsed
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <Badge value="A" severity="contrast" />
              Choice A
            </Flex>
          </template>
          <Flex column class="gap-4">
            <div class="rounded-lg border border-surface-300 h-24" />
            <div class="font-bold text-surface-400">Feedback</div>
            <div class="rounded-lg border border-surface-300 h-24" />
          </Flex>
        </Panel>
        <Panel
          header="Choice"
          toggleable
          :toggle-button-props="toggleButtonProps"
          collapsed
          class="border-none"
        >
          <template #header>
            <Flex class="gap-2 items-center font-bold">
              <Badge value="B" severity="contrast" />
              Choice B
            </Flex>
          </template>
          <Flex column class="gap-4">
            <div class="rounded-lg border border-surface-300 h-24" />
            <div class="font-bold text-surface-400">Feedback</div>
            <div class="rounded-lg border border-surface-300 h-24" />
          </Flex>
        </Panel> -->
        <Panel
          header="Choices"
          toggleable
          :toggle-button-props="toggleButtonProps"
          collapsed
          class="border-none"
        >
          <template #header>
            <Flex class="w-full gap-2 items-center font-bold">
              <i class="ri-list-indefinite" />
              Choices
              <div class="flex-grow"></div>
            </Flex>
          </template>
          <Flex column class="gap-1">
            <!-- <DataTable
              :value="choices"
              :show-headers="false"
              reorderable-columns
              class="-mx-3"
              :expanded-rows="[]"
              data-key="id"
            >
              <Column field="text" header="Text" class="w-full !pl-3">
                <template #body="{ data }">
                  <Flex class="items-center gap-2">
                    <RadioButton />
                    {{ data.text }}
                  </Flex>
                </template>
              </Column>
              <Column row-reorder row-reorder-icon="ri-draggable"></Column>
            </DataTable> -->
            <Panel
              header="Choice"
              toggleable
              :toggle-button-props="toggleButtonProps"
              collapsed
              class="border-none bg-surface-50"
            >
              <template #header>
                <Flex class="w-full gap-2 items-center font-bold">
                  <i class="ri-draggable" />
                  <Badge value="A" severity="contrast" />
                  Choice A
                  <div class="flex-grow"></div>
                  <ToggleSwitch />
                  <Button
                    icon="ri-delete-bin-line font-normal"
                    severity="danger"
                    variant="text"
                  />
                </Flex>
              </template>
              <Tabs value="0">
                <TabList class="border-b">
                  <Tab value="0">Text</Tab>
                  <Tab value="1">Feedback</Tab>
                </TabList>
                <TabPanels class="bg-transparent">
                  <TabPanel value="0">
                    <div
                      class="bg-white rounded-lg border border-surface-300 h-24"
                    />
                  </TabPanel>
                  <TabPanel value="1">
                    <div
                      class="bg-white rounded-lg border border-surface-300 h-24"
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Panel>
            <Panel
              header="Choice"
              toggleable
              :toggle-button-props="toggleButtonProps"
              collapsed
              class="border-none bg-surface-50"
            >
              <template #header>
                <Flex class="w-full gap-2 items-center font-bold">
                  <i class="ri-draggable" />
                  <Badge value="B" severity="contrast" />
                  Choice B
                  <div class="flex-grow"></div>
                  <!-- <ToggleSwitch /> -->
                  <Button
                    icon="ri-arrow-down-s-line"
                    icon-pos="right"
                    label="yes"
                    severity="secondary"
                  />
                  <Button
                    icon="ri-delete-bin-line font-normal"
                    severity="danger"
                    variant="text"
                  />
                </Flex>
              </template>
              <Flex column class="gap-4">
                <div
                  class="bg-white rounded-lg border border-surface-300 h-24"
                />
                <!-- <div class="font-bold text-surface-400">Feedback</div> -->
                <Divider
                  ><b class="text-xs uppercase tracking-wider">
                    Feedback
                  </b></Divider
                >
                <div
                  class="bg-white rounded-lg border border-surface-300 h-24"
                />
              </Flex>
            </Panel>
            <Flex class="justify-center mt-3">
              <Button
                icon="ri-add-line"
                label="Add Choice"
                severity="contrast"
              />
            </Flex>
          </Flex>
        </Panel>
        <div class="px-4 font-bold text-surface-400">General</div>
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

const choices = [
  {
    id: 'A',
    text: 'Choice A',
    feedback: 'Feedback A',
    correct: false,
  },
  {
    id: 'B',
    text: 'Choice B',
    feedback: 'Feedback B',
    correct: true,
  },
  {
    id: 'C',
    text: 'Choice C',
    feedback: 'Feedback C',
    correct: false,
  },
]
</script>

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

:deep(.p-divider-horizontal) {
  @apply my-0;
}
:deep(.p-divider-content) {
  @apply bg-neutral-50 text-surface-400;
}
</style>
