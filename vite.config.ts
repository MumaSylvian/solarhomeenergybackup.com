import { sites } from '@openai/sites-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [tailwindcss(), vinext(), sites()] });
