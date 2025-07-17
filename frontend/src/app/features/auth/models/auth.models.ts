/**
 * Domain types for authentication feature.
 *
 * Context:
 * - Defines payloads for login/register HTTP calls and the shape of API responses.
 * - Describes AuthState stored in NgRx, as well as a normalized ApiError type.
 * - TokenPayload interface matches decoded JWT structure (e.g. user role flags).
 */

export interface RegisterResponse {
  id: number;
  email: string;
  createdAt: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh?: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  fieldErrors: Record<string, string[]>;
  nonFieldErrors: string[];
}

export interface ApiError {
  fieldErrors: Record<string, string[]>;
  nonFieldErrors?: string[];
}

export interface TokenPayload {
  is_staff?: boolean;
  username?: string;
}
