const express = require('express');

const courseController = require('../controllers/courseController');

const auth = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    courseController.createCourse
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    courseController.updateCourse
  )
  .delete(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    courseController.deleteCourse
  );

module.exports = router;
