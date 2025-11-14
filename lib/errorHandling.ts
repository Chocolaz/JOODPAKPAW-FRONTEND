// lib/errorHandling.ts

export class ApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

const errorMessages: { [key: string]: string } = {
  'A-3001': 'Invalid username or password',
  'A-3003': 'Email is already in used',
  // Add other error codes and messages here
};

export function getApiErrorMessage(error: unknown): string | null {
  if (error instanceof ApiError && error.code in errorMessages) {
    return errorMessages[error.code];
  }
  return null;
}
