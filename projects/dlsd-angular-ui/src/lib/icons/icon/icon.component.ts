import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from '@angular/core';
import { DLSDCustomIconComponent } from '../custom-icon/custom-icon.component';
import { IconCategory, IconName, IconSize } from '../interfaces';

@Component({
  selector: 'dlsd-icon',
  standalone: true,
  imports: [DLSDCustomIconComponent],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDIconComponent<
  C extends IconCategory = IconCategory,
  N extends IconName<C> = IconName<C>,
  S extends IconSize<C, N> = IconSize<C, N>
> {
  @Input({ required: true }) public category!: C;
  @Input({ required: true }) public name!: N;
  @Input({ required: true }) public size!: S;
  public scale = input<number>();
}
