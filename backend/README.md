# Food Lite Health Checkup Backend 🏥

NestJS 기반의 건강검진 데이터 관리 및 분석 API 서버입니다.

## 🚀 주요 기능

- **건강검진 데이터 CRUD**: 생성, 조회, 수정, 삭제
- **검색 기능**: 이름별, 기간별 검색
- **건강 위험도 분석**: BMI, 혈압, 혈당, 콜레스테롤 등 종합 분석
- **Swagger API 문서**: 자동 생성된 API 문서
- **데이터 검증**: Class-validator 기반 입력 데이터 검증

## 📋 API 엔드포인트

### 건강검진 데이터 관리

- `POST /api/v1/health-checkups` - 건강검진 데이터 생성
- `GET /api/v1/health-checkups` - 모든 데이터 조회
- `GET /api/v1/health-checkups/:id` - 특정 데이터 조회
- `PATCH /api/v1/health-checkups/:id` - 데이터 수정
- `DELETE /api/v1/health-checkups/:id` - 데이터 삭제

### 검색 기능

- `GET /api/v1/health-checkups/search/by-name?name=홍길동` - 이름으로 검색
- `GET /api/v1/health-checkups/search/by-date-range?startDate=2024-01-01&endDate=2024-12-31` - 기간별 검색

### 분석 기능

- `GET /api/v1/health-checkups/:id/analyze` - 건강 위험도 분석

## 🛠️ 설치 및 실행

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.example .env
```

### 3. 개발 서버 실행
```bash
npm run start:dev
```

### 4. 프로덕션 빌드
```bash
npm run build
npm run start:prod
```

## 📚 API 문서

서버 실행 후 다음 URL에서 Swagger UI를 통해 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:3000/api-docs

## 🗄️ 데이터베이스

- **타입**: SQLite (개발용)
- **파일**: `health-checkup.db`
- **ORM**: TypeORM

### 데이터 스키마

```typescript
{
  id: number;                          // 검진 ID (자동 생성)
  name: string;                        // 성명
  birthDate: string;                   // 주민등록번호 (생년월일)
  sex: string;                         // 성별
  height: number;                      // 신장(cm)
  weight: number;                      // 체중(kg)
  waistCircumference: number;          // 허리둘레(cm)
  bmi: number;                         // 체질량지수(kg/m²)
  hasDiagnosis: boolean;               // 질병 진단 여부
  isMedicated: boolean;                // 복용 중인 약물 여부
  hasTraumaOrAftereffects: boolean;    // 외상 또는 후유증 여부
  lifestyle: string;                   // 생활습관
  generalCondition: string;            // 전반적 건강상태
  visionLeft: number;                  // 시력(좌)
  visionRight: number;                 // 시력(우)
  isHearingLeftNormal: boolean;        // 청력(좌) 정상 여부
  isHearingRightNormal: boolean;       // 청력(우) 정상 여부
  bloodPressureSystolic: number;       // 최고 혈압
  bloodPressureDiastolic: number;      // 최저 혈압
  isProteinuriaPositive: boolean;      // 요단백 양성 여부
  hemoglobin: number;                  // 혈색소
  fastingBloodSugar: number;           // 식전혈당
  totalCholesterol: number;            // 총콜레스테롤
  hdlCholesterol: number;              // HDL-콜레스테롤
  triglycerides: number;               // 트리글리세라이드
  ldlCholesterol: number;              // LDL-콜레스테롤
  serumCreatinine: number;             // 혈청크레아티닌
  astSgot: number;                     // AST(SGOT)
  altSgpt: number;                     // ALT(SGPT)
  gammaGtp: number;                    // 감마지티피(γ-GTP)
  isHepatitisBAntigenPositive?: boolean; // B형간염항원 양성 여부
  isHepatitisBAntibodyPositive?: boolean; // B형간염항체 양성 여부
  isChestXrayNormal: boolean;          // 흉부방사선검사 정상 여부
  checkupDate: string;                 // 검진일
  checkupCenterName: string;           // 검진기관명
  hepatitis?: boolean;                 // 간염 검사 여부
  createdAt: Date;                     // 생성일시
  updatedAt: Date;                     // 수정일시
}
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# 테스트 커버리지
npm run test:cov

# E2E 테스트
npm run test:e2e
```

## 📊 건강 위험도 분석 기준

### BMI 분석
- **정상**: < 25
- **과체중**: 25-29.9
- **비만**: ≥ 30

### 혈압 분석
- **정상**: < 130/80 mmHg
- **고혈압 전단계**: 130-139/80-89 mmHg
- **고혈압**: ≥ 140/90 mmHg

### 혈당 분석
- **정상**: < 100 mg/dL
- **공복혈당장애**: 100-125 mg/dL
- **당뇨병**: ≥ 126 mg/dL

### 콜레스테롤 분석
- **정상**: < 200 mg/dL
- **경계성**: 200-239 mg/dL
- **고콜레스테롤**: ≥ 240 mg/dL

## 🔧 개발 도구

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: SQLite + TypeORM
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## 📝 라이선스

MIT License
