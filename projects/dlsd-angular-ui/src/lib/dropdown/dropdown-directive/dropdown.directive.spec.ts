import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MockRender, MockedDebugElement, ngMocks } from 'ng-mocks';
import { DropdownDirective } from './dropdown.directive';

describe('DropdownDirective', () => {
  let directiveDebugElement: MockedDebugElement<DropdownDirective<unknown>>;
  let directive: DropdownDirective<unknown>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DropdownDirective],
      providers: [Overlay],
    }).compileComponents();
  });

  beforeEach(() => {
    MockRender(`<div [onyxDropdownOptions]="[]"></div>`);
    directiveDebugElement = ngMocks.find(DropdownDirective);
    directive = directiveDebugElement.componentInstance;
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
