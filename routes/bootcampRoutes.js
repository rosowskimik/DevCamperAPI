const express = require('express');

const bootcampController = require('../controllers/bootcampController');
const courseRouter = require('./courseRoutes');

const auth = require('../middlewares/auth');
const imageUpload = require('../middlewares/imageUpload');

const router = express.Router();

router.use(
  '/:bootcampId/courses',
  bootcampController.bootcampExists,
  courseRouter
);

router
  .route('/:bootcampId/photo')
  .patch(
    auth.protect,
    bootcampController.bootcampExists,
    imageUpload('photo'),
    bootcampController.uploadPhoto
  );

router
  .route('/')
  .get(bootcampController.getAllBootcamps)
  .post(auth.protect, bootcampController.createBootcamp);

router
  .route('/:id')
  .get(bootcampController.getBootcamp)
  .patch(auth.protect, bootcampController.updateBootcamp)
  .delete(auth.protect, bootcampController.deleteBootcamp);

router
  .route('/radius/:zipcode/:distance/:unit')
  .get(bootcampController.getBootcampsInRadius);

module.exports = router;
