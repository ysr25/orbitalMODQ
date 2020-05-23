const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let moduleList = ['CS1101S', 'CS1231']; // etc...

let modReviewSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  datePosted: {
    type: Date, 
    default: Date.now
  },
  dateEdited: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  content: {
    type: String, 
    required: true,
    trim: true
  },
  moduleCode: {
    type: String, 
    required: true,
    enum: moduleList // drop-down list?
  }
});

module.exports = mongoose.model('ModReview', modReviewSchema);