import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
import { createProxy } from './build/vite/proxy';
import pkg from './package.json';
import { format } from 'date-fns';
const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_GLOB_PROD_MOCK, VITE_PROXY } = viteEnv;
  const prodMock = VITE_GLOB_PROD_MOCK;
  const isBuild = command === 'build';
  return {
    base: VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
      ],
      dedupe: ['vue'],
    },
    plugins: createVitePlugins(viteEnv, isBuild, prodMock),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    server: {
      host: true,
      port: VITE_PORT,
      // proxy:  createProxy(VITE_PROXY),
      proxy: {
        // 接口地址代理
        '/apiEbs': {
          target: 'http://172.16.1.61:8070', // 接口的域名
          // target: 'http://124.221.211.92:3000/mock/425', // 接口的域名
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/apiEbs/, ''),
        },
        '/apiCon': {
          target: 'http://172.16.1.54:7070', // 接口的域名
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/apiCon/, ''),
        },
        '/apiKnife4j': {
          target: 'http://172.16.3.69:28080', // 接口的域名
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
          rewrite: (path) => path.replace(/^\/apiKnife4j/, ''),
        },
      },
    },
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
};
