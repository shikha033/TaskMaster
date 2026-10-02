// Lets async route handlers throw errors without try/catch blocks.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
