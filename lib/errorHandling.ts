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
  // Add other error codes and messages here
}

export function getApiErrorMessages(
  error: unknown
): { field: 'email' | 'password' | 'general'; message: string }[] | null {
  if (error instanceof ApiError) {
    if (error.code === 'T-2007' && error.errors && error.errors.length > 0) {
      return error.errors.map((err) => {
        if (err.field.includes('Password')) {
          return {
            field: 'password',
            message: 'Password must be at least 8 characters.',
          }
        }
        if (err.field.includes('Email')) {
          return { field: 'email', message: 'Invalid email format.' }
        }
        return {
          field: 'general',
          message: 'An unknown validation error occurred.',
        }
      })
    }
    if (error.code in errorMessages) {
      return [{ field: 'general', message: errorMessages[error.code] }]
    }
  }
  return null
}
