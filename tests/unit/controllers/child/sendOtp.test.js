"use strict";

jest.mock("../../../../models", () => ({
  Child: { findOne: jest.fn() },
}));
jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

const sgMail = require("@sendgrid/mail");
const { Child } = require("../../../../models");
const sendOtp = require("../../../../src/controllers/child/sendOtp");

const makeReq = (body = {}) => ({ body });
const makeRes = () => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  return res;
};

const fakeChild = {
  id: 1,
  email: "child@test.com",
  otp: null,
  otp_expiry: null,
  update: jest.fn().mockResolvedValue(true),
};

beforeEach(() => jest.clearAllMocks());

describe("sendOtp (child)", () => {
  it("returns 400 when email is not provided", async () => {
    const res = makeRes();
    await sendOtp(makeReq({}), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 404 when child not found", async () => {
    Child.findOne.mockResolvedValue(null);
    const res = makeRes();
    await sendOtp(makeReq({ email: "missing@x.com" }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("calls sgMail.send and returns 200 on success", async () => {
    Child.findOne.mockResolvedValue({ ...fakeChild, update: jest.fn().mockResolvedValue(true) });
    sgMail.send.mockResolvedValue([{ statusCode: 202 }]);
    const res = makeRes();

    await sendOtp(makeReq({ email: "child@test.com" }), res);

    expect(sgMail.send).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  it("returns 500 when SendGrid throws", async () => {
    Child.findOne.mockResolvedValue({ ...fakeChild, update: jest.fn().mockResolvedValue(true) });
    sgMail.send.mockRejectedValue(new Error("SendGrid error"));
    const res = makeRes();

    await sendOtp(makeReq({ email: "child@test.com" }), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("returns 500 on database error", async () => {
    Child.findOne.mockRejectedValue(new Error("DB error"));
    const res = makeRes();
    await sendOtp(makeReq({ email: "child@test.com" }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
