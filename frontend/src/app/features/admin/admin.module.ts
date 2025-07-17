import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin.component';

const routes: Routes = [{ path: '', component: AdminComponent }];

/**
 * Feature module for the Admin area.
 *
 * Context:
 * - Configures routing for the staff-only admin section.
 * - Declares AdminComponent as the single routed component.
 * - Lazy-loaded under the "/admin" path (see app.routes.ts).
 */

@NgModule({
  imports: [RouterModule.forChild(routes), AdminComponent],
})
export class AdminModule {}
