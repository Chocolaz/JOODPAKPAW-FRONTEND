// lib/errorHandling.ts

export class ApiError extends Error {
  code: string
  errors?: { field: string; tag: string; value: string }[]

  constructor(
    message: string,
    code: string,
    errors?: { field: string; tag: string; value: string }[]
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.errors = errors
  }
}

const errorMessages: { [key: string]: string } = {
  'A-3001': 'Invalid email or password.',
  'A-3003': 'Email is already in used.',
  'DB-1002': 'This email is not registered.',
  'A-3010': 'Reset password token already used.',
  'A-3012': 'New password same as old password.',
  // Add other error codes and messages here
}

export function getApiErrorMessages(
  error: unknown
): { field: 'email' | 'password' | 'general'; message: string }[] | null {
  if (error instanceof ApiError) {
    if (error.code === 'T-2007' && error.errors && error.errors.length > 0) {
      return error.errors.map((err) => {
        // Use the 'tag' for more reliable error mapping
        switch (err.tag) {
          case 'email':
            return { field: 'email', message: 'Invalid email format.' };
          case 'min': // Assuming 'min' tag for password length
            if (err.field.toLowerCase().includes('password')) {
              return { field: 'password', message: 'Password must be at least 8 characters.' };
            }
            break;
          // Add more cases for other tags like 'required', etc.
        }
        // Fallback for unhandled tags or fields
        return {
          field: 'general',
          message: 'An unknown validation error occurred.',
        };
      });
    }
    if (error.code in errorMessages) {
      return [{ field: 'general', message: errorMessages[error.code] }];
    }
  }
  return null;
}
