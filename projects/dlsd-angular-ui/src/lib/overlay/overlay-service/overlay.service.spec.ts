import { TestBed } from '@angular/core/testing';

import { DLSDOverlayService } from './overlay.service';

describe('OverlayService', () => {
  let service: DLSDOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DLSDOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
