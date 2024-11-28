import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ru_RU, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import {
  CloseCircleOutline,
  DownloadOutline,
  ExpandOutline,
  HomeOutline,
  InboxOutline,
  ToolOutline,
} from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';

registerLocaleData(ru);

const icons = [HomeOutline, ToolOutline, InboxOutline, DownloadOutline, CloseCircleOutline, ExpandOutline];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(ru_RU),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons),
  ],
};
