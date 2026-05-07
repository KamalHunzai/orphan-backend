"use strict";

const jwt = require("jsonwebtoken");
const {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  requireChild,
  requireAdminOrSuperAdmin,
} = require("../../../src/middlewares/auth");

const SECRET = process.env.TOKEN_SECRET;

const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

// ─── authenticate ────────────────────────────────────────────────────────────

describe("authenticate", () => {
  it("returns 401 when no token is provided", () => {
    const req = { header: jest.fn().mockReturnValue(null) };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is malformed", () => {
    const req = { header: jest.fn().mockReturnValue("not-a-jwt") };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is expired", () => {
    const expired = jwt.sign({ id: 1, role: "admin" }, SECRET, {
      expiresIn: "-1s",
    });
    const req = { header: jest.fn().mockReturnValue(expired) };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token is signed with wrong secret", () => {
    const bad = jwt.sign({ id: 1, role: "admin" }, "wrong-secret");
    const req = { header: jest.fn().mockReturnValue(bad) };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and attaches user for a valid token", () => {
    const token = jwt.sign(
      { id: 42, email: "test@example.com", role: "admin" },
      SECRET
    );
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toEqual({ id: 42, email: "test@example.com", role: "admin" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("attaches correct role to req.user", () => {
    const token = jwt.sign({ id: 5, email: "child@x.com", role: "child" }, SECRET);
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = makeRes();
    const next = jest.fn();

    authenticate(req, res, next);

    expect(req.user.role).toBe("child");
  });
});

// ─── requireAdmin ─────────────────────────────────────────────────────────────

describe("requireAdmin", () => {
  it("calls next when role is admin", () => {
    const req = { user: { role: "admin" } };
    const next = jest.fn();
    requireAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when role is superadmin", () => {
    const req = { user: { role: "superadmin" } };
    const res = makeRes();
    requireAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 when role is child", () => {
    const req = { user: { role: "child" } };
    const res = makeRes();
    requireAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 when user is undefined", () => {
    const req = {};
    const res = makeRes();
    requireAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

// ─── requireSuperAdmin ────────────────────────────────────────────────────────

describe("requireSuperAdmin", () => {
  it("calls next when role is superadmin", () => {
    const req = { user: { role: "superadmin" } };
    const next = jest.fn();
    requireSuperAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when role is admin", () => {
    const req = { user: { role: "admin" } };
    const res = makeRes();
    requireSuperAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 when role is child", () => {
    const req = { user: { role: "child" } };
    const res = makeRes();
    requireSuperAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

// ─── requireChild ─────────────────────────────────────────────────────────────

describe("requireChild", () => {
  it("calls next when role is child", () => {
    const req = { user: { role: "child" } };
    const next = jest.fn();
    requireChild(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 when role is admin", () => {
    const req = { user: { role: "admin" } };
    const res = makeRes();
    requireChild(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 when role is superadmin", () => {
    const req = { user: { role: "superadmin" } };
    const res = makeRes();
    requireChild(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});

// ─── requireAdminOrSuperAdmin ─────────────────────────────────────────────────

describe("requireAdminOrSuperAdmin", () => {
  it("calls next for admin role", () => {
    const req = { user: { role: "admin" } };
    const next = jest.fn();
    requireAdminOrSuperAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("calls next for superadmin role", () => {
    const req = { user: { role: "superadmin" } };
    const next = jest.fn();
    requireAdminOrSuperAdmin(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it("returns 403 for child role", () => {
    const req = { user: { role: "child" } };
    const res = makeRes();
    requireAdminOrSuperAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("returns 403 when user is undefined", () => {
    const req = {};
    const res = makeRes();
    requireAdminOrSuperAdmin(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
