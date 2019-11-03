const express = require('express');

const reviewController = require('../controllers/reviewController');

const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getAllReviews);

module.exports = router;
