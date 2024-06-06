import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DropdownDirective } from '../../../../dlsd-angular-ui/src/lib';
import { DropdownOption } from '../../../../dlsd-angular-ui/src/lib/dropdown/dropdown-interfaces';

@Component({
  selector: 'app-dropdowns',
  standalone: true,
  imports: [DropdownDirective],
  templateUrl: './dropdowns.component.html',
  styleUrl: './dropdowns.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownsComponent {
  selectOption(option: DropdownOption<number>): void {
    alert(`Selected ${option.name}`);
  }
}
