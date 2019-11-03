const express = require('express');

const bootcampController = require('../controllers/bootcampController');
const courseRoutes = require('./courseRoutes');
const reviewRoutes = require('./reviewRoutes');

const auth = require('../middlewares/auth');
const imageUpload = require('../middlewares/imageUpload');

const router = express.Router();

router.use(
  '/:bootcampId/courses',
  bootcampController.bootcampExists,
  courseRoutes
);
router.use(
  '/:bootcampId/reviews',
  bootcampController.bootcampExists,
  reviewRoutes
);

router.patch(
  '/:bootcampId/photo',
  auth.protect,
  auth.authorize('publisher', 'admin'),
  bootcampController.bootcampExists,
  imageUpload('photo'),
  bootcampController.uploadPhoto
);

router
  .route('/')
  .get(bootcampController.getAllBootcamps)
  .post(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampController.createBootcamp
  );

router
  .route('/:id')
  .get(bootcampController.getBootcamp)
  .patch(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampController.updateBootcamp
  )
  .delete(
    auth.protect,
    auth.authorize('publisher', 'admin'),
    bootcampController.deleteBootcamp
  );

router
  .route('/radius/:zipcode/:distance/:unit')
  .get(bootcampController.getBootcampsInRadius);

module.exports = router;
