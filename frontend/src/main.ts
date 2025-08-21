import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config.js';
import { App } from './app/app.js';

bootstrapApplication(App, appConfig)
  .catch((err: unknown) => console.error(err));
