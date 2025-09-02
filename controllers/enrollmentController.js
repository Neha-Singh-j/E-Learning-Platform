// backend/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.createEnrollment = async (req, res) => {
  try {
    const { items } = req.body; // items: [{ courseId, price }]
    if (!items || !items.length) return res.status(400).json({ message: 'No courses provided' });

    const courses = [];
    let total = 0;
    for (const it of items) {
      const course = await Course.findById(it.courseId);
      if (!course) return res.status(400).json({ message: 'Course not found' });
      courses.push({ course: course._id, pricePaid: it.price ?? course.price });
      total += it.price ?? course.price;
    }

    const enrollment = new Enrollment({
      student: req.user._id,
      courses,
      totalAmount: total,
      status: 'completed'
    });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate('courses.course','title thumbnail');
    res.json(enrollments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};
