// apps/your-shell-app/src/main.ts (ou app.module.ts)
import { setRemoteDefinitions } from '@nx/angular/mf';

// Définissez l'URL de votre remote Svelte
setRemoteDefinitions({
  'mermaid': 'http://localhost:3000/remoteEntry.js',
});

import('./bootstrap').catch((err) => console.error(err));
