import { Routes } from '@angular/router';
import { InputsComponent } from './inputs/inputs.component';
import { inputsRoutes } from './inputs/inputs.routes';

export const formsRoutes: Routes = [
  {
    title: 'inputs',
    component: InputsComponent,
    path: 'inputs',
    children: inputsRoutes,
  },
];
