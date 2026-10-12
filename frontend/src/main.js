// Creates a Vue application and set up Pinia for state management
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// importing the main App component and the router configuration for the Vue application
import App from './App.vue'
import router from './router'

const app = createApp(App) // Use the main App component as the root component for the Vue application

// Set up Pinia for state management and the router for navigation
app.use(createPinia())
app.use(router)

app.mount('#app') // Makes the Vue application available in the HTML element with the id 'app'
