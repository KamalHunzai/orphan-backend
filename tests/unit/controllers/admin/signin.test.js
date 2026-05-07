"use strict";

jest.mock("../../../../models", () => ({
  Admin: { findOne: jest.fn() },
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn() }));

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../../../../models");
const signin = require("../../../../src/controllers/admin/signin");

const makeReq = (body = {}) => ({ body });
const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const fakeAdmin = {
  id: 1,
  email: "admin@test.com",
  password: "hashed",
  full_name: "Test Admin",
  country: "Pakistan",
  employment_type: "Full-time",
  years_of_experience: 5,
  preferred_age_group: "6-12",
};

beforeEach(() => jest.clearAllMocks());

describe("admin signin", () => {
  describe("Joi validation", () => {
    it("returns 400 when email is not provided", async () => {
      const res = makeRes();
      await signin(makeReq({ password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when email format is invalid", async () => {
      const res = makeRes();
      await signin(makeReq({ email: "not-an-email", password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when password is shorter than 6 characters", async () => {
      const res = makeRes();
      await signin(makeReq({ email: "a@b.com", password: "abc" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when password is missing", async () => {
      const res = makeRes();
      await signin(makeReq({ email: "a@b.com" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("authentication logic", () => {
    it("returns 401 when admin is not found", async () => {
      Admin.findOne.mockResolvedValue(null);
      const res = makeRes();
      await signin(makeReq({ email: "notfound@test.com", password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("queries with lowercase email and is_deleted=false", async () => {
      Admin.findOne.mockResolvedValue(null);
      const res = makeRes();
      await signin(makeReq({ email: "ADMIN@TEST.COM", password: "pass123" }), res);
      expect(Admin.findOne).toHaveBeenCalledWith({
        where: { email: "admin@test.com", is_deleted: false },
      });
    });

    it("returns 401 when password does not match", async () => {
      Admin.findOne.mockResolvedValue(fakeAdmin);
      bcrypt.compare.mockResolvedValue(false);
      const res = makeRes();
      await signin(makeReq({ email: "admin@test.com", password: "wrongpass" }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 200 with token and admin data on success", async () => {
      Admin.findOne.mockResolvedValue(fakeAdmin);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await signin(makeReq({ email: "admin@test.com", password: "pass123" }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      const payload = res.json.mock.calls[0][0];
      expect(payload.token).toBeDefined();
      expect(payload.admin).toBeDefined();
    });

    it("token has role=admin", async () => {
      Admin.findOne.mockResolvedValue(fakeAdmin);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await signin(makeReq({ email: "admin@test.com", password: "pass123" }), res);

      const { token } = res.json.mock.calls[0][0];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      expect(decoded.role).toBe("admin");
      expect(decoded.id).toBe(1);
    });

    it("does not return password in the response", async () => {
      Admin.findOne.mockResolvedValue(fakeAdmin);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await signin(makeReq({ email: "admin@test.com", password: "pass123" }), res);

      const { admin } = res.json.mock.calls[0][0];
      expect(admin).not.toHaveProperty("password");
    });
  });

  describe("error handling", () => {
    it("returns 500 on unexpected error", async () => {
      Admin.findOne.mockRejectedValue(new Error("Connection refused"));
      const res = makeRes();
      await signin(makeReq({ email: "a@b.com", password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
