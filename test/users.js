const sinon = require("sinon")
const chai = require("chai")
const expect = chai.expect
const httpMocks = require("node-mocks-http")
const app = require("../app")
const User = require("../models/UserModel")
const userController = require("../controllers/userController")

afterEach(function() {
  sinon.restore()
})

it("get request to /api/users", async function() {
  const req = httpMocks.createRequest({
    method: "GET",
    url: "/api/users",
  })
  const res = httpMocks.createResponse()

  await userController.checkIfLoggedIn(req, res, () => {})
  expect(res.statusCode).to.equal(200)
  expect(res._getJSONData().content).to.equal(null)
})

describe("post request to /api/users/signup", function() {
  it("create new user successfully", async function() {
    const testUser = { username: "test", email: "test@test.com", password: "test" }
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/users/signup",
      body: testUser,
      login: (user, next) => next(),
    })
    const res = httpMocks.createResponse()
    const stub = sinon.stub(User, "create").resolves(testUser)

    await userController.postUser(req, res, () => {})
    expect(res.statusCode).to.equal(200)
  })

  it("create new user unsuccessfully (invalid email)", async function() {
    const testUser = { username: "test", email: "test", password: "test" }
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/users/signup",
      body: testUser,
    })
    const res = httpMocks.createResponse()
    const stub = sinon.stub(User, "create").resolves(testUser)

    await userController.postUser(req, res, () => {})
    expect(res.statusCode).to.equal(400)
  })

  it("create new user unsuccessfully (no password)", async function() {
    const testUser = { username: "test", email: "test@test.com", password: "" }
    const req = httpMocks.createRequest({
      method: "GET",
      url: "/api/users/signup",
      body: testUser,
    })
    const res = httpMocks.createResponse()
    const stub = sinon.stub(User, "create").resolves(testUser)

    await userController.postUser(req, res, () => {})
    expect(res.statusCode).to.equal(400)
  })
})