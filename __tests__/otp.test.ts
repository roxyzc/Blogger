import { generateOTP } from "../src/services/otp.service";
// import request from "supertest";

/* sebelum testing aktifkan Types di tsconfig.json  */

describe("Test OTP", () => {
  it("OTP", () => {
    expect(generateOTP()).toBe("12345");
  });
});
