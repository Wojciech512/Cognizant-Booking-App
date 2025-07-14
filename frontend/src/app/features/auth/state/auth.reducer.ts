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
    fieldErrors: {},
    nonFieldErrors: [],
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
    error: null,
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
    error: null,
    loading: false,
  })),

  on(AuthActions.clearAuthErrors, (state) => ({
    ...state,
    fieldErrors: {},
    nonFieldErrors: [],
  })),
);
