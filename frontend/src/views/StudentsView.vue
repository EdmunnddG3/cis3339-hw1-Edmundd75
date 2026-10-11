
<script setup>
import { ref } from 'vue'

const studentName = ref('')
const student = ref(null)

const addName = ref('')
const addId = ref('')
const addPhone = ref('')
const addZip = ref('')

const loadingSearch = ref(false)
const loadingAdd = ref(false)
const message = ref('')
const errorMessage = ref('')

const API_URL = 'http://localhost:3000'

async function searchStudent() {
  message.value = ''
  errorMessage.value = ''
  student.value = null

  if (!studentName.value.trim()) {
    errorMessage.value = 'Please enter a student name.'
    return
  }

  loadingSearch.value = true

  try {
    const response = await fetch(`${API_URL}/find-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: studentName.value.trim() }),
    })

    if (response.status === 404) {
      errorMessage.value = 'Cannot find the student.'
      return
    }

    if (!response.ok) {
      errorMessage.value = 'An error occurred while searching for the student.'
      return
    }

    student.value = await response.json()
  } catch (error) {
    console.error('Error searching for student:', error)
    errorMessage.value = 'Could not connect to the backend. Is the server running?'
  } finally {
    loadingSearch.value = false
  }
}

async function deleteStudent() {
  if (!student.value) return

  const name = student.value.name

  if (!confirm(`Delete student ${name}?`)) return

  message.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch(`${API_URL}/delete-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: student.value.id }),
    })

    if (response.status === 404) {
      errorMessage.value = 'Student not found or already deleted.'
      return
    }

    if (!response.ok) {
      const error = await response.json()
      errorMessage.value = `Error: ${error.error || 'Could not delete student.'}`
      return
    }

    student.value = null
    studentName.value = ''
    message.value = 'Student deleted successfully.'
  } catch (error) {
    console.error('Error deleting student:', error)
    errorMessage.value = 'Could not connect to the backend.'
  }
}

async function addStudent() {
  message.value = ''
  errorMessage.value = ''

  if (!addName.value.trim() || !addId.value.trim() ||
      !addPhone.value.trim() || !addZip.value.trim()) {
    errorMessage.value = 'Please complete all student fields.'
    return
  }

  loadingAdd.value = true

  try {
    const response = await fetch(`${API_URL}/add-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: addName.value.trim(),
        id: addId.value.trim(),
        phone: addPhone.value.trim(),
        zip: addZip.value.trim(),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      errorMessage.value = `Error: ${error.error || 'Could not add student.'}`
      return
    }

    addName.value = ''
    addId.value = ''
    addPhone.value = ''
    addZip.value = ''
    message.value = 'Student added successfully!'
  } catch (error) {
    console.error('Error adding student:', error)
    errorMessage.value = 'Could not connect to the backend.'
  } finally {
    loadingAdd.value = false
  }
}
</script>

<template>
  <section class="students-page">
    <h2>Students</h2>

    <section class="panel">
      <h3>Search Student</h3>
      <form @submit.prevent="searchStudent">
        <label for="studentName">Student name</label>
        <input
          id="studentName"
          v-model="studentName"
          type="text"
          placeholder="Enter student name"
        />
        <button type="submit" :disabled="loadingSearch">
          {{ loadingSearch ? 'Searching...' : 'Search' }}
        </button>
      </form>

      <table v-if="student">
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Phone</th>
            <th>ZIP</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ student.name }}</td>
            <td>{{ student.id }}</td>
            <td>{{ student.phone }}</td>
            <td>{{ student.zip }}</td>
            <td>
              <button class="delete-button" type="button" @click="deleteStudent">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="panel">
      <h3>Add Student</h3>
      <form @submit.prevent="addStudent">
        <label for="addName">Name</label>
        <input id="addName" v-model="addName" type="text" />

        <label for="addId">Student ID</label>
        <input id="addId" v-model="addId" type="text" />

        <label for="addPhone">Phone</label>
        <input id="addPhone" v-model="addPhone" type="tel" />

        <label for="addZip">ZIP code</label>
        <input id="addZip" v-model="addZip" type="text" />

        <button type="submit" :disabled="loadingAdd">
          {{ loadingAdd ? 'Adding...' : 'Add Student' }}
        </button>
      </form>
    </section>

    <p v-if="message" class="success-message" role="status">
      {{ message }}
    </p>
    <p v-if="errorMessage" class="error-message" role="alert">
      {{ errorMessage }}
    </p>
  </section>
</template>

<style scoped>
.students-page {
  max-width: 900px;
  margin: 0 auto;
}

.panel {
  margin: 24px 0;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
}

form {
  display: grid;
  gap: 10px;
  max-width: 420px;
}

input {
  padding: 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
}

button {
  width: fit-content;
  padding: 10px 16px;
  border: 0;
  border-radius: 4px;
  background: #24476b;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.delete-button {
  background: #a52828;
}

table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

.success-message {
  color: #176b35;
}

.error-message {
  color: #a52828;
}
</style>
