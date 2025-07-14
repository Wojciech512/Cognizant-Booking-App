import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppState } from '../../../state/app.state';

export function storageSyncReducer(
  reducer: ActionReducer<AppState>,
): ActionReducer<AppState> {
  return localStorageSync({
    keys: ['auth'],
    rehydrate: true,
  })(reducer);
}
