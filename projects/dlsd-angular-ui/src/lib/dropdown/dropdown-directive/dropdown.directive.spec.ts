import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MockRender, MockedDebugElement, ngMocks } from 'ng-mocks';
import { DLSDDropdownDirective } from './dropdown.directive';

describe('DropdownDirective', () => {
  let directiveDebugElement: MockedDebugElement<DLSDDropdownDirective<unknown>>;
  let directive: DLSDDropdownDirective<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DLSDDropdownDirective],
      providers: [Overlay],
    }).compileComponents();
  });

  beforeEach(() => {
    MockRender(`<div [onyxDropdownOptions]="[]"></div>`);
    directiveDebugElement = ngMocks.find(DLSDDropdownDirective);
    directive = directiveDebugElement.componentInstance;
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
