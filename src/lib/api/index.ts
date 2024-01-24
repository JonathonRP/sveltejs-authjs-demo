import type { AppRouter } from '$/server/api/root';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCSvelte } from 'trpc-svelte-query';
// import { Buxfer } from '$/server';
import { transformer } from './transformer';
import { dev } from '$app/environment';
import { refreshTokenLink } from './links/refreshLink';

const provider = 'buxfer';

export const api = createTRPCSvelte<AppRouter>({
	links: [
		loggerLink({
			enabled: (opts) => dev || (opts.direction === 'down' && opts.result instanceof Error)
		}),
		refreshTokenLink({
			async getRefreshToken(ctx) {
				return undefined;
			},
			async fetchJwtPairByRefreshToken(refresh_token) {
				// return Buxfer.client('/refresh', { refresh: refresh_token });
				return Promise.resolve({
					access: '',
					refresh: ''
				});
			},
			async onJwtPairFetched(ctx, { access, refresh }, email) {
				return Promise.resolve({
					access: '',
					refresh: ''
				});
			}
		}),
		httpBatchLink({
			url: '/api/trpc',
			async headers(opts) {
				const { context } = opts.opList[0];
				return {};
			}
		})
	],
	transformer
});

export type { AppRouter } from '$/server/api/root';
export { transformer };
