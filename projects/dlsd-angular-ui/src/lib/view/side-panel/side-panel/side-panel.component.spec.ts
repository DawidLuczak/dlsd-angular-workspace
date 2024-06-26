import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLSDSidePanelComponent } from './side-panel.component';

describe('SidePanelComponent', () => {
  let component: DLSDSidePanelComponent;
  let fixture: ComponentFixture<DLSDSidePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DLSDSidePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DLSDSidePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
