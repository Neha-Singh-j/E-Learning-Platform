const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // optional, if you want to link review to a user
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // optional, if this review is for a product
      required: true
    }
  },
  {
    timestamps: true // automatically adds createdAt and updatedAt
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;
