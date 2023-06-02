import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Component from "unplugin-vue-components/vite";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx';
import optimizer from "vite-plugin-optimizer";
import { devPlugin, getReplacer } from "./src/plugins/devPlugin"
import topLevelAwait from 'vite-plugin-top-level-await'

declare interface ViteEnv {
  VITE_ENV: string,
  VITE_API_KEY: string
  VITE_OSS: string
}
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname) as unknown as ViteEnv;
  return {
    base: './',
    define: {
      GLOB: Object.freeze(env),
    },
    plugins: [
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: i => `__tla_${i}`
      }),
      vueJsx(),
      vue(),
      Component({
        dts: "./src/types/auto-coms.d.ts",
        dirs: [
          "src/components/**",
          "./src/pages/**",
        ],
        resolvers:
          [
            ElementPlusResolver()
          ]
      }),
      AutoImport({
        imports: ["vue", "vue-router", '@vueuse/head', '@vueuse/core',],
        dts: "./src/types/auto-apis.d.ts",
        dirs: ["./src/store/**", "./src/composables/*", "./src/utils/**", "./src/api/**"],
        resolvers: [ElementPlusResolver()]
      }),
      // optimizer(getReplacer()), devPlugin()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "#": path.resolve(__dirname, "./src/pages"),
        "com": path.resolve(__dirname, "./src/pages/Home/com"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/assets/styles/index.scss";',
          javascriptEnabled: true,
        },
      },
    },
    build: {
      assetsDir: './',
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        }
      }
    }
  }
})