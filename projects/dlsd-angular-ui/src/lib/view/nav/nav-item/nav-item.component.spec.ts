import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DLSDNavItemComponent } from './nav-item.component';

describe('NavItemComponent', () => {
  let component: DLSDNavItemComponent;
  let fixture: ComponentFixture<DLSDNavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DLSDNavItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DLSDNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
