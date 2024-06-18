import { Route } from '@angular/router';

export interface DLSDActiveRoutesTree {
  route: Route;
  routesTree?: DLSDActiveRoutesTree;
}
