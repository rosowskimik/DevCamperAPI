const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    const resourceQuery =
      options.forResource && req.params[`${options.forResource}Id`]
        ? new APIFeatures(
            Model,
            req.query,
            Model.find({
              [options.forResource]: req.params[`${options.forResource}Id`]
            })
          )
        : new APIFeatures(Model, req.query);

    await resourceQuery
      .filter()
      .selectFields()
      .sortBy()
      .paginate();

    const documents = options.populate
      ? await resourceQuery.query.populate(options.populate)
      : await resourceQuery.query;

    res.status(200).json({
      status: 'success',
      pagination: resourceQuery.pagination,
      results: documents.length,
      data: documents
    });
  });

exports.getOne = (Model, options = {}) =>
  asyncHandler(async (req, res, next) => {
    const query = Model.findById(req.params.id);

    const document = options.populate
      ? await query.populate(options.populate)
      : await query;

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

exports.deleteUser = currentUser =>
  asyncHandler(async (req, res, next) => {
    const userToRemove = await User.findById(
      currentUser ? req.user._id : req.params.id
    );

    if (!userToRemove) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (currentUser) {
      res.cookie('jwt', null, {
        expires: new Date(Date.now() + 1000 * 10),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    await userToRemove.remove();

    res.status(204).json({
      status: 'success',
      message: 'User deleted'
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
