const Bootcamp = require('../models/bootcampModel');

// @route				GET /api/v1/bootcamps
// @desc				Get all bootcamps
// @access			Public
exports.getAllBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      status: 'success',
      results: bootcamps.length,
      data: bootcamps
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @route				GET /api/v1/bootcamps/:id
// @desc				Get bootcamp by id
// @access			Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp)
      return res.status(404).json({
        status: 'fail',
        message: 'The bootcamp with specified ID does not exist.'
      });

    res.status(200).json({
      status: 'success',
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @route				POST /api/v1/bootcamps
// @desc				Create new bootcamp
// @access			Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const newBootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newBootcamp
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// @route				PATCH /api/v1/bootcamps/:id
// @desc				Update bootcamp with specified id
// @access			Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ status: 'success' });
};

// @route				DELETED /api/v1/bootcamps/:id
// @desc				Delete bootcamp with specified id
// @access			Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(204).json({ status: 'success' });
};
