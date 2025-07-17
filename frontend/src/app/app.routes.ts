import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { NoAuthGuard } from './features/auth/guards/no-auth.guard';
import { IsStaffGuard } from './features/auth/guards/is-staff.guard';

/**
 * Defines the top-level routing table for the application.
 *
 * Context:
 * - Guards routes based on authentication state and user roles.
 * - Lazy-loads feature modules for performance.
 * - Provides fallback redirects for root and unknown paths.
 */

export const appRoutes: Routes = [
  { path: 'login', canActivate: [NoAuthGuard], component: LoginComponent },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    component: RegisterComponent,
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/calendar/calendar.module').then(
        (module) => module.CalendarModule,
      ),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, IsStaffGuard],
    loadChildren: () =>
      import('./features/admin/admin.module').then(
        (module) => module.AdminModule,
      ),
  },
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
