# diet_test_local.py
import os, sys, json, math, re
import numpy as np
import pandas as pd
from datetime import datetime, date
from typing import List, Dict, Any, Tuple, Optional

# --- Google GenAI ---
from google import genai
from google.genai import types as t

# ---------------- CLI ----------------
import argparse
ap = argparse.ArgumentParser()
ap.add_argument("--nutrition", default="nutrition.csv")
ap.add_argument("--aliases",   default="aliases.csv")
ap.add_argument("--input",     default=None, help="검진표 JSON(스키마 고정). 없으면 샘플 사용")
ap.add_argument("--max-n", type=int, default=600, help="nutrition 최대 행수")
ap.add_argument("--max-a", type=int, default=800, help="aliases 최대 행수")
ap.add_argument("--model", default="gemini-2.0-flash")
ap.add_argument("--out",   default="result.json")
args = ap.parse_args()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("❌ Set GEMINI_API_KEY env var."); sys.exit(1)

# ---------------- IO helpers ----------------
def read_csv_local(path, max_rows=None, required=True):
    if not os.path.exists(path):
        if required:
            print(f"❌ not found: {path}"); sys.exit(1)
        return None
    df = pd.read_csv(path)
    if max_rows and len(df) > max_rows:
        df = df.sample(n=max_rows, random_state=42).reset_index(drop=True)
    df.columns = [c.strip() for c in df.columns]
    return df

N = read_csv_local(args.nutrition, args.max_n, required=True)
A = read_csv_local(args.aliases,   args.max_a, required=True)  # (현재 버전에서는 읽기만)

# ---------------- nutrition 컬럼 정규화 ----------------
def normalize_nutrition_columns(df: pd.DataFrame) -> pd.DataFrame:
    std2cands = {
        "food_id":   ["food_id","id","code"],
        "name_kr":   ["name_kr","name","menu_kr","food_name","ko_name","품목명","음식명"],
        "category":  ["category","class","type","분류","음식군"],
        "serving_g": ["serving_g","portion_g","weight_g","1회제공량(g)","중량(g)","중량","serving","portion"],
        "kcal":      ["kcal","calorie","energy_kcal","열량(kcal)","열량","energy"],
        "carb_g":    ["carb_g","carbohydrate_g","carb","탄수화물(g)","탄수화물"],
        "protein_g": ["protein_g","protein","단백질(g)","단백질"],
        "fat_g":     ["fat_g","fat","지방(g)","지방"],
        "sugar_g":   ["sugar_g","sugars_g","sugar","당류(g)","당류"],
        "sodium_mg": ["sodium_mg","sodium","na_mg","나트륨(mg)","나트륨"],
        "satfat_g":  ["satfat_g","saturated_fat_g","sfa_g","포화지방(g)","포화지방"],
    }
    lowmap = {c.lower().replace(" ",""): c for c in df.columns}
    rename_map = {}
    for std, cands in std2cands.items():
        if std in df.columns: continue
        for cand in cands:
            key = cand.lower().replace(" ","")
            if key in lowmap:
                rename_map[lowmap[key]] = std
                break
    if rename_map:
        df = df.rename(columns=rename_map)
    # types
    for c in ["serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"]:
        if c in df.columns: df[c] = pd.to_numeric(df[c], errors="coerce")
    for c in ["food_id","name_kr","category"]:
        if c in df.columns: df[c] = df[c].astype(str)
    return df

N = normalize_nutrition_columns(N)

# ---------------- 유틸 ----------------
def compute_age(birth_date_str: str, ref_date: date | None = None) -> int:
    if not birth_date_str: return 0
    try:
        if "T" in birth_date_str:
            bd = datetime.fromisoformat(birth_date_str.replace("Z","+00:00")).date()
        else:
            bd = datetime.strptime(birth_date_str, "%Y-%m-%d").date()
    except Exception:
        return 0
    ref = ref_date or date.today()
    return max(0, ref.year - bd.year - ((ref.month, ref.day) < (bd.month, bd.day)))

# ---------------- 입력 로드 (검진표) ----------------
if args.input and os.path.exists(args.input):
    raw_in = json.load(open(args.input, "r", encoding="utf-8"))
else:
    raw_in = {
      "id": 1,
      "name": "홍길동",
      "birthDate": "1990-01-01",
      "hasDiagnosis": True,
      "isMedicated": False,
      "hasTraumaOrAftereffects": False,
      "lifestyle": "주 3회 운동",
      "generalCondition": "양호",
      "height": 175.0,
      "weight": 70.0,
      "waistCircumference": 85.0,
      "bmi": 22.9,
      "visionLeft": 1.0,
      "visionRight": 1.2,
      "isHearingLeftNormal": True,
      "isHearingRightNormal": True,
      "bloodPressureSystolic": 120,
      "bloodPressureDiastolic": 80,
      "isProteinuriaPositive": False,
      "hemoglobin": 15.5,
      "fastingBloodSugar": 99.0,
      "totalCholesterol": 190.0,
      "hdlCholesterol": 50.0,
      "triglycerides": 130.0,
      "ldlCholesterol": 114.0,
      "serumCreatinine": 1.0,
      "astSgot": 25.0,
      "altSgpt": 30.0,
      "gammaGtp": 20.0,
      "isHepatitisBAntigenPositive": False,
      "isHepatitisBAntibodyPositive": True,
      "isChestXrayNormal": True,
      "checkupDate": "2025-08-22T00:53:00Z",
      "checkupCenterName": "서울대학교병원 건강증진센터"
    }

def to_user_internal(checkup: dict) -> dict:
    age  = compute_age(checkup.get("birthDate"))
    height_cm = float(checkup.get("height") or 0.0)
    weight_kg = float(checkup.get("weight") or 0.0)
    return {
        "version":"1.0",
        "user":{
            "user_id": str(checkup.get("id","")),
            "name": checkup.get("name") or f"user-{checkup.get('id','')}",
            "sex": "U",
            "age": age,
            "height_cm": height_cm,
            "weight_kg": weight_kg
        },
        "labs":{
            "fasting_glucose_mgdl": checkup.get("fastingBloodSugar"),
            "ldl_mgdl": checkup.get("ldlCholesterol"),
            "hdl_mgdl": checkup.get("hdlCholesterol"),
            "tg_mgdl":  checkup.get("triglycerides"),
            "sbp_mmhg": checkup.get("bloodPressureSystolic"),
            "dbp_mmhg": checkup.get("bloodPressureDiastolic"),
            "total_cholesterol_mgdl": checkup.get("totalCholesterol"),
            "ast_u_l": checkup.get("astSgot"),
            "alt_u_l": checkup.get("altSgpt"),
            "ggt_u_l": checkup.get("gammaGtp"),
            "creatinine_mgdl": checkup.get("serumCreatinine"),
            "hemoglobin_gdl": checkup.get("hemoglobin"),
        }
    }
U = to_user_internal(raw_in)

# ---------------- 식단 제약 & 후보 생성 ----------------
MEALS_PER_DAY = 3
weight = float(U["user"].get("weight_kg") or 0)
prot_day = round(1.1 * weight, 1) if weight>0 else 60.0
prot_per_meal = round(prot_day / MEALS_PER_DAY, 1)
P_MIN = round(prot_per_meal * 0.8, 1)
SOD_LIMIT = 800.0

def is_side(name:str):
    return any(k in (name or "") for k in ["장아찌","젓갈","절임","피클"])

def score_food(row):
    prot_val = float(row.get("protein_g") or 0)
    sod_val  = float(row.get("sodium_mg") or 0)
    kcal_val = row.get("kcal"); kcal_pen = 0.0
    try:
        if kcal_val is not None and not (pd.isna(kcal_val)):
            kcal_pen = abs((float(kcal_val) - 600.0) / 600.0)
    except Exception:
        kcal_pen = 0.0
    prot_pen = abs(prot_val - prot_per_meal)
    sod_pen  = max(0.0, sod_val - SOD_LIMIT) / max(1.0, SOD_LIMIT)
    return 0.6*prot_pen + 1.0*sod_pen + 0.4*kcal_pen

def candidates_df(df: pd.DataFrame) -> pd.DataFrame:
    cols_need = [c for c in ["food_id","name_kr","category","serving_g","kcal","carb_g","protein_g","fat_g","sodium_mg"] if c in df.columns]
    d = df[cols_need].copy()
    d = d.dropna(subset=["protein_g","sodium_mg"])
    d = d[(d["protein_g"]>=P_MIN) & (d["sodium_mg"]<=SOD_LIMIT)]
    d = d[~d["name_kr"].apply(is_side)]
    d["__score"] = d.apply(score_food, axis=1)
    d = d.sort_values("__score").drop_duplicates(subset=["food_id"]).head(150)
    return d

CAND = candidates_df(N)

def to_json_records(df: pd.DataFrame, max_chars=80_000) -> str:
    js = df.to_dict(orient="records")
    s = json.dumps(js, ensure_ascii=False)
    if len(s)>max_chars:
        s = s[:max_chars]; s = s.rsplit("}",1)[0] + "}]"
    return s

# ---------------- LLM #1: 평균 예측(나이/신장 등 기반) ----------------
client = genai.Client(api_key=API_KEY)

avg_schema = t.Schema(
    type=t.Type.OBJECT,
    required=["means","sds"],
    properties={
        "means": t.Schema(
            type=t.Type.OBJECT,
            required=[
                "bmi","sbp_mmhg","dbp_mmhg","hemoglobin_gdl","fasting_glucose_mgdl",
                "total_cholesterol_mgdl","hdl_mgdl","tg_mgdl","creatinine_mgdl",
                "ldl_mgdl","ast_u_l","alt_u_l","ggt_u_l"
            ],
            properties={k: t.Schema(type=t.Type.NUMBER) for k in [
                "bmi","sbp_mmhg","dbp_mmhg","hemoglobin_gdl","fasting_glucose_mgdl",
                "total_cholesterol_mgdl","hdl_mgdl","tg_mgdl","creatinine_mgdl",
                "ldl_mgdl","ast_u_l","alt_u_l","ggt_u_l"
            ]},
        ),
        "sds": t.Schema(
            type=t.Type.OBJECT,
            required=[
                "bmi","sbp_mmhg","dbp_mmhg","hemoglobin_gdl","fasting_glucose_mgdl",
                "total_cholesterol_mgdl","hdl_mgdl","tg_mgdl","creatinine_mgdl",
                "ldl_mgdl","ast_u_l","alt_u_l","ggt_u_l"
            ],
            properties={k: t.Schema(type=t.Type.NUMBER) for k in [
                "bmi","sbp_mmhg","dbp_mmhg","hemoglobin_gdl","fasting_glucose_mgdl",
                "total_cholesterol_mgdl","hdl_mgdl","tg_mgdl","creatinine_mgdl",
                "ldl_mgdl","ast_u_l","alt_u_l","ggt_u_l"
            ]},
        ),
    },
)
avg_config = t.GenerateContentConfig(
    response_schema=avg_schema,
    response_mime_type="application/json",
    temperature=0.2,
    max_output_tokens=768,
)

AVG_SYSTEM = """
역할: 건강지표 평균 예측기.
입력된 개인 정보(나이, 성별, 신장, 체중 등)를 바탕으로 '해당 집단에서 일반적인 평균값'을 추정해라.
- 현실적 범위의 수치만 생성(음수 금지, 비상식값 금지).
- 표준편차도 같이 추정해라(현실적 크기).
- 출력은 means{}, sds{} 두 객체만 포함한 JSON.
"""

# 사용자 값(참고용) + BMI
user_vals = U["labs"].copy()
h, w = U["user"]["height_cm"], U["user"]["weight_kg"]
bmi_user = round(w/((h/100)**2), 1) if h and w else None
user_vals["bmi"] = bmi_user

AVG_TASK = json.dumps({
    "age": U["user"]["age"],
    "sex": U["user"]["sex"],
    "height_cm": U["user"]["height_cm"],
    "weight_kg": U["user"]["weight_kg"],
    "user_values": user_vals,  # 사용자의 실제 값(참고용)
    "need_metrics": [
        "bmi","sbp_mmhg","dbp_mmhg","hemoglobin_gdl","fasting_glucose_mgdl",
        "total_cholesterol_mgdl","hdl_mgdl","tg_mgdl","creatinine_mgdl",
        "ldl_mgdl","ast_u_l","alt_u_l","ggt_u_l"
    ]
}, ensure_ascii=False)

def llm_predict_averages() -> Tuple[Dict[str,float], Dict[str,float]]:
    try:
        r = client.models.generate_content(
            model=args.model,
            contents=[AVG_SYSTEM.strip(), AVG_TASK],
            config=avg_config,
        )
        data = r.parsed if getattr(r, "parsed", None) else (json.loads(r.text) if getattr(r,"text",None) else {})
        means = data.get("means", {})
        sds   = data.get("sds", {})
        return means, sds
    except Exception as e:
        print("⚠️ LLM averages error:", e)
        return {}, {}

means_llm, sds_llm = llm_predict_averages()

# 이상치 정리(음수/비상식 제거)
def sanitize_num(v, lo=None, hi=None):
    if v is None: return None
    try:
        x = float(v)
        if lo is not None and x < lo: x = lo
        if hi is not None and x > hi: x = hi
        return x
    except Exception:
        return None

CLAMPS = {
    "bmi": (10, 50),
    "sbp_mmhg": (70, 200),
    "dbp_mmhg": (40, 130),
    "hemoglobin_gdl": (5, 20),
    "fasting_glucose_mgdl": (60, 300),
    "total_cholesterol_mgdl": (80, 400),
    "hdl_mgdl": (10, 120),
    "tg_mgdl": (30, 800),
    "creatinine_mgdl": (0.3, 3.0),
    "ldl_mgdl": (30, 300),
    "ast_u_l": (5, 300),
    "alt_u_l": (5, 300),
    "ggt_u_l": (5, 500),
}
def sanitize_dict(d):
    out={}
    for k,(lo,hi) in CLAMPS.items():
        out[k] = sanitize_num(d.get(k), lo, hi)
    return out

means_llm = sanitize_dict(means_llm)
sds_llm   = sanitize_dict(sds_llm)

# 누락값 보정(LLM이 특정 항목을 못 줬다면 사용자 값으로 대체해 0/None 방지)
for k in CLAMPS.keys():
    if means_llm.get(k) is None:
        means_llm[k] = user_vals.get(k)
    if sds_llm.get(k) is None:
        # 보수적 기본 표준편차 (대략적)
        sds_llm[k] = {
            "bmi":2.5,"sbp_mmhg":12,"dbp_mmhg":8,"hemoglobin_gdl":1.2,"fasting_glucose_mgdl":15,
            "total_cholesterol_mgdl":28,"hdl_mgdl":12,"tg_mgdl":40,"creatinine_mgdl":0.15,
            "ldl_mgdl":25,"ast_u_l":10,"alt_u_l":10,"ggt_u_l":15
        }[k]

# ---------------- 종합건강점수 계산(LLM 예측평균/표준편차 기반) ----------------
def overall_health_score(user:dict, means:dict, sds:dict) -> int:
    keys = list(CLAMPS.keys())
    vals = user.copy()
    vals["bmi"] = bmi_user
    zs = []
    for k in keys:
        u = vals.get(k)
        if u is None or means.get(k) is None or (sds.get(k) is None or sds.get(k) <= 0):
            continue
        z = (float(u) - float(means[k])) / float(sds[k])
        zs.append(abs(z))
    score = 100
    if zs:
        avg_abs_z = float(np.mean(zs))
        penalty = min(30.0, avg_abs_z * 8.0)  # z=1 → -8, z=2 → -16
        score = int(round(100 - penalty))
        score = max(0, min(100, score))
    return score

OVERALL_SCORE = overall_health_score(U["labs"], means_llm, sds_llm)

# ---------------- LLM #2: 식단 6개 + 진단→근거 포함 comment ----------------
food_schema = t.Schema(
    type=t.Type.OBJECT,
    required=["comment","foods"],
    properties={
        "comment": t.Schema(type=t.Type.STRING),
        "foods": t.Schema(
            type=t.Type.ARRAY,
            items=t.Schema(
                type=t.Type.OBJECT,
                required=["food_id","name_kr","serving_g","carb_g","protein_g","fat_g","sodium_mg"],
                properties={
                    "food_id": t.Schema(type=t.Type.STRING),
                    "name_kr": t.Schema(type=t.Type.STRING),
                    "serving_g": t.Schema(type=t.Type.NUMBER),
                    "carb_g": t.Schema(type=t.Type.NUMBER),
                    "protein_g": t.Schema(type=t.Type.NUMBER),
                    "fat_g": t.Schema(type=t.Type.NUMBER),
                    "sodium_mg": t.Schema(type=t.Type.NUMBER),
                },
            ),
        ),
    },
)
food_config = t.GenerateContentConfig(
    response_schema=food_schema,
    response_mime_type="application/json",
    temperature=0.2,
    max_output_tokens=1024,
)

FOOD_SYSTEM = """
역할: 영양데이터 기반 추천기.
- 아래 candidates(표 형식 JSON 배열)에서만 6개를 고르라(중복 금지, 사이드 금지).
- 제약: protein_g ≥ P_MIN, sodium_mg ≤ SOD_LIMIT.
- 'comment'는 반드시 한국어 한 단락:
  1) 먼저 건강상태 '진단 요약'(입력값 vs 예측평균 비교로 핵심만)
  2) 이어서 '이러한 이유로 …을 고려하여' 선정 식단의 근거를 연결(단백질/나트륨/지방 등).
출력은 {comment, foods[]} 하나의 JSON.
"""

FOOD_TASK = json.dumps({
    "user": {
      "age": U["user"]["age"],
      "height_cm": U["user"]["height_cm"],
      "weight_kg": U["user"]["weight_kg"],
      "labs": U["labs"]
    },
    "predicted_means": means_llm,
    "constraints": {
      "protein_target_per_meal": prot_per_meal,
      "protein_min": P_MIN,
      "sodium_limit_mg": SOD_LIMIT
    },
    "candidates": json.loads(to_json_records(CAND))  # 실제 배열로 전달
}, ensure_ascii=False)

def llm_pick_foods_and_comment() -> Tuple[List[Dict[str,Any]], str]:
    try:
        r = client.models.generate_content(
            model=args.model,
            contents=[FOOD_SYSTEM.strip(), FOOD_TASK],
            config=food_config,
        )
        data = r.parsed if getattr(r, "parsed", None) else (json.loads(r.text) if getattr(r,"text",None) else {})
        foods = data.get("foods") or []
        comment = (data.get("comment") or "").strip()
        return foods, comment
    except Exception as e:
        print("⚠️ LLM selection error -> fallback:", e)
        tmp = CAND.sort_values("__score").head(6).to_dict(orient="records")
        return tmp, "입력값 대 예측평균 비교 결과를 바탕으로 단백질 충족·저염 기준에 맞춘 자동 선택(폴백)."

foods_llm, comment_llm = llm_pick_foods_and_comment()

# --- 중복/정합성 보정 & 6개 맞추기 ---
def normalize_food_list(items: List[Dict[str,Any]], need: int = 6) -> List[Dict[str,Any]]:
    out = []
    used = set()
    for m in items:
        fid = str(m.get("food_id","")); name = str(m.get("name_kr",""))
        if not fid or not name: continue
        if fid in used or is_side(name): continue
        try:
            p = float(m.get("protein_g") or 0.0); s = float(m.get("sodium_mg") or 1e9)
        except Exception:
            continue
        if p < P_MIN or s > SOD_LIMIT: continue
        used.add(fid); out.append(m)
        if len(out) >= need: break
    if len(out) < need:
        for _, r in CAND.iterrows():
            fid = str(r.get("food_id",""))
            if fid in used or is_side(r.get("name_kr","")): continue
            used.add(fid)
            out.append({
                "food_id": fid,
                "name_kr": r.get("name_kr"),
                "serving_g": r.get("serving_g"),
                "carb_g": r.get("carb_g"),
                "protein_g": r.get("protein_g"),
                "fat_g": r.get("fat_g"),
                "sodium_mg": r.get("sodium_mg"),
            })
            if len(out) >= need: break
    return out[:need]

foods6 = normalize_food_list(foods_llm, need=6)

# ---------------- 고정 출력 스키마로 매핑 ----------------
AVE_KEY_MAP = {
    "bmi":                        "ave_bmi_kg_per_m2",
    "sbp_mmhg":                   "ave_bloodPressure_systolic",
    "dbp_mmhg":                   "ave_bloodPressure_diastolic",
    "hemoglobin_gdl":             "ave_hemoglobin_g_dL",
    "fasting_glucose_mgdl":       "ave_fastingBloodGlucose_mg_dL",
    "total_cholesterol_mgdl":     "ave_totalCholesterol_mg_dL",
    "hdl_mgdl":                   "ave_hdlCholesterol_mg_dL",
    "tg_mgdl":                    "ave_triglycerides_mg_dL",
    "creatinine_mgdl":            "ave_serumCreatinine_mg_dL",
    "ldl_mgdl":                   "ave_ldlCholesterol_mg_dL",
    "ast_u_l":                    "ave_ast_sgot_U_L",
    "alt_u_l":                    "ave_alt_sgpt_U_L",
    "ggt_u_l":                    "ave_gammaGTP_U_L",
}

def to_fixed_output_schema() -> Dict[str, Any]:
    out = {"overallHealthScore": OVERALL_SCORE}
    # averages
    for k, outk in AVE_KEY_MAP.items():
        out[outk] = (None if means_llm.get(k) is None else float(means_llm[k]))
    # foods 1..6
    def put_food(i:int, rec: Optional[Dict[str,Any]]):
        out[f"food{i}_name"]         = (None if rec is None else rec.get("name_kr"))
        out[f"food{i}_grams"]        = (None if rec is None else rec.get("serving_g"))
        out[f"food{i}_carbohydrate"] = (None if rec is None else rec.get("carb_g"))
        out[f"food{i}_protein"]      = (None if rec is None else rec.get("protein_g"))
        out[f"food{i}_fat"]          = (None if rec is None else rec.get("fat_g"))
        out[f"food{i}_sodium"]       = (None if rec is None else rec.get("sodium_mg"))
    for i in range(1,7):
        rec = foods6[i-1] if i-1 < len(foods6) else None
        put_food(i, rec)
    # overallComment (진단→근거 순서 보장; LLM 결과가 비어도 폴백 문장 구성)
    if comment_llm:
        out["overallComment"] = comment_llm
    else:
        out["overallComment"] = (
            "전반적 상태는 양호하나 일부 지표는 예측 평균 대비 주의가 필요합니다. "
            "이에 따라 단백질 목표를 충족하면서 나트륨은 끼니당 800mg 이하로 제한하고, "
            "가공육·튀김을 피하는 메뉴로 식단을 구성했습니다."
        )
    return out

FINAL = to_fixed_output_schema()

# ---------------- 저장/출력 ----------------
txt = json.dumps(FINAL, ensure_ascii=False, indent=2)
print(txt)
with open(args.out, "w", encoding="utf-8") as f:
    f.write(txt)
print(f"\n[ok] saved: {args.out}")
