import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
} from '@angular/core';
import { Routes } from '@angular/router';
import { DLSDActiveRoutesTree } from '../../nav';

@Component({
  selector: 'dlsd-components-container',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './components-container.component.html',
  styleUrl: './components-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDComponentsContainerComponent {
  private readonly SCROLL_PADDING = 56;

  public routes = input.required<Routes>();

  public scrollSectionChange = output<DLSDActiveRoutesTree>();

  constructor(private elementRef: ElementRef) {}

  public changeSection(routeTree: DLSDActiveRoutesTree): void {
    const section = this.findSection(routeTree);
    if (!section) return;

    this.elementRef.nativeElement.scrollTo({
      top: section.offsetTop - this.SCROLL_PADDING,
      behavior: 'smooth',
    });
  }

  private findSection(
    routeTree: DLSDActiveRoutesTree
  ): HTMLElement | undefined {
    let route = routeTree.routesTree;
    let section: HTMLElement | undefined = this.elementRef.nativeElement;
    let sections = Array.from(section!.children) as HTMLElement[];

    while (route?.routesTree) {
      section = sections.find(
        (s) => s.getAttribute('sectionName') === route?.route?.path
      )?.nextElementSibling as HTMLElement;
      if (!section) return;

      sections = Array.from(section.children) as HTMLElement[];
      route = route.routesTree;
    }

    // return !route?.route
    //   ? section
    //   : route.route.children?.length
    //   ? (sections.find(
    //       (s) => s.getAttribute('name') === route?.route?.path
    //     ) as HTMLElement)
    //   : sections.find((s) => s.localName === `app-${route.route.path}`);

    if (!route?.route) return section;

    if (route.route.children?.length) {
      return sections.find(
        (s) => s.getAttribute('sectionName') === route.route.path
      ) as HTMLElement;
    }

    return sections.find((s) => s.localName === `app-${route.route.path}`);
  }
}
