
const mongoose = require('mongoose');

// Defining the structure of the Enrollment schema with studentId and courseId fields, both required and trimmed
const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    trim: true,
  },
  courseId: {
    type: String,
    required: true,
    trim: true,
  },
});

// Making the combination of studentId and courseId unique to prevent duplicate enrollments
enrollmentSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true }
);

module.exports = mongoose.model('Enrollment', enrollmentSchema); // Exporting the Enrollment model based on the defined schema for use in other parts of the application
