import { Routes } from '@angular/router';
import { FeatureFlagsContainerComponent } from './components/feature-flags/feature-flags-container.component';
import { LayoutComponent } from './core/layout/layout';

export const routes: Routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'feature-flags', component: FeatureFlagsContainerComponent },
            { path: '', redirectTo: 'feature-flags', pathMatch: 'full' }
        ]
    }

];
