
const mongoose = require('mongoose');

// Defining the structure of the Student schema with name, id, phone, and zip fields, all required and trimmed
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  zip: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Student', studentSchema); // Exporting the Student model based on the defined schema for use in other parts of the application
