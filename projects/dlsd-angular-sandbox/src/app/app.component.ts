import { NgClass, NgComponentOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  signal,
  viewChild,
} from '@angular/core';
import { Route, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgComponentOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly Object = Object;
  readonly ROUTES = routes;

  private readonly SCROLL_PADDING = 32;

  protected activeSection = signal(this.ROUTES[0]);

  private containerRef =
    viewChild.required<ElementRef<HTMLElement>>('container');

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

      this.activeSection.set(activeSection);
    }
  }

  protected changeSection(route: Route): void {
    const sections = this.getSections();
    const section = sections.find(
      (section) =>
        section.localName.split('-').slice(1).join('-') ===
        route.title?.toString().toLowerCase()
    );
    if (!section) return;

    window.scrollTo({
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
