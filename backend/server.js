const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

// Importing the Mongoose models for Student, Course, and Enrollment
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');

// Serve static files from the frontend build directory, enable CORS for cross-origin requests, and parse incoming JSON requests
app.use(express.static(frontendPath));
app.use(cors());
app.use(express.json());


// Search for a student by name
app.post('/find-student', async (req, res) => {
    try {
        const { name } = req.body;

        const student = await Student.findOne({
            name: { $regex: `^${name}$`, $options: 'i' }
        });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json(student);
    } catch (error) {
        console.error('Error searching for student:', error);
        res.status(500).json({
            message: 'Error searching for student'
        });
    }
});


// Endpoint to save a student
app.post('/add-student', async (req, res) => {
    try {
        const { name, id, phone, zip } = req.body;

        const student = new Student({
            name,
            id,
            phone,
            zip
        });

        await student.save();

        res.status(201).json({
            message: 'Student added successfully!',
            student
        });
    } catch (error) {
        console.error('Error adding student:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A student with this ID already exists.'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Please provide all required student fields.'
            });
        }

        res.status(500).json({
            message: 'Error adding student'
        });
    }
});


// Endpoint to delete a student by name
app.post('/delete-student', async (req, res) => {
    try {
        const { id } = req.body;

        const student = await Student.findOneAndDelete({ id });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        await Enrollment.deleteMany({ studentId: id });

        res.json({
            message: 'Student deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting student:', error);

        res.status(500).json({
            message: 'Error deleting student'
        });
    }
});

// Endpoint to save a course
app.post('/add-course', async (req, res) => {
    try {
        const { courseId, courseName } = req.body;

        const course = new Course({
            courseId,
            courseName
        });

        await course.save();

        res.status(201).json({
            message: 'Course added successfully!',
            course
        });
    } catch (error) {
        console.error('Error adding course:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'A course with this ID already exists.'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Please provide a course ID and course name.'
            });
        }

        res.status(500).json({
            message: 'Error adding course'
        });
    }
});

// Endpoint to search for a course by courseId
app.post('/find-course', async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findOne({ courseId });

        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        res.json(course);
    } catch (error) {
        console.error('Error searching for course:', error);

        res.status(500).json({
            message: 'Error searching for course'
        });
    }
});

// Endpoint to delete a course by courseId
app.post('/delete-course', async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findOneAndDelete({ courseId });

        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        await Enrollment.deleteMany({ courseId });

        res.json({
            message: 'Course deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting course:', error);

        res.status(500).json({
            message: 'Error deleting course'
        });
    }
});

// Endpoint to add an enrollment
app.post('/add-enrollment', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        message: 'Student ID and course ID are required.',
      });
    }

    const student = await Student.findOne({ id: studentId });
    if (!student) {
      return res.status(404).json({
        message: 'Student not found.',
      });
    }

    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({
        message: 'Course not found.',
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: 'This student is already enrolled in this course.',
      });
    }

    await Enrollment.create({ studentId, courseId });

    return res.status(201).json({
      message: 'Student enrolled successfully!',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This student is already enrolled in this course.',
      });
    }

    console.error('Error adding enrollment:', error);
    return res.status(500).json({
      message: 'Could not add enrollment.',
    });
  }
});

// Endpoint to find enrollments for a specific course
app.post('/find-enrollments', async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: 'Course ID is required.',
      });
    }

    const course = await Course.findOne({ courseId });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found.',
      });
    }

    const enrollments = await Enrollment.find({ courseId }).lean();
    const studentIds = enrollments.map(
      (enrollment) => enrollment.studentId
    );

    const students = await Student.find({
      id: { $in: studentIds },
    }).lean();

    return res.status(200).json({
      courseId,
      students,
    });
  } catch (error) {
    console.error('Error finding enrollments:', error);
    return res.status(500).json({
      message: 'Could not retrieve enrollments.',
    });
  }
});

// Endpoint to list all students
app.get('/list-students', async (req, res) => {
  try {
    const students = await Student.find()
      .select('name id phone zip -_id')
      .sort({ name: 1 })
      .lean();

    return res.status(200).json(students);
  } catch (error) {
    console.error('Error listing students:', error);
    return res.status(500).json({
      message: 'Could not retrieve students.',
    });
  }
});

// Endpoint to list all courses
app.get('/list-courses', async (req, res) => {
  try {
    const courses = await Course.find()
      .select('courseId courseName -_id')
      .sort({ courseId: 1 })
      .lean();

    return res.status(200).json(courses);
  } catch (error) {
    console.error('Error listing courses:', error);
    return res.status(500).json({
      message: 'Could not retrieve courses.',
    });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = 3000;

// Connect to MongoDB and initialize indexes for Student, Course, and Enrollment models before starting the server
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        await Promise.all([
            Student.init(),
            Course.init(),
            Enrollment.init(),
        ]);

        console.log('Connected to MongoDB');
        console.log('Database indexes initialized');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB or initialize indexes:', error);
        process.exit(1);
    });

