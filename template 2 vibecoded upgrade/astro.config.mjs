import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kasper.agency',
  server: { host: '0.0.0.0', port: 4321 },
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' }
});
