const Bootcamp = require('../models/bootcampModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const geocoder = require('../utils/geocoder');
const APIFeatures = require('../utils/apiFeatures');

// @route				GET /api/v1/bootcamps
// @desc				Get all bootcamps
// @access			Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {
  const bootcampsQuery = new APIFeatures(Bootcamp.find(), req.query)
    .filter()
    .selectFields()
    .sortBy();

  const bootcamps = await bootcampsQuery.query;

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

// @route				GET /api/v1/bootcamps/:zipcode/:distance/:unit
// @desc				Get all bootcamps in the specified area
// @access			Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const unit = `${req.params.unit === 'mi' ? '3963' : '6378'}`;

  const [loc] = await geocoder.geocode(zipcode);
  const { latitude, longitude } = loc;

  const radius = distance / unit;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: bootcamps.length,
    data: bootcamps
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

// @route				DELETE /api/v1/bootcamps/:id
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
