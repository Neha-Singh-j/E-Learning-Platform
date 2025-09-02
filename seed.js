const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User'); // to assign instructor
require('dotenv').config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // find one instructor to assign (make sure role = instructor in your DB)
    const instructor = await User.findOne({ role: 'instructor' });
    if (!instructor) {
      console.log("No instructor found. Please create one first.");
      process.exit(0);
    }

    await Course.deleteMany(); // clear old data

    const courses = [
      {
        title: "JavaScript for Beginners",
        slug: "javascript-for-beginners",
        description: "Learn JavaScript from scratch.",
        price: 49,
        instructor: instructor._id,
        thumbnail: "https://example.com/js-course.jpg",
        duration: "5h 30m",
        syllabus: [
          { title: "Introduction", content: "What is JavaScript?" },
          { title: "Variables", content: "Understanding variables" }
        ],
        tags: ["javascript", "programming"],
        seats: 50
      },
      {
        title: "Node.js Masterclass",
        slug: "nodejs-masterclass",
        description: "Advanced Node.js course.",
        price: 99,
        instructor: instructor._id,
        thumbnail: "https://example.com/node-course.jpg",
        duration: "8h 00m",
        syllabus: [
          { title: "Async Patterns", content: "Callbacks, Promises, Async/Await" },
          { title: "Express.js", content: "Building REST APIs" }
        ],
        tags: ["nodejs", "backend"],
        seats: 30
      }
    ];

    await Course.insertMany(courses);
    console.log("Courses seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// seedCourses();
