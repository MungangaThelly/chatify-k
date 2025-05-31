import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Sentry.ErrorBoundary>
);
