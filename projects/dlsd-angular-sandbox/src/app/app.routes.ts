import { Routes } from '@angular/router';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { TooltipsComponent } from './tooltips/tooltips.component';

export const routes: Routes = [
  {
    title: 'dropdowns',
    component: DropdownsComponent,
    path: 'dropdowns',
  },
  {
    title: 'tooltips',
    component: TooltipsComponent,
    path: 'tooltips',
  },
];
