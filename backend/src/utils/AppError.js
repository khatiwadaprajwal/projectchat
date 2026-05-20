class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Identifies that this is a predictable, operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;