<template>
  <div class="flex flex-col h-full bg-surface-50">
    <div class="flex justify-between items-center gap-4 p-4">
      <div class="flex items-center gap-4">
        <i class="ri-camera-lens-fill text-3xl text-primary-500"></i>
        <Breadcrumb v-bind="breadcrumbs" class="bg-transparent p-0" />
      </div>
      <Avatar label="R" class="bg-indigo-500 text-white" shape="circle" />
      <!-- <AvatarGroup>
        <Avatar
          label="R"
          class="bg-indigo-500 text-white border-none ring-2 ring-white !mr-3"
          shape="circle"
        />
        <Avatar
          label="K"
          class="bg-indigo-500 text-white border-none ring-2 ring-white !mr-3"
          shape="circle"
        />
        <Avatar
          label="+2"
          class="border-none ring-2 ring-white"
          shape="circle"
        />
      </AvatarGroup> -->
    </div>

    <div class="flex flex-col px-4 py-8 gap-8">
      <div class="items-center justify-between flex gap-2">
        <div class="flex gap-2">
          <span class="text-2xl font-bold">Courses</span>
          <Badge value="21" size="large" />
        </div>
        <!-- <MeterGroup
          class="text-sm gap-1 w-96"
          label-position="start"
          :value="[
            { label: 'IBM', color: 'black', icon: '', value: 15 },
            { label: 'SAI', color: 'red', icon: '', value: 15 },
          ]"
        /> -->
      </div>

      <div class="flex gap-4">
        <IconField class="flex-grow">
          <InputIcon class="ri-search-line" />
          <InputText placeholder="Search" fluid />
        </IconField>
        <!-- <div class="flex-grow" /> -->
        <SplitButton
          severity="secondary"
          :label="sortBy"
          :icon="sortOrder === 'asc' ? 'ri-sort-asc' : 'ri-sort-desc'"
          dropdownIcon="ri-arrow-down-s-line"
          @click="changeSortOrder"
          :model="[
            {
              label: 'Code',
              command: () => {
                sortBy = 'Code'
              },
            },
            {
              label: 'Title',
              command: () => {
                sortBy = 'Title'
              },
            },
            {
              label: 'Status',
              command: () => {
                sortBy = 'Status'
              },
            },
            {
              label: 'Edited',
              command: () => {
                sortBy = 'Edited'
              },
            },
          ]"
        />
        <SelectButton :options="['Client', 'Library']">
          <template #option="{ option }">
            <i
              :class="
                option === 'Client' ? 'ri-building-line' : 'ri-book-shelf-fill'
              "
            />
            {{ option }}
            <Badge :value="option === 'Client' ? 15 : 6" size="small" />
          </template>
        </SelectButton>
      </div>

      <div class="flex flex-wrap gap-4">
        <div
          class="w-96 flex flex-col rounded-md bg-white shadow gap-4 p-4 justify-between"
        >
          <div class="flex gap-4">
            <Avatar
              label="SAI"
              class="shrink-0 text-base font-bold text-primary-700 bg-primary-100"
              size="large"
            />
            <div class="flex-grow flex flex-col gap-1 mt-1">
              <div>2025 IBM Core Training 2025</div>
              <div class="text-sm text-surface-400">ERxx01aSAI</div>
            </div>
          </div>

          <div class="flex gap-4 justify-between items-center">
            <div class="text-surface-400 text-sm">
              <i class="ri-history-fill" /> 5 months
            </div>
            <div class="flex">
              <Button
                size="small"
                icon="ri-file-copy-line"
                label="Clone"
                severity="secondary"
                variant="text"
              />
              <Button
                size="small"
                icon="ri-pencil-line"
                label="Edit"
                severity="secondary"
                variant="text"
              />
            </div>
          </div>
        </div>

        <div
          class="w-96 flex flex-col rounded-md bg-white shadow gap-4 p-4 justify-between"
        >
          <div class="flex gap-4">
            <Avatar
              label="IBM"
              class="shrink-0 text-base font-bold text-surface-700 bg-surface-100"
              size="large"
            />
            <div class="flex-grow flex flex-col gap-1 mt-1">
              <div>2025 IBM Core Training 2025</div>
              <div class="text-sm text-surface-400">ERxx01aSAI</div>
            </div>
          </div>

          <div class="flex gap-4 justify-between items-center">
            <div class="text-surface-400 text-sm">
              <i class="ri-history-fill" /> 5 months
            </div>
            <div class="flex">
              <Button
                size="small"
                icon="ri-file-copy-line"
                label="Clone"
                severity="secondary"
                variant="text"
              />
              <Button
                size="small"
                icon="ri-pencil-line"
                label="Edit"
                severity="secondary"
                variant="text"
              />
            </div>
          </div>
        </div>

        <div
          class="w-96 flex flex-col rounded-xl bg-white shadow gap-4 p-4 justify-between"
        >
          <div class="flex gap-4 justify-between items-center">
            <div class="text-sm text-surface-400">ERxx01aSAI</div>
            <div class="flex gap-2">
              <!-- <Tag>Published</Tag> -->
              <Tag>SAI</Tag>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="font-medium">2025 IBM Core Training 2025</div>
          </div>

          <div class="flex gap-4 justify-between items-center mt-2">
            <div class="text-surface-400 text-sm">
              <i class="ri-history-fill" /> 5 months
            </div>
            <div class="flex gap-2">
              <Button
                size="small"
                icon="ri-file-copy-line"
                label="Clone"
                severity="secondary"
                variant="text"
              />
              <Button
                size="small"
                icon="ri-edit-2-line"
                label="Edit"
                severity="secondary"
                variant="outlined"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const breadcrumbs = reactive({
  home: { icon: 'ri-function-line', label: 'Clients' },
  model: [{ icon: 'ri-building-line', label: 'IBM' }],
})

const sortBy = ref('Title')

const sortOrder = ref<'asc' | 'desc'>('asc')

function changeSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}
</script>

<style lang="postcss" scoped>
:deep(.p-tablist-tab-list) {
  @apply bg-transparent;
}
</style>
