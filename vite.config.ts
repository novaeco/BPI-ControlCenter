import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'lucide': ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['lucide-react']
  },
  esbuild: {
    legalComments: 'none',
    treeShaking: true
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['server/tests/**/*.test.ts'],
    setupFiles: ['server/tests/setup.ts'],
    deps: {
      optimizer: {
        ssr: {
          include: ['supertest']
        }
      }
    }
  }
});