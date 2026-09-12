import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import prerenderer from '@prerenderer/rollup-plugin'
import puppeteerRenderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' }),
    /*
    prerenderer({
      routes: [
        '/',
        '/about',
        '/contact',
        '/program',
        '/clinical-research-cr-pv-dm-course',
        '/clinical-research-medical-writing-course',
        '/clinical-research-pharmacovigilance-course',
        '/clinical-research-regulatory-affairs-course',
        '/clinical-research-data-management-course',
        '/clinical-research-medical-coding-course',
        '/blogs',
        '/events',
        '/placements'
      ],
      renderer: puppeteerRenderer,
      rendererOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        renderAfterDocumentEvent: 'custom-render-trigger',
        renderAfterTime: 5000,
        maxConcurrentRoutes: 2
      },
      postProcess(renderedRoute) {
        // Optional: you can minify html here or clean up
        return renderedRoute;
      }
    }),*/
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 20000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true
  }
})
