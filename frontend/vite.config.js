import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendPort = process.env.BACKEND_PORT || env.BACKEND_PORT || "3001";
  const proxyTarget =
    process.env.VITE_API_PROXY_TARGET ||
    env.VITE_API_PROXY_TARGET ||
    `http://127.0.0.1:${backendPort}`;

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: Number(process.env.FRONTEND_PORT || env.FRONTEND_PORT) || 3000,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
