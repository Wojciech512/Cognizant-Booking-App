import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppState } from '../../../state/app.state';

/**
 * Meta-reducer to persist and rehydrate the ‘auth’ slice of state via localStorage.
 *
 * Context:
 * - Wraps the root NgRx reducer to automatically save `auth` into browser storage.
 * - On app start, it rehydrates the `auth` state so users stay logged in across reloads.
 */

export function storageSyncReducer(
  reducer: ActionReducer<AppState>,
): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['auth'],
    rehydrate: true,
  })(reducer);
}
