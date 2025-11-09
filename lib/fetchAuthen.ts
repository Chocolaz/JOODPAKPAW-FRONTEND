const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function post<T>(endpoint: string, body: any, errorContext: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error: any) {
    console.error(`${errorContext} failed:`, error.message);
    throw error; 
  }
}

// --- Credentials Interfaces ---
export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  phone: string;
}

export interface VerifyOtpCredentials {
  email: string;
  otp: string;
}

export interface ForgotPasswordCredentials {
  email: string;
}

export interface ResetPasswordCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  resetPasswordToken: string;
}

// --- Response Interfaces ---
export interface SignInResponse {
  accessToken: string;
  refreshToken:string;
  code: number;
  expiresIn: number;
  message: string;
  tokenType: string;
}

// --- API Functions ---
export const signIn = (credentials: SignInCredentials): Promise<SignInResponse> => {
  return post<SignInResponse>('api/v1/auth/sign-in', credentials, 'Sign-in');
};

export const signUp = (credentials: SignUpCredentials) => {
  return post('api/v1/auth/sign-up', credentials, 'Sign-up');
};

export const verifyOtp = (
  credentials: VerifyOtpCredentials
): Promise<SignInResponse> => {
  return post<SignInResponse>(
    'api/v1/auth/verify-otp',
    credentials,
    'OTP Verification'
  )
}

export const resendOtp = (credentials: { email: string }) => {
  return post('api/v1/auth/resend-otp', credentials, 'Resend OTP');
};

export const forgotPassword = (credentials: ForgotPasswordCredentials) => {
  return post('api/v1/auth/forgot-password', credentials, 'Forgot Password');
};

export const resetPassword = (credentials: ResetPasswordCredentials) => {
  return post('api/v1/auth/reset-password', credentials, 'Reset Password');
};
