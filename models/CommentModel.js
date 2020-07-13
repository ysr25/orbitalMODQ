const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CommentsSchema = new Schema({
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
  },
  content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
  }
});

module.exports = mongoose.model('Comment', CommentsSchema);
