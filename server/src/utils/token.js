import jwt from "jsonwebtoken";

const EXPIRES_IN = "7d";

export function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
