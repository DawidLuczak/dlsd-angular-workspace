import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'dlsd-input-label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './input-label.component.html',
  styleUrl: './input-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDInputLabelComponent {
  public type = input<'label' | 'title'>('label');
  public label = input.required<string>();
  public required = input<boolean>(false);
  public disabled = input<boolean>(false);
  public hint = input<string>();

  public labelClick = output<void>();
}
