import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLSDIconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: DLSDIconComponent;
  let fixture: ComponentFixture<DLSDIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DLSDIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DLSDIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
