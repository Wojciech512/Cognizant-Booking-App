import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AuthGuard } from './features/auth/guards/auth.guard';
import { AdminComponent } from './features/admin/components/admin.component';
import { CalendarComponent } from './features/calendar/components/calendar.component';
import { NoAuthGuard } from './features/auth/guards/no-auth.guard';
import { IsStaffGuard} from './features/auth/guards/is-staff.guard';

export const appRoutes: Routes = [
  { path: 'login', canActivate: [NoAuthGuard], component: LoginComponent },
  {
    path: 'register',
    canActivate: [NoAuthGuard],
    component: RegisterComponent,
  },
  { path: 'calendar', canActivate: [AuthGuard], component: CalendarComponent },
  { path: 'admin', canActivate: [AuthGuard, IsStaffGuard], component: AdminComponent },
  { path: '', redirectTo: 'calendar', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
