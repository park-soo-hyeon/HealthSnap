# Food Lite Dataset 🍽️

AI-Hub [음식 이미지 및 영양정보 텍스트 데이터](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=74)를 경량화하고 정제한 프로젝트입니다.

## 📊 원본 데이터셋 개요

- **출처**: AI-Hub 음식 이미지 및 영양정보 텍스트 데이터
- **구축년도**: 2020년
- **데이터량**: 84.5만장의 음식 이미지 (400종 이상)
- **구성**: 일반 음식 이미지 80만장 + 정밀 촬영 4.2만장
- **포맷**: 이미지 파일, JSON 어노테이션, 영양정보 메타데이터

## 🎯 정제 목표

원본 84.5만장 → **핵심 데이터만 추출하여 경량화**
- 중복 제거 및 품질 필터링
- 영양정보 표준화 및 결측값 보정
- 동의어 사전 구축
- 이미지 압축 및 리사이징

## 📁 프로젝트 구조

```
food_lite/
├── raw/                          # 원본 AI-Hub 데이터 (별도 다운로드 필요)
│   └── README_DOWNLOAD.md        # 다운로드 가이드 (6GB+ 파일들)
│
├── main/                         # 🎯 최종 핵심 데이터셋
│   ├── nutrition.csv             # 정제된 영양정보 (401개 메뉴)
│   └── aliases.csv               # 동의어 사전 (85개 매핑)
│
├── lite/                         # 경량화된 전체 데이터
│   ├── nutrition.parquet         # Parquet 형식 영양정보
│   ├── nutrition.jsonl           # JSONL 형식 영양정보
│   ├── aliases.csv               # 동의어 사전
│   ├── keep_classes.txt          # 핵심 메뉴 리스트
│   └── images/                   # 경량화된 이미지 (WebP, 384px)
│       ├── ssalbab/primary_0.webp
│       ├── galbitang/primary_0.webp
│       └── ...
│
├── aihub_food_litepack.py        # 데이터 정제 메인 스크립트
├── prep_lite_from_local.py       # 로컬 정제 헬퍼
└── debug_logs/                   # 정제 과정 로그
```

## 🛠️ 데이터 정제 과정

### 0단계: 원본 데이터 다운로드
```bash
# raw/README_DOWNLOAD.md 파일 참조
# AI-Hub에서 약 6GB의 원본 데이터 다운로드
```

### 1단계: 원본 데이터 분석
```bash
python aihub_food_litepack.py --analyze raw/
```
- ZIP 파일 구조 분석
- 라벨링 데이터 매핑 확인
- 영양정보 컬럼 일치성 검증

### 2단계: 영양정보 정제
- **컬럼 표준화**: `name_kr`, `serving_g`, `carb_g`, `protein_g`, `fat_g`, `sugar_g`, `sodium_mg`
- **결측값 보정**:
  - `kcal` 없으면 Atwater 계수(탄수화물 4, 단백질 4, 지방 9)로 계산
  - `satfat_g` 없으면 총 지방의 35%로 추정
  - `serving_g` 기본값 채움 (카테고리별 기본값 적용)
- **ID 생성**: 한글명 → ASCII 슬러그 (`food_id`)

### 3단계: 동의어 사전 구축
- 라벨링 ZIP에서 메뉴명 변형 추출
- 표기 통일 (예: "갈비탕" ↔ "소갈비탕")
- 검색 성능 향상을 위한 alias 매핑

### 4단계: 이미지 경량화
```bash
python aihub_food_litepack.py --extract raw/ --output lite/
```
- **포맷 변환**: JPG/PNG → WebP
- **리사이징**: 최대 384px (종횡비 유지)
- **압축**: 품질 80% (용량 최적화)
- **선별**: 메뉴당 대표 이미지 1장

### 5단계: 최종 데이터셋 생성
```bash
python prep_lite_from_local.py
```
- `main/` 폴더에 핵심 2개 파일 생성
- API 서빙용 최적화된 형태

## 📈 정제 결과

| 항목 | 원본 | 정제 후 | 압축률 |
|------|------|---------|--------|
| 이미지 수 | 842,000장 | 85장 | 99.99% ↓ |
| 메뉴 수 | 400+ 종 | 401 종 | 유지 |
| 이미지 용량 | ~50GB | ~2MB | 99.996% ↓ |
| 영양정보 | 분산된 형태 | 표준화된 CSV | 구조화 |

## 🔧 주요 스크립트

### `aihub_food_litepack.py`
메인 정제 스크립트
- ZIP 파일 스트리밍 처리
- 이미지 리사이징 및 WebP 변환
- 영양정보 표준화
- 동의어 추출

### `prep_lite_from_local.py`
로컬 환경용 정제 헬퍼
- 이미 다운로드된 파일 기반 처리
- 빠른 재처리를 위한 캐시 활용

## 🚀 활용 방법

### 1. 데이터 로딩
```python
import pandas as pd

# 영양정보 로드
nutrition = pd.read_csv('main/nutrition.csv')
aliases = pd.read_csv('main/aliases.csv')

print(f"총 {len(nutrition)}개 메뉴")
print(f"동의어 매핑 {len(aliases)}개")
```

### 2. API 서버 실행
```bash
python food_api.py
# http://localhost:8080 에서 서비스 시작
```

### 3. 주요 API 엔드포인트
- `GET /foods/search?q=밥` - 메뉴 검색
- `POST /recommend` - 개인화 추천
- `POST /plan/day` - 1일 식단 계획
- `GET /images/{food_id}` - 음식 이미지

## 📋 데이터 스키마

### nutrition.csv
```csv
food_id,name_kr,serving_g,carb_g,protein_g,fat_g,sugar_g,sodium_mg
ssalbab,쌀밥,210.0,73.71,5.76,0.45,0.0,59.4
galbitang,갈비탕,500.0,5.2,25.8,12.4,2.1,890.5
```

### aliases.csv
```csv
food_id,name_kr,alias
ssalbab,쌀밥,쌀밥
galbitang,갈비탕,갈비탕
galbitang,갈비탕,소갈비탕
```

## 🎯 품질 보증

- **영양성분 정확도**: Atwater 계수 기반 칼로리 계산
- **이미지 품질**: 고해상도 원본에서 384px 리사이징
- **데이터 일관성**: 전체 파이프라인 자동화로 휴먼 에러 방지
- **검색 성능**: 동의어 사전으로 검색 커버리지 향상

## 📄 라이선스

원본 데이터는 [AI-Hub 이용약관](https://aihub.or.kr)을 따릅니다.

---

*최종 핵심 데이터셋: `main/nutrition.csv` (401개 메뉴) + `main/aliases.csv` (85개 매핑)*