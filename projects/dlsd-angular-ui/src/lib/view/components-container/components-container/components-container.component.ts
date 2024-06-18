import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  output,
} from '@angular/core';
import { Route, Routes } from '@angular/router';
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

  @HostListener('window:scroll')
  public updateActiveSection(): void {
    const sections = this.getSections();

    for (const section of sections) {
      const sectionTop = section.offsetTop - this.SCROLL_PADDING;
      const sectionBottom =
        section.offsetTop + section.offsetHeight + this.SCROLL_PADDING;
      if (window.scrollY < sectionTop || window.scrollY > sectionBottom) return;

      const activeSection = this.routes().find(
        (route) =>
          route.title?.toString().toLocaleLowerCase() ===
          section.localName.split('-').slice(1).join('-')
      );
      if (!activeSection) return;

      this.scrollSectionChange.emit({ route: activeSection });
    }
  }

  public changeSection(route: Route): void {
    const sections = this.getSections();
    const section = sections.find(
      (section) =>
        section.localName.split('-').slice(1).join('-') ===
        route.title?.toString().toLowerCase()
    );
    if (!section) return;

    this.elementRef.nativeElement.scrollTo({
      top: section.offsetTop - this.SCROLL_PADDING,
      behavior: 'smooth',
    });
  }

  private getSections(): HTMLElement[] {
    const sectionRefs = Array.from(
      this.elementRef.nativeElement.children as HTMLElement[]
    );
    const sections = [];

    for (const section of sectionRefs) {
      if (section.classList.contains('separator')) continue;
      sections.push(section);
    }
    return sections;
  }
}
