#!/usr/bin/env python3
"""
Generate the create-resources preview webps from the source PDFs.

The PDFs in public/pdf/ are the source-of-truth (also served for printing); this
regenerates the webps the AI Targeted Materials page renders (public/previews/).
Run it whenever the PDFs change.

    python3 scripts/pdf-to-preview.py            # public/pdf -> public/previews
    python3 scripts/pdf-to-preview.py --src DIR --out DIR

Prerequisites (not npm deps — install once on your machine):
    - poppler         (provides `pdftocairo`)   e.g. `brew install poppler`
    - Pillow + numpy  (Python imaging)           e.g. `pip3 install Pillow numpy`

Format (reproduces the original prototype previews):
    - Rasterize each PDF page to 1584px wide (the preview width).
    - Vertically TRIM each page to its content, collapsing the PDF's page margins.
    - Pad 112px top + 112px bottom per page. The page renders the image at 0.5
      scale (1584px image -> 792px on screen), so 112px native = ~56px rendered
      (and ~58px in print) — the document header margin. If the on-screen preview
      width ever changes, recompute: NATIVE_MARGIN = round(desired_rendered / scale).
    - Join multi-page docs with a 2px #C0C0C0 horizontal divider so each document
      reads as individual pages.

Naming: PDF `{KEY}_{material}_{variant}.pdf` -> `{material}_{KEY}_{variant}.webp`
(student_materials gets a trailing `@2x`). Matches the paths in src/data/lessonSets.ts.
"""
import argparse
import glob
import os
import subprocess
import sys
import tempfile
import shutil

try:
    import numpy as np
    from PIL import Image
except ImportError:
    sys.exit("Pillow + numpy required: pip3 install Pillow numpy")

WIDTH = 1584          # preview image width (px)
TOP = BOT = 112       # native margin = 56px rendered at the page's 0.5 display scale
DIV_H = 2             # divider thickness (px)
DIV = (192, 192, 192) # divider color (#C0C0C0), matched to the original previews
WEBP_QUALITY = 80


def out_name(stem: str) -> str:
    """`G1M3L4_mini_lesson_A` -> `mini_lesson_G1M3L4_A.webp` (student adds @2x).
    Filters empty tokens so a stray double underscore can't break parsing."""
    toks = [t for t in stem.split("_") if t]
    key, variant, material = toks[0], toks[-1], "_".join(toks[1:-1])
    suffix = "@2x" if material == "student_materials" else ""
    return f"{material}_{key}_{variant}{suffix}.webp"


def content_bbox_v(im: "Image.Image", thresh: int = 240, min_px: int = 5):
    """Top/bottom rows of real content (>= min_px non-white pixels), or None if blank."""
    a = np.asarray(im.convert("RGB"))
    counts = (a < thresh).any(axis=2).sum(axis=1)
    rows = np.where(counts >= min_px)[0]
    return (int(rows[0]), int(rows[-1])) if len(rows) else None


def build(pdf: str, out: str) -> tuple[int, tuple[int, int]]:
    tmp = tempfile.mkdtemp()
    try:
        subprocess.run(
            ["pdftocairo", "-png", "-scale-to-x", str(WIDTH), "-scale-to-y", "-1", pdf, f"{tmp}/p"],
            check=True, capture_output=True,
        )
        crops = []
        for p in sorted(glob.glob(f"{tmp}/p-*.png")):
            im = Image.open(p).convert("RGB")
            bb = content_bbox_v(im)
            # a genuinely blank page (bb is None) falls back to the full raster
            crops.append(im.crop((0, bb[0], im.width, bb[1] + 1)) if bb else im)
        if not crops:
            raise RuntimeError("no pages rendered")
        w = crops[0].width
        total = sum(TOP + c.height + BOT for c in crops) + DIV_H * (len(crops) - 1)
        canvas = Image.new("RGB", (w, total), (255, 255, 255))
        divider = Image.new("RGB", (w, DIV_H), DIV)
        y = 0
        for i, c in enumerate(crops):
            y += TOP
            canvas.paste(c, (0, y))
            y += c.height + BOT
            if i < len(crops) - 1:
                canvas.paste(divider, (0, y))
                y += DIV_H
        canvas.save(out, "WEBP", quality=WEBP_QUALITY, method=4)
        return len(crops), canvas.size
    finally:
        shutil.rmtree(tmp)


def main() -> int:
    ap = argparse.ArgumentParser(description="PDF -> preview webp generator.")
    ap.add_argument("--src", default="public/pdf", help="source PDF directory")
    ap.add_argument("--out", default="public/previews", help="output webp directory")
    args = ap.parse_args()

    if shutil.which("pdftocairo") is None:
        sys.exit("pdftocairo not found — install poppler (e.g. `brew install poppler`).")

    os.makedirs(args.out, exist_ok=True)
    pdfs = sorted(glob.glob(os.path.join(args.src, "*.pdf")))
    if not pdfs:
        sys.exit(f"no PDFs in {args.src}")

    made, errs = 0, []
    for pdf in pdfs:
        stem = os.path.splitext(os.path.basename(pdf))[0]
        out = os.path.join(args.out, out_name(stem))
        try:
            pages, size = build(pdf, out)
            made += 1
            print(f"  {os.path.basename(out)}  ({pages}p {size[0]}x{size[1]})")
        except Exception as e:  # noqa: BLE001 — report and continue
            errs.append((os.path.basename(pdf), str(e)))

    print(f"\ngenerated {made}/{len(pdfs)} webps -> {args.out}")
    for f, e in errs:
        print(f"  ERROR {f}: {e}")
    return 1 if errs else 0


if __name__ == "__main__":
    raise SystemExit(main())
