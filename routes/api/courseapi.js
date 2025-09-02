const express = require('express');
const { isLoggedIn } = require('../../middlewares');
const User = require('../../models/User');

const router = express.Router();

// ❤️ Add/Remove Course from Wishlist
router.post('/courses/:courseId/like', isLoggedIn, async (req, res) => {
  try {
    let { courseId } = req.params;
    let user = req.user;

    let isLiked = user.wishlist.includes(courseId);

    if (isLiked) {
      // remove from wishlist
      await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: courseId } });
    } else {
      // add to wishlist
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { wishlist: courseId } });
    }

    res.status(201).send('ok');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
