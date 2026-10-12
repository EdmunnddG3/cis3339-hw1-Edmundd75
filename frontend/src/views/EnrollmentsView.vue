
<script setup>
import { ref, onMounted } from 'vue'
import StatusMessage from '../components/StatusMessage.vue'

// Define the backend API URL
const API_URL = 'http://localhost:3000' 

// State variables for students and courses
const students = ref([])
const courses = ref([])

// State variables for selected student and course for enrollment, and the course to view enrollments
const selectedStudentId = ref('')
const selectedCourseId = ref('')
const viewCourseId = ref('')

// Define local state variables for success and error messages, and loading state
const enrolledStudents = ref([])
const enrollmentSuccessMessage = ref('')
const loading = ref(false)
const enrollmentError = ref('')

// Load the list of students and courses from the backend when the component is mounted
async function loadOptions() {
  enrollmentError.value = ''

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
    enrollmentError.value = 'Could not load students and courses. Check the backend.'
  }
}

// Enrolls a student in a course by sending a POST request to the backend and updates the list of enrolled students
async function addEnrollment() {
  enrollmentSuccessMessage.value = ''
  enrollmentError.value = '' 

  if (!selectedStudentId.value || !selectedCourseId.value) {
    enrollmentError.value = 'Please select both a student and a course.'
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
      enrollmentError.value = data.message || 'Could not enroll student.'
      return
    }

    enrollmentSuccessMessage.value = data.message || 'Student enrolled successfully!'
    viewCourseId.value = selectedCourseId.value
    await findEnrollments()
  } catch (error) {
    console.error('Error enrolling student:', error)
    enrollmentError.value = 'Could not connect to the backend.'
  } finally {
    loading.value = false
  }
}

// Searches for students enrolled in a specific course by sending a POST request to the backend and updates the list of enrolled students
async function findEnrollments() {
  enrollmentError.value = ''
  enrolledStudents.value = []

  if (!viewCourseId.value) {
    enrollmentError.value = 'Please select a course to view its enrolled students.'
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
      enrollmentError.value = data.message || 'Could not retrieve enrollments.'
      return
    }

    enrolledStudents.value = data.students
  } catch (error) {
    console.error('Error finding enrollments:', error)
    enrollmentError.value = 'Could not connect to the backend.'
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

    <StatusMessage :message="enrollmentSuccessMessage" type="success" />
    <StatusMessage :message="enrollmentError" type="error" />

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
      v-else-if="viewCourseId && !enrollmentError && !enrollmentSuccessMessage"
      role="status"
    >
      No enrolled students are currently displayed. Select View Enrolled Students to refresh the list.
    </p>

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

form {
  display: grid;
  gap: 16px;
  max-width: 620px;
  margin-bottom: 24px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e3eaf0;
  border-radius: 16px;
  box-shadow: 0 8px 26px rgba(20, 40, 63, 0.045);
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

input,
select {
  width: 100%;
  min-height: 44px;
  padding: 11px 13px;
  border: 1px solid #d9e2e9;
  border-radius: 9px;
  background: #fbfcfd;
  color: #202d40;
  font: inherit;
  font-size: 14px;
}

input:focus,
select:focus {
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
  color: #ffffff;
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
  margin: 0 0 24px;
  padding: 22px 24px;
  list-style: none;
  background: #ffffff;
  border: 1px solid #e3eaf0;
  border-radius: 16px;
  box-shadow: 0 8px 26px rgba(20, 40, 63, 0.045);
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

table {
  width: 100%;
  margin: 20px 0;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e3eaf0;
  border-radius: 12px;
  background: #ffffff;
  font-size: 13px;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid #e8edf1;
  text-align: left;
  overflow-wrap: anywhere;
}

th {
  background: #f1f7f4;
  color: #40536a;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

tbody tr:last-child td {
  border-bottom: 0;
}

p {
  line-height: 1.6;
}

@media (max-width: 600px) {
  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 17px;
  }

  form,
  ul {
    padding: 18px;
    border-radius: 13px;
  }

  form {
    max-width: none;
  }

  table {
    display: block;
    overflow-x: auto;
  }

  th,
  td {
    padding: 12px 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>
```