const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    cb(null, `bootcamp-${req.params.bootcampId}.png`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files can be uploaded.', 415), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: process.env.PHOTO_FILE_SIZE }
});

const imageUpload = fieldName => upload.single(fieldName);

module.exports = imageUpload;
