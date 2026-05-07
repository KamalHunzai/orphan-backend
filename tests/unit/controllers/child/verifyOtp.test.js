"use strict";

jest.mock("../../../../models", () => ({
  Child: { findOne: jest.fn() },
}));

const { Child } = require("../../../../models");
const verifyOtp = require("../../../../src/controllers/child/verifyOtp");

const makeReq = (body = {}) => ({ body });
const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const validExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
const expiredDate = new Date(Date.now() - 1000).toISOString();

beforeEach(() => jest.clearAllMocks());

describe("verifyOtp (child)", () => {
  it("returns 400 when email is missing", async () => {
    const res = makeRes();
    await verifyOtp(makeReq({ otp: "1234" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 400 when otp is missing", async () => {
    const res = makeRes();
    await verifyOtp(makeReq({ email: "a@b.com" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when child not found", async () => {
    Child.findOne.mockResolvedValue(null);
    const res = makeRes();
    await verifyOtp(makeReq({ email: "x@x.com", otp: "1234" }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("returns 400 when OTP does not match", async () => {
    Child.findOne.mockResolvedValue({ otp: 5678, otp_expiry: validExpiry });
    const res = makeRes();
    await verifyOtp(makeReq({ email: "a@b.com", otp: "1234" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Invalid OTP." })
    );
  });

  it("returns 400 when OTP has expired", async () => {
    Child.findOne.mockResolvedValue({ otp: 1234, otp_expiry: expiredDate });
    const res = makeRes();
    await verifyOtp(makeReq({ email: "a@b.com", otp: "1234" }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "OTP has expired." })
    );
  });

  it("returns 200 when OTP is valid and not expired", async () => {
    Child.findOne.mockResolvedValue({ otp: 1234, otp_expiry: validExpiry });
    const res = makeRes();
    await verifyOtp(makeReq({ email: "a@b.com", otp: "1234" }), res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("returns 500 on database error", async () => {
    Child.findOne.mockRejectedValue(new Error("DB failure"));
    const res = makeRes();
    await verifyOtp(makeReq({ email: "a@b.com", otp: "1234" }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
