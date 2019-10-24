const express = require('express');

const bootcampController = require('../controllers/bootcampController');

const router = express.Router();

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
