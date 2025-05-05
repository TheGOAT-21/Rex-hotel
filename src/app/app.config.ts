// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

// Importer les services
import { SettingsService } from './core/services/settings.service';
import { SpaceService } from './core/services/space.service';
import { MockSettingsService } from './core/services/mock/mock-settings.service';
import { MockSpaceService } from './core/services/mock/mock-space.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // Utiliser les services mock
    { provide: SettingsService, useClass: MockSettingsService },
    { provide: SpaceService, useClass: MockSpaceService }
  ]
};