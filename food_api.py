# --- replace BEGIN ---
from fastapi import FastAPI
from pydantic import BaseModel
import duckdb, os, glob
import pandas as pd
import unicodedata

LITE_DIR = "lite"
DB = duckdb.connect(":memory:")

def slugify(txt: str) -> str:
    if not isinstance(txt, str): txt = str(txt)
    return unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode("ascii")

# 1) Parquet 읽기
df = DB.execute(f"SELECT * FROM read_parquet('{LITE_DIR}/nutrition.parquet')").df()

# 2) 필수 컬럼 보강(없으면 생성/계산)
def ensure(df, col, default):
    if col not in df.columns:
        df[col] = default
    return df

df = ensure(df, "name_kr", "")
df = ensure(df, "food_id", df["name_kr"].map(slugify))

# 영양 컬럼 기본값
for col in ["serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"]:
    df = ensure(df, col, 0.0)

# kcal 없으면 Atwater 계수로 추정
missing_kcal = (df["kcal"]==0) | df["kcal"].isna()
if missing_kcal.any():
    carb = df["carb_g"].fillna(0)
    prot = df["protein_g"].fillna(0)
    fat  = df["fat_g"].fillna(0)
    df.loc[missing_kcal, "kcal"] = (carb*4 + prot*4 + fat*9)

# serving 기본 200g
df.loc[(df["serving_g"]==0) | df["serving_g"].isna(), "serving_g"] = 200.0

# 카테고리 없으면 '기타'
df = ensure(df, "category", "기타")

# 타입 정리
num_cols = ["serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"]
df[num_cols] = df[num_cols].apply(pd.to_numeric, errors="coerce").fillna(0.0)

# 3) DuckDB 테이블로 적재
DB.register("foods_df", df)
DB.execute("""
CREATE TABLE foods AS
SELECT
  CAST(row_number() OVER () AS BIGINT) AS id,
  food_id, name_kr, category,
  serving_g, kcal, carb_g, protein_g, fat_g, sugar_g, sodium_mg, satfat_g
FROM foods_df;
""")

# 이미지 인덱스(있으면 사용)
IMG = {}
for p in glob.glob(f"{LITE_DIR}/images/*/*.webp"):
    fid = os.path.basename(os.path.dirname(p))
    IMG[fid] = p
# --- replace END ---


class Constraints(BaseModel):
    per_meal_kcal: int
    sodium_max_mg: int = 800
    sugar_max_g: int = 20
    satfat_max_g: float = 6.0
    topk: int = 30

app = FastAPI(title="Food Recommender (Lite)")

@app.get("/foods/search")
def foods_search(q: str = "", limit: int = 20):
    res = DB.execute("""
        SELECT id, food_id, name_kr, category, serving_g, kcal, protein_g, fat_g, sodium_mg
        FROM foods
        WHERE name_kr LIKE '%' || ? || '%'
        ORDER BY (protein_g - satfat_g*0.5 - sodium_mg/1000.0) DESC
        LIMIT ?;
    """, [q, limit]).fetchall()
    out = []
    for r in res:
        d = dict(zip(["id","food_id","name_kr","category","serving_g","kcal","protein_g","fat_g","sodium_mg"], r))
        d["image"] = f"/images/{d['food_id']}" if d["food_id"] in IMG else None
        out.append(d)
    return out

@app.post("/recommend")
def recommend(c: Constraints):
    res = DB.execute("""
        SELECT id, food_id, name_kr, serving_g, kcal, carb_g, protein_g, fat_g, sugar_g, sodium_mg, satfat_g
        FROM foods
        WHERE kcal <= ?*1.2
          AND sodium_mg <= ?
          AND sugar_g   <= ?
          AND satfat_g  <= ?
        ORDER BY (protein_g - satfat_g*0.5 - sodium_mg/1000.0) DESC
        LIMIT ?;
    """, [c.per_meal_kcal, c.sodium_max_mg, c.sugar_max_g, c.satfat_max_g, c.topk]).fetchall()

    def scale(row):
        keys = ["id","food_id","name_kr","serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"]
        r = dict(zip(keys, row))
        ratio = min(1.6, max(0.6, c.per_meal_kcal / max(r["kcal"],1)))
        for k in ["serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"]:
            r[k] = round(r[k]*ratio, 1)
        r["portion_g"] = r.pop("serving_g")
        r["image"] = f"/images/{r['food_id']}" if r["food_id"] in IMG else None
        return r

    return {"items": [scale(r) for r in res]}

@app.get("/images/{food_id}")
def get_image(food_id: str):
    p = IMG.get(food_id)
    if not p: return {"error":"no image"}
    from fastapi.responses import FileResponse
    return FileResponse(p, media_type="image/webp")

# 간단한 1일 플랜(아점저 3개 뽑기)
@app.post("/plan/day")
def plan_day(c: Constraints):
    items = recommend(c)["items"]
    return {"breakfast": items[0] if items else None,
            "lunch": items[1] if len(items)>1 else None,
            "dinner": items[2] if len(items)>2 else None}
