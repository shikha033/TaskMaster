import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { issueOtp, consumeOtp } from "../utils/otp.js";
import { signToken } from "../utils/token.js";

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function readEmail(body) {
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, "Please enter a valid email address.");
  }
  return email;
}

function readPassword(body) {
  const password = String(body.password || "");
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  return password;
}

const sendSession = (res, user, status = 200) =>
  res.status(status).json({ token: signToken(user._id), user: user.toPublic() });

// --- Sign up: email a code, then create the account ---------------------

router.post(
  "/signup/send-otp",
  asyncHandler(async (req, res) => {
    const email = readEmail(req.body);
    if (await User.exists({ email })) {
      throw new HttpError(409, "An account with this email already exists. Please log in.");
    }
    await issueOtp(email, "signup");
    res.json({ message: "Verification code sent." });
  })
);

router.post(
  "/signup/verify",
  asyncHandler(async (req, res) => {
    const email = readEmail(req.body);
    const password = readPassword(req.body);
    const username = String(req.body.username || "").trim() || email.split("@")[0];

    await consumeOtp(email, "signup", req.body.otp);

    const user = await User.create({
      email,
      username,
      password: await bcrypt.hash(password, 10),
    });
    sendSession(res, user, 201);
  })
);

// --- Login ---------------------------------------------------------------

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = readEmail(req.body);
    const user = await User.findOne({ email });
    const ok = user && (await bcrypt.compare(String(req.body.password || ""), user.password));
    if (!ok) throw new HttpError(401, "Invalid email or password.");
    sendSession(res, user);
  })
);

// --- Forgot password: email a code, then set a new password --------------

router.post(
  "/forgot/send-otp",
  asyncHandler(async (req, res) => {
    const email = readEmail(req.body);
    // Same response whether or not the account exists (avoids leaking emails).
    if (await User.exists({ email })) await issueOtp(email, "reset");
    res.json({ message: "If that account exists, a reset code has been sent." });
  })
);

router.post(
  "/forgot/verify",
  asyncHandler(async (req, res) => {
    const email = readEmail(req.body);
    const password = readPassword(req.body);

    await consumeOtp(email, "reset", req.body.otp);

    const user = await User.findOne({ email });
    if (!user) throw new HttpError(404, "Account not found.");
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    sendSession(res, user);
  })
);

// --- Current user (used to restore the session on page refresh) ----------

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export default router;
