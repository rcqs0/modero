import { defineStore } from 'pinia'
import { ref } from 'vue'

const useContextStore = defineStore('context', () => {
  const temp = ref(true)

  return { temp }
})

export default useContextStore
