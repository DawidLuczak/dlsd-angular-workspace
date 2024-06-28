import { TestBed } from '@angular/core/testing';

import { DLSDSidePanelService } from './side-panel.service';

describe('SidePanelService', () => {
  let service: DLSDSidePanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DLSDSidePanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
