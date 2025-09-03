import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 5173,
    open: false,
  },
  output: {
    // 도메인 사용으로 단순화
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
      'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
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


