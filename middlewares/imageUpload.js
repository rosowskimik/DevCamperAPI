const path = require('path');
const multer = require('multer');
const ErrorResponse = require('../utils/errorResponse');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `bootcamp-${req.params.bootcampId}.png`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files can be uploaded.', 415), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: process.env.PHOTO_FILE_SIZE }
});

const imageUpload = fieldName => upload.single(fieldName);

module.exports = imageUpload;
