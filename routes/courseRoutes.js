const express = require('express');

const courseController = require('../controllers/courseController');

const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(auth.protect, courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(auth.protect, courseController.updateCourse)
  .delete(auth.protect, courseController.deleteCourse);

module.exports = router;
