import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { DLSDToastService } from './toast.service';

describe('OnyxToastServiceService', () => {
  let service: DLSDToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockProvider(TranslateService)],
    });
    service = TestBed.inject(DLSDToastService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create overlay and attach toaster component to it', () => {
    expect(service['toasts']()).toHaveSize(0);
    expect(service['overlayRef']()).toBeDefined();
    expect(document.querySelectorAll('onyx-toaster')).toHaveSize(1);
  });

  it('should add toast', () => {
    const toast = service.showSuccess('Test');
    expect(service['toasts']().includes(toast)).toBeTrue();
  });
});
