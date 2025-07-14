import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appRoutes } from './app.routes';
import { authReducer } from './features/auth/state/auth.reducer';
import { AuthEffects } from './features/auth/state/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(appRoutes),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
  ],
};
