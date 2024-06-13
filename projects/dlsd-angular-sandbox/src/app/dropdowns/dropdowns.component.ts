import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DLSDDropdownDirective } from '../../../../dlsd-angular-ui/src/lib';
import { DLSDDropdownOption } from '../../../../dlsd-angular-ui/src/lib/dropdown/dropdown-interfaces';

@Component({
  selector: 'app-dropdowns',
  standalone: true,
  imports: [DLSDDropdownDirective],
  templateUrl: './dropdowns.component.html',
  styleUrl: './dropdowns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownsComponent {
  selectOption(option: DLSDDropdownOption<number>): void {
    alert(`Selected ${option.name}`);
  }
}
