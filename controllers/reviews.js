const Review = require("../models/review-model");
const Comment = require("../models/comment-model");

exports.getAllReviews = (req, res, next) => {
  Review.findAndSort({}, req.query.sort, req.query.filter, (err, reviews) => {
    if (err) return next(err);
    res.locals.content = reviews;
    next();
  });
};

exports.getOneReview = (req, res, next) => {
  Review.findById(req.params.reviewId).exec((err, review) => {
    if (err) return next(err);
    res.locals.content = review;
    next();
  });
};

exports.getComments = (req, res, next) => {
  Comment.find({ reviewId: req.params.reviewId })
    .sort("-createdAt")
    .populate("author", "username")
    .exec((err, comments) => {
      if (err) return next(err);
      res.locals.content = comments;
      next();
    });
};

exports.postComment = (req, res, next) => {
  const newComment = new Comment({
    content: req.body.content,
    author: req.user._id,
    reviewId: req.params.reviewId,
  });

  newComment.save((err, result) => {
    if (err) return next(err);
    res.locals.msg = "New comment added successfully.";
    res.locals.content = result;
    next();
  });
};

exports.postReview = (req, res, next) => {
  const newPost = new Review({
    title: req.body.title,
    content: req.body.content,
    moduleCode: req.body.moduleCode,
  });
  if (req.user) {
    newPost.author = req.user._id;
    newPost.anonymous = req.body.anonymous;
  } else if (req.body.anonymous) {
    newPost.anonymous = true;
  } else {
    const error = new Error("Please log in or choose to post anonymously.");
    error.status = 403;
    return next(error);
  }
  newPost.save((err, result) => {
    if (err) return next(err);
    res.locals.msg = "Module review created successfully.";
    res.locals.content = result._id;
    next();
  });
};

exports.checkIfAuthor = (req, res, next) => {
  if (!req.user) {
    res.locals.isAuthor = false;
    return next();
  }
  const review = res.locals.content;
  if (!review.author) {
    res.locals.isAuthor = false;
    return next();
  }
  res.locals.isAuthor = String(review.author._id) === String(req.user._id);
  next();
};

exports.checkVotes = (req, res, next) => {
  if (!req.user) {
    res.locals.isUpvoted = false;
    res.locals.isDownvoted = false;
    return next();
  }
  const review = res.locals.content;
  res.locals.isUpvoted = review.upvotes.includes(req.user._id);
  res.locals.isDownvoted = review.downvotes.includes(req.user._id);
  next();
};

exports.editReview = (req, res, next) => {
  Review.findById(req.params.reviewId, (err, review) => {
    if (err) return next(err);
    if (String(review.author) !== String(req.user._id)) {
      const error = new Error("You can only edit your own post.");
      error.status = 403;
      return next(error);
    }
    for (const field in req.body) {
      review[field] = req.body[field];
    }
    review.save((err, result) => {
      if (err) return next(err);
      res.locals.msg = "Module review updated successfully.";
      res.locals.content = result;
      next();
    });
  });
};

exports.deleteReview = (req, res, next) => {
  Review.findById(req.params.reviewId, (err, review) => {
    if (err) return next(err);
    if (String(review.author) !== String(req.user._id)) {
      const error = new Error("You can only delete your own post.");
      error.status = 403;
      next(error);
    }
    Review.findByIdAndDelete(req.params.reviewId, (err, result) => {
      if (err) return next(err);
      res.locals.msg = "Module review deleted successfully.";
      res.locals.content = result;
      next();
    });
  });
};

exports.searchReviews = (req, res, next) => {
  // Reused from https://stackoverflow.com/a/41919138 with minor modifications
  const mergeReviews = (arr1, arr2) => {
    return arr1
      .filter(
        (rev1) => !arr2.find((rev2) => String(rev1._id) === String(rev2._id))
      )
      .concat(arr2);
  };

  const sortReviews = (reviews, sort) => {
    const isAsc = sort.charAt(0) !== "-";
    const field = isAsc ? sort : sort.substring(1);
    const comparator = (rev1, rev2) =>
      isAsc ? rev1[field] - rev2[field] : rev2[field] - rev1[field];
    return reviews.sort(comparator);
  };

  // Full search using text indexes
  Review.findAndSort(
    {
      $text: { $search: req.query.q },
    },
    req.query.sort,
    req.query.filter,
    (err, reviews) => {
      if (err) return next(err);
      // Partial search on last word only
      const keywords = req.query.q.split(" ");
      const lastWord = keywords[keywords.length - 1];
      res.locals.query = Review.findAndSort(
        {
          $or: [
            { title: { $regex: lastWord, $options: "i" } },
            { content: { $regex: lastWord, $options: "i" } },
          ],
        },
        req.query.sort,
        req.query.filter,
        (err, result) => {
          if (err) return next(err);
          res.locals.content = sortReviews(
            mergeReviews(reviews, result),
            req.query.sort
          );
          next();
        }
      );
    }
  );
};

exports.vote = (req, res, next) => {
  Review.findById(req.params.reviewId, (err, review) => {
    if (err) return next(err);

    const oldVoteArray = review[res.locals.vote];
    const oldVotes = review.votes;
    const isUpvote = res.locals.vote === "upvotes";
    const voteType = isUpvote ? "upvote" : "downvote";
    let newVoteArray;
    let newVotes;
    let message;

    if (oldVoteArray.includes(req.user._id)) {
      // Take back up/downvote
      newVoteArray = oldVoteArray.filter(
        (item) => String(item) !== String(req.user._id)
      );
      newVotes = isUpvote ? oldVotes - 1 : oldVotes + 1;
      message = `Module review ${voteType} removed.`;
    } else {
      // Up/downvote
      newVoteArray = oldVoteArray.slice();
      newVoteArray.push(req.user._id);
      newVotes = isUpvote ? oldVotes + 1 : oldVotes - 1;
      message = `Module review ${voteType} added.`;
    }

    review.updateVotes(
      res.locals.vote,
      newVoteArray,
      newVotes,
      (err, result) => {
        if (err) return next(err);
        res.locals.msg = message;
        res.locals.content = result;
        next();
      }
    );
  });
};
