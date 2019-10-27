const Course = require('../models/courseModel');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./controllerFactory');

// @route				GET /api/v1/courses
// @route				GET /api/v1/bootcamps/:bootcampId/courses
// @desc				Get all courses avalilable or for a given bootcamp
// @access			Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  const query = req.params.bootcampId
    ? new APIFeatures(
        Course,
        req.query,
        Course.find({ bootcamp: req.params.bootcampId })
      )
    : new APIFeatures(Course, req.query);

  await query
    .filter()
    .selectFields()
    .sortBy()
    .paginate();

  const courses = await query.query;

  res.status(200).json({
    status: 'success',
    pagination: query.pagination,
    results: courses.length,
    data: courses
  });
});

// @route				GET /api/v1/courses/:id
// @desc				Get course by id
// @access			Public
exports.getCourse = factory.getOne(Course, {
  path: 'bootcamp',
  select: 'name description'
});

// @route				POST /api/v1/bootcamps/:bootcampId/courses
// @desc				Create new course
// @access			Private
exports.createCourse = factory.createOne(Course);

// @route				PATCH /api/v1/courses/:id
// @desc				Update bootcamp with specified id
// @access			Private
exports.updateCourse = factory.updateOne(Course);

// @route				DELETE /api/v1/courses/:id
// @desc				Delete bootcamp with specified id
// @access			Private
exports.deleteCourse = factory.deleteOne(Course);
