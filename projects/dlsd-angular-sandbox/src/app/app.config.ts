import { registerLocaleData } from '@angular/common';
import { HttpBackend, provideHttpClient } from '@angular/common/http';
import localePl from '@angular/common/locales/pl';
import {
  ApplicationConfig,
  LOCALE_ID,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { routes } from './app.routes';

registerLocaleData(localePl);

export const createTranslateLoader = (http: HttpBackend) =>
  new MultiTranslateHttpLoader(http, [
    { prefix: '/assets/i18n/', suffix: '.json' },
  ]);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'pl',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpBackend],
        },
      })
    ),
    {
      provide: LOCALE_ID,
      useValue: 'pl',
    },
  ],
};
