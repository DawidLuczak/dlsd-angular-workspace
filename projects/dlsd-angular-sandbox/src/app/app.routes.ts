import { Routes } from '@angular/router';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { FormsComponent } from './forms/forms.component';
import { PaginationComponent } from './pagination/pagination.component';
import { TabsComponent } from './tabs/tabs.component';
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
    title: 'tooltips',
    component: TooltipsComponent,
    path: 'tooltips',
  },
];
