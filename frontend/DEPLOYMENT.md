# 🚀 HealthSnap Frontend 배포 가이드

## 📋 배포 전 준비사항

### 1️⃣ **GitHub Repository 설정**
- Repository 이름: `HealthSnap`
- GitHub Pages 설정: Settings → Pages → Source = GitHub Actions

### 2️⃣ **환경변수 설정**
```bash
# frontend/.env 파일 생성
API_BASE_URL=https://healthsnap-5stc.onrender.com
GITHUB_PAGES_PATH=/HealthSnap
```

## 🔧 배포 단계

### 1️⃣ **자동 배포 (GitHub Actions)**
```bash
# main 브랜치에 frontend/ 폴더 변경사항 푸시
git add .
git commit -m "Update frontend for GitHub Pages deployment"
git push origin main
```

**GitHub Actions가 자동으로 실행됩니다:**
- ✅ 의존성 설치
- ✅ 프로덕션 빌드
- ✅ GitHub Pages 배포

### 2️⃣ **수동 배포 (로컬)**
```bash
# 의존성 설치
npm install

# 환경변수 설정
export API_BASE_URL=https://healthsnap-5stc.onrender.com

# 프로덕션 빌드
npm run build

# dist/ 폴더를 GitHub Pages에 업로드
```

## 🌐 배포 후 확인

### **배포 URL**
- **메인 페이지**: https://danto7632.github.io/HealthSnap/
- **API 문서**: https://healthsnap-5stc.onrender.com/api-docs

### **테스트 체크리스트**
- [ ] 메인 페이지 로딩
- [ ] 로그인/회원가입 기능
- [ ] 건강검진 입력 및 분석
- [ ] 검진 이력 조회
- [ ] API 연결 상태

## 🚨 문제 해결

### **빈 화면이 나오는 경우**
1. `rsbuild.config.mjs`의 `assetPrefix` 확인
2. GitHub Pages 설정에서 Source = GitHub Actions 확인
3. Actions 로그에서 빌드 오류 확인

### **API 연결 실패**
1. 백엔드 서버 상태 확인
2. CORS 설정 확인
3. 환경변수 `API_BASE_URL` 확인

### **라우팅 404 오류**
1. `public/404.html` 파일 존재 확인
2. GitHub Pages 설정에서 404 페이지 설정 확인

## 📱 모바일 최적화

### **PWA 설정**
- `public/manifest.json` 설정 완료
- 오프라인 지원 가능
- 앱 아이콘 및 스플래시 스크린

### **반응형 디자인**
- 모바일/태블릿/데스크톱 최적화
- 터치 제스처 지원
- 접근성 향상

## 🔄 업데이트 배포

### **자동 배포**
- `frontend/` 폴더 변경 시 자동 배포
- GitHub Actions 워크플로우 실행
- 배포 완료까지 약 2-3분 소요

### **수동 배포**
- `npm run build` 실행
- `dist/` 폴더 내용을 GitHub Pages에 업로드

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:
1. GitHub Actions 로그
2. 브라우저 개발자 도구 콘솔
3. 네트워크 탭의 API 요청 상태
4. 백엔드 서버 로그