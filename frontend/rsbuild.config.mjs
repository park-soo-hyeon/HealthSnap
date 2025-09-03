import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 5173,
    open: false,
  },
  output: {
    // GitHub Pages 서브패스 배포를 위한 설정
    assetPrefix: '/HealthSnap',
    // 정적 파일 경로 설정
    distPath: {
      root: 'dist',
      js: 'assets/js',
      css: 'assets/css',
      media: 'assets/media',
    },
  },
  // 환경변수 주입
  source: {
    define: {
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'https://healthsnap-5stc.onrender.com'),
    },
  },
});


