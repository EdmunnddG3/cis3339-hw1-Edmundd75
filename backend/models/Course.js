
const mongoose = require('mongoose'); // Importing the Mongoose library to define the Course schema and model

// Defining the structure of the Course schema with courseId and courseName fields, both required and trimmed
const courseSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Course', courseSchema); // Exporting the Course model based on the defined schema for use in other parts of the application
