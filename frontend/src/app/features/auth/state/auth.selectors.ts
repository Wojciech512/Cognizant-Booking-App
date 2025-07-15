import { createSelector, createFeatureSelector } from '@ngrx/store';
import { jwtDecode } from 'jwt-decode';
import { AuthState, TokenPayload } from '../models/auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token,
);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (s) => s.loading,
);
export const selectAuthFieldErrors = createSelector(
  selectAuthState,
  (s) => s.fieldErrors,
);
export const selectAuthNonFieldErrors = createSelector(
  selectAuthState,
  (s) => s.nonFieldErrors,
);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (s) => s.isAuthenticated,
);
export const selectTokenPayload = createSelector(
  selectAuthToken,
  (token): TokenPayload | null => {
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  },
);
export const selectIsStaff = createSelector(
  selectTokenPayload,
  (payload) => !!payload?.is_staff,
);
export const selectUsername = createSelector(
  selectTokenPayload,
  (payload) => payload?.username,
);
