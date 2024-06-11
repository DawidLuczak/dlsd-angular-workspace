import { Routes } from '@angular/router';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { FormsComponent } from './forms/forms.component';
import { TooltipsComponent } from './tooltips/tooltips.component';

export const routes: Routes = [
  {
    title: 'dropdowns',
    component: DropdownsComponent,
    path: 'dropdowns',
  },
  {
    title: 'forms',
    component: FormsComponent,
    path: 'forms',
  },
  {
    title: 'tooltips',
    component: TooltipsComponent,
    path: 'tooltips',
  },
];
