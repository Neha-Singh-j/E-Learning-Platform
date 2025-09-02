const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
require("dotenv").config(); // ✅ environment variables
const seedDB = require("./seed");

// seedDB();
const courseRoutes = require("./routes/courseRoutes");
const reviewRoutes = require("./routes/review");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

const courseApi = require("./routes/api/courseapi"); // instead of productApi

// ✅ Database connection
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ✅ Sessions & Flash
let configSession = {
  secret: process.env.SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(configSession));
app.use(flash());
// ✅ Passport (Authentication)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); // strategy first
passport.serializeUser(User.serializeUser());         // methods from PLM
passport.deserializeUser(User.deserializeUser());

// ✅ Flash + Current User available in all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ✅ Home route
app.get("/", (req, res) => {
  res.render("home");
});

// ✅ Routes
// app.use(courseRoutes);      // courses CRUD
// app.use(reviewRoutes);      // reviews for courses
// app.use(authRoutes);        // login, signup, logout
// app.use(cartRoutes);        // enrollment cart & checkout
// app.use(courseApi);         // wishlist (like/unlike courses)


// ✅ Routes
app.use("/courses", courseRoutes);   // all course-related routes
app.use("/reviews", reviewRoutes);   // reviews
app.use("/", authRoutes);       // login, signup, logout
// app.use("/cart", cartRoutes);        // cart
app.use("/user", cartRoutes);
// app.use(cartRoutes);
app.use("/api/courses", courseApi);  // API

// ✅ Start Server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});

















