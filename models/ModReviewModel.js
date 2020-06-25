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
    ref: "User",
    default: [],
  }
});
modReviewSchema.index({ title: "text", content: "text" });
module.exports = mongoose.model("ModReview", modReviewSchema);
