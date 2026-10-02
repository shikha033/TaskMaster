import User from "../models/User.js";
import { HttpError } from "../utils/HttpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/token.js";

// Protects a route: requires a valid "Authorization: Bearer <token>" header.
export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Not authenticated.");

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new HttpError(401, "Session expired. Please log in again.");
  }

  const user = await User.findById(payload.id);
  if (!user) throw new HttpError(401, "This account no longer exists.");

  req.user = user;
  next();
});
