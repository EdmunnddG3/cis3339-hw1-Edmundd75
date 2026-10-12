# CIS 3339 Homework 1 — Student and Course Management

## Overview

This project is a web application for managing students, courses, and course enrollments. It uses Vue 3 for the frontend, Express.js for the backend, and MongoDB for persistent data storage.

## Features

### Students
- Add students with a name, student ID, phone number, and ZIP code.
- Search for students by name.
- View the list of students.
- Delete students.
- Prevent duplicate student IDs.

### Courses
- Add courses with a course ID and course name.
- View and search for courses.
- Delete courses.
- Prevent duplicate course IDs.

### Enrollments
- Enroll existing students in existing courses.
- View students enrolled in a selected course.
- Prevent duplicate enrollments.
- Automatically remove related enrollments when a student or course is deleted.

## Technologies

- Vue 3 and Vite
- Vue Router
- Pinia
- Node.js and Express.js
- MongoDB and Mongoose

## Requirements

Install Node.js and npm, along with MongoDB Community Server. MongoDB must be running locally before starting the backend.

## Installation

Open a command prompt in the project root directory.

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

Create or check `backend/.env`. It should contain:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
```

On Windows, open the Services application by pressing **Windows + R**, entering `services.msc`, and pressing Enter. Find **MongoDB Server (MongoDB)**, right-click it, and select **Start** if it is not already running. If the service is already running, no action is needed.

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Build the frontend

Return to the project root directory:

```bash
cd ..
npm run build
```

The production frontend files are generated in `frontend/dist`.

## Run the Application

From the project root directory, run:

```bash
npm start
```

The backend connects to MongoDB and serves the application at:

http://localhost:3000

Open that address in your browser.

To stop the server, press `Ctrl+C` in the command prompt running it.

## Data Storage

Student, course, and enrollment records are stored in MongoDB and persist between application restarts. The backend uses Mongoose models and initializes model indexes at startup. MongoDB creates collections when records are first saved.

Deleting a student or course also deletes its associated enrollment records.

## Production Build

To build the frontend from the project root:

```bash
npm run build
```

The Express backend serves the generated frontend files from `frontend/dist`.

## Automated Tests

The backend includes automated API tests using Node.js's built-in test runner.

Make sure MongoDB is running and the application backend is available at `http://localhost:3000`. From the project root, run:

```bash
npm --prefix backend test
```

The tests verify that the student and course list endpoints return successful responses containing arrays of records.

To run the tests, keep the backend server running in a separate terminal.

## Notes

- Keep MongoDB running while using the application.
- The application uses the local MongoDB database named `cis3339_homework1`.
- This assignment uses a local development database. Do not put real passwords or private credentials in version control.