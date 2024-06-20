import { Routes } from '@angular/router';
import { controlsRoutes } from './controls/controls.routes';
import { FormsComponent } from './forms.component';
import { inputsRoutes } from './inputs/inputs.routes';

export const formsRoutes: Routes = [
  {
    title: 'forms',
    component: FormsComponent,
    path: 'forms',
    children: [...inputsRoutes, ...controlsRoutes],
  },
];
