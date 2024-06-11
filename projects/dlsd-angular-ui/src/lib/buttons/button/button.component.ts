import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  input,
} from '@angular/core';
import { DLSDSpinnerComponent } from '../../spinner';

@Component({
  selector: 'dlsd-button',
  standalone: true,
  imports: [DLSDSpinnerComponent, NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDButtonComponent {
  public type = input<'primary' | 'outline'>('primary');
  public color = input<'blue' | 'green' | 'red'>('blue');
  public size = input<'s' | 'm'>('m');
  public spinner = input<boolean>(false);
  public disabled = input<boolean>(false);

  protected showSpinner: Signal<boolean> = computed(
    () => this.spinner() && !this.disabled() && this.color() === 'blue'
  );
}
