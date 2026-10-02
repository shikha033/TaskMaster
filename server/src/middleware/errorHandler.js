import { HttpError } from "../utils/HttpError.js";

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Turns any thrown error into a JSON response: { message }.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)[0]?.message || "Invalid data.";
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id." });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "That value is already in use." });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
}
