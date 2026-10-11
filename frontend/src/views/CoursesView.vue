
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000'

const courseId = ref('')
const courseName = ref('')
const message = ref('')
const errorMessage = ref('')
const loading = ref(false)

const searchCourseId = ref('')
const foundCourse = ref(null)
const courses = ref([])

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

async function addCourse() {
  message.value = ''
  errorMessage.value = ''

  if (!courseId.value.trim() || !courseName.value.trim()) {
    errorMessage.value = 'Please enter both a course ID and course name.'
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
      errorMessage.value = data.message || 'Could not add course.'
      return
    }

    message.value = 'Course added successfully!'
    courseId.value = ''
    courseName.value = ''
    await loadCourses()
  } catch (error) {
    console.error('Error adding course:', error)
    errorMessage.value = 'Could not connect to the backend.'
  } finally {
    loading.value = false
  }
}

async function searchCourse() {
  message.value = ''
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

async function deleteCourse() {
  if (!foundCourse.value) return

  const courseIdToDelete = foundCourse.value.courseId

  if (!confirm(`Delete course ${courseIdToDelete}?`)) return

  message.value = ''
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
    message.value = 'Course deleted successfully!'
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

    <p v-if="message" role="status">{{ message }}</p>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
  </section>
</template>
