"use strict";

jest.mock("../../../../models", () => ({
  Child: { findByPk: jest.fn() },
}));
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const bcrypt = require("bcryptjs");
const { Child } = require("../../../../models");
const updatePassword = require("../../../../src/controllers/child/updatePassword");

const makeReq = (params = {}, body = {}) => ({ params, body });
const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const fakeChild = () => ({
  id: 10,
  password: "hashed_old",
  update: jest.fn().mockResolvedValue(true),
  toJSON: jest.fn().mockReturnValue({ id: 10, email: "c@c.com", password: "hashed_new" }),
});

beforeEach(() => jest.clearAllMocks());

describe("updatePassword", () => {
  describe("validation", () => {
    it("returns 400 when oldPassword is missing", async () => {
      const res = makeRes();
      await updatePassword(makeReq({ id: "10" }, { newPassword: "newpass123" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when newPassword is missing", async () => {
      const res = makeRes();
      await updatePassword(makeReq({ id: "10" }, { oldPassword: "oldpass" }), res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when newPassword is shorter than 6 characters", async () => {
      const res = makeRes();
      await updatePassword(
        makeReq({ id: "10" }, { oldPassword: "oldpass", newPassword: "abc" }),
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("business logic", () => {
    it("returns 404 when child not found", async () => {
      Child.findByPk.mockResolvedValue(null);
      const res = makeRes();
      await updatePassword(
        makeReq({ id: "99" }, { oldPassword: "oldpass", newPassword: "newpass123" }),
        res
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(Child.findByPk).toHaveBeenCalledWith("99");
    });

    it("returns 400 when old password is incorrect", async () => {
      Child.findByPk.mockResolvedValue(fakeChild());
      bcrypt.compare.mockResolvedValue(false);
      const res = makeRes();
      await updatePassword(
        makeReq({ id: "10" }, { oldPassword: "wrongold", newPassword: "newpass123" }),
        res
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it("updates password and returns 200 on success", async () => {
      const child = fakeChild();
      Child.findByPk.mockResolvedValue(child);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashed_new_pass");
      const res = makeRes();

      await updatePassword(
        makeReq({ id: "10" }, { oldPassword: "oldpass", newPassword: "newpass123" }),
        res
      );

      expect(bcrypt.hash).toHaveBeenCalledWith("newpass123", 10);
      expect(child.update).toHaveBeenCalledWith({ password: "hashed_new_pass" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("does not return password in the success response", async () => {
      const child = fakeChild();
      Child.findByPk.mockResolvedValue(child);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("hashed_new_pass");
      const res = makeRes();

      await updatePassword(
        makeReq({ id: "10" }, { oldPassword: "oldpass", newPassword: "newpass123" }),
        res
      );

      const { child: returned } = res.json.mock.calls[0][0];
      expect(returned).not.toHaveProperty("password");
    });
  });

  describe("error handling", () => {
    it("returns 500 on database error", async () => {
      Child.findByPk.mockRejectedValue(new Error("DB down"));
      const res = makeRes();
      await updatePassword(
        makeReq({ id: "10" }, { oldPassword: "oldpass", newPassword: "newpass123" }),
        res
      );
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
