import {
  ApplicationConfig,
  provideZoneChangeDetection,
  REQUEST,
  SecurityContext,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions, withPreloading, withRouterConfig, withDebugTracing, PreloadAllModules } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';

import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { MERMAID_OPTIONS, provideMarkdown } from 'ngx-markdown';
import { AuthService } from './modules/auth/services/auth.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeServerApp } from '@angular/fire/app';
import { ProjectService } from './modules/dashboard/services/project.service';

const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideFirebaseApp(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        return initializeApp(firebaseConfig);
      }
      const request = inject(REQUEST, { optional: true });
      const authHeader = request?.headers?.get('authorization');

      const authIdToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split('Bearer ')[1]
        : undefined;
      return initializeServerApp(firebaseConfig, {
        authIdToken,
        releaseOnDeref: request || undefined,
      });
    }),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },  
    }),
    provideAnimations(),
    provideHttpClient(),
    provideMarkdown({
      sanitize: SecurityContext.NONE,
      mermaidOptions: {
        
        provide: MERMAID_OPTIONS,
        useValue: {
          darkMode: false,
          look: 'classic',
        },
      },
    }),
    AuthService,
    ProjectService,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
};
