import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import { AuthEffects } from './app/features/auth/state/auth.effects';
import { authReducer } from './app/features/auth/state/auth.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),
    provideEffects([AuthEffects]),
    provideStore({ auth: authReducer }),
    provideEffects([AuthEffects]),
  ],
}).catch((err) => console.error(err));
