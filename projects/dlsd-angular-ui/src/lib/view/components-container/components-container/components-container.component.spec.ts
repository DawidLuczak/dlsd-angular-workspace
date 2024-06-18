import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLSDComponentsContainerComponent } from './components-container.component';

describe('ComponentsContainerComponent', () => {
  let component: DLSDComponentsContainerComponent;
  let fixture: ComponentFixture<DLSDComponentsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DLSDComponentsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DLSDComponentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
