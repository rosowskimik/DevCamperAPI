const Review = require('../models/reviewModel');
const factory = require('./controllerFactory');

// @route				GET /api/v1/reviews
// @route				GET /api/v1/bootcamps/:bootcampId/reviews
// @desc				Get all reviews avalilable or for a given bootcamp
// @access
exports.getAllReviews = factory.getAll(Review, {
  populate: {
    path: 'bootcamp',
    select: 'name description'
  },
  forResource: 'bootcamp'
});
