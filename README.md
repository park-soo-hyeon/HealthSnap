# 🍽️ HealthSnap - AI 기반 건강검진 분석 시스템

<div align="center">
  <img src="public/image/main.png" alt="HealthSnap 메인화면" width="800"/>
  <br/><br/>
  
  [![React](https://img.shields.io/badge/React-18.0-blue?logo=react)](https://reactjs.org/)
  [![NestJS](https://img.shields.io/badge/NestJS-10.0-red?logo=nestjs)](https://nestjs.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Gemini AI](https://img.shields.io/badge/Gemini-1.5%20Flash-green?logo=google)](https://ai.google.dev/)
  [![AI-Hub](https://img.shields.io/badge/AI--Hub-Dataset-orange)](https://aihub.or.kr/)
  
  **건강검진 결과를 5분 만에 AI 분석하여 개인별 맞춤 식단을 추천하는 서비스**
</div>

---

## 🌐 **라이브 데모 & 무료 배포 (24시간 접근)**

### 🚀 **지금 바로 체험하세요!**

<div align="center">
  
  [![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-지금_체험하기-00C851?style=for-the-badge&logo=globe&logoColor=white)](https://health-snap.kro.kr/)
  
  **🔗 웹앱 URL: [https://health-snap.kro.kr/](https://health-snap.kro.kr/)**
  
</div>

---

## 👥 개발팀

| 역할 | 개발자 | 담당 업무 |
|------|--------|-----------|
| **🎯 팀장** | **김인성** [@Danto7632](https://github.com/Danto7632) | 데이터 전처리, 백엔드 개발, 프론트엔드 개선 |
| **💻 프론트엔드** | **박수현** [@park-soo-hyeon](https://github.com/park-soo-hyeon) | 프론트엔드 개발, API 연결 |

---

## 🚀 서비스 소개

### 🎬 시연 영상

<div align="center">
  <a href="https://youtu.be/55BXg13ntFM">
    <img src="https://img.shields.io/badge/🎥_YouTube-시연영상_보기-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="HealthSnap 시연 영상" width="300" height="80"/>
  </a>
  <br/>
  <em>👆 클릭하여 HealthSnap 실제 동작 영상을 확인하세요!</em>
</div>

### 🎯 핵심 기능
- **⚡ 5분 빠른 분석**: 건강검진 결과 입력 후 즉시 AI 분석
- **🤖 Gemini AI 활용**: Google 최신 AI로 정확한 건강 상태 평가
- **🍽️ 맞춤 식단 추천**: AI-Hub 401종 한국 음식 데이터 기반 개인화 추천
- **📊 건강 점수**: 13개 지표 종합한 0-100점 건강 점수 제공
- **🔐 개인화 서비스**: JWT 인증으로 개인별 건강 이력 관리

### 🎨 서비스 플로우

| 1️⃣ 건강검진 입력 | 2️⃣ AI 분석 중 |
|:---:|:---:|
| <img src="public/image/input.png" alt="건강검진 입력" width="450"/> | <img src="public/image/loading.png" alt="AI 분석 중" width="450"/> |
| 개인 건강검진 데이터 입력 | Gemini AI가 실시간 분석 |

| 3️⃣ 분석 결과 | 4️⃣ 식단 추천 |
|:---:|:---:|
| <img src="public/image/result.png" alt="분석 결과" width="450"/> | <img src="public/image/recommend.png" alt="식단 추천" width="450"/> |
| 종합 건강 점수 및 AI 소견 | 개인 맞춤 식단 6가지 이내 추천 |

| 5️⃣ 검진 이력 | 6️⃣ 상세 분석 |
|:---:|:---:|
| <img src="public/image/history.png" alt="검진 이력" width="450"/> | <img src="public/image/detail.png" alt="상세 분석" width="450"/> |
| 개인별 검진 이력 관리 | 상세 분석 결과 확인 |

### 🔐 로그인 vs 비로그인 서비스

| 기능 | 🌐 비로그인 사용자 | 🔒 로그인 사용자 |
|------|-------------------|------------------|
| **건강검진 입력** | ✅ 1단계부터 전체 입력 | ✅ 2단계부터 (기본정보 자동입력) |
| **AI 분석 결과** | ✅ 즉시 확인 가능 | ✅ 즉시 확인 + DB 저장 |
| **식단 추천** | ✅ 6가지 추천 확인 | ✅ 6가지 추천 + 영양정보 |
| **검진 기록** | ❌ "로그인 후 이용해주세요" | ✅ 개인별 이력 관리 |
| **데이터 저장** | ❌ 일회성 분석만 | ✅ 영구 저장 및 트렌드 분석 |

<details>
<summary>📱 비로그인 이용 시 화면</summary>

<div align="center">
  <img src="public/image/Non-login-history.png" alt="비로그인 검진기록" width="600"/>
  <br/>
  <em>비로그인 상태에서 검진 기록 접근 시 로그인 유도 화면</em>
</div>

</details>

---

## 📊 데이터 전처리 성과

### 🎯 압축 성과
<div align="center">
  <img src="public/image/data.png" alt="데이터 전처리 과정" width="600"/>
  <br/><br/>
  
  | 항목 | 원본 (AI-Hub) | 처리 후 | 압축률 | 성과 |
  |------|---------------|---------|--------|------|
  | **전체 용량** | ~6GB | 732KB | **99.988% ↓** | Git 일반 파일로 관리 |
  | **이미지 수** | 842,000장 | 0장* | 100% ↓ | *백엔드 API만 활용 |
  | **음식 종류** | 400+ 종 | 401 종 | 유지 | 품질 검증 완료 |
  | **영양정보** | 분산 Excel | 표준 CSV | 구조화 | 실시간 로드 |
  | **검색 성능** | 기본 명칭 | +85개 별칭 | 향상 | 동의어 사전 |
  
</div>

<details>
<summary>🔧 전처리 과정 상세</summary>

### 1️⃣ 원본 데이터 분석
```python
# 84.5만장 이미지 + JSON 라벨링 분석
python aihub_food_litepack.py --analyze raw/
```

### 2️⃣ 영양정보 표준화
```python
# 결측값 보정 로직
- kcal 부재 → 탄수화물×4 + 단백질×4 + 지방×9 (Atwater 계수)
- 포화지방 부재 → 총지방의 35% 추정
- 제공량 부재 → 카테고리별 기본값 (밥류 210g, 국물류 500g)
```

### 3️⃣ 동의어 사전 구축
```python
# 검색 최적화를 위한 별칭 매핑
aliases = {
    "galbitang": ["갈비탕", "소갈비탕", "LA갈비탕"],
    "kimcijjigae": ["김치찌개", "김치찜", "묵은지찌개"],
    "bibimbab": ["비빔밥", "돌솥비빔밥", "야채비빔밥"]
}
```

### 4️⃣ 최종 데이터셋
- **`nutrition.csv`**: 401개 음식 영양정보 (34KB)
- **`aliases.csv`**: 85개 검색 별칭 (3KB)

</details>

---

## 🔧 백엔드 개발

### 🏗️ 기술 스택
- **NestJS**: TypeScript 기반 모듈러 아키텍처
- **TypeORM**: Code-First 데이터 모델링
- **JWT**: Stateless 인증 시스템
- **SQLite**: 개발용 경량 DB (MySQL 마이그레이션 준비)
- **Swagger**: 자동 API 문서화

### 🤖 주요 기능
- **AI 서비스**: AI-Hub 401개 음식 데이터 실시간 로드 및 Gemini AI 건강 분석
- **인증 시스템**: JWT 기반 사용자별 데이터 격리
- **API 엔드포인트**: 로그인/비로그인 사용자 구분 서비스

<details>
<summary>📋 API 명세</summary>

### 인증 API
```http
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "김인성",
  "phone": "010-1234-5678",
  "birthDate": "19901225",
  "gender": "남"
}

POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
→ { "access_token": "eyJhbGci...", "user": {...} }
```

### 건강검진 분석 API
```http
# 로그인 사용자: 분석 + 저장
POST /Ai/db
Authorization: Bearer eyJhbGci...

# 비로그인 사용자: 분석만
POST /Ai/analyze

{
  "name": "김인성",
  "birthDate": "19901225",
  "height": 175.0,
  "weight": 70.0,
  "bmi": 22.9,
  "bloodPressureSystolic": 120,
  "bloodPressureDiastolic": 80,
  "fastingBloodSugar": 95.0,
  // ... 기타 건강검진 데이터
}
```

### 응답 형식
```json
{
  "healthScore": 85,
  "finalmessage": "전반적으로 양호한 건강상태입니다...",
  
  // 추천 식단 (6개)
  "food_name1": "현미밥", "grams1": 150,
  "food_name2": "갈비탕", "grams2": 500,
  
  // 예측 평균값 vs 실제값
  "ave_bmi": 23.0, "bmi": 22.9,
  "ave_bloodPressureSystolic": 125, "bloodPressureSystolic": 120
}
```

</details>

<details>
<summary>🗃️ 데이터 스키마</summary>

### Users 테이블
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,  -- bcrypt 해시
  name VARCHAR NOT NULL,
  phone VARCHAR,
  birthDate DATE,
  gender VARCHAR,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Health Checkups 테이블
```sql
CREATE TABLE health_checkups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  
  -- 기본 정보
  name VARCHAR, height FLOAT, weight FLOAT, bmi FLOAT,
  
  -- 생체 지표
  bloodPressureSystolic INTEGER, bloodPressureDiastolic INTEGER,
  fastingBloodSugar FLOAT, totalCholesterol FLOAT,
  
  -- AI 분석 결과
  healthScore INTEGER,      -- 0-100점
  finalmessage TEXT,        -- AI 건강 소견
  
  -- 추천 식단 (6개)
  food_name1 VARCHAR, grams1 FLOAT, protein1 FLOAT,
  food_name2 VARCHAR, grams2 FLOAT, protein2 FLOAT,
  -- ...
  
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### AI-Hub 영양 데이터
```csv
food_id,name_kr,serving_g,kcal,carb_g,protein_g,fat_g,sodium_mg
ssalbab,쌀밥,210.0,313.9,73.71,5.76,0.45,59.4
galbitang,갈비탕,500.0,284.0,5.2,25.8,12.4,890.5
bibimbab,비빔밥,450.0,567.2,89.4,18.9,15.2,1205.3
```

</details>

---

## 🎨 프론트엔드 개발

### 🏗️ 기술 스택
- **React 18**: 함수형 컴포넌트 + Hooks
- **Context API**: JWT 인증 전역 상태 관리
- **Rsbuild**: 고속 번들링 도구
- **반응형 CSS**: 모바일/데스크톱 최적화

### 🎯 주요 기능
- **인증 시스템**: JWT 기반 전역 상태 관리 및 보호된 라우팅
- **사용자 경험**: 로딩 UI, 에러 처리, 반응형 디자인
- **서비스 분기**: 로그인/비로그인 사용자별 차별화된 서비스 제공

---
## 🚀 배포 구성

| 구성 요소 | 플랫폼 | 비용 | 특징 |
|-----------|--------|------|------|
| **🌐 Frontend** | GitHub Pages | 무료 | 자동 배포, 커스텀 도메인 |
| **🔧 Backend API** | Render Free | 무료 | 15분 슬립, 자동 배포 |
| **🗄️ Database** | Neon Free | 무료 | Serverless PostgreSQL |

### ⚠️ **무료 플랜 제한사항**

- **Render**: 15분 비활성 시 슬립 → 첫 요청 시 30초 지연
- **Neon**: 5분 비활성 시 scale-to-zero → 첫 쿼리 시 웜업
- **결론**: 24시간 접근 가능하지만 처음 호출은 다소 느릴 수 있음

---
## 🎯 핵심 성과

### 📊 데이터 처리
- ✅ **99.988% 압축**: 6GB → 732KB 극한 최적화
- ✅ **100% 품질**: 401개 음식 영양정보 완전 보정
- ✅ **85% 검색 향상**: 동의어 사전으로 검색 커버리지 확대

### 🤖 AI 분석
- ✅ **실시간 분석**: Gemini 1.5 Flash로 5초 내 결과
- ✅ **개인화 추천**: 나이/성별/건강상태 기반 맞춤 식단
- ✅ **의학적 근거**: Atwater 계수 기반 정확한 영양 계산

---

## 📈 향후 개발 계획

### 📋 Next Feature
- **🔍 건강검진표 OCR 처리**: 이미지 업로드로 자동 데이터 입력

---

<div align="center">
  <h3>🎯 5분 만에 AI 건강 분석, 지금 시작하세요!</h3>
  
  <em>✨ 완전 무료로 24시간 언제든 이용 가능합니다!</em>
</div>