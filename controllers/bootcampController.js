const Bootcamp = require('../models/bootcampModel');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const factory = require('./controllerFactory');

// Bootcamp specific middleware
exports.bootcampExists = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.exists({ _id: req.params.bootcampId });

  if (!bootcamp)
    return next(
      new ErrorResponse('Bootcamp with specified ID does not exist.', 404)
    );

  req.body.bootcamp = req.params.bootcampId;
  next();
});

// Bootcamp route handlers

// @route				GET /api/v1/bootcamps
// @desc				Get all bootcamps
// @access			Public
exports.getAllBootcamps = factory.getAll(Bootcamp, {
  path: 'courses',
  select: 'title description'
});

// @route				GET /api/v1/bootcamps/:id
// @desc				Get bootcamp by id
// @access			Public
exports.getBootcamp = factory.getOne(Bootcamp, 'courses');

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
  // Assign bootcamp to logged in user
  req.body.user = req.user._id;

  // Check if logged in publisher already created a bootcamp
  if (
    (await Bootcamp.exists({ user: req.body.user })) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User with ID ${req.body.user} has already created a bootcamp`,
        400
      )
    );
  }

  const newBootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newBootcamp
  });
});

// @route				PATCH /api/v1/bootcamps/:id
// @desc				Update bootcamp with specified id
// @access			Private
exports.updateBootcamp = factory.updateOne(Bootcamp, 'photo');

// @route				PATCH /api/v1/bootcamps/:id/photo
// @desc				Upload / change bootcamp image
// @access			Private
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcampWithPhoto = await Bootcamp.findByIdAndUpdate(
    req.params.bootcampId,
    {
      photo: req.file.filename
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    filename: req.file.filename,
    data: bootcampWithPhoto
  });
});

// @route				DELETE /api/v1/bootcamps/:id
// @desc				Delete bootcamp with specified id
// @access			Private
exports.deleteBootcamp = factory.deleteOne(Bootcamp);
