import { Routes } from '@angular/router';
import { ControlsComponent } from './controls.component';
import { FormControlsGroupComponent } from './form-controls-group/form-controls-group.component';

export const controlsRoutes: Routes = [
  {
    title: 'controls',
    component: ControlsComponent,
    path: 'controls',
    children: [
      {
        title: 'form controls group',
        component: FormControlsGroupComponent,
        path: 'form-controls-group',
      },
    ],
  },
];
