import { Component } from '@angular/core';
import { DLSDIconComponent } from '../../../../dlsd-angular-ui/src/lib/icons';
import { ICONS } from '../../../../dlsd-angular-ui/src/lib/icons/icons';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [DLSDIconComponent],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss',
})
export class IconsComponent {
  protected readonly Object = Object;
  protected readonly ICONS = ICONS;
}
