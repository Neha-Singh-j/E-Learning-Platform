// cart.js
const express = require("express");
const { isLoggedIn } = require("../middlewares");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const router = express.Router();

// 🛒 View Enrollment Cart
// router.get("/cart", isLoggedIn, async (req, res) => {
//   try {
//     let userId = req.user._id;
//     let user = await User.findById(userId).populate("cart");  

//     let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);

//     res.render("cart/cart", { user, totalAmount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// 🛒 View Enrollment Cart
router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await User.findById(userId).populate("cart");  
    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);
    res.render("cart/cart", { user, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ➕ Add Course to Cart
// router.post("/:courseId/add", isLoggedIn, async (req, res) => {
//   try {
//     let { courseId } = req.params;
//     let userId = req.user._id;

//     let user = await User.findById(userId);
//     let course = await Course.findById(courseId);

//     if (!course) return res.status(404).send("Course not found");

//     if (!user.cart.includes(course._id)) {
//       user.cart.push(course);
//       await user.save();
//     }

//     res.redirect("/user/cart");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });
// 🛒 Add Course to Cart
router.post("/cart/add/:courseId", isLoggedIn, async (req, res) => {
  try {
    let courseId = req.params.courseId;
    let user = await User.findById(req.user._id);

    if (!user.cart.includes(courseId)) {
      user.cart.push(courseId);
      await user.save();
    }

    res.redirect("/user/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});



// ✅ Checkout
router.post("/cart/checkout", isLoggedIn, async (req, res) => {
  try {
    let userId = req.user._id;
    let user = await User.findById(userId).populate("cart");

    if (!user.cart.length) return res.redirect("/user/cart");

    let totalAmount = user.cart.reduce((sum, curr) => sum + curr.price, 0);

    const enrollment = new Enrollment({
      student: user._id,
      courses: user.cart.map((c) => ({
        course: c._id,
        pricePaid: c.price,
      })),
      totalAmount,
      status: "completed",
    });

    await enrollment.save();
    user.cart = [];
    await user.save();

    res.redirect("/user/enrollments");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ Enrollments
router.get("/enrollments", isLoggedIn, async (req, res) => {
  try {
    let enrollments = await Enrollment.find({ student: req.user._id })
      .populate("courses.course")
      .sort({ createdAt: -1 });

    res.render("cart/enrollments", { enrollments });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
