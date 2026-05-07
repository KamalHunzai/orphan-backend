"use strict";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../../../models", () => ({
  Child: { findOne: jest.fn() },
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn() }));

const { Child } = require("../../../../models");
const login_child = require("../../../../src/controllers/child/loginChild");

const makeReq = (body = {}) => ({ body });
const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const fakeChild = {
  id: 1,
  email: "child@test.com",
  password: "hashed",
  is_deleted: false,
  first_name: "Ali",
  last_name: "Khan",
  profile_picture: null,
  toJSON: jest.fn().mockReturnValue({
    id: 1,
    email: "child@test.com",
    password: "hashed",
    first_name: "Ali",
    last_name: "Khan",
  }),
};

beforeEach(() => jest.clearAllMocks());

describe("loginChild", () => {
  describe("input validation", () => {
    it("returns 400 when email is missing", async () => {
      const res = makeRes();
      await login_child(makeReq({ password: "pass" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it("returns 400 when password is missing", async () => {
      const res = makeRes();
      await login_child(makeReq({ email: "a@b.com" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when body is empty", async () => {
      const res = makeRes();
      await login_child(makeReq({}), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("authentication logic", () => {
    it("returns 401 when child is not found", async () => {
      Child.findOne.mockResolvedValue(null);
      const res = makeRes();
      await login_child(makeReq({ email: "x@x.com", password: "pass" }), res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(Child.findOne).toHaveBeenCalledWith({
        where: { email: "x@x.com", is_deleted: false },
      });
    });

    it("returns 401 when password does not match", async () => {
      Child.findOne.mockResolvedValue(fakeChild);
      bcrypt.compare.mockResolvedValue(false);
      const res = makeRes();
      await login_child(makeReq({ email: "child@test.com", password: "wrong" }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 200 with token and child data on success", async () => {
      Child.findOne.mockResolvedValue(fakeChild);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await login_child(makeReq({ email: "child@test.com", password: "correct" }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      const payload = res.json.mock.calls[0][0];
      expect(payload.success).toBe(true);
      expect(payload.token).toBeDefined();
      expect(payload.child).toBeDefined();
      expect(payload.child.password).toBeUndefined();
    });

    it("token contains id, email, and role=child", async () => {
      Child.findOne.mockResolvedValue(fakeChild);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await login_child(makeReq({ email: "child@test.com", password: "correct" }), res);

      const { token } = res.json.mock.calls[0][0];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      expect(decoded.role).toBe("child");
      expect(decoded.id).toBe(1);
    });

    it("does not return password in the response", async () => {
      Child.findOne.mockResolvedValue(fakeChild);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await login_child(makeReq({ email: "child@test.com", password: "correct" }), res);

      const { child } = res.json.mock.calls[0][0];
      expect(child).not.toHaveProperty("password");
    });
  });

  describe("error handling", () => {
    it("returns 500 on unexpected database error", async () => {
      Child.findOne.mockRejectedValue(new Error("DB failure"));
      const res = makeRes();
      await login_child(makeReq({ email: "a@b.com", password: "pass" }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
