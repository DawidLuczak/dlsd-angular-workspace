import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLSDCustomIconComponent } from './custom-icon.component';

describe('CustomIconComponent', () => {
  let component: DLSDCustomIconComponent;
  let fixture: ComponentFixture<DLSDCustomIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DLSDCustomIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DLSDCustomIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
