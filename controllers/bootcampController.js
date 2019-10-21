const Bootcamp = require('../models/bootcampModel');

// @route				GET /api/v1/bootcamps
// @desc				Get all bootcamps
// @access			Public
exports.getAllBootcamps = (req, res, next) => {
  res.status(200).json({ status: 'success' });
};

// @route				GET /api/v1/bootcamps/:id
// @desc				Get bootcamp by id
// @access			Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ status: 'success' });
};

// @route				POST /api/v1/bootcamps
// @desc				Create new bootcamp
// @access			Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const newBootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      status: 'success',
      bootcamp: newBootcamp
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
