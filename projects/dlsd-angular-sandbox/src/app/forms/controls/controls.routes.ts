import { Routes } from '@angular/router';
import { ControlsComponent } from './controls.component';
import { FormControlsGroupComponent } from './form-controls-group/form-controls-group.component';

export const controlsRoutes: Routes = [
  {
    title: 'Controls',
    path: 'controls',
    component: ControlsComponent,
    children: [
      {
        title: 'Form controls group',
        path: 'form-controls-group',
        component: FormControlsGroupComponent,
      },
    ],
  },
];
