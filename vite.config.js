import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'student-yg6', // ✅ Your Sentry organization slug
      project: 'chatify-k', // ✅ Your Sentry project slug
      authToken: process.env.SENTRY_AUTH_TOKEN, // 🔐 Required for uploading
      release: process.env.RELEASE || 'chatify-k@1.0.0', // 🏷 Optional but recommended
      telemetry: false, // Optional: disable Sentry's plugin telemetry
    }),
  ],

  build: {
    sourcemap: true, // ✅ Required for source map upload
  },
});
