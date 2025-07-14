import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../features/auth/state/auth.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};
