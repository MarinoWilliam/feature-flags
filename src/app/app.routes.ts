import { Routes } from '@angular/router';
import { FeatureFlagsComponent } from './features/feature-flags/feature-flags.component';

export const routes: Routes = [
    { path: 'feature-flags', component: FeatureFlagsComponent },
    { path: '', redirectTo: 'feature-flags', pathMatch: 'full' }
];
