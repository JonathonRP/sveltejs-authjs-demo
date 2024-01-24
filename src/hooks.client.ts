import { handleErrorWithSentry, Replay, BrowserTracing, BrowserProfilingIntegration } from "@sentry/sveltekit";
import * as Sentry from '@sentry/sveltekit';
import { formatError } from '$lib/utils';
import { HandleClientError } from "@sveltejs/kit";
import * as Spotlight from '@spotlightjs/spotlight';
import { dev } from "$app/environment";

Sentry.init({
  dsn: 'https://5e4b9e175620069eefffa37504badc02@o4506588389900288.ingest.sentry.io/4506621599809536',
  tracesSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  
  // If you don't want to use Session Replay, just remove the line below:
  integrations: [new Replay(), new BrowserTracing(), new BrowserProfilingIntegration()],
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry((async ({ error, event }) => 
// const errorId = ulid();

// TODO - replace with logging collection data service (ex. Sentry).
// logger.error({
// 	issue: (error as Error)?.stack || (error as App.Error).message || 'Oops!',
// 	...{ event, errorId, error },
// });

  formatError(error)
) satisfies HandleClientError);

if (dev) {
  Spotlight.init({
    injectImmediately: true,
  });
}
