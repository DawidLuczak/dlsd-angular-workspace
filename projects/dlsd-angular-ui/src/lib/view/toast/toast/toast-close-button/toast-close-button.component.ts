import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'dlsd-toast-close-button',
  standalone: true,
  imports: [],
  templateUrl: './toast-close-button.component.html',
  styleUrl: './toast-close-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDToastCloseButtonComponent {
  public color = input.required<'green' | 'red' | 'gray' | 'yellow'>();
}
