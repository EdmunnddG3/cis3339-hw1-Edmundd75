\# CIS 3339 Homework 1 — Student and Course Management



\## Overview



This project is a web application for managing students, courses, and course enrollments. It uses Vue 3 for the frontend, Express.js for the backend, and MongoDB for persistent data storage.



\## Features



\### Students

\- Add students with a name, student ID, phone number, and ZIP code.

\- Search for students by name.

\- View the list of students.

\- Delete students.

\- Prevent duplicate student IDs.



\### Courses

\- Add courses with a course ID and course name.

\- View and search for courses.

\- Delete courses.

\- Prevent duplicate course IDs.



\### Enrollments

\- Enroll existing students in existing courses.

\- View students enrolled in a selected course.

\- Prevent duplicate enrollments.

\- Automatically remove related enrollments when a student or course is deleted.



\## Technologies



\- Vue 3 and Vite

\- Vue Router

\- Pinia

\- Node.js and Express.js

\- MongoDB and Mongoose



\## Requirements



Install the following before running the application:



\- Node.js and npm

\- MongoDB Community Server



MongoDB must be running locally before starting the backend.



\## Installation



Open a command prompt in the project root directory.



\### 1. Install backend dependencies



```bash

cd backend

npm install

```



\### 2. Configure MongoDB



Create or check the file `backend/.env`. It should contain:



```env

MONGODB\_URI=mongodb://127.0.0.1:27017/cis3339\_homework1

```



Make sure your local MongoDB server is running.



\### 3. Install frontend dependencies



```bash

cd ../frontend

npm install

```



\### 4. Build the frontend



Return to the project root directory:



```bash

cd ..

npm run build

```



The production frontend files are generated in `frontend/dist`.



\## Run the Application



From the project root directory, run:



```bash

npm start

```



The backend connects to MongoDB and serves the application on:



http://localhost:3000



Open that address in your browser.



To stop the server, press `Ctrl+C` in the command prompt running it.



\## Data Storage



Student, course, and enrollment records are stored in MongoDB and persist between application restarts. The backend uses Mongoose models and initializes model indexes at startup. Required collections are created by MongoDB when records are first saved.



Deleting a student or course also deletes its associated enrollment records.



\## Production Build



To build the frontend from the project root:



```bash

npm run build

```



The Express backend serves the generated frontend files from `frontend/dist`.



\## Notes



\- Keep MongoDB running while using the application.

\- The application uses the local MongoDB database named `cis3339\_homework1`.

\- Do not commit database credentials or other private secrets to version control.



