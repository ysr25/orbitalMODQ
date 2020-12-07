const mongoose = require("mongoose");
const moduleList = require("./module-list");
const sanitize = require("./utils").sanitize;

const ReviewSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    votes: {
      type: Number,
      default: 0,
    },
    editedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ReviewSchema.index({ title: "text", content: "text" });

ReviewSchema.virtual("displayedAuthor").get(function () {
  return this.anonymous || !this.author ? "Anonymous" : this.author.username;
});

ReviewSchema.pre("find", function (next) {
  this.populate("author", "username");
  next();
});

ReviewSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.content = sanitize(this.content);
  }
  if (
    this.isModified("title") ||
    this.isModified("content") ||
    this.isModified("moduleCode")
  ) {
    this.editedAt = Date.now();
  }
  return next();
});

ReviewSchema.methods.updateVotes = function (
  direction,
  newArray,
  newVotes,
  next
) {
  this[direction] = newArray;
  this.votes = newVotes;
  this.save(function (err, review) {
    if (err) return next(err);
    return next(null, review);
  });
};

ReviewSchema.statics.findAndSort = function (findOptions, sort, filter, next) {
  sort = sort || "-createdAt";
  let options;
  if (filter) {
    options = { ...findOptions, moduleCode: { $eq: filter } };
  } else {
    options = findOptions;
  }

  return this.find(options)
    .sort(sort)
    .exec((err, result) => {
      if (err) return next(err);
      next(null, result);
    });
};

module.exports = mongoose.model("Review", ReviewSchema);
