const Course = require('../models/Course');

// Create course (Instructor/Admin)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, duration, syllabus, tags, thumbnail } = req.body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')        // replace spaces with -
      .replace(/[^\w-]+/g, '');    // remove non-word chars

    const course = new Course({
      title,
      description,
      price,
      duration,
      syllabus: syllabus || [],
      tags: tags || [],
      instructor: req.user._id,
      thumbnail: thumbnail || '',
      slug,
    });

    await course.save();

    // Redirect to new course page
    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { err: err.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.render('courses/index', { courses });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { err: err.message });
  }
};

// Get course by slug (Show page)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.id }).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).render('error', { err: 'Course not found' });
    }
    res.render('courses/show', { course });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { err: err.message });
  }
};

// Update course (edit & save)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.id });
    if (!course) return res.status(404).render('error', { err: 'Course not found' });

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).render('error', { err: 'Not authorized' });
    }

    Object.assign(course, req.body);

    // update slug if title changes
    if (req.body.title) {
      course.slug = req.body.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
    }

    await course.save();

    res.redirect(`/courses/${course.slug}`);
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { err: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.id });
    if (!course) return res.status(404).render('error', { err: 'Course not found' });

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).render('error', { err: 'Not authorized' });
    }

    await course.deleteOne();

    res.redirect('/courses');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { err: err.message });
  }
};
