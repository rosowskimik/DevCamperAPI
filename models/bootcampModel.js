const mongoose = require('mongoose');
const slugify = require('slugify');

const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name.'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters.']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description.'],
    maxlength: [250, 'Description cannot exceed 250 characters.']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please enter a valid URL with HTTP or HTTPS.'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot exceed 20 characters.']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      'Please enter a valid email address.'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address.']
  },
  // location: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     required: true
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true
  //   },
  //   formattedAddress: String,
  //   street: String,
  //   city: String,
  //   state: String,
  //   zipcode: String,
  //   country: String
  // },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other'
    ]
  },
  averageRating: Number,
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add slug from bootcamp name
bootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Bootcamp', bootcampSchema);
