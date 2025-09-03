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
    assetPrefix: '/HealthSnap/',
    // 정적 파일 경로 설정
    distPath: {
      root: 'dist',
      js: 'assets/js',
      css: 'assets/css',
      media: 'assets/media',
    },
    // HTML 파일의 base 태그 자동 설정
    injectStyles: true,
    injectScripts: true,
  },
  // 환경변수 주입
  source: {
    define: {
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'https://healthsnap-5stc.onrender.com'),
      'process.env.PUBLIC_URL': JSON.stringify('/HealthSnap'),
    },
  },
  // HTML 설정
  html: {
    template: './public/index.html',
    title: 'HealthSnap - AI 기반 건강검진 분석',
    meta: {
      description: 'AI 기반 건강검진 분석으로 나만의 맞춤 건강관리',
      keywords: '건강검진, AI분석, 식단추천, 건강점수',
    },
  },
});


