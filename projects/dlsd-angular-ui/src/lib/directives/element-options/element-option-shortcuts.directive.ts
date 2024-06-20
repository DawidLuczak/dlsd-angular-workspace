import { Directive, ElementRef, input } from '@angular/core';

@Directive({
  selector: '[dlsdElementOptionShortcuts]',
  standalone: true,
})
export class DLSDElementOptionShortcutsDirective {
  public elementOptionShortcuts = input.required({
    alias: 'dlsdElementOptionShortcuts',
  });

  constructor(private elementRef: ElementRef) {}
}
