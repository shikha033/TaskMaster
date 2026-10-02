import crypto from "crypto";
import Otp from "../models/Otp.js";
import { HttpError } from "./HttpError.js";
import { sendEmail } from "./sendEmail.js";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

const hashCode = (email, code) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`${email}:${code}`)
    .digest("hex");

// Creates a 6-digit code, stores its hash, and emails the code to the user.
export async function issueOtp(email, purpose) {
  const code = crypto.randomInt(100000, 1000000).toString();

  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      codeHash: hashCode(email, code),
      attempts: 0,
      expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const action = purpose === "signup" ? "verify your email" : "reset your password";
  await sendEmail({
    to: email,
    subject: `Your TaskMaster code: ${code}`,
    text: `Use this code to ${action}: ${code}\n\nIt expires in ${OTP_TTL_MINUTES} minutes.`,
  });
}

// Checks the code. The code is deleted after one successful use.
export async function consumeOtp(email, purpose, code) {
  const record = await Otp.findOne({ email, purpose });
  if (!record) {
    throw new HttpError(400, "Code expired or not found. Please request a new one.");
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    throw new HttpError(429, "Too many wrong attempts. Please request a new code.");
  }

  const expected = Buffer.from(record.codeHash, "hex");
  const actual = Buffer.from(hashCode(email, String(code || "").trim()), "hex");
  const valid = crypto.timingSafeEqual(expected, actual);

  if (!valid) {
    record.attempts += 1;
    await record.save();
    throw new HttpError(400, "Incorrect code. Please try again.");
  }
  await record.deleteOne();
}
