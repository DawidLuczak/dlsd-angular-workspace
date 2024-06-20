import { Routes } from '@angular/router';
import { dropdownsRoutes } from './dropdowns/dropdowns.routes';
import { toastsRoutes } from './toasts/toasts.routes';
import { tooltipsRoutes } from './tooltips/tooltips.routes';
import { ViewComponent } from './view.component';

export const viewRoutes: Routes = [
  {
    title: 'view',
    component: ViewComponent,
    path: 'view',
    children: [...dropdownsRoutes, ...toastsRoutes, ...tooltipsRoutes],
  },
];
