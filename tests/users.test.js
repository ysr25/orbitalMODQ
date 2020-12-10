const UserModel = require("../models/user-model");
const users = require("../controllers/users");
const passport = require("../config/passport");

jest.mock("../models/user-model");
jest.mock("../config/passport");

let req;
let res;

beforeEach(() => {
  req = { query: {}, login: (user, next) => next(null, user) };
  res = { locals: {} };
});

afterEach(() => {
  req = {};
  res = {};
});

describe("signing up", () => {
  let testUser;

  beforeEach(() => {
    testUser = {
      username: "test",
      email: "test@test.com",
      password: "test",
    };

    UserModel.mockImplementation(() => {
      return {
        saveUser: (next) => next(null, testUser),
      };
    });
  });

  afterEach(() => {
    testUser = {};
  });

  it("creates new user successfully", (done) => {
    req.body = testUser;

    users.createUser(req, res, (err) => {
      if (err) return done(err);
      try {
        expect(res.locals.content).toEqual(testUser);
        expect(res.locals.msg).toEqual("Logged in successfully.");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("creates new user unsuccessfully (invalid email)", (done) => {
    testUser.email = "test";
    req.body = testUser;

    users.createUser(req, res, (err) => {
      try {
        expect(err.message).toEqual("Please enter a valid email address.");
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it("creates new user unsuccessfully (no password)", (done) => {
    testUser.password = "";
    req.body = testUser;

    users.createUser(req, res, (err) => {
      try {
        expect(err.message).toEqual("Password is required.");
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
