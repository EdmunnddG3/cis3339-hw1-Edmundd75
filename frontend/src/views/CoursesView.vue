
<script setup>
// Importing functions and components from Vue and Pinia for state management and component rendering
import { ref, onMounted } from 'vue' 
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import StatusMessage from '../components/StatusMessage.vue'

const API_URL = 'http://localhost:3000'

// State variables for course addition
const courseId = ref('')
const courseName = ref('')

// Access the global error message from the app store
const appStore = useAppStore()
const { errorMessage } = storeToRefs(appStore)

// Define local state variables for success and error messages, and loading state
const courseSuccessMessage = ref('')
const loading = ref(false)
const addCourseError = ref('')

// State variables for course search and deletion
const searchCourseId = ref('')
const foundCourse = ref(null)
const courses = ref([])

// Load the list of courses from the backend when the component is mounted
async function loadCourses() {
  try {
    const response = await fetch(`${API_URL}/list-courses`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Could not load courses.')
    }

    courses.value = data
  } catch (error) {
    console.error('Error loading courses:', error)
    errorMessage.value = 'Could not load the course list. Check the backend.'
  }
}

// Adds a new course to the backend and updates the course list
async function addCourse() {
  errorMessage.value = ''
  addCourseError.value = ''
  courseSuccessMessage.value = ''

  if (!courseId.value.trim() || !courseName.value.trim()) {
  addCourseError.value = 'Please enter both a course ID and course name.'
  return
}

  loading.value = true

  try {
    const response = await fetch(`${API_URL}/add-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: courseId.value.trim(),
        courseName: courseName.value.trim(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      addCourseError.value = data.message || 'Could not add course.'
      console.log('Add Course error:', addCourseError.value)
      return
    }

    courseSuccessMessage.value = data.message || 'Course added successfully!'
    courseId.value = ''
    courseName.value = ''
    await loadCourses()
  } catch (error) {
    console.error('Error adding course:', error)
    addCourseError.value = 'Could not connect to the backend.'
  } finally {
    loading.value = false
  }
}

// Enter a course ID to search for a course in the backend
async function searchCourse() {
  courseSuccessMessage.value = ''
  errorMessage.value = ''
  foundCourse.value = null

  if (!searchCourseId.value.trim()) {
    errorMessage.value = 'Please enter a course ID to search.'
    return
  }

  try {
    const response = await fetch(`${API_URL}/find-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: searchCourseId.value.trim(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Course not found.'
      return
    }

    foundCourse.value = data
  } catch (error) {
    console.error('Error searching for course:', error)
    errorMessage.value = 'Could not connect to the backend.'
  }
}

// Removes a course from the backend and updates the course list
async function deleteCourse() {
  if (!foundCourse.value) return

  const courseIdToDelete = foundCourse.value.courseId

  if (!confirm(`Delete course ${courseIdToDelete}?`)) return

  courseSuccessMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/delete-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: courseIdToDelete }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Could not delete course.'
      return
    }

    foundCourse.value = null
    searchCourseId.value = ''
    courseSuccessMessage.value = data.message || 'Course deleted successfully!'
    await loadCourses()
  } catch (error) {
    console.error('Error deleting course:', error)
    errorMessage.value = 'Could not connect to the backend.'
  }
}

onMounted(loadCourses)
</script>

<template>
  <section>
    <h2>Courses</h2>

    <h3>Add a Course</h3>

    <form @submit.prevent="addCourse">
      <div>
        <label for="courseId">Course ID:</label>
        <input id="courseId" v-model="courseId" type="text" required />
      </div>

      <div>
        <label for="courseName">Course Name:</label>
        <input id="courseName" v-model="courseName" type="text" required />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Adding...' : 'Add Course' }}
      </button>
    </form>

        <StatusMessage :message="courseSuccessMessage" type="success" />
        <StatusMessage :message="addCourseError" type="error" />

    <h3>All Courses</h3>

    <p v-if="courses.length === 0">No courses have been added yet.</p>

    <ul v-else>
      <li v-for="course in courses" :key="course.courseId">
        <strong>{{ course.courseId }}</strong> — {{ course.courseName }}
      </li>
    </ul>

    <h3>Search for a Course</h3>

    <form @submit.prevent="searchCourse">
      <div>
        <label for="searchCourseId">Course ID:</label>
        <input
          id="searchCourseId"
          v-model="searchCourseId"
          type="text"
          required
        />
      </div>

      <button type="submit">Search Course</button>
    </form>

    <div v-if="foundCourse">
      <h4>Course Details</h4>
      <p>Course ID: {{ foundCourse.courseId }}</p>
      <p>Course Name: {{ foundCourse.courseName }}</p>
      <button type="button" @click="deleteCourse">Delete Course</button>
    </div>

<StatusMessage :message="errorMessage" type="error" />
  </section>
</template>

```vue
<style scoped>
section {
  max-width: 1050px;
  margin: 0 auto;
  color: #202d40;
}

h2 {
  margin: 0 0 24px;
  color: #14283f;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

h3 {
  margin: 26px 0 16px;
  color: #14283f;
  font-size: 19px;
  font-weight: 750;
}

form,
section > ul,
section > p,
section > div:has(h4) {
  margin-bottom: 22px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e3eaf0;
  border-radius: 16px;
  box-shadow: 0 8px 26px rgba(20, 40, 63, 0.045);
}

form {
  display: grid;
  gap: 16px;
  max-width: 620px;
}

form div {
  display: grid;
  gap: 8px;
}

label {
  color: #40536a;
  font-size: 13px;
  font-weight: 700;
}

input {
  width: 100%;
  min-height: 44px;
  padding: 11px 13px;
  border: 1px solid #d9e2e9;
  border-radius: 9px;
  background: #fbfcfd;
  color: #202d40;
  font-size: 14px;
}

input:focus {
  border-color: #318364;
  outline: 3px solid rgba(49, 131, 100, 0.14);
  outline-offset: 1px;
}

button {
  width: fit-content;
  min-height: 43px;
  padding: 11px 20px;
  border: 0;
  border-radius: 9px;
  background: #14283f;
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;
}

button:hover:not(:disabled) {
  background: #28506b;
  transform: translateY(-1px);
}

button:focus-visible {
  outline: 3px solid #40b98c;
  outline-offset: 3px;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

ul {
  list-style: none;
  padding-left: 24px;
}

li {
  padding: 14px 0;
  border-bottom: 1px solid #e8edf1;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

li:last-child {
  border-bottom: 0;
}

li strong {
  color: #318364;
}

h4 {
  margin-top: 0;
  color: #14283f;
}

section > div:has(h4) p {
  line-height: 1.6;
  overflow-wrap: anywhere;
}

section > div:has(h4) button {
  background: #fff0ed;
  color: #a43830;
}

section > div:has(h4) button:hover {
  background: #a43830;
  color: white;
}

@media (max-width: 600px) {
  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 17px;
  }

  form,
  section > ul,
  section > p,
  section > div:has(h4) {
    padding: 18px;
    border-radius: 13px;
  }

  form {
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>
```