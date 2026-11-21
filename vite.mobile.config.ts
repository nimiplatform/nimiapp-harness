import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { androidConfiguration } from './mobile-config';

export default defineConfig(() => ({
  root: 'mobile', base: './', plugins: [react(), tailwindcss()],
  define: { __NIMI_APP_ANDROID_CONFIG__: JSON.stringify(androidConfiguration().remote) },
  build: { outDir: '../dist-mobile', emptyOutDir: true },
  resolve: { dedupe: ['react', 'react-dom', 'react/jsx-runtime'] },
}));
