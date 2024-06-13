import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  input,
  output,
} from '@angular/core';
import { AbstractControl, Validators } from '@angular/forms';
import { DLSDInputLabelComponent } from '../../labels';
import { DLSDFormControlErrorComponent } from '../form-control-error/form-control-error.component';

@Component({
  selector: 'dlsd-form-controls-group',
  standalone: true,
  imports: [NgStyle, DLSDFormControlErrorComponent, DLSDInputLabelComponent],
  templateUrl: './form-controls-group.component.html',
  styleUrl: './form-controls-group.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DLSDFormControlsGroupComponent {
  @HostBinding('style.width') @Input() public width = '100%';

  public type = input<'label' | 'title'>('label');
  public label = input<string>('');
  public hint = input<string>();
  public formControls = input<AbstractControl[]>();
  public gap = input<number>(0);
  public errors = input<boolean>(true);

  public labelCallback = output<void>();
  public focusInput = output<void>();

  public get required(): boolean {
    const formControls = this.formControls();
    if (formControls == null) return false;

    for (const control of formControls) {
      if (!control.hasValidator(Validators.required)) return false;
    }
    return true;
  }

  public get disabled(): boolean {
    const formControls = this.formControls();
    if (formControls == null) return false;

    for (const control of formControls) {
      if (!control.disabled) return false;
    }
    return true;
  }

  protected labelClick() {
    this.labelCallback.emit();
    this.focusInput.emit();
  }
}
