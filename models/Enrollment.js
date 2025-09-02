// backend/models/Enrollment.js
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
      pricePaid: { type: Number, required: true },
      enrolledAt: { type: Date, default: Date.now }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['completed','pending','cancelled'], default: 'completed' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
