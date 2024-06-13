import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'dlsd-number-label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './number-label.component.html',
  styleUrl: './number-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDNumberLabelComponent {
  public type = input<'gray' | 'white'>();
  public value = input.required<number>();
  public active = input<boolean>();
  public disabled = input<boolean>();
}
