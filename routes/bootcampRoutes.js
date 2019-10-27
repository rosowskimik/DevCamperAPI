const express = require('express');

const bootcampController = require('../controllers/bootcampController');
const courseRouter = require('./courseRoutes');

const router = express.Router();

router.use(
  '/:bootcampId/courses',
  bootcampController.bootcampExists,
  courseRouter
);

router
  .route('/')
  .get(bootcampController.getAllBootcamps)
  .post(bootcampController.createBootcamp);

router
  .route('/:id')
  .get(bootcampController.getBootcamp)
  .patch(bootcampController.updateBootcamp)
  .delete(bootcampController.deleteBootcamp);

router
  .route('/radius/:zipcode/:distance/:unit')
  .get(bootcampController.getBootcampsInRadius);

module.exports = router;
