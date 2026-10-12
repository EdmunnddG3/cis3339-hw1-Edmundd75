import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// Pinia store for managing a simple counter with increment functionality and computed double count
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
