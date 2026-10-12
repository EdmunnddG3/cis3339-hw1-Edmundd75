
import { createRouter, createWebHistory } from 'vue-router' // Managing routing in the Vue application using Vue Router

// Importing the views for students, courses, and enrollments
import StudentsView from '../views/StudentsView.vue'
import CoursesView from '../views/CoursesView.vue'
import EnrollmentsView from '../views/EnrollmentsView.vue'

// Router configuration for the Vue application, defining routes for students, courses, and enrollments views
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'students',
      component: StudentsView,
    },
    {
      path: '/courses',
      name: 'courses',
      component: CoursesView,
    },
    {
      path: '/enrollments',
      name: 'enrollments',
      component: EnrollmentsView,
    },
  ],
})

export default router // Exporting the router instance for use in the main application
