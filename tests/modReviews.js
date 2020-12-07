const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const httpMocks = require("node-mocks-http");
const app = require("../app");
const ModReview = require("../models/ModReviewModel");
const modReviewController = require("../controllers/modReviewController");

afterEach(function () {
  sinon.restore();
});

it("get request to /api/modReviews/view/all", async function () {
  const testPosts = [
    { title: "test", content: "test", author: "test" },
    { title: "test", content: "test", author: "test" },
  ];
  const req = httpMocks.createRequest({
    method: "GET",
    url: "/api/modReviews/view/all",
  });
  const res = httpMocks.createResponse();
  const stub = sinon.stub(ModReview, "find").returns({
    populate: sinon.stub().resolves(testPosts),
  });

  await modReviewController.getAllReviews(req, res, () => {});
  expect(res.statusCode).to.equal(200);
  expect(res._getJSONData().content).to.deep.equal(testPosts);
});

describe("post request to /api/modReviews/newPost", function () {
  it("create new post successfully (anonymous)", async function () {
    const testPost = {
      moduleCode: "ACC1002",
      title: "test",
      content: "test",
      anonymous: "true",
    };
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/modReviews/newPost",
      body: testPost,
    });
    const res = httpMocks.createResponse();
    const stub = sinon.stub(ModReview, "create").resolves(testPost);

    await modReviewController.postReview(req, res, () => {});
    expect(res.statusCode).to.equal(200);
  });

  it("create new post unsuccessfully (no title)", async function () {
    const testPost = {
      moduleCode: "ACC1002",
      title: "",
      content: "test",
      anonymous: "true",
    };
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/modReviews/newPost",
      body: testPost,
    });
    const res = httpMocks.createResponse();
    const stub = sinon.stub(ModReview, "create").resolves(testPost);

    await modReviewController.postReview(req, res, () => {});
    expect(res.statusCode).to.equal(400);
  });

  it("create new post unsuccessfully (not logged in and not posting anonymously)", async function () {
    const testPost = { moduleCode: "ACC1002", title: "test", content: "test" };
    const req = httpMocks.createRequest({
      method: "POST",
      url: "/api/modReviews/newPost",
      body: testPost,
    });
    const res = httpMocks.createResponse();
    const stub = sinon.stub(ModReview, "create").resolves(testPost);

    await modReviewController.postReview(req, res, () => {});
    expect(res.statusCode).to.equal(403);
  });
});
