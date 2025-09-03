# diet_test.py
import os, sys, json, time
from typing import Optional
from google import genai
from google.genai import types as t
from google.genai.errors import ClientError, ServerError

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("❌ Set GEMINI_API_KEY env var.")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)

# CSV (CDN 권장)
NUTRITION = "https://cdn.jsdelivr.net/gh/Danto7632/jeongje_data@main/nutrition.csv"
ALIASES   = "https://cdn.jsdelivr.net/gh/Danto7632/jeongje_data@main/aliases.csv"

def build_schema():
    return t.Schema(
        type=t.Type.OBJECT,
        required=["version","user_ref","derived","diet_plan"],
        properties={
            "version": t.Schema(type=t.Type.STRING),
            "user_ref": t.Schema(
                type=t.Type.OBJECT, required=["user_id","age","sex"],
                properties={
                    "user_id": t.Schema(type=t.Type.STRING),
                    "age": t.Schema(type=t.Type.NUMBER),
                    "sex": t.Schema(type=t.Type.STRING),
                },
            ),
            "derived": t.Schema(
                type=t.Type.OBJECT, required=["bmi","bmi_class","risk_flags"],
                properties={
                    "bmi": t.Schema(type=t.Type.NUMBER),
                    "bmi_class": t.Schema(type=t.Type.STRING),
                    "risk_flags": t.Schema(type=t.Type.ARRAY, items=t.Schema(type=t.Type.STRING)),
                },
            ),
            "age_group_stats": t.Schema(
                type=t.Type.OBJECT,
                properties={
                    "age_group": t.Schema(type=t.Type.STRING),
                    "sex": t.Schema(type=t.Type.STRING),
                    "metrics": t.Schema(
                        type=t.Type.ARRAY,
                        items=t.Schema(
                            type=t.Type.OBJECT, required=["metric","user","avg","diff"],
                            properties={
                                "metric": t.Schema(type=t.Type.STRING),
                                "user": t.Schema(type=t.Type.NUMBER),
                                "avg": t.Schema(type=t.Type.NUMBER),
                                "diff": t.Schema(type=t.Type.NUMBER),
                                "unit": t.Schema(type=t.Type.STRING),
                            },
                        ),
                    ),
                    "source": t.Schema(type=t.Type.STRING),
                },
            ),
            "checkup_summary": t.Schema(
                type=t.Type.OBJECT,
                properties={
                    "label": t.Schema(type=t.Type.STRING),
                    "notes": t.Schema(type=t.Type.ARRAY, items=t.Schema(type=t.Type.STRING)),
                },
            ),
            "diet_plan": t.Schema(
                type=t.Type.OBJECT, required=["daily_targets","meals"],
                properties={
                    "daily_targets": t.Schema(
                        type=t.Type.OBJECT,
                        properties={
                            "energy_kcal": t.Schema(type=t.Type.NUMBER),
                            "protein_g": t.Schema(type=t.Type.NUMBER),
                            "sodium_mg_per_meal": t.Schema(type=t.Type.NUMBER),
                        },
                    ),
                    "strategy": t.Schema(type=t.Type.ARRAY, items=t.Schema(type=t.Type.STRING)),
                    "meals": t.Schema(
                        type=t.Type.ARRAY,
                        items=t.Schema(
                            type=t.Type.OBJECT, required=["food_id","name_kr","kcal","protein_g","sodium_mg"],
                            properties={
                                "food_id": t.Schema(type=t.Type.STRING),
                                "name_kr": t.Schema(type=t.Type.STRING),
                                "serving_g": t.Schema(type=t.Type.NUMBER),
                                "kcal": t.Schema(type=t.Type.NUMBER),
                                "carb_g": t.Schema(type=t.Type.NUMBER),
                                "protein_g": t.Schema(type=t.Type.NUMBER),
                                "fat_g": t.Schema(type=t.Type.NUMBER),
                                "sodium_mg": t.Schema(type=t.Type.NUMBER),
                                "category": t.Schema(type=t.Type.STRING),
                                "reason": t.Schema(type=t.Type.STRING),
                            },
                        ),
                    ),
                    "notes": t.Schema(type=t.Type.STRING),
                },
            ),
            "sources": t.Schema(
                type=t.Type.OBJECT,
                properties={
                    "tables": t.Schema(type=t.Type.ARRAY, items=t.Schema(type=t.Type.STRING)),
                    "items":  t.Schema(type=t.Type.ARRAY, items=t.Schema(type=t.Type.STRING)),
                },
            ),
            "errors": t.Schema(type=t.Type.ARRAY, items=t.Schema(type=t.Type.STRING)),
        },
    )

SYSTEM_BASE = f"""
[역할] 영양데이터 기반 식단 추천기. 아래 CSV만 근거 사용(환각 금지).
[데이터] nutrition: {NUTRITION} | aliases: {ALIASES}
[규칙]
- 한국어 이름/별칭은 aliases로 정규화 후 nutrition에서만 검색.
- 나트륨/단백질/kcal/카테고리 조건을 파싱해 필터링.
"""

user_input = {
  "version":"1.0",
  "user":{"user_id":"u-123","sex":"M","age":38,"region":"honam","height_cm":173,"weight_kg":78},
  "labs":{"fasting_glucose_mgdl":112,"hba1c_pct":6.1,"ldl_mgdl":155,"hdl_mgdl":42,"tg_mgdl":210,"sbp_mmhg":138,"dbp_mmhg":88},
  "diet_pref":{"korean_only":True,"meals_per_day":2,"allergies":[],"dislikes":[]},
  "targets":{"energy_kcal_per_day":None,"protein_g_per_day":None,"sodium_limit_mg_per_meal":800},
  "context":{"request_id":"req-001"}
}

def call_model(model:str, prompt:str, config:t.GenerateContentConfig, tries:int=3, backoff:float=1.5):
    last_err: Optional[Exception] = None
    for i in range(1, tries+1):
        try:
            return client.models.generate_content(model=model, contents=[prompt], config=config)
        except (ServerError, ClientError) as e:
            last_err = e
            # 5xx 또는 일시 4xx는 재시도
            code = getattr(e, "status_code", None)
            print(f"[warn] attempt {i} failed (code={code}): {e}")
            if i < tries:
                time.sleep(backoff**i)
    if last_err:
        raise last_err

def main():
    # 1차: 스키마 + URL context
    schema = build_schema()
    config_1 = t.GenerateContentConfig(
        tools=[{"url_context": {}}],
        response_schema=schema,
        # temperature 낮추어 일관성 ↑
        temperature=0.2,
    )
    SYSTEM_1 = SYSTEM_BASE + "- 결과는 JSON(meals[], notes) 중심으로 생성.\n"
    PROMPT = f"""{SYSTEM_1}
[작업]
- 위 CSV를 URL context로 로드/파싱 후, 아래 input JSON을 기준으로 식단 추천을 생성하라.
- 출력은 위 response_schema(JSON)를 엄격히 준수하라.

[input JSON]
{json.dumps(user_input, ensure_ascii=False)}
"""
    try:
        resp = call_model("gemini-2.5-flash", PROMPT, config_1)
        print(resp.text)
        meta = resp.candidates[0].url_context_metadata if resp.candidates else None
        if meta: print("\n[URL context metadata]", meta)
        return
    except Exception as e1:
        print("\n[info] fallback A (no schema) ...", e1)

    # 2차: 스키마 제거 + “JSON만 출력”
    config_2 = t.GenerateContentConfig(
        tools=[{"url_context": {}}],
        temperature=0.2,
    )
    SYSTEM_2 = SYSTEM_BASE + "- 가능한 한 JSON만 출력(설명 금지). 키 누락 없이 반환.\n"
    PROMPT_2 = f"""{SYSTEM_2}
[작업]
- 위 CSV를 URL context로 로드/파싱 후, 아래 input JSON을 기준으로 식단 추천을 생성하라.
- 출력은 JSON 객체 한 개로만 반환하라(텍스트 설명 금지).

[input JSON]
{json.dumps(user_input, ensure_ascii=False)}
"""
    try:
        resp = call_model("gemini-2.5-flash", PROMPT_2, config_2)
        print(resp.text)
        meta = resp.candidates[0].url_context_metadata if resp.candidates else None
        if meta: print("\n[URL context metadata]", meta)
        return
    except Exception as e2:
        print("\n[info] fallback B (switch model) ...", e2)

    # 3차: 모델 교체 (2.0 flash) + 스키마 제거
    try:
        resp = call_model("gemini-2.0-flash", PROMPT_2, config_2)
        print(resp.text)
        meta = resp.candidates[0].url_context_metadata if resp.candidates else None
        if meta: print("\n[URL context metadata]", meta)
        return
    except Exception as e3:
        print("\n❌ All attempts failed.")
        raise e3

if __name__ == "__main__":
    main()
