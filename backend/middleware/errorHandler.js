import { logError } from "../utils/logger.js";

export default function errorHandler(err, req, res, next) {
  logError("Unhandled error", { err });
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal server error"
  });
}
