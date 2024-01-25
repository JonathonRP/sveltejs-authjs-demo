import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { SvelteKitAuth } from '@auth/sveltekit';
import { parseAcceptLanguage } from 'intl-parse-accept-language';
import { formatError } from '$lib/utils';
import GitHub from '@auth/sveltekit/providers/github';
import LinkedIn from '@auth/sveltekit/providers/linkedin';
import Google from '@auth/sveltekit/providers/google';
import Facebook from '@auth/sveltekit/providers/facebook';
import Twitter from '@auth/sveltekit/providers/twitter';
import Auth0 from '@auth/sveltekit/providers/auth0';
import Discord from '@auth/sveltekit/providers/discord';
import Twitch from '@auth/sveltekit/providers/twitch';
import Pinterest from '@auth/sveltekit/providers/pinterest';
import Email from '@auth/sveltekit/providers/email';
import { setupSidecar } from '@spotlightjs/spotlight/sidecar';
import { Handle, HandleServerError, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { adapter } from '$/server/db';
import { ulid } from 'ulid';

Sentry.init({
    dsn: "https://5e4b9e175620069eefffa37504badc02@o4506588389900288.ingest.sentry.io/4506621599809536",
    tracesSampleRate: 1.0,
		spotlight: dev
})

function authentication() {
	return (async (...args) => SvelteKitAuth({
		providers: [
			Email({
				type: 'email'
			})
		],
		adapter,
		session: {
			strategy: 'database',
			generateSessionToken: () => ulid()
		},
		callbacks: {
			session: ({ session }) => {
				return {
					...session
				};
			}
		}
	})(...args)) satisfies Handle;
}

function loginAndResume(url: URL, loginEndpoint: string, redirectReason?: string) {
	const { pathname, search } = url;
	return `${loginEndpoint}${pathname.slice(1, -1) ? `?redirectTo=${pathname.slice(1, -1)}${search}${redirectReason ? `&reason=${redirectReason}` : ''}` : ''}`;
}

function authorization() {
	return (async ({ event, resolve }) => {
		const { url, request: { headers }, route } = event;
		const session = await event.locals.auth();
		

		// if (!session && !route.id?.includes('auth')) {
		// 	console.log('redirect hook', route)
		// 	return redirect(302, loginAndResume(url, '/auth'));
		// }

		// if (!headers.get('Authorization') && route.id?.includes('finanseer')) {
		// 	console.log(`/user/linkBuxferAccount${url.search.slice(1)}`);
		// }

		// REVIEW - is this needed?
		// if (session && redirectTo) {
		// 	return redirect(302, `/${redirectTo.slice(1)}`);
		// }
		
		return resolve(event);
	}) satisfies Handle;
}

function setup() {
	return (async ({ event, resolve }) => {
		const { request: { headers } } = event;
		const locales = parseAcceptLanguage(headers.get('accept-language') || '');

		const locale = locales.length ? locales[0] : 'en-US';
		const timezone = headers.get('x-vercel-ip-timezone');

		console.log(locale);
		console.log(timezone ?? 'no timezone');

		return resolve(event);
	}) satisfies Handle;
}

export const handle = sequence(Sentry.sentryHandle(), sequence(authentication(), authorization(), setup()));
export const handleError = Sentry.handleErrorWithSentry((async ({ error, event }) => {
// const errorId = ulid();

// TODO - replace with logging collection data service (ex. Sentry).
// logger.error((error as Error)?.stack || (error as App.Error).message || 'Oops!', { event, errorId, error });
 console.log('error');
 formatError(error)
}) satisfies HandleServerError);

if (dev) {
  setupSidecar();
}