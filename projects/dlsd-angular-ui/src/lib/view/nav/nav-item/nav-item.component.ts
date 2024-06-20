import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Route } from '@angular/router';
import { DLSDActiveRoutesTree } from '../interface';
import { NavItemType } from './../enums';

@Component({
  selector: 'dlsd-nav-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDNavItemComponent {
  protected readonly NavItemType = NavItemType;

  public route = input.required<Route>();
  public activeRoutesTree = input.required<DLSDActiveRoutesTree>();
  public type = input(NavItemType.TITLE);

  public activate = output<DLSDActiveRoutesTree>();

  protected activateChildRoute(activeRoute: DLSDActiveRoutesTree): void {
    const routesTree: DLSDActiveRoutesTree = {
      route: activeRoute.route,
      routesTree: {
        route: this.route(),
        routesTree: activeRoute.routesTree,
      },
    };
    this.activate.emit(routesTree);
  }
}
