import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms: ['brotli', 'gzip'],
      threshold: 512,
      deleteOriginalAssets: false,
    }),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  root: 'client',
  publicDir: 'public',
  base: '/',
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    minify: 'terser',
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    cssMinify: true,
    reportCompressedSize: false,
    sourcemap: false,
    modulePreload: {
      polyfill: true,
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-core';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'i18n';
            }
            if (id.includes('@paypal') || id.includes('paypal')) {
              return 'paypal';
            }
            if (id.includes('helmet')) {
              return 'helmet';
            }
            return 'vendor';
          }
        },
        experimentalMinChunkSize: 20000,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true,
        },
      },
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
    },
    chunkSizeWarningLimit: 400,
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    proxy: (process.env.VERCEL && process.env.VERCEL_ENV) ? undefined : {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/paypal-client-id': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/order': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    legalComments: 'none',
    treeShaking: true,
  },
});
