import { defineStore } from 'pinia'
import { ref } from 'vue'

// Pinia store for managing application-wide messages and error messages
export const useAppStore = defineStore('app', () => {
  const message = ref('')
  const errorMessage = ref('')

  function showMessage(text) {
    message.value = text
    errorMessage.value = ''
  }

  function showError(text) {
    errorMessage.value = text
    message.value = ''
  }

  function clearMessages() {
    message.value = ''
    errorMessage.value = ''
  }

  return {
    message,
    errorMessage,
    showMessage,
    showError,
    clearMessages,
  }
})