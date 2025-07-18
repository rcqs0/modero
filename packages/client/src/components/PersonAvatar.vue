<template>
  <Avatar
    shape="circle"
    class="font-medium"
    :style="{ backgroundColor, color }"
  >
    {{ initials }}
  </Avatar>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

function toHSL(name: string) {
  let h: number, s: number, l: number

  const opts = {
    hue: [0, 360],
    sat: [75, 100],
    lit: [40, 60],
  }

  function range(hash: number, min: number, max: number) {
    const diff = max - min
    const x = ((hash % diff) + diff) % diff

    return x + min
  }

  let hash = 0
  if (!name.length) return [220, 13, 91]

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }

  h = range(hash, opts.hue[0], opts.hue[1])
  s = range(hash, opts.sat[0], opts.sat[1])
  l = range(hash, opts.lit[0], opts.lit[1])

  return [h, s, l]
}

function toInitials(name: string) {
  if (!name.length) return ''

  const words = name.split(' ')
  if (words.length === 1) return words[0][0].toUpperCase()

  return `${words[0][0]}${words[words.length - 1][0]}`
}

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const colorParams = computed(() => toHSL(props.name))

    const backgroundColor = computed(() => {
      const [h, s, l] = colorParams.value
      return `hsl(${h}, ${s}%, ${l}%)`
    })

    const color = computed(() => {
      const [h, s, l] = colorParams.value
      return l > 50
        ? `hsl(${h}, ${s}%, ${l - 40}%)`
        : `hsl(${h}, ${s}%, ${l + 40}%)`
    })

    const initials = computed(() => toInitials(props.name))

    return { backgroundColor, color, initials }
  },
})
</script>
