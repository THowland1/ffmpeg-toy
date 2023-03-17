import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// @ts-expect-error: import has no .d.ts file
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation';

export default defineConfig({
	plugins: [sveltekit(), crossOriginIsolation()]
});
