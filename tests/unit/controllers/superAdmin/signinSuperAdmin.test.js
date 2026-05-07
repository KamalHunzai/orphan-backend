"use strict";

jest.mock("../../../../models", () => ({
  SuperAdmin: { findOne: jest.fn() },
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn() }));

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SuperAdmin } = require("../../../../models");
const signinSuperAdmin = require("../../../../src/controllers/superAdmin/signinSuperAdmin");

const makeReq = (body = {}) => ({ body });
const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const fakeSuperAdmin = {
  id: 5,
  email: "super@admin.com",
  password: "hashed",
  full_name: "Super Admin",
  role: "superadmin",
  county: "Pakistan",
  number: "03001234567",
};

beforeEach(() => jest.clearAllMocks());

describe("signinSuperAdmin", () => {
  describe("Joi validation", () => {
    it("returns 400 when email is missing", async () => {
      const res = makeRes();
      await signinSuperAdmin(makeReq({ password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it("returns 400 when email format is invalid", async () => {
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "bad-email", password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when password is missing", async () => {
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "a@b.com" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("authentication logic", () => {
    it("returns 401 when superadmin not found", async () => {
      SuperAdmin.findOne.mockResolvedValue(null);
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "x@x.com", password: "pass123" }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("queries with lowercase email and is_deleted=false", async () => {
      SuperAdmin.findOne.mockResolvedValue(null);
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "SUPER@ADMIN.COM", password: "pass" }), res);
      expect(SuperAdmin.findOne).toHaveBeenCalledWith({
        where: { email: "super@admin.com", is_deleted: false },
      });
    });

    it("returns 401 when password does not match", async () => {
      SuperAdmin.findOne.mockResolvedValue(fakeSuperAdmin);
      bcrypt.compare.mockResolvedValue(false);
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "super@admin.com", password: "wrong" }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 200 with token and superAdmin data on success", async () => {
      SuperAdmin.findOne.mockResolvedValue(fakeSuperAdmin);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "super@admin.com", password: "correct" }), res);

      expect(res.status).toHaveBeenCalledWith(200);
      const payload = res.json.mock.calls[0][0];
      expect(payload.success).toBe(true);
      expect(payload.token).toBeDefined();
      expect(payload.superAdmin).toBeDefined();
    });

    it("token has role=superadmin", async () => {
      SuperAdmin.findOne.mockResolvedValue(fakeSuperAdmin);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "super@admin.com", password: "correct" }), res);

      const { token } = res.json.mock.calls[0][0];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      expect(decoded.role).toBe("superadmin");
      expect(decoded.id).toBe(5);
    });

    it("does not expose password in response", async () => {
      SuperAdmin.findOne.mockResolvedValue(fakeSuperAdmin);
      bcrypt.compare.mockResolvedValue(true);
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "super@admin.com", password: "correct" }), res);

      const body = res.json.mock.calls[0][0];
      expect(JSON.stringify(body)).not.toContain("hashed");
    });
  });

  describe("error handling", () => {
    it("returns 500 on database error", async () => {
      SuperAdmin.findOne.mockRejectedValue(new Error("DB crash"));
      const res = makeRes();
      await signinSuperAdmin(makeReq({ email: "a@b.com", password: "pass" }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
