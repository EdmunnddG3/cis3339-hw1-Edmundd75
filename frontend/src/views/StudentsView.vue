
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'
import StatusMessage from '../components/StatusMessage.vue'

const studentName = ref('')
const student = ref(null)

const addName = ref('')
const addId = ref('')
const addPhone = ref('')
const addZip = ref('')

const loadingSearch = ref(false)
const loadingAdd = ref(false)
const addErrorMessage = ref('')
const appStore = useAppStore()

const { message, errorMessage } = storeToRefs(appStore)

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
  addErrorMessage.value = ''

  if (!addName.value.trim() || !addId.value.trim() ||
      !addPhone.value.trim() || !addZip.value.trim()) {
    addErrorMessage.value = 'Please complete all student fields.'
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
      addErrorMessage.value = `Error: ${error.message || error.error || 'Could not add student.'}`
      return
    }

    addName.value = ''
    addId.value = ''
    addPhone.value = ''
    addZip.value = ''
    message.value = 'Student added successfully!'
  } catch (error) {
    console.error('Error adding student:', error)
    addErrorMessage.value = 'Could not connect to the backend.'
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

        <StatusMessage :message="errorMessage" type="error" />

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
      
      <StatusMessage :message="addErrorMessage" type="error" />
    </section>

<StatusMessage :message="message" type="success" />
  </section>
</template>

```css
<style scoped>
.students-page {
  max-width: 1050px;
  margin: 0 auto;
  color: #202d40;
}

.students-page > h2 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #14283f;
}

.panel {
  margin: 22px 0;
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e3eaf0;
  border-radius: 18px;
  box-shadow: 0 8px 26px rgba(20, 40, 63, 0.045);
  transition: box-shadow 180ms ease, border-color 180ms ease;
}

.panel:hover {
  border-color: #d2e6dd;
  box-shadow: 0 12px 32px rgba(20, 40, 63, 0.075);
}

.panel h3 {
  margin: 0 0 22px;
  color: #14283f;
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -0.3px;
}

form {
  display: grid;
  gap: 10px;
  max-width: 480px;
}

label {
  margin-top: 5px;
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
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

input::placeholder {
  color: #8997a7;
}

input:hover {
  border-color: #a9c7bb;
}

input:focus {
  border-color: #318364;
  outline: 3px solid rgba(49, 131, 100, 0.14);
  outline-offset: 1px;
  background: #ffffff;
}

button {
  width: fit-content;
  min-height: 43px;
  margin-top: 10px;
  padding: 11px 20px;
  border: 0;
  border-radius: 9px;
  background: #14283f;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease;
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

.delete-button {
  background: #fff0ed;
  color: #a43830;
}

.delete-button:hover:not(:disabled) {
  background: #a43830;
  color: #ffffff;
}

table {
  width: 100%;
  margin-top: 24px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border: 1px solid #e3eaf0;
  border-radius: 12px;
  font-size: 13px;
}

th,
td {
  padding: 14px 12px;
  border-bottom: 1px solid #e8edf1;
  text-align: left;
}

th {
  background: #f1f7f4;
  color: #40536a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

td {
  color: #34465a;
  overflow-wrap: anywhere;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody tr:hover {
  background: #f8fbf9;
}

.success-message {
  color: #176b35;
}

.error-message {
  color: #a52828;
}

@media (max-width: 600px) {
  .students-page > h2 {
    font-size: 24px;
  }

  .panel {
    margin: 16px 0;
    padding: 19px;
    border-radius: 14px;
  }

  .panel h3 {
    font-size: 17px;
    margin-bottom: 18px;
  }

  form {
    max-width: none;
  }

  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  th,
  td {
    padding: 12px 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .panel,
  button,
  input {
    transition: none;
  }
}
</style>
```
