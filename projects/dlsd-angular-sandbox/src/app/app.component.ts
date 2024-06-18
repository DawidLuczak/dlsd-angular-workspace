import { NgClass, NgComponentOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { Route, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  DLSDActiveRoutesTree,
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
    RouterOutlet,
    NgClass,
    NgComponentOutlet,
    DLSDSwitchComponent,
    DLSDNavItemComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly Object = Object;
  protected readonly View = View;
  protected readonly I18N = 'dlsdAngularSandbox';
  protected readonly ROUTES = routes;

  private readonly SCROLL_PADDING = 56;

  protected view = signal(View.COMPONENT_OUTLETS);
  protected activeRouteTree = signal<DLSDActiveRoutesTree>({
    route: this.ROUTES[0],
  });

  private containerRef =
    viewChild.required<ElementRef<HTMLElement>>('container');

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  public updateActiveSection(): void {
    const sections = this.getSections();

    for (const section of sections) {
      const sectionTop = section.offsetTop - this.SCROLL_PADDING;
      const sectionBottom =
        section.offsetTop + section.offsetHeight + this.SCROLL_PADDING;
      if (window.scrollY < sectionTop || window.scrollY > sectionBottom) return;

      const activeSection = this.ROUTES.find(
        (route) =>
          route.title?.toString().toLocaleLowerCase() ===
          section.localName.split('-').slice(1).join('-')
      );
      if (!activeSection) return;

      this.activeRouteTree.set({ route: activeSection });
    }
  }

  protected changeView(flag: boolean): void {
    this.view.set(flag ? View.ROUTER_OUTLET : View.COMPONENT_OUTLETS);
    this.router.navigate([`/${this.activeRouteTree().route.path}`]);
  }

  protected navigateTo(activeRoute: DLSDActiveRoutesTree): void {
    if (this.view() === View.COMPONENT_OUTLETS) {
      this.changeSection(activeRoute.route);
    } else {
      let routeTree = activeRoute.routesTree;
      let path = '/';
      do {
        path += `/${routeTree?.route.path}`;
        routeTree = routeTree?.routesTree;
      } while (routeTree);
      this.router.navigate([path]);
    }
    this.activeRouteTree.set(activeRoute);
  }

  private changeSection(route: Route): void {
    const sections = this.getSections();
    const section = sections.find(
      (section) =>
        section.localName.split('-').slice(1).join('-') ===
        route.title?.toString().toLowerCase()
    );
    if (!section) return;

    this.containerRef().nativeElement.scrollTo({
      top: section.offsetTop - this.SCROLL_PADDING,
      behavior: 'smooth',
    });
  }

  private getSections(): HTMLElement[] {
    const sectionRefs = Array.from(this.containerRef().nativeElement.children);
    const sections = [];

    for (const section of sectionRefs) {
      if (section.classList.contains('separator')) continue;
      sections.push(section as HTMLElement);
    }
    return sections;
  }
}
