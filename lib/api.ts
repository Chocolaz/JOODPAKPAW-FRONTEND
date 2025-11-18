// lib/api.ts
import request from './apiClient';
import {
  FacilitiesResponse,
  ForgotPasswordCredentials,
  ProfileResponse,
  ResetPasswordCredentials,
  SignInCredentials,
  SignInResponse,
  SignUpCredentials,
  VerifyOtpCredentials,
} from '@/types';

// --- Auth Functions ---
export const signIn = (credentials: SignInCredentials): Promise<SignInResponse> => {
  return request<SignInResponse>({
    endpoint: 'api/v1/auth/sign-in',
    method: 'POST',
    body: credentials,
    errorContext: 'Sign-in',
  });
};

export const signUp = (credentials: SignUpCredentials) => {
  return request({
    endpoint: 'api/v1/auth/sign-up',
    method: 'POST',
    body: credentials,
    errorContext: 'Sign-up',
  });
};

export const verifyOtp = (credentials: VerifyOtpCredentials): Promise<SignInResponse> => {
  return request<SignInResponse>({
    endpoint: 'api/v1/auth/verify-otp',
    method: 'POST',
    body: credentials,
    errorContext: 'OTP Verification',
  });
};

export const resendOtp = (credentials: { email: string }) => {
  return request({
    endpoint: 'api/v1/auth/resend-otp',
    method: 'POST',
    body: credentials,
    errorContext: 'Resend OTP',
  });
};

export const forgotPassword = (credentials: ForgotPasswordCredentials) => {
  return request({
    endpoint: 'api/v1/auth/forgot-password',
    method: 'POST',
    body: credentials,
    errorContext: 'Forgot Password',
  });
};

export const resetPassword = (credentials: ResetPasswordCredentials) => {
  return request({
    endpoint: 'api/v1/auth/reset-password',
    method: 'POST',
    body: credentials,
    errorContext: 'Reset Password',
  });
};

// --- User Functions ---
export const getProfile = (): Promise<ProfileResponse> => {
  return request<ProfileResponse>({
    endpoint: 'api/v1/auth/profile',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Profile',
    cache: 'no-store',
  });
};

export const updateUserProfile = (userId: string, formData: FormData) => {
  return request({
    endpoint: `api/v1/users/${userId}`,
    method: 'PUT',
    body: formData,
    requiresAuth: true,
    errorContext: 'Update Profile',
  });
};

// --- Property Functions ---
export const getProperties = (page: number, limit: number) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return request({
    endpoint: `api/v1/properties?${params.toString()}`,
    method: 'GET',
    errorContext: 'Get Properties',
  });
};

export const getFacilities = (): Promise<FacilitiesResponse> => {
  return request<FacilitiesResponse>({
    endpoint: 'api/v1/hosts/facilities/all',
    method: 'GET',
    requiresAuth: true,
    errorContext: 'Get Facilities',
  });
};