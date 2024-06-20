import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  DLSDActiveRoutesTree,
  DLSDComponentsContainerComponent,
  DLSDNavItemComponent,
  DLSDSwitchComponent,
} from '../../../dlsd-angular-ui/src/lib';
import { routes } from './app.routes';
import { I18N_NAMESPACE } from './core/constants/app-constants';

enum View {
  ROUTER_OUTLET,
  COMPONENT_OUTLETS,
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    DLSDSwitchComponent,
    DLSDNavItemComponent,
    DLSDComponentsContainerComponent,
    NgClass,
    RouterOutlet,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly View = View;
  protected readonly I18N = `${I18N_NAMESPACE}.view`;

  protected routes = signal(routes);
  protected activeRouteTree = signal<DLSDActiveRoutesTree>({
    route: this.routes()[0],
  });
  protected view = signal(View.COMPONENT_OUTLETS);

  private componentsContainerRef =
    viewChild.required<DLSDComponentsContainerComponent>(
      DLSDComponentsContainerComponent
    );

  constructor(private router: Router) {}

  public abc(a: any): void {
    console.log(a);
  }

  protected changeView(flag: boolean): void {
    this.view.set(flag ? View.ROUTER_OUTLET : View.COMPONENT_OUTLETS);
    if (this.view() !== View.ROUTER_OUTLET) return;

    this.navigateRouter(this.activeRouteTree());
  }

  protected navigateTo(activeRoute: DLSDActiveRoutesTree): void {
    this.activeRouteTree.set(activeRoute);
    this.view()
      ? this.componentsContainerRef().changeSection(activeRoute)
      : this.navigateRouter(activeRoute);
  }

  private navigateRouter(activeRoute: DLSDActiveRoutesTree): void {
    const path = this.combineRoutePath(activeRoute);
    this.router.navigate(path);
  }

  private combineRoutePath(activeRoute: DLSDActiveRoutesTree): string[] {
    let routeTree = activeRoute.routesTree;
    let path = [`${routeTree?.route.path ?? activeRoute.route.path}`];
    while (routeTree?.routesTree?.route.path) {
      path.push(routeTree.routesTree.route.path);
      routeTree = routeTree.routesTree;
    }

    return path;
  }
}
