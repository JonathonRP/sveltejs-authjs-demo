import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		exclude: ['@sentry/sveltekit', '@sentry_integration']
	},
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'self-qw6',
				project: 'sveltekit-demos'
			}
		}),
		sveltekit()
	]
});
