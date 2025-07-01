import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

<<<<<<< HEAD
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
=======
export default defineConfig({
  plugins: [react({
    jsxImportSource: '@emotion/react',
    babel: {
      plugins: ['@emotion/babel-plugin'],
    },
  })],
  resolve: {
    alias: {
      '@': '/src', // Add this if you're using path aliases
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      'react-router-dom',
      'lucide-react',
      'framer-motion',
      'launchdarkly-js-client-sdk',
      'react-intersection-observer',
      '@emailjs/browser',
      '@emotion/react',
      '@emotion/styled',
    ],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
    },
  },
  server: {
    port: 5175,
    strictPort: true, // Exit if port is in use
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5175,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    },
  },
});
>>>>>>> 079c4ae (recent changes)
