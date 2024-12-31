<template>
  <div
    :class="{
      resizablelayout: true,
      'flex-1 flex overflow-auto': true,
      'flex-col': column,
    }"
  >
    <template v-for="(child, i) in children">
      <component :is="child" />
      <div
        v-if="i < children.length - 1"
        :class="{
          'resizablelayout-divider': true,
          'flex basis-0 bg-surface-100': true,
          'cursor-col-resize': !column,
          'cursor-row-resize': column,
        }"
        ref="dividers"
        @mousedown="startResizing(i)"
      >
        <div
          :class="{
            'resizablelayout-divider-overlay': true,
            'flex-shrink-0 flex-grow z-0': true,
            '-mx-1': !column,
            '-my-1': column,
          }"
        />
        <div
          v-if="isResizing"
          class="resizablelayout-resize-overlay fixed top-0 left-0 w-full h-full"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, getCurrentInstance } from 'vue'
import Layout from './Layout.vue'

const props = defineProps<{ column?: boolean }>()

const slots = defineSlots<{
  default(): any
}>()

const children = computed(
  () =>
    slots
      .default()
      .filter(
        (child: any) =>
          child.type === Layout || child.type === getCurrentInstance()?.type,
      ),
  // .slice(0, 2),
)

const dividers = ref<HTMLDivElement[]>([])
const isResizing = ref(false)
const resizingDivider = ref<HTMLDivElement>()

function resize(event: MouseEvent) {
  const divider = resizingDivider.value!
  const parent = divider.parentElement!
  const previous = divider.previousElementSibling as HTMLElement
  const next = divider.nextElementSibling as HTMLElement

  const boundary = parent.getBoundingClientRect()

  const basis = getComputedStyle(previous).getPropertyValue('flex-basis')
  if (basis.endsWith('px')) {
    previous.style.flexBasis = props.column
      ? `${event.clientY - previous.getBoundingClientRect().y}px`
      : `${event.clientX - previous.getBoundingClientRect().x}px`
  } else {
    const fraction = props.column
      ? (event.clientY - boundary.y) / boundary.height
      : (event.clientX - boundary.x) / boundary.width

    console.log(event, window.innerWidth)

    // previous.style.flexBasis = `${fraction * 100}%`
    // next.style.flexBasis = `${(1 - fraction) * 100}%`

    const current = parseFloat(basis)
    if (current === 0) {
      console.log('YEA')
      previous.style.flexBasis = `${fraction * 100}%`
      next.style.flexBasis = `${(1 - fraction) * 100}%`
    } else {
      const diff = (event.movementX / boundary.width) * 100
      previous.style.flexBasis = `${current + diff}%`
      next.style.flexBasis = `${
        parseFloat(getComputedStyle(next).getPropertyValue('flex-basis')) - diff
      }%`
    }
  }
}

function startResizing(i: number) {
  isResizing.value = true
  resizingDivider.value = dividers.value[i]
  window.addEventListener('mousemove', resize)
}

function stopResizing() {
  isResizing.value = false
  resizingDivider.value = undefined
  window.removeEventListener('mousemove', resize)
}

window.addEventListener('mouseup', stopResizing)
onBeforeUnmount(() => {
  window.removeEventListener('mouseup', stopResizing)
})
</script>
