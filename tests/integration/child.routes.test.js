"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

// ── Mock all DB models before app loads ────────────────────────────────────────
jest.mock("../../models", () => ({
  Child: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  Admin: { findOne: jest.fn(), findByPk: jest.fn() },
  Notification: { create: jest.fn() },
  Report: { findAll: jest.fn() },
  Activity: { findAll: jest.fn() },
  VisitReport: { findAll: jest.fn() },
  SuperAdmin: { findOne: jest.fn() },
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
jest.mock("../../src/utils/emailUtilchild", () => jest.fn());

const bcrypt = require("bcryptjs");
const { Child, Notification } = require("../../models");
const sendEmail = require("../../src/utils/emailUtilchild");

// Load app AFTER mocks
const app = require("../../app");

const SECRET = process.env.TOKEN_SECRET;

const adminToken = () =>
  jwt.sign({ id: 1, email: "admin@test.com", role: "admin" }, SECRET);
const childToken = (id = 20) =>
  jwt.sign({ id, email: "child@test.com", role: "child" }, SECRET);

const fakeChildRecord = {
  id: 20,
  email: "child@test.com",
  password: "hashed",
  first_name: "Ali",
  last_name: "Khan",
  is_deleted: false,
  toJSON: () => ({
    id: 20,
    email: "child@test.com",
    first_name: "Ali",
    last_name: "Khan",
  }),
};

beforeEach(() => jest.clearAllMocks());

// ── POST /child/login ─────────────────────────────────────────────────────────

describe("POST /child/login", () => {
  it("returns 400 when body is empty", async () => {
    const res = await request(app).post("/child/login").send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is missing", async () => {
    const res = await request(app)
      .post("/child/login")
      .send({ email: "a@b.com" });
    expect(res.status).toBe(400);
  });

  it("returns 401 when child not found", async () => {
    Child.findOne.mockResolvedValue(null);
    const res = await request(app)
      .post("/child/login")
      .send({ email: "x@x.com", password: "pass" });
    expect(res.status).toBe(401);
  });

  it("returns 401 when password is wrong", async () => {
    Child.findOne.mockResolvedValue(fakeChildRecord);
    bcrypt.compare.mockResolvedValue(false);
    const res = await request(app)
      .post("/child/login")
      .send({ email: "child@test.com", password: "wrong" });
    expect(res.status).toBe(401);
  });

  it("returns 200 with token on valid credentials", async () => {
    Child.findOne.mockResolvedValue(fakeChildRecord);
    bcrypt.compare.mockResolvedValue(true);
    const res = await request(app)
      .post("/child/login")
      .send({ email: "child@test.com", password: "correct" });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.child).toBeDefined();
  });

  it("does not expose password in login response", async () => {
    Child.findOne.mockResolvedValue(fakeChildRecord);
    bcrypt.compare.mockResolvedValue(true);
    const res = await request(app)
      .post("/child/login")
      .send({ email: "child@test.com", password: "correct" });
    expect(res.body.child?.password).toBeUndefined();
    expect(JSON.stringify(res.body)).not.toContain("hashed");
  });
});

// ── GET /child/allchildren ────────────────────────────────────────────────────

describe("GET /child/allchildren", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).get("/child/allchildren");
    expect(res.status).toBe(401);
  });

  it("returns 403 when token is for child role", async () => {
    const res = await request(app)
      .get("/child/allchildren")
      .set("accessToken", childToken());
    expect(res.status).toBe(403);
  });

  it("returns 403 when token is for superadmin role", async () => {
    const token = jwt.sign({ id: 1, role: "superadmin" }, SECRET);
    const res = await request(app)
      .get("/child/allchildren")
      .set("accessToken", token);
    expect(res.status).toBe(403);
  });

  it("returns 200 for admin token", async () => {
    const { Child: C } = require("../../models");
    C.findAndCountAll.mockResolvedValue({ rows: [fakeChildRecord], count: 1 });
    const res = await request(app)
      .get("/child/allchildren")
      .set("accessToken", adminToken());
    expect(res.status).toBe(200);
  });
});

// ── GET /child/getbyid/:id ────────────────────────────────────────────────────

describe("GET /child/getbyid/:id", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).get("/child/getbyid/20");
    expect(res.status).toBe(401);
  });

  it("returns 200 for admin token", async () => {
    const plain = { id: 20, first_name: "Ali", last_name: "Khan", email: "c@t.com" };
    Child.findByPk.mockResolvedValue({ get: jest.fn().mockReturnValue(plain) });
    const res = await request(app)
      .get("/child/getbyid/20")
      .set("accessToken", adminToken());
    expect(res.status).toBe(200);
  });
});

// ── DELETE /child/deleteChild/:id ─────────────────────────────────────────────

describe("DELETE /child/deleteChild/:id", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).delete("/child/deleteChild/20");
    expect(res.status).toBe(401);
  });

  it("returns 403 when token is for child role", async () => {
    const res = await request(app)
      .delete("/child/deleteChild/20")
      .set("accessToken", childToken());
    expect(res.status).toBe(403);
  });

  it("requires admin role", async () => {
    const superToken = jwt.sign({ id: 1, role: "superadmin" }, SECRET);
    const res = await request(app)
      .delete("/child/deleteChild/20")
      .set("accessToken", superToken);
    expect(res.status).toBe(403);
  });
});

// ── PUT /child/updatePassword/:id ─────────────────────────────────────────────

describe("PUT /child/updatePassword/:id", () => {
  it("returns 401 when no token is provided", async () => {
    const res = await request(app).put("/child/updatePassword/20").send({});
    expect(res.status).toBe(401);
  });

  it("returns 403 when token is for admin role", async () => {
    const res = await request(app)
      .put("/child/updatePassword/20")
      .set("accessToken", adminToken())
      .send({ oldPassword: "old", newPassword: "new123" });
    expect(res.status).toBe(403);
  });

  it("returns 400 for missing body fields", async () => {
    const res = await request(app)
      .put("/child/updatePassword/20")
      .set("accessToken", childToken())
      .send({});
    expect(res.status).toBe(400);
  });
});

// ── GET /child/getNotificationsByChild/:childId ───────────────────────────────

describe("GET /child/getNotificationsByChild/:id", () => {
  it("returns 401 when unauthenticated", async () => {
    const res = await request(app).get("/child/getNotificationsByChild/20");
    expect(res.status).toBe(401);
  });

  it("returns 403 when admin tries to access", async () => {
    const res = await request(app)
      .get("/child/getNotificationsByChild/20")
      .set("accessToken", adminToken());
    expect(res.status).toBe(403);
  });
});
