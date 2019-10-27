const Course = require('../models/courseModel');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./controllerFactory');

// @route				GET /api/v1/courses
// @route				GET /api/v1/bootcamps/:bootcampId/courses
// @desc				Get all courses avalilable or for a given bootcamp
// @access			Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = await new APIFeatures(
      Course,
      req.query,
      Course.find({ bootcamp: req.params.bootcampId })
    );
  } else {
    query = await new APIFeatures(Course, req.query);
  }
  query
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
