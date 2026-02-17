import { Routes } from '@angular/router';
import { FeatureFlagsComponent } from './features/feature-flags/feature-flags.component';
import { LayoutComponent } from './core/layout/layout';

export const routes: Routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'feature-flags', component: FeatureFlagsComponent },
            { path: '', redirectTo: 'feature-flags', pathMatch: 'full' }
        ]
    }

];
