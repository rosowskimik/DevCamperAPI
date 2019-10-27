const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = Model =>
  asyncHandler(async (req, res, next) => {
    const resourceQuery = await new APIFeatures(Model, req.query)
      .filter()
      .selectFields()
      .sortBy()
      .paginate();

    const documents = await resourceQuery.query;

    res.status(200).json({
      status: 'success',
      pagination: resourceQuery.pagination,
      results: documents.length,
      data: documents
    });
  });

exports.getOne = Model =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document)
      return next(
        new AppError('The document with specified ID does not exist.', 404)
      );

    res.status(200).json({
      status: 'success',
      data: document
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

exports.updateOne = Model =>
  asyncHandler(async (req, res, next) => {
    const updatedDocument = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedDocument)
      return next(
        new AppError('The document with specified ID does not exist.', 404)
      );

    res.status(200).json({
      status: 'success',
      data: updatedDocument
    });
  });

exports.deleteOne = Model =>
  asyncHandler(async (req, res, next) => {
    const deletedDocument = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDocument)
      return next(
        new AppError('The document with specified ID does not exist.', 404)
      );

    res.status(204).json({ status: 'success', message: 'Document deleted' });
  });
