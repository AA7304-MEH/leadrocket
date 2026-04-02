import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    {
      name: 'diagnostic-resolver',
      resolveId(source, importer) {
        if (source.includes('@/') || source.startsWith('.')) {
          // Log only local/aliased imports to avoid noise
          const fs = require('fs');
          fs.appendFileSync('resolution_log.txt', `Resolving: ${source} from ${importer}\n`);
        }
        return null;
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },

  preview: {
    port: 4173,
    host: true,
  },
}));
