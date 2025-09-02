// backend/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { protect } = require('../middlewares');

router.route('/')
  .post(protect, enrollmentController.createEnrollment)
  .get(protect, enrollmentController.getMyEnrollments);

module.exports = router;
