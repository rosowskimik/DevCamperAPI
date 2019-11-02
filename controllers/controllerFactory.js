const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const resourceQuery = await new APIFeatures(Model, req.query)
      .filter()
      .selectFields()
      .sortBy()
      .paginate();

    const documents = await resourceQuery.query.populate(populateOptions);

    res.status(200).json({
      status: 'success',
      pagination: resourceQuery.pagination,
      results: documents.length,
      data: documents
    });
  });

exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id).populate(
      populateOptions
    );

    if (!document) {
      return next(
        new ErrorResponse(
          `${getResourceName(Model)} with specified ID does not exist`,
          404
        )
      );
    }

    res.status(200).json({
      status: 'success',
      data: document
    });
  });

exports.getUser = currentUser =>
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(
      currentUser ? req.user._id : req.params.id
    );

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: user
    });
  });

exports.createOne = Model =>
  asyncHandler(async (req, res, next) => {
    const newDocument = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newDocument
    });
  });

exports.updateOne = (Model, ignoreFields = []) =>
  asyncHandler(async (req, res, next) => {
    const oldDocument = await Model.findById(req.params.id);

    if (!oldDocument) {
      return next(
        new ErrorResponse(
          `${getResourceName(Model)} with specified ID does not exist`,
          404
        )
      );
    }

    if (!req.user.isOwner(oldDocument)) {
      return next(
        new ErrorResponse(
          `User with ID ${
            req.user._id
          } is not authorized to update this ${getResourceName(Model, false)}`,
          403
        )
      );
    }

    ignoreFields.forEach(field => delete req.body[field]);

    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: updatedDocument
    });
  });

exports.updateUser = currentUser =>
  asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = currentUser
      ? { name: req.body.name, email: req.body.email }
      : req.body;

    const updatedUser = await User.findByIdAndUpdate(
      currentUser ? req.user._id : req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: updatedUser
    });
  });

exports.deleteOne = Model =>
  asyncHandler(async (req, res, next) => {
    const documentToRemove = await Model.findById(req.params.id);

    if (!documentToRemove) {
      return next(
        new ErrorResponse(
          `${getResourceName(Model)} with specified ID does not exist`,
          404
        )
      );
    }

    if (!req.user.isOwner(documentToRemove)) {
      return next(
        new ErrorResponse(
          `User with ID ${
            req.user._id
          } is not authorized to remove this ${getResourceName(Model, false)}`,
          403
        )
      );
    }
    await documentToRemove.remove();

    res.status(204).json({
      status: 'success',
      message: `${getResourceName(Model)} deleted`
    });
  });

// Local utils
const getResourceName = (Model, uppercase = true) => {
  const name = Model.collection.name.substring(
    0,
    Model.collection.name.length - 1
  );
  return uppercase ? `${name[0].toUpperCase()}${name.slice(1)}` : name;
};
