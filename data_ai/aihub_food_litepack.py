# aihub_food_litepack.py
# pip install stream-unzip requests Pillow pandas pyarrow duckdb Unidecode openpyxl

import os, io, re, json, csv, argparse, zipfile
import requests
import pandas as pd
from PIL import Image
from unidecode import unidecode
from stream_unzip import stream_unzip

IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}

# ---------- Utils ----------

def save_webp_resized(raw_bytes, out_path, max_side=384, q=80):
    im = Image.open(io.BytesIO(raw_bytes)).convert("RGB")
    w, h = im.size
    if max(w, h) > max_side:
        if w >= h:
            nh = int(h * (max_side / w)); nw = max_side
        else:
            nw = int(w * (max_side / h)); nh = max_side
        im = im.resize((nw, nh), Image.LANCZOS)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    im.save(out_path, "WEBP", quality=q, method=6)

def norm(s: str) -> str:
    s = str(s).strip()
    s = re.sub(r"\s+", " ", s)
    return s

def recode_korean(s: str) -> str:
    # 일부 ZIP이 cp437로 기록된 한글을 갖고 있을 수 있어 보정 시도
    try:
        return s.encode("cp437").decode("cp949")
    except Exception:
        try:
            return s.encode("latin1").decode("cp949")
        except Exception:
            return s

def want_meta(path: str) -> bool:
    p = path.lower()
    return ("/meta/" in p) or (
        any(z in p for z in ["nutrition", "nutrient", "label", "mapping"])
        and (p.endswith(".csv") or p.endswith(".json") or p.endswith(".xlsx"))
    )

def path_is_image(path: str) -> bool:
    return os.path.splitext(path)[1].lower() in IMG_EXT

def seg_match_keep(path: str, KEEP: set):
    parts = [norm(recode_korean(p)) for p in path.replace("\\", "/").split("/") if p.strip()]
    for seg in parts:
        if seg in KEEP:
            return seg
    return None

# ---------- 라벨 ZIP → 파일베이스명→클래스 ----------

def build_filename_to_class_map(label_zip_paths):
    """
    라벨 ZIP 안의 경로 구조/txt 파일명으로
    이미지 파일의 '베이스명(확장자 제외)' -> 클래스명을 만든다.
    내부 ZIP(txt/<클래스>/Q?/Q?.zip) 재귀 지원.
    """
    mapping = {}
    if not label_zip_paths:
        print("[info] filename->class mapping loaded: 0 entries")
        return mapping

    def process_label_zip(zf: zipfile.ZipFile, inherited_cls=None):
        for info in zf.infolist():
            path = recode_korean(info.filename)
            lower = path.lower()

            # 내부 ZIP 재귀
            if lower.endswith(".zip"):
                try:
                    buf = io.BytesIO(zf.read(info))
                    with zipfile.ZipFile(buf) as inner:
                        # 경로에서 클래스 힌트 추출 (txt/<클래스>/Q?/.. or xml/<클래스>/..)
                        parts = [norm(p) for p in path.replace("\\","/").split("/") if p.strip()]
                        hint = inherited_cls
                        for tag in ("txt","xml"):
                            if tag in parts:
                                i = parts.index(tag)
                                if i+1 < len(parts):
                                    hint = norm(recode_korean(parts[i+1]))
                                    break
                        process_label_zip(inner, inherited_cls=hint)
                except Exception as e:
                    print(f"[warn] label inner zip skip {path}: {e}")
                continue

            # TXT 어노테이션 파일: 파일 '베이스명'으로 매핑
            if lower.endswith(".txt"):
                base = os.path.splitext(os.path.basename(path))[0]
                if inherited_cls:
                    mapping[base] = inherited_cls
                continue

            # 엑셀/CSV/JSON도 혹시 있으면 보조로 처리(선택)
            try:
                raw = zf.read(info)
            except Exception:
                continue
            if lower.endswith((".csv",".tsv",".txt_table.csv")):
                try:
                    txt = raw.decode("utf-8")
                except UnicodeDecodeError:
                    txt = raw.decode("cp949","ignore")
                sep = "," if "," in txt[:200] else "\t"
                reader = csv.DictReader(io.StringIO(txt), delimiter=sep)
                file_keys = {"file","filename","file_name","image","img","path","경로","파일","파일명","image_path"}
                class_keys = {"class","label","category","food","name","food_name","menu","음식명","라벨","분류","classname"}
                def pick(d, keys):
                    for k in list(d.keys()):
                        kk = k.strip().lower()
                        if kk in keys and str(d[k]).strip():
                            return str(d[k]).strip()
                    return None
                for row in reader:
                    f = pick(row, file_keys)
                    c = pick(row, class_keys) or inherited_cls
                    if not f or not c: continue
                    base = os.path.splitext(os.path.basename(f))[0]
                    mapping[base] = norm(c)
            elif lower.endswith(".json"):
                try:
                    j = json.loads(raw.decode("utf-8","ignore"))
                    rows = j if isinstance(j,list) else j.get("items",[])
                    for row in rows:
                        if not isinstance(row, dict): continue
                        f = row.get("file") or row.get("filename") or row.get("image") or row.get("path")
                        c = row.get("class") or row.get("label") or inherited_cls
                        if not f or not c: continue
                        base = os.path.splitext(os.path.basename(str(f)))[0]
                        mapping[base] = norm(str(c))
                except Exception:
                    pass

    for zpath in label_zip_paths:
        try:
            with zipfile.ZipFile(zpath) as zf:
                process_label_zip(zf, inherited_cls=None)
        except Exception as e:
            print(f"[warn] label parse fail: {zpath} -> {e}")

    print(f"[info] filename->class mapping loaded: {len(mapping)} entries")
    return mapping

def save_if_needed(cls: str, raw: bytes, out_dir: str, max_per_class: int, alias_rows, saved_counter):
    out_dir_cls = f"{out_dir}/images/{unidecode(cls)}"
    os.makedirs(out_dir_cls, exist_ok=True)
    existing = [f for f in os.listdir(out_dir_cls) if f.endswith(".webp")]
    if len(existing) >= max_per_class:
        return 0
    save_webp_resized(raw, f"{out_dir_cls}/primary_{len(existing)}.webp", max_side=384, q=80)
    alias_rows.append({"food_id": unidecode(cls), "name_kr": cls, "alias": cls})
    saved_counter[0] += 1
    return 1

# ---------- ZIP handlers (내부 ZIP 재귀 + 클래스 상속) ----------

def process_zipfile(zf: zipfile.ZipFile, args, KEEP, meta_rows, alias_rows, fname2class, saved_counter, depth=0, inherited_cls=None):
    for info in zf.infolist():
        path = recode_korean(info.filename)
        low = path.lower()

        # 메타
        if want_meta(path):
            try:
                raw = zf.read(info)
                if low.endswith(".csv"):
                    df = pd.read_csv(io.BytesIO(raw)); meta_rows.append(df)
                elif low.endswith(".json"):
                    j = json.loads(raw.decode("utf-8","ignore"))
                    df = pd.json_normalize(j) if isinstance(j,(dict,list)) else None
                    if isinstance(df,pd.DataFrame): meta_rows.append(df)
                elif low.endswith(".xlsx"):
                    df = pd.read_excel(io.BytesIO(raw)); meta_rows.append(df)
            except Exception:
                pass
            continue

        if args.no_ui_images:
            continue

        # 내부 ZIP이면 재귀 — 이때 바깥 경로에서 클래스 힌트를 추출해 상속
        if low.endswith(".zip"):
            try:
                # image/<클래스>/Q?/Q?.zip 구조에서 클래스 추출
                parts = [norm(p) for p in path.replace("\\","/").split("/") if p.strip()]
                cls_hint = inherited_cls
                if "image" in parts:
                    i = parts.index("image")
                    if i+1 < len(parts):
                        cand = parts[i+1]
                        if cand in KEEP:
                            cls_hint = cand
                buf = io.BytesIO(zf.read(info))
                with zipfile.ZipFile(buf) as inner:
                    process_zipfile(inner, args, KEEP, meta_rows, alias_rows, fname2class, saved_counter, depth+1, inherited_cls=cls_hint)
            except Exception as e:
                print(f"[warn] skip inner zip {path}: {e}")
            continue

        # 이미지 파일 처리
        if not path_is_image(path):
            continue

        # 1) 경로 세그먼트에서 직접 매칭(드물게 존재)
        cls = seg_match_keep(path, KEEP)

        # 2) 파일베이스명으로 라벨 매핑 시도
        if not cls and fname2class:
            base_noext = os.path.splitext(os.path.basename(path))[0]
            cls = fname2class.get(base_noext)

        # 3) 상속된 클래스(바깥 폴더의 음식명) 사용
        if not cls and inherited_cls in KEEP:
            cls = inherited_cls

        if not cls:
            continue

        raw = zf.read(info)
        save_if_needed(cls, raw, args.out, args.max_per_class, alias_rows, saved_counter)

def handle_zip_stream(stream_iter, args, KEEP, meta_rows, alias_rows, fname2class, saved_counter):
    for (path_b, size, chunks) in stream_unzip(stream_iter):
        path = path_b.decode("utf-8", errors="ignore")
        low = path.lower()

        if want_meta(path):
            raw = b"".join(chunks)
            try:
                if low.endswith(".csv"):
                    df = pd.read_csv(io.BytesIO(raw)); meta_rows.append(df)
                elif low.endswith(".json"):
                    j = json.loads(raw.decode("utf-8","ignore"))
                    df = pd.json_normalize(j) if isinstance(j,(dict,list)) else None
                    if isinstance(df,pd.DataFrame): meta_rows.append(df)
                elif low.endswith(".xlsx"):
                    df = pd.read_excel(io.BytesIO(raw)); meta_rows.append(df)
            except Exception:
                pass
            continue

        if args.no_ui_images:
            for _ in chunks: pass
            continue

        if low.endswith(".zip"):
            raw = b"".join(chunks)
            try:
                with zipfile.ZipFile(io.BytesIO(raw)) as inner:
                    process_zipfile(inner, args, KEEP, meta_rows, alias_rows, fname2class, saved_counter, depth=1, inherited_cls=None)
            except Exception as e:
                print(f"[warn] skip inner zip {path}: {e}")
            continue

        keep_cls = seg_match_keep(path, KEEP)
        if not keep_cls and fname2class:
            base_noext = os.path.splitext(os.path.basename(path))[0]
            keep_cls = fname2class.get(base_noext)
        if not keep_cls or not path_is_image(path):
            for _ in chunks: pass
            continue

        raw = b"".join(chunks)
        save_if_needed(keep_cls, raw, args.out, args.max_per_class, alias_rows, saved_counter)

# ---------- Main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--zip", nargs="+", required=True, help="AI Hub 이미지 ZIP(여러개 가능, 분할 통합본 포함) 또는 URL")
    ap.add_argument("--label", nargs="+", help="라벨 ZIP 경로들(txt/<클래스>/Q?/Q?.zip 형태 포함)", default=None)
    ap.add_argument("--keep", default="keep_classes.txt", help="KEEP 클래스 목록(한 줄 1개)")
    ap.add_argument("--out", default="lite", help="출력 디렉토리")
    ap.add_argument("--max-per-class", type=int, default=1, help="클래스당 저장 이미지 수")
    ap.add_argument("--no_ui_images", action="store_true", help="UI 노출용 이미지 저장 생략")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    os.makedirs(f"{args.out}/images", exist_ok=True)

    keep_raw = [norm(x) for x in open(args.keep, encoding="utf-8").read().splitlines() if x.strip()]
    KEEP = set(keep_raw)
    if not KEEP:
        raise SystemExit(f"[error] keep list is empty: {args.keep}")
    print(f"[info] keep classes: {len(KEEP)}")

    fname2class = build_filename_to_class_map(args.label) if args.label else {}

    meta_rows, alias_rows = [], []
    for k in KEEP:
        alias_rows.append({"food_id": unidecode(k), "name_kr": k, "alias": k})

    saved_counter = [0]
    for z in args.zip:
        print(f"[info] processing: {z}")
        before = saved_counter[0]
        try:
            if re.match(r"^https?://", z):
                with requests.get(z, stream=True) as r:
                    r.raise_for_status()
                    handle_zip_stream(r.iter_content(chunk_size=1024*1024),
                                      args, KEEP, meta_rows, alias_rows, fname2class, saved_counter)
            else:
                with zipfile.ZipFile(z) as zf:
                    process_zipfile(zf, args, KEEP, meta_rows, alias_rows, fname2class, saved_counter, inherited_cls=None)
            print(f"[info] saved images from this zip: {saved_counter[0] - before}")
        except Exception as e:
            print(f"[warn] failed on {z}: {e}")

    if meta_rows:
        meta = pd.concat(meta_rows, ignore_index=True).drop_duplicates()
        colmap = {
            "name_kr": ["name","name_kr","menu_kr","food_name","ko_name","label_kr","품목명","음식명"],
            "category": ["category","class","type","분류","음식군"],
            "serving_g": ["serving_g","serving","portion_g","weight_g","1회제공량(g)","중량(g)","중량"],
            "kcal": ["kcal","calorie","energy_kcal","열량(kcal)","열량"],
            "carb_g": ["carb_g","carbohydrate_g","carb","탄수화물(g)","탄수화물"],
            "protein_g": ["protein_g","protein","단백질(g)","단백질"],
            "fat_g": ["fat_g","fat","지방(g)","지방"],
            "sugar_g": ["sugar_g","sugars_g","sugar","당류(g)","당류"],
            "sodium_mg": ["sodium_mg","sodium","na_mg","나트륨(mg)","나트륨"],
            "satfat_g": ["satfat_g","saturated_fat_g","sfa_g","포화지방(g)","포화지방"],
        }
        norm_cols = {}
        for std, cands in colmap.items():
            for c in meta.columns:
                if c.lower().replace(" ", "") in {cc.replace(" ", "") for cc in cands}:
                    norm_cols[std] = c; break
        need = [c for c in ["name_kr","category","serving_g","kcal","carb_g","protein_g","fat_g","sugar_g","sodium_mg","satfat_g"] if c in norm_cols]
        if need:
            out = meta[[norm_cols[c] for c in need]].copy()
            out.columns = need
            out["name_kr"] = out["name_kr"].map(norm)
            out["food_id"] = out["name_kr"].apply(lambda s: unidecode(norm(str(s))))
            out = out[out["name_kr"].apply(lambda s: norm(str(s)) in KEEP)]
            out = out.drop_duplicates(subset=["food_id"]).reset_index(drop=True)
            out.to_parquet(f"{args.out}/nutrition.parquet", compression="zstd", index=False)
            print(f"[ok] wrote {args.out}/nutrition.parquet rows={len(out)}")
        else:
            print("[info] no meta columns recognized; skip parquet")

    pd.DataFrame(alias_rows).drop_duplicates().to_csv(f"{args.out}/aliases.csv", index=False, encoding="utf-8")
    print(f"[DONE] LitePack at: {args.out}")
    print(f"[INFO] total images saved: {saved_counter[0]}")

if __name__ == "__main__":
    main()
