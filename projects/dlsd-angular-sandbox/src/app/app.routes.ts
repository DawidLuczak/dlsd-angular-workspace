import { Routes } from '@angular/router';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { FormsComponent } from './forms/forms.component';
import { formsRoutes } from './forms/forms.routes';
import { PaginationComponent } from './pagination/pagination.component';
import { TabsComponent } from './tabs/tabs.component';
import { ToastsComponent } from './toasts/toasts.component';
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
    children: formsRoutes,
  },
  {
    title: 'pagination',
    component: PaginationComponent,
    path: 'pagination',
  },
  {
    title: 'tabs',
    component: TabsComponent,
    path: 'tabs',
  },
  {
    title: 'toasts',
    component: ToastsComponent,
    path: 'toasts',
  },
  {
    title: 'tooltips',
    component: TooltipsComponent,
    path: 'tooltips',
  },
];
