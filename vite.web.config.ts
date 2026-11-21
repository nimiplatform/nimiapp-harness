import { defineConfig, loadEnv, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nimiWebViteConfig } from '@nimiplatform/app-tools/web';

export default defineConfig(({ command, mode }) => mergeConfig({
  root: 'web', base: './', plugins: [react(), tailwindcss()],
  build: { outDir: '../dist-web', emptyOutDir: true },
  resolve: { dedupe: ['react', 'react-dom', 'react/jsx-runtime'] },
}, nimiWebViteConfig({ root: import.meta.dirname, env: { ...loadEnv(mode, import.meta.dirname, ''), ...process.env }, serve: command === 'serve', release: mode === 'web-release' })));
