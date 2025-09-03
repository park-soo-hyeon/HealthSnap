# prep_lite_from_local.py
# pip install pandas pyarrow duckdb openpyxl
import os, re, zipfile, io, argparse, pandas as pd
from collections import Counter
from unidecode import unidecode

def norm(s:str)->str:
    if s is None: return ""
    s = str(s).strip()
    s = re.sub(r"\s+", " ", s)
    return s

# 1) 영양DB.xlsx -> nutrition.parquet
def build_nutrition_parquet(excel_path:str, out_parquet:str):
    df = pd.read_excel(excel_path)
    # 컬럼 자동 매핑(파일에 따라 이름 조금씩 달라서 유연하게 처리)
    cmap = {
        "name_kr":  {"name","name_kr","menu_kr","food_name","ko_name","품목명","음식명"},
        "category": {"category","class","type","분류","음식군"},
        "serving_g":{"serving_g","serving","portion_g","1회제공량(g)","중량(g)","중량"},
        "kcal":     {"kcal","calorie","energy_kcal","열량(kcal)","열량"},
        "carb_g":   {"carb_g","carbohydrate_g","carb","탄수화물(g)","탄수화물"},
        "protein_g":{"protein_g","protein","단백질(g)","단백질"},
        "fat_g":    {"fat_g","fat","지방(g)","지방"},
        "sugar_g":  {"sugar_g","sugars_g","sugar","당류(g)","당류"},
        "sodium_mg":{"sodium_mg","sodium","na_mg","나트륨(mg)","나트륨"},
        "satfat_g": {"satfat_g","saturated_fat_g","sfa_g","포화지방(g)","포화지방"},
    }
    colmap = {}
    for std, cands in cmap.items():
        for c in df.columns:
            cl = c.lower().replace(" ", "")
            if cl in {x.lower().replace(" ", "") for x in cands}:
                colmap[std] = c; break
    need = [k for k in ["name_kr","category","serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"] if k in colmap]
    out = df[[colmap[k] for k in need]].copy()
    out.columns = need
    out["name_kr"] = out["name_kr"].map(norm)
    out["food_id"] = out["name_kr"].apply(lambda s: unidecode(s))
    out = out.drop_duplicates(subset=["food_id"]).reset_index(drop=True)
    os.makedirs(os.path.dirname(out_parquet), exist_ok=True)
    out.to_parquet(out_parquet, compression="zstd", index=False)
    print(f"[OK] nutrition.parquet -> {out_parquet} ({len(out)} rows)")
    return set(out["name_kr"].tolist())

# 2) 라벨 zip들에서 클래스/동의어 수집 (zip 내부 CSV 자동 탐색)
def harvest_labels_from_zip(zip_path:str):
    cls_counter = Counter()
    aliases = set()
    with zipfile.ZipFile(zip_path) as zf:
        for name in zf.namelist():
            if not name.lower().endswith((".csv",".tsv",".txt",".json")): 
                continue
            if "/라벨" not in name and "label" not in name.lower():
                # 파일명에 라벨/label 없으면 스킵(노이즈 줄이기)
                continue
            data = zf.read(name)
            try:
                if name.lower().endswith(".json"):
                    # json은 스킵(구조 다양) — 필요하면 추가 처리
                    continue
                # 구분자 자동 판단
                sep = "," if b"," in data[:200] else "\t"
                df = pd.read_csv(io.BytesIO(data), sep=sep, encoding="utf-8", engine="python")
            except Exception:
                try:
                    df = pd.read_csv(io.BytesIO(data), sep=sep, encoding="cp949", engine="python")
                except Exception:
                    continue
            cols = {c.lower(): c for c in df.columns}
            # 후보 컬럼들
            cand_cols = ["class","label","food","food_name","menu","name","classname","음식명","품목명","라벨"]
            target = None
            for c in cand_cols:
                if c in cols:
                    target = cols[c]; break
            if target is None:
                continue
            names = df[target].dropna().astype(str).map(norm).tolist()
            cls_counter.update(names)
            for n in names:
                aliases.add((unidecode(n), n))
    return cls_counter, aliases

def save_keep_list(nutrition_names:set, counters:list, out_keep:str, top_k:int=300):
    # 라벨 빈도 기반으로 정렬하되, 영양DB에 존재하는 항목을 우선
    total = Counter()
    for c in counters: total.update(c)
    ranked = [n for n,_ in total.most_common()]
    preferred = [n for n in ranked if n in nutrition_names]
    others = [n for n in ranked if n not in nutrition_names]
    keep = (preferred + others)[:top_k]
    with open(out_keep, "w", encoding="utf-8") as f:
        for k in keep: 
            if k.strip(): f.write(k+"\n")
    print(f"[OK] keep_classes.txt -> {out_keep} ({len(keep)} items)")

def save_aliases(aliases:set, out_csv:str):
    rows = [{"food_id": fid, "name_kr": kr, "alias": kr} for fid, kr in sorted(aliases)]
    pd.DataFrame(rows).drop_duplicates().to_csv(out_csv, index=False, encoding="utf-8")
    print(f"[OK] aliases.csv -> {out_csv} ({len(rows)} rows)")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--excel", required=True, help="영양DB 엑셀 경로 (44.음식분류 AI 데이터 영양DB.xlsx)")
    ap.add_argument("--label", nargs="+", required=True, help="라벨 zip 경로들 (TRAIN/VAL)")
    ap.add_argument("--out", default="lite", help="출력 폴더")
    ap.add_argument("--topk", type=int, default=300, help="keep_classes 개수")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    nutrition_names = build_nutrition_parquet(args.excel, os.path.join(args.out, "nutrition.parquet"))

    counters, alias_all = [], set()
    for z in args.label:
        c, a = harvest_labels_from_zip(z)
        counters.append(c); alias_all |= a
        print(f"[scan] {os.path.basename(z)} -> {len(c)} classes, {sum(c.values())} rows")

    save_keep_list(nutrition_names, counters, os.path.join(args.out, "keep_classes.txt"), top_k=args.topk)
    save_aliases(alias_all, os.path.join(args.out, "aliases.csv"))
    print("[DONE] Lite meta ready.")
