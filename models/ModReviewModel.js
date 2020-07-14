const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moduleList = require("./ModuleList");

let modReviewSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  dateEdited: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  moduleCode: {
    type: String,
    required: true,
    enum: moduleList,
  },
  anonymous: {
    type: Boolean,
    required: true,
  },
  upvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  downvotes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});

modReviewSchema.index({ title: "text", content: "text" });

modReviewSchema.virtual("votes").get(function() {
  return this.upvotes.length - this.downvotes.length;
})

modReviewSchema.methods.updateUpvotes = function(newArray, next) {
  return mongoose.model("ModReview").findOneAndUpdate(
    { _id: this._id }, 
    { upvotes: newArray }, 
    { new: true, useFindAndModify: false },
    next
  )
}

modReviewSchema.methods.updateDownvotes = function(newArray, next) {
  return mongoose.model("ModReview").findOneAndUpdate(
    { _id: this._id }, 
    { downvotes: newArray }, 
    { new: true, useFindAndModify: false },
    next
  )
}


module.exports = mongoose.model("ModReview", modReviewSchema);
