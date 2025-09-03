-- PostgreSQL 데이터베이스 초기화 스크립트
-- Render에서 PostgreSQL 사용 시 실행

-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  "birthDate" VARCHAR,
  gender VARCHAR,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Checkups 테이블 생성
CREATE TABLE IF NOT EXISTS health_checkups (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  
  -- 기본 정보
  name VARCHAR,
  height FLOAT,
  weight FLOAT,
  bmi FLOAT,
  
  -- 생체 지표
  "bloodPressureSystolic" INTEGER,
  "bloodPressureDiastolic" INTEGER,
  "fastingBloodSugar" FLOAT,
  "totalCholesterol" FLOAT,
  "ldlCholesterol" FLOAT,
  "hdlCholesterol" FLOAT,
  "triglycerides" FLOAT,
  "astSgot" FLOAT,
  "altSgpt" FLOAT,
  "gammaGtp" FLOAT,
  "serumCreatinine" FLOAT,
  "hemoglobin" FLOAT,
  
  -- AI 분석 결과
  "healthScore" INTEGER,
  "finalmessage" TEXT,
  
  -- 추천 식단 (6개)
  "food_name1" VARCHAR, "grams1" FLOAT, "protein1" FLOAT,
  "food_name2" VARCHAR, "grams2" FLOAT, "protein2" FLOAT,
  "food_name3" VARCHAR, "grams3" FLOAT, "protein3" FLOAT,
  "food_name4" VARCHAR, "grams4" FLOAT, "protein4" FLOAT,
  "food_name5" VARCHAR, "grams5" FLOAT, "protein5" FLOAT,
  "food_name6" VARCHAR, "grams6" FLOAT, "protein6" FLOAT,
  
  -- 평균값 예측
  "ave_bmi" FLOAT,
  "ave_bloodPressureSystolic" FLOAT,
  "ave_bloodPressureDiastolic" FLOAT,
  "ave_fastingBloodSugar" FLOAT,
  "ave_totalCholesterol" FLOAT,
  "ave_ldlCholesterol" FLOAT,
  "ave_hdlCholesterol" FLOAT,
  "ave_triglycerides" FLOAT,
  "ave_astSgot" FLOAT,
  "ave_altSgpt" FLOAT,
  "ave_gammaGtp" FLOAT,
  "ave_serumCreatinine" FLOAT,
  "ave_hemoglobin" FLOAT,
  
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY ("userId") REFERENCES users(id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_health_checkups_userid ON health_checkups("userId");
CREATE INDEX IF NOT EXISTS idx_health_checkups_createdat ON health_checkups("createdAt");

-- 테이블 생성 확인
SELECT 'Users table' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Health Checkups table' as table_name, COUNT(*) as record_count FROM health_checkups;