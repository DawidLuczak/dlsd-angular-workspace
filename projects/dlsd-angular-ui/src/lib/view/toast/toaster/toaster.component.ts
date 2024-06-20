import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  InjectionToken,
} from '@angular/core';
import { DLSDToasterConfig } from '../interfaces';
import { DLSDToastComponent } from '../toast/toast.component';

export const ONYX_TOASTER_CONFIG = new InjectionToken<DLSDToasterConfig>(
  'Toaster config injection token'
);

@Component({
  selector: 'dlsd-toaster',
  standalone: true,
  imports: [DLSDToastComponent],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDToasterComponent {
  constructor(
    @Inject(ONYX_TOASTER_CONFIG) protected config: DLSDToasterConfig
  ) {}
}
