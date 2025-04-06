import {
  mergeApplicationConfig,
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  REQUEST,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { environment } from '../environments/environment';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { initializeApp, initializeServerApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { isPlatformBrowser } from '@angular/common';

const firebaseConfig = {
  apiKey: environment.firebase.apiKey,
  authDomain: environment.firebase.authDomain,
  projectId: environment.firebase.projectId,
  storageBucket: environment.firebase.storageBucket,
  messagingSenderId: environment.firebase.messagingSenderId,
  appId: environment.firebase.appId,
};
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    provideFirebaseApp(() => {
      if (isPlatformBrowser(inject(PLATFORM_ID))) {
        return initializeApp(firebaseConfig);
      }
      // Optional, since it's null in dev-mode and SSG
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
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
