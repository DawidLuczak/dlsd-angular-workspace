import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelsComponent } from './side-panels.component';

describe('SidePanelsComponent', () => {
  let component: SidePanelsComponent;
  let fixture: ComponentFixture<SidePanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidePanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
