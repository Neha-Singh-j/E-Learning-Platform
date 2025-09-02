const express = require('express');
const Course = require('../models/Course');
const Review = require('../models/Review');
const { validateReview, isLoggedIn } = require('../middlewares');

const router = express.Router();

// ✍️ Add a Review for a Course
router.post('/courses/:courseId/review', isLoggedIn, validateReview, async (req, res) => {
  try {
    let { courseId } = req.params;
    let { rating, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      req.flash('error', 'Course not found');
      return res.redirect('/courses');
    }

    // create new review
    const review = new Review({
      rating,
      comment,
      author: req.user._id   // ✅ link review to user
    });

    // add review reference to course
    course.reviews.push(review);

    await review.save();
    await course.save();

    req.flash('success', 'Review added successfully');
    res.redirect(`/courses/${courseId}`);
  } catch (e) {
    console.log(err);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
