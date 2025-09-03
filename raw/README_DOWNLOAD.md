# AI-Hub 원본 데이터 다운로드 가이드

이 프로젝트는 [AI-Hub 음식 이미지 및 영양정보 텍스트 데이터](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=74)를 기반으로 합니다.

## 📥 필요한 원본 파일들

다음 파일들을 AI-Hub에서 다운로드하여 `raw/` 폴더에 배치하세요:

### 1. 라벨링 데이터
- `음식분류_라벨링_TRAIN_1223_add.zip` (약 120MB)
- `음식분류_라벨링_VAL_1223_add.zip` (약 30MB)
- `양추정_라벨링_TRAIN.zip` (약 180MB)
- `양추정_라벨링_VAL.zip` (약 45MB)

### 2. 이미지 데이터
- `양추정_이미지_VAL_0422_add_merged.zip` (약 5.5GB)

### 3. 영양정보 메타데이터
- `44.음식분류_AI_데이터_영양DB_활용가이드.xlsx` (약 2MB)
- `nutrition.xlsx` (약 1MB)

## 🔗 다운로드 링크

**메인 데이터셋 페이지**: https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=74

## 📋 다운로드 절차

1. **AI-Hub 회원가입 및 로그인**
   - https://aihub.or.kr 에서 회원가입
   - 내국인만 데이터 신청 가능

2. **데이터셋 신청**
   - 위 링크에서 "다운로드" 버튼 클릭
   - 이용목적 및 개인정보 동의
   - 승인 대기 (보통 1-2일)

3. **파일 다운로드**
   - 승인 후 개별 파일 다운로드
   - 또는 API 다운로드 이용 가능

## 📁 폴더 구조

다운로드 완료 후 다음과 같은 구조가 되어야 합니다:

```
raw/
├── README_DOWNLOAD.md                           # 이 파일
├── 음식분류_라벨링_TRAIN_1223_add.zip
├── 음식분류_라벨링_VAL_1223_add.zip  
├── 양추정_라벨링_TRAIN.zip
├── 양추정_라벨링_VAL.zip
├── 양추정_이미지_VAL_0422_add_merged.zip
├── 44.음식분류_AI_데이터_영양DB_활용가이드.xlsx
└── nutrition.xlsx
```

## 🚀 데이터 처리 실행

파일 다운로드 완료 후:

```bash
# 데이터 정제 및 경량화 실행
python aihub_food_litepack.py --extract raw/ --output lite/

# 최종 데이터셋 생성
python prep_lite_from_local.py
```

## ⚠️ 주의사항

- **총 용량**: 약 6GB
- **라이선스**: AI-Hub 이용약관 준수
- **개인정보**: 상업적 이용 시 별도 문의 필요
- **원본 데이터는 Git에 포함되지 않음** (용량 문제로 제외)

---

*이 파일들은 데이터 정제를 위해서만 필요하며, 최종 결과물은 `main/` 폴더에 경량화되어 제공됩니다.*
