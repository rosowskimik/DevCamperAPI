const Review = require('../models/reviewModel');
const asyncHandler = require('../utils/asyncHandler');
const factory = require('./controllerFactory');

// @route				GET /api/v1/reviews
// @route				GET /api/v1/bootcamps/:bootcampId/reviews
// @desc				Get all reviews avalilable or for a given bootcamp
// @access			Public
exports.getAllReviews = factory.getAll(Review, {
  populate: [
    {
      path: 'bootcamp',
      select: 'name description'
    }
  ],
  forResource: 'bootcamp'
});

// @route				GET /api/v1/reviews/:id
// @desc				Get review by id
// @access			Public
exports.getReview = factory.getOne(Review, {
  populate: [
    {
      path: 'bootcamp',
      select: 'name'
    },
    {
      path: 'user',
      select: 'name'
    }
  ]
});

// @route				POST /api/v1/reviews
// @desc				Create new review
// @access			Private
exports.createReview = asyncHandler(async (req, res, next) => {
  // Assign course to logged in user & bootcamp
  req.body.user = req.user._id;
  req.body.bootcamp = req.params.bootcampId;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newReview
  });
});

// @route				PATCH /api/v1/reviews/:id
// @desc				Update review with specified ID
// @access			Private
exports.updateReview = factory.updateOne(Review, ['bootcamp', 'user']);

// @route				DELETE /api/v1/reviews/:id
// @desc				Delete review with specified ID
// @access			Private
exports.deleteReview = factory.deleteOne(Review);
