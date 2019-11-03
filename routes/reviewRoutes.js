const express = require('express');

const reviewController = require('../controllers/reviewController');

const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    auth.protect,
    auth.authorize('user', 'admin'),
    reviewController.createReview
  );

router.route('/:id').get(reviewController.getReview);

module.exports = router;
