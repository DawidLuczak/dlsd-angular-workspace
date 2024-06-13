import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControlsGroupComponent } from './form-controls-group.component';

describe('FormControlsGroupComponent', () => {
  let component: FormControlsGroupComponent;
  let fixture: ComponentFixture<FormControlsGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormControlsGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormControlsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
