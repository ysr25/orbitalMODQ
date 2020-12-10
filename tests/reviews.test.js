const reviews = require("../controllers/reviews");
const ReviewModel = require("../models/review-model");

jest.mock("../models/review-model");

let req;
let res;

beforeEach(() => {
  req = { query: {} };
  res = { locals: {} };
});

afterEach(() => {
  req = {};
  res = {};
});

it("gets all reviews", (done) => {
  const testReviews = [
    { title: "test", content: "test", author: "test" },
    { title: "test", content: "test", author: "test" },
  ];

  ReviewModel.findAndSort.mockImplementation((opts, sort, filter, next) =>
    next(null, testReviews)
  );

  reviews.getAllReviews(req, res, (err) => {
    if (err) return done(err);
    try {
      expect(res.locals.content).toEqual(testReviews);
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("create new review", function () {
  let testReview;

  beforeEach(() => {
    testReview = {
      _id: 1,
      moduleCode: "ACC1002",
      title: "test",
      content: "test",
      anonymous: "true",
    };

    ReviewModel.mockImplementation(() => {
      return {
        save: (next) => next(null, testReview),
      };
    });
  });

  afterEach(() => {
    testReview = {};
  });

  it("creates new review successfully (anonymous)", (done) => {
    req.body = testReview;

    reviews.postReview(req, res, (err) => {
      if (err) return done(err);
      try {
        expect(res.locals.content).toEqual(testReview._id);
        expect(res.locals.msg).toEqual("Module review created successfully.");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("creates new review successfully (logged in)", (done) => {
    testReview.anonymous = false;
    req.body = testReview;
    req.user = { _id: 1 };

    reviews.postReview(req, res, (err) => {
      if (err) return done(err);
      try {
        expect(res.locals.content).toEqual(testReview._id);
        expect(res.locals.msg).toEqual("Module review created successfully.");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("creates new review unsuccessfully (not logged in and not anonymous)", (done) => {
    testReview.anonymous = false;
    req.body = testReview;

    reviews.postReview(req, res, (err) => {
      try {
        expect(err.message).toEqual(
          "Please log in or choose to post anonymously."
        );
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
