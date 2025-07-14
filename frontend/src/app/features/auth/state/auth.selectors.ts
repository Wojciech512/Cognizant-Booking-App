import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../models/auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.token,
);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading,
);
export const selectAuthFieldErrors = createSelector(
  selectAuthState,
  (s) => s.fieldErrors,
);
export const selectAuthNonFieldErrors = createSelector(
  selectAuthState,
  (s) => s.nonFieldErrors,
);
