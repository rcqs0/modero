<template>
  <input
    class="slider"
    type="range"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    @change="onChange"
    @input="onInput"
  />
</template>

<script lang="ts">
import { PropType, defineComponent, computed, ref, watchEffect } from 'vue'
import _ from 'lodash'
import { piecewise, interpolate } from 'd3-interpolate'

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    step: {
      type: Number,
      default: 0.01,
    },
    color: {
      type: [Array, String] as PropType<string | string[]>,
    },
  },

  setup(props, { emit }) {
    const colorInterpolator = computed(() => {
      const colorArray = _.castArray(props.color)

      if (colorArray.length > 1) {
        return piecewise(interpolate, colorArray)
      }

      return () => colorArray[0] || '#e5e7eb'
    })

    const currentColor = ref<string>()

    function onChange(event: any) {
      emit('update:modelValue', _.round(event.target.value, 2))
    }

    const onInput = _.throttle((event: any) => {
      currentColor.value = colorInterpolator.value(
        (event.target.value - props.min) / (props.max - props.min),
      )

      // TODO: remove for performance or increase throttle? needs more testing
      onChange(event)
    }, 0)

    watchEffect(() => {
      currentColor.value = colorInterpolator.value(
        ((props.modelValue ?? props.min) - props.min) / (props.max - props.min),
      )
    })

    return { currentColor, onChange, onInput }
  },
})
</script>

<style lang="postcss" scoped>
.slider {
  @apply appearance-none rounded-full h-1;
  background: v-bind(currentColor);

  &::-webkit-slider-thumb {
    @apply appearance-none;
  }

  &::-webkit-slider-thumb {
    @apply bg-white h-4 w-4 rounded-full;
    @apply shadow ring-1 ring-neutral-200 cursor-pointer;
  }

  &::-moz-range-thumb {
    @apply bg-white h-4 w-4 rounded-full;
    @apply shadow ring-1 ring-neutral-200 cursor-pointer;
  }
}
</style>
