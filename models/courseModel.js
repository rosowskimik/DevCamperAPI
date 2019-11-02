const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [250, 'Description cannot exceed 250 characters']
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks']
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition'],
    min: [0, 'Tuition cannot be less than 0']
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Static for calculating bootcamp's average courses tuition
courseSchema.statics.getAverageCost = async function(bootcampId) {
  const [obj] = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj.averageCost / 10) * 10
    });
  } catch (err) {
    console.error(err);
  }
};

courseSchema.pre('remove', async function(next) {
  await this.constructor.getAverageCost(this.bootcamp);
  next();
});
courseSchema.post('save', async function() {
  await this.constructor.getAverageCost(this.bootcamp);
});
courseSchema.post('findOneAndUpdate', async function(doc) {
  await this.model.getAverageCost(doc.bootcamp);
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
