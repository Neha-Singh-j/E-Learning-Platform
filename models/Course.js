// // backend/models/Course.js
// const mongoose = require('mongoose');

// const CourseSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true },
//   slug: { type: String, required: true, unique: true }, // optional
//   description: { type: String, required: true },
//   price: { type: Number, default: 0 },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   thumbnail: { type: String }, // URL or file path
//   duration: { type: String }, // e.g., "5h 30m"
//   syllabus: [{ title: String, content: String }], // basic breakdown
//   tags: [String],
//   createdAt: { type: Date, default: Date.now },
//   seats: { type: Number, default: 0 } // optional
// });

// module.exports = mongoose.model('Course', CourseSchema);


const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: { type: String, default: "" }, // Image URL or path
  duration: { type: String, default: "" },  // e.g., "5h 30m"
  syllabus: [
    {
      title: { type: String, required: true },
      content: { type: String, required: true }
    }
  ],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  seats: { type: Number, default: 0 }
});

module.exports = mongoose.model('Course', CourseSchema);
