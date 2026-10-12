```vue
<script setup>

// Receives props for the status message component, including the message text and its type (success or error)
defineProps({
  message: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'success',
  },
})
</script>

<template>
  <p
    v-if="message"
    :class="type === 'error' ? 'error-message' : 'success-message'"
    :role="type === 'error' ? 'alert' : 'status'"
  >
    {{ message }}
  </p>
</template>

<style scoped>
.success-message {
  color: #176b35;
  margin: 16px 0;
}

.error-message {
  color: #a52828;
  margin: 16px 0;
}
</style>
```