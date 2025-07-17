
/**
 * Reducer managing AuthState in response to auth actions.
 *
 * Context:
 * - Tracks token, loading flags, authentication status, and error payloads.
 * - Resets error fields on each new attempt; clears state on logout.
 */

import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState } from '../models/auth.models';

const initialAuthState: AuthState = {
  token: null,
  isAuthenticated: false,
  loading: false,
  fieldErrors: {},
  nonFieldErrors: [],
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    fieldErrors: {},
    nonFieldErrors: [],
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.registerFailure, (state, { fieldErrors, nonFieldErrors }) => ({
    ...state,
    loading: false,
    fieldErrors: fieldErrors || {},
    nonFieldErrors: nonFieldErrors || [],
  })),

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    fieldErrors: {},
    nonFieldErrors: [],
  })),
  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: true,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state, { fieldErrors, nonFieldErrors }) => ({
    ...state,
    loading: false,
    fieldErrors: fieldErrors || {},
    nonFieldErrors: nonFieldErrors || [],
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    isAuthenticated: false,
    loading: false,
  })),

  on(AuthActions.clearAuthErrors, (state) => ({
    ...state,
    fieldErrors: {},
    nonFieldErrors: [],
  })),
);
