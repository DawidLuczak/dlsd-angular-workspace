import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLSDCloseButtonComponent } from './close-button.component';

describe('CloseButtonComponent', () => {
  let component: DLSDCloseButtonComponent;
  let fixture: ComponentFixture<DLSDCloseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DLSDCloseButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DLSDCloseButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
