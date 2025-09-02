const Joi = require("joi");

const courseSchema = Joi.object({
    title: Joi.string().trim().min(3).max(100).required(),
    description: Joi.string().trim().min(10).required(),
    category: Joi.string().trim().min(3).max(50).required(),
    price: Joi.number().min(0).required(),
    slug: Joi.string().trim().min(3).max(100).required()
});

const reviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().trim().min(3).required()
});

module.exports = { courseSchema, reviewSchema };
