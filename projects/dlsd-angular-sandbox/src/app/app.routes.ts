import { Routes } from '@angular/router';
import { formsRoutes } from './forms/forms.routes';
import { iconsRoutes } from './icons/icons.routes';
import { paginationRoutes } from './pagination/pagination.routes';
import { tabsRoutes } from './tabs/tabs.routes';
import { viewRoutes } from './view/view.routes';

export const routes: Routes = [
  ...formsRoutes,
  ...iconsRoutes,
  ...paginationRoutes,
  ...tabsRoutes,
  ...viewRoutes,
];
