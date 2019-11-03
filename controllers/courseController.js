const Course = require('../models/courseModel');
const asyncHandler = require('../utils/asyncHandler');
const factory = require('./controllerFactory');

// @route				GET /api/v1/courses
// @route				GET /api/v1/bootcamps/:bootcampId/courses
// @desc				Get all courses avalilable or for a given bootcamp
// @access			Public
exports.getAllCourses = factory.getAll(Course, {
  forResource: 'bootcamp'
});

// @route				GET /api/v1/courses/:id
// @desc				Get course by id
// @access			Public
exports.getCourse = factory.getOne(Course, {
  populate: {
    path: 'bootcamp',
    select: 'name description'
  }
});

// @route				POST /api/v1/bootcamps/:bootcampId/courses
// @desc				Create new course
// @access			Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Assign course to logged in user & bootcamp
  req.body.user = req.user._id;
  req.body.bootcamp = req.params.bootcampId;

  const newCourse = await Course.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newCourse
  });
});

// @route				PATCH /api/v1/courses/:id
// @desc				Update bootcamp with specified id
// @access			Private
exports.updateCourse = factory.updateOne(Course, ['bootcamp', 'user']);

// @route				DELETE /api/v1/courses/:id
// @desc				Delete bootcamp with specified id
// @access			Private
exports.deleteCourse = factory.deleteOne(Course);
