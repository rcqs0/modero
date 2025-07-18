<template>
  <div class="z-20 shadow-sm relative">
    <Menubar :model="items" class="!rounded-none">
      <template #start>
        <div
          class="ml-[9px] flex-grow relative h-6 w-6 flex-shrink-0 border-b-2 shadow-inner stroke-current shadow-current text-cyan-700 bg-cyan-300 border-current rounded-md"
        >
          <svg
            class="absolute top-0 left-0 h-full w-full rounded-md"
            xmlns="http://www.w3.org/2000/svg"
          >
            <pattern
              id="diagonalHatch129837"
              width="8"
              height="10"
              patternTransform="rotate(-45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="10" style="stroke-width: 8" />
            </pattern>
            <rect fill="url(#diagonalHatch129837)" width="100%" height="100%" />
          </svg>
        </div>
      </template>
      <template #end>
        <!-- <PersonAvatar class="-mr-2" name="Erik" />
      <PersonAvatar class="-mr-2" name="Vytenis" />
      <PersonAvatar class="-mr-2" name="Anton" /> -->
        <PersonAvatar name="Roderick" />
      </template>
    </Menubar>

    <div
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
    >
      <div class="pointer-events-auto flex items-center gap-1">
        <div class="text-neutral-400">Models</div>
        <div class="text-neutral-400">/</div>
        <div>Construction</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const items = [
  {
    label: 'Model',
    items: [
      {
        label: 'New',
        icon: 'ri-add-line',
      },
      {
        label: 'Open',
        icon: 'ri-folder-open-line',
      },
      { separator: true },
      {
        label: 'Save',
        icon: 'ri-save-2-line',
      },
      {
        label: 'Save as...',
        icon: 'ri-save-2-line',
      },
    ],
  },
]
</script>
