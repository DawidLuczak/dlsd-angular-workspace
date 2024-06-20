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
  protected readonly I18N = 'dlsdAngularSandbox';

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

  protected changeView(flag: boolean): void {
    this.view.set(flag ? View.ROUTER_OUTLET : View.COMPONENT_OUTLETS);
    if (this.view() !== View.ROUTER_OUTLET) return;

    this.router.navigate([`/${this.activeRouteTree().route.path}`]);
  }

  protected navigateTo(activeRoute: DLSDActiveRoutesTree): void {
    this.view()
      ? this.componentsContainerRef().changeSection(activeRoute.route)
      : this.navigateRouter(activeRoute);

    this.activeRouteTree.set(activeRoute);
  }

  private navigateRouter(activeRoute: DLSDActiveRoutesTree): void {
    let routeTree = activeRoute.routesTree;
    let path = '/';
    do {
      path += `/${routeTree?.route.path}`;
      routeTree = routeTree?.routesTree;
    } while (routeTree);

    this.router.navigate([path]);
  }
}
