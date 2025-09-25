import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// import { visualizer } from 'rollup-plugin-visualizer';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';

// Plugin để thay thế GA4 Measurement ID trong HTML
const ga4Plugin = () => {
  return {
    name: 'ga4-plugin',
    transformIndexHtml(html, { bundle }) {
      const measurementId = process.env.VITE_GA4_MEASUREMENT_ID || 'GA_MEASUREMENT_ID';
      return html.replace(/GA_MEASUREMENT_ID/g, measurementId);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    ga4Plugin(),
    // visualizer({ open: true, gzipSize: true, brotliSize: true }), // Add visualizer plugin
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false, resolveIcons: true })], // Configure Ant Design Vue resolver
    }),
  ],
  build: {
    chunkSizeWarningLimit: 4000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/base/_variables.scss";`,
      },
    },
  },
})
