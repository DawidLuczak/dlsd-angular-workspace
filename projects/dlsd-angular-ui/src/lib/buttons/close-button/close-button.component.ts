import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DLSDIconComponent } from '../../icons';

@Component({
  selector: 'dlsd-close-button',
  standalone: true,
  imports: [DLSDIconComponent],
  templateUrl: './close-button.component.html',
  styleUrl: './close-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDCloseButtonComponent {
  public size = input(32);
}
