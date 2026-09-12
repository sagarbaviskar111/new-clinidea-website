// Standardized API Response & Error Handling System

export class ApiError extends Error {
  constructor(message, statusCode = 400, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const createApiResponse = (success, data = null, message = '', errors = null) => {
  return {
    success,
    data,
    message,
    errors,
    timestamp: new Date().toISOString()
  };
};

export const logAuditAction = async (userId, action, endpoint, payload = null, ipAddress = null) => {
  console.log(`[AUDIT LOG] ${new Date().toISOString()} | User: ${userId || 'ANONYMOUS'} | Action: ${action} | Endpoint: ${endpoint}`);
};
