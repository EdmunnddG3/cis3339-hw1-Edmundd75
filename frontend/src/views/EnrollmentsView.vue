
<script setup>
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3000'

const students = ref([])
const courses = ref([])
const selectedStudentId = ref('')
const selectedCourseId = ref('')
const viewCourseId = ref('')
const enrolledStudents = ref([])
const message = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function loadOptions() {
  errorMessage.value = ''

  try {
    const [studentResponse, courseResponse] = await Promise.all([
      fetch(`${API_URL}/list-students`),
      fetch(`${API_URL}/list-courses`),
    ])

    if (!studentResponse.ok || !courseResponse.ok) {
      throw new Error('Could not load students or courses.')
    }

    students.value = await studentResponse.json()
    courses.value = await courseResponse.json()
  } catch (error) {
    console.error('Error loading enrollment options:', error)
    errorMessage.value = 'Could not load students and courses. Check the backend.'
  }
}

async function addEnrollment() {
  message.value = ''
  errorMessage.value = ''

  if (!selectedStudentId.value || !selectedCourseId.value) {
    errorMessage.value = 'Please select both a student and a course.'
    return
  }

  loading.value = true

  try {
    const response = await fetch(`${API_URL}/add-enrollment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: selectedStudentId.value,
        courseId: selectedCourseId.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Could not enroll student.'
      return
    }

    message.value = data.message || 'Student enrolled successfully!'
    viewCourseId.value = selectedCourseId.value
    await findEnrollments()
  } catch (error) {
    console.error('Error enrolling student:', error)
    errorMessage.value = 'Could not connect to the backend.'
  } finally {
    loading.value = false
  }
}

async function findEnrollments() {
  errorMessage.value = ''
  enrolledStudents.value = []

  if (!viewCourseId.value) {
    errorMessage.value = 'Please select a course to view its enrolled students.'
    return
  }

  try {
    const response = await fetch(`${API_URL}/find-enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId: viewCourseId.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Could not retrieve enrollments.'
      return
    }

    enrolledStudents.value = data.students
  } catch (error) {
    console.error('Error finding enrollments:', error)
    errorMessage.value = 'Could not connect to the backend.'
  }
}

onMounted(loadOptions)
</script>

<template>
  <section>
    <h2>Enrollments</h2>

    <h3>Enroll a Student in a Course</h3>

    <form @submit.prevent="addEnrollment">
      <div>
        <label for="studentSelect">Student:</label>
        <select
          id="studentSelect"
          v-model="selectedStudentId"
          required
        >
          <option value="" disabled>Select a student</option>
          <option
            v-for="student in students"
            :key="student.id"
            :value="student.id"
          >
            {{ student.name }} ({{ student.id }})
          </option>
        </select>
      </div>

      <div>
        <label for="courseSelect">Course:</label>
        <select
          id="courseSelect"
          v-model="selectedCourseId"
          required
        >
          <option value="" disabled>Select a course</option>
          <option
            v-for="course in courses"
            :key="course.courseId"
            :value="course.courseId"
          >
            {{ course.courseId }} — {{ course.courseName }}
          </option>
        </select>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Enrolling...' : 'Enroll Student' }}
      </button>
    </form>

    <h3>View Students Enrolled in a Course</h3>

    <form @submit.prevent="findEnrollments">
      <div>
        <label for="viewCourseSelect">Course:</label>
        <select id="viewCourseSelect" v-model="viewCourseId" required>
          <option value="" disabled>Select a course</option>
          <option
            v-for="course in courses"
            :key="course.courseId"
            :value="course.courseId"
          >
            {{ course.courseId }} — {{ course.courseName }}
          </option>
        </select>
      </div>

      <button type="submit">View Enrolled Students</button>
    </form>

    <div v-if="enrolledStudents.length > 0">
      <h4>Enrolled Students</h4>
      <ul>
        <li v-for="student in enrolledStudents" :key="student.id">
          {{ student.name }} ({{ student.id }})
        </li>
      </ul>
    </div>

    <p
      v-else-if="viewCourseId && !errorMessage && !message"
      role="status"
    >
      No enrolled students are currently displayed. Select View Enrolled Students to refresh the list.
    </p>

    <p v-if="message" role="status">{{ message }}</p>
    <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
  </section>
</template>
