import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // We register in main.jsx only in PROD as required
      manifest: false, // Use our handcrafted public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin }) => sameOrigin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'same-origin-assets',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})

