import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      sentryVitePlugin({
        org: 'student-yg6',
        project: 'chatify-k',
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN || '',
        release: process.env.VITE_RELEASE || 'chatify-k@1.0.0',
        telemetry: false,
      }),
    ],
    build: {
      sourcemap: true,
    },
  };
});
