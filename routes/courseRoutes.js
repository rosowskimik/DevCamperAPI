const express = require('express');

const courseController = require('../controllers/courseController');

const router = express.Router({ mergeParams: true });

router.route('/').get(courseController.getAllCourses);

module.exports = router;