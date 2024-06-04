import { TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider, MockRender, ngMocks } from 'ng-mocks';
import { of } from 'rxjs';
import {
  TOOLTIP_CONFIG,
  TooltipConfig,
  TooltipTemplateComponent,
} from './tooltip-template.component';

describe('TooltipTemplateComponent', () => {
  let component: TooltipTemplateComponent;
  let fixture: ComponentFixture<TooltipTemplateComponent>;
  const tooltipConfig: TooltipConfig = {
    context: '',
    position$: of({ arrowX: 0, arrowY: 0 }),
    close: () => undefined,
  };
  let createBeforeEach = () => {
    tooltipConfig.context = 'TooltipDataTestString';
    fixture = TestBed.createComponent(TooltipTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [TooltipTemplateComponent, TranslateModule.forRoot()],
      providers: [MockProvider(TOOLTIP_CONFIG, tooltipConfig)],
    }).compileComponents();
  }));

  beforeEach(() => {
    createBeforeEach();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inject tooltipContext as string', () => {
    beforeAll(() => {
      createBeforeEach = () => {
        tooltipConfig.context = 'TooltipDataTestString';
        fixture = TestBed.createComponent(TooltipTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      };
    });

    it('tooltipData should be a string', () => {
      expect(component.config).toEqual(tooltipConfig);
      expect(component['contextAsString']()).toEqual(
        component.config.context as string
      );
      expect(component['contextAsTemplate']()).toBeFalse();
    });

    it('should display tooltipData as text', () => {
      expect(fixture.debugElement.nativeElement.innerHTML).toContain(
        tooltipConfig.context
      );
    });
  });

  describe('inject tooltipContext as TemplateRef', () => {
    beforeAll(() => {
      createBeforeEach = () => {
        const templateContext = 'template';
        ngMocks.flushTestBed();
        const templateFixture = MockRender(
          `<ng-template #template><p>{{ templateContext }}</p></ng-template>`,
          { templateContext }
        );
        tooltipConfig.context = ngMocks.findTemplateRef(
          templateFixture,
          'template'
        );
        fixture = TestBed.createComponent(TooltipTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      };
    });

    it('tooltipData should be a TemplateRef', () => {
      expect(component.config.context).toEqual(tooltipConfig.context);
      expect(component['contextAsTemplate']()).toEqual(
        tooltipConfig.context as TemplateRef<unknown>
      );
      expect(component['contextAsString']()).toBeFalse();
    });

    it('should display TemplateRef', () => {
      expect(
        fixture.debugElement.children[0].nativeElement.innerHTML
      ).toContain('template');
    });
  });
});
