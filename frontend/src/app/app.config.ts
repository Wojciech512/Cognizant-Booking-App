import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appRoutes } from './app.routes';
import { AuthEffects } from './features/auth/state/auth.effects';
import { storageSyncReducer } from './features/auth/state/storage.metareducer';
import { appReducers } from './state/app.reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes),
    provideStore(appReducers, { metaReducers: [storageSyncReducer] }),
    provideEffects([AuthEffects]),
  ],
};
