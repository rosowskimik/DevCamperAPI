const Bootcamp = require('../models/bootcampModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

// @route				GET /api/v1/bootcamps
// @desc				Get all bootcamps
// @access			Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    status: 'success',
    results: bootcamps.length,
    data: bootcamps
  });
});

// @route				GET /api/v1/bootcamps/:id
// @desc				Get bootcamp by id
// @access			Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new AppError('The bootcamp with specified ID does not exist.', 404)
    );

  res.status(200).json({
    status: 'success',
    data: bootcamp
  });
});

// @route				POST /api/v1/bootcamps
// @desc				Create new bootcamp
// @access			Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const newBootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newBootcamp
  });
});

// @route				PATCH /api/v1/bootcamps/:id
// @desc				Update bootcamp with specified id
// @access			Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedBootcamp)
    return next(
      new AppError('The bootcamp with specified ID does not exist.', 404)
    );

  res.status(200).json({
    status: 'success',
    data: updatedBootcamp
  });
});

// @route				DELETED /api/v1/bootcamps/:id
// @desc				Delete bootcamp with specified id
// @access			Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const deletedBootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!deletedBootcamp)
    return next(
      new AppError('The bootcamp with specified ID does not exist.', 404)
    );

  res.status(204).json({ status: 'success', message: 'Bootcamp deleted' });
});
