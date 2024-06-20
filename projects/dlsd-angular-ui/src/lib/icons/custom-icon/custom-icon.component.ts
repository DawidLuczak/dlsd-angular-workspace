import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  SvgHttpLoader,
  SvgIconComponent,
  SvgIconRegistryService,
  SvgLoader,
} from 'angular-svg-icon';

@Component({
  selector: 'dlsd-custom-icon',
  standalone: true,
  imports: [SvgIconComponent, NgStyle],
  providers: [
    SvgIconRegistryService,
    { provide: SvgLoader, useClass: SvgHttpLoader },
  ],
  templateUrl: './custom-icon.component.html',
  styleUrl: './custom-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DLSDCustomIconComponent {
  public source = input.required<string>();
  public size = input.required<number>();
}
