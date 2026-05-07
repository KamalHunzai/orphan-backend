"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../../models", () => ({
  Admin: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Child: { findAll: jest.fn(), findOne: jest.fn() },
  SuperAdmin: { findOne: jest.fn() },
  VisitReport: { findAll: jest.fn() },
  Report: { findAll: jest.fn() },
  Activity: { findAll: jest.fn() },
  LearningMaterial: { findAll: jest.fn() },
  Notification: { findAll: jest.fn() },
  Task: { findAll: jest.fn() },
  VisitPlanning: { findAll: jest.fn() },
  Comment: { findAll: jest.fn() },
  Sequelize: {
    fn: jest.fn().mockReturnValue("COUNT(id)"),
    col: jest.fn().mockReturnValue("assigned_children.id"),
  },
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn(), hash: jest.fn() }));
jest.mock("../../src/middlewares/rateLimiter", () => {
  const pass = (req, res, next) => next();
  return { authLimiter: pass, otpLimiter: pass };
});
const passThroughMiddleware = (req, res, next) => next();
jest.mock("../../src/middlewares/Upload", () => ({
  single: jest.fn().mockReturnValue(passThroughMiddleware),
  fields: jest.fn().mockReturnValue(passThroughMiddleware),
  array: jest.fn().mockReturnValue(passThroughMiddleware),
}));
jest.mock("@sendgrid/mail", () => ({ setApiKey: jest.fn(), send: jest.fn() }));

const bcrypt = require("bcryptjs");
const { Admin } = require("../../models");
const app = require("../../app");

const SECRET = process.env.TOKEN_SECRET;

const adminToken = (id = 1) =>
  jwt.sign({ id, email: "admin@test.com", role: "admin" }, SECRET);
const superAdminToken = () =>
  jwt.sign({ id: 99, email: "super@test.com", role: "superadmin" }, SECRET);
const childToken = () =>
  jwt.sign({ id: 20, email: "child@test.com", role: "child" }, SECRET);

const fakeAdmin = {
  id: 1,
  email: "admin@test.com",
  password: "hashed",
  full_name: "Test Admin",
  country: "Pakistan",
  employment_type: "Full-time",
  years_of_experience: 5,
  preferred_age_group: "6-12",
  is_deleted: false,
};

beforeEach(() => jest.clearAllMocks());

// ── POST /admin/signin ────────────────────────────────────────────────────────

describe("POST /admin/signin", () => {
  it("returns 400 for empty body", async () => {
    const res = await request(app).post("/admin/signin").send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await request(app)
      .post("/admin/signin")
      .send({ email: "bad", password: "pass123" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when password < 6 chars", async () => {
    const res = await request(app)
      .post("/admin/signin")
      .send({ email: "a@b.com", password: "abc" });
    expect(res.status).toBe(400);
  });

  it("returns 401 when admin not found", async () => {
    Admin.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post("/admin/signin")
      .send({ email: "notfound@test.com", password: "pass123" });
    expect(res.status).toBe(401);
  });

  it("returns 401 when password is wrong", async () => {
    Admin.findOne.mockResolvedValue(fakeAdmin);
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app)
      .post("/admin/signin")
      .send({ email: "admin@test.com", password: "wrongpass" });
    expect(res.status).toBe(401);
  });

  it("returns 200 with token on successful sign-in", async () => {
    Admin.findOne.mockResolvedValue(fakeAdmin);
    bcrypt.compare.mockResolvedValue(true);
    const res = await request(app)
      .post("/admin/signin")
      .send({ email: "admin@test.com", password: "pass123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin).toBeDefined();
  });

  it("normalises email to lowercase before lookup", async () => {
    Admin.findOne.mockResolvedValue(null);
    await request(app)
      .post("/admin/signin")
      .send({ email: "ADMIN@TEST.COM", password: "pass123" });

    expect(Admin.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ email: "admin@test.com" }),
      })
    );
  });
});

// ── Protected route: GET /admin/getbyid/:id ───────────────────────────────────

describe("GET /admin/getbyid/:id", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/admin/getbyid/1");
    expect(res.status).toBe(401);
  });

  it("returns 401 for a malformed token", async () => {
    const res = await request(app)
      .get("/admin/getbyid/1")
      .set("accessToken", "garbage");
    expect(res.status).toBe(401);
  });

  it("returns 200 for valid admin token", async () => {
    Admin.findOne.mockResolvedValue(fakeAdmin);
    const res = await request(app)
      .get("/admin/getbyid/1")
      .set("accessToken", adminToken());
    expect(res.status).toBe(200);
  });
});

// ── DELETE /admin/deleteAdminById/:id ─────────────────────────────────────────

describe("DELETE /admin/deleteAdminById/:id", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).delete("/admin/deleteAdminById/1");
    expect(res.status).toBe(401);
  });

  it("returns 403 when child tries to delete admin", async () => {
    const res = await request(app)
      .delete("/admin/deleteAdminById/1")
      .set("accessToken", childToken());
    expect(res.status).toBe(403);
  });

  it("returns 403 when admin tries to delete another admin", async () => {
    const res = await request(app)
      .delete("/admin/deleteAdminById/1")
      .set("accessToken", adminToken());
    expect(res.status).toBe(403);
  });
});

// ── GET /admin/get-MentorsBy-Country ─────────────────────────────────────────

describe("GET /admin/get-MentorsBy-Country", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/admin/get-MentorsBy-Country");
    expect(res.status).toBe(401);
  });

  it("returns 403 when child tries to access", async () => {
    const res = await request(app)
      .get("/admin/get-MentorsBy-Country")
      .set("accessToken", childToken());
    expect(res.status).toBe(403);
  });

  it("returns 403 when admin (non-superadmin) tries to access", async () => {
    const res = await request(app)
      .get("/admin/get-MentorsBy-Country")
      .set("accessToken", adminToken());
    expect(res.status).toBe(403);
  });

  it("returns 400 when country query param is missing", async () => {
    const res = await request(app)
      .get("/admin/get-MentorsBy-Country")
      .set("accessToken", superAdminToken());
    expect(res.status).toBe(400);
  });

  it("returns 200 with country param for superadmin token", async () => {
    const mentorWithGet = {
      ...fakeAdmin,
      get: jest.fn().mockReturnValue(0),
    };
    Admin.findAll.mockResolvedValue([mentorWithGet]);
    const res = await request(app)
      .get("/admin/get-MentorsBy-Country?country=Pakistan")
      .set("accessToken", superAdminToken());
    expect(res.status).toBe(200);
  });
});

// ── GET /admin/getDashboardStats/:adminId ─────────────────────────────────────

describe("GET /admin/getDashboardStats/:adminId", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).get("/admin/getDashboardStats/1");
    expect(res.status).toBe(401);
  });

  it("returns 403 for child role", async () => {
    const res = await request(app)
      .get("/admin/getDashboardStats/1")
      .set("accessToken", childToken());
    expect(res.status).toBe(403);
  });
});
