const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

// 📝 Registration Page
router.get("/register", (req, res) => {
  res.render("auth/signup");
});

// 📝 Register User
router.post("/register", async (req, res) => {
  try {
    let { username, password, email, role, gender } = req.body;

    // default role = student if not provided
    if (!role) role = "student";

    let user = new User({ username, email, gender, role });
    let newUser = await User.register(user, password);

    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration failed.");
    res.redirect("/register");
  }
});

// 🔑 Login Page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// 🔑 Login User
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    req.flash("success", `Welcome Back ${req.user.username}`);

    // redirect based on role
    if (req.user.role === "instructor") {
      // res.redirect("/instructor/dashboard");
      res.redirect("/courses"); // temp redirect to courses
    } else {
      res.redirect("/courses"); // default for students
    }
  }
);

// 🚪 Logout User
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out successfully");
    res.redirect("/login");
  });
});

module.exports = router;
