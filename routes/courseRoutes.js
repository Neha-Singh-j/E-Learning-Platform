// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { isLoggedIn, authorize } = require('../middlewares'); // ✅ fix path

router.get('/new', isLoggedIn, authorize('instructor', 'admin'), (req, res) => {
  
  res.render('courses/new');
});
// Get all courses & create a new course
router.route('/')
  .get(courseController.getAllCourses)
  .post(isLoggedIn, authorize('instructor', 'admin'), courseController.createCourse);

// Get, update, or delete a course by ID
router.route('/:id')
  .get(courseController.getCourseById)
  .put(isLoggedIn, authorize('instructor', 'admin'), courseController.updateCourse)
  .delete(isLoggedIn, authorize('instructor', 'admin'), courseController.deleteCourse);


module.exports = router;
