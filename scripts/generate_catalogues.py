"""
Generate branded 2-page PDF catalogues for each Texsonics robot.

Reads robots from src/data/robots.ts (naive TS parse — sufficient because the
file is a plain, well-formed literal export we control) and produces one PDF
per robot into public/catalogues/{MODEL}.pdf.

Design references:
  - C:/Users/Dreqi/Downloads/Texsonics_Catalogue.pdf  (2-page navy/cyan layout)
  - C:/Texsonics/Robots/Robot 1/WhatsApp Image 2026-08-05 at 7.06.57 PM.jpeg
    (brand blue #15CEEA)
"""

from __future__ import annotations

import io
import re
from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA_TS = ROOT / "src" / "data" / "robots.ts"
ASSETS = ROOT / "src" / "assets" / "robots"
LOGO_PATH = ROOT / "src" / "assets" / "texsonics-logo.png"
OUT_DIR = ROOT / "public" / "catalogues"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Brand colors --------------------------------------------------------
NAVY = HexColor("#0B3358")
NAVY_DEEP = HexColor("#062340")
CYAN = HexColor("#15CEEA")
CYAN_LIGHT = HexColor("#B7EEF7")
GREY_DARK = HexColor("#2F3A44")
GREY_MID = HexColor("#6B7B8A")
GREY_LIGHT = HexColor("#E5EBF0")
WHITE = HexColor("#FFFFFF")
BG_TINT = HexColor("#F0F5F8")

# --- Fonts ---------------------------------------------------------------
def register_fonts():
    """Try to register Inter/Space Grotesk from Windows Fonts; fall back to
    ReportLab defaults (Helvetica) if not found — the PDF still renders."""
    win_fonts = Path("C:/Windows/Fonts")
    candidates = {
        "TexBody": ["arial.ttf", "segoeui.ttf"],
        "TexBodyBold": ["arialbd.ttf", "segoeuib.ttf"],
        "TexDisplay": ["arialbd.ttf", "segoeuib.ttf"],
    }
    registered = {}
    for name, files in candidates.items():
        for f in files:
            p = win_fonts / f
            if p.exists():
                try:
                    pdfmetrics.registerFont(TTFont(name, str(p)))
                    registered[name] = True
                    break
                except Exception:
                    pass
    return registered

FONTS = register_fonts()
BODY = "TexBody" if "TexBody" in FONTS else "Helvetica"
BODY_BOLD = "TexBodyBold" if "TexBodyBold" in FONTS else "Helvetica-Bold"
DISPLAY = "TexDisplay" if "TexDisplay" in FONTS else "Helvetica-Bold"

# --- TS data loader ------------------------------------------------------
def parse_robots():
    """Extract robots[] from robots.ts as a list of dicts.

    Skips the `Robot[]` type annotation and finds the actual array literal
    after `=`. Then does a proper brace-and-string aware scan for top-level
    objects."""
    src = DATA_TS.read_text(encoding="utf-8")
    m = re.search(r'export const robots\s*:\s*Robot\[\]\s*=\s*\[', src)
    assert m, "could not find robots array declaration"
    i = m.end()  # positioned right after the opening `[` of the array literal
    objs = []
    array_depth = 1
    in_str = False
    str_char = None
    while i < len(src) and array_depth > 0:
        c = src[i]
        if in_str:
            if c == "\\":
                i += 2; continue
            if c == str_char:
                in_str = False
            i += 1
            continue
        if c in ('"', "'", "`"):
            in_str = True; str_char = c; i += 1; continue
        if c == "[":
            array_depth += 1; i += 1; continue
        if c == "]":
            array_depth -= 1; i += 1; continue
        if c == "{" and array_depth == 1:
            # scan matched-brace object
            obj_start = i
            depth = 1
            j = i + 1
            in_s = False; sc = None
            while j < len(src):
                cj = src[j]
                if in_s:
                    if cj == "\\": j += 2; continue
                    if cj == sc: in_s = False
                    j += 1; continue
                if cj in ('"', "'", "`"):
                    in_s = True; sc = cj; j += 1; continue
                if cj == "{":
                    depth += 1
                elif cj == "}":
                    depth -= 1
                    if depth == 0:
                        objs.append(src[obj_start:j+1])
                        i = j + 1
                        break
                j += 1
            else:
                break
            continue
        i += 1
    return [ts_object_to_dict(o) for o in objs]

def ts_object_to_dict(ts_src: str) -> dict:
    """Very small TS-object -> python dict parser: handles strings (single or
    double), numeric-looking flags, arrays of strings, and arrays of {label,
    value} pairs. Not general — only for our robots.ts literal shape."""
    d = {}
    # Extract simple string fields (use raw string — our source is UTF-8 and
    # never uses \u escapes we'd need to unescape).
    for key in ("id", "model", "name", "series", "tagline", "axes", "payload",
                "reach", "repeatability", "description", "longDescription", "image", "catalogue"):
        m = re.search(rf'{key}\s*:\s*"((?:[^"\\]|\\.)*)"', ts_src)
        if m:
            d[key] = m.group(1)
    # applications: [ "a", "b", ... ]
    m = re.search(r'applications\s*:\s*\[(.*?)\]', ts_src, re.DOTALL)
    if m:
        d["applications"] = [s.strip().strip('"') for s in re.findall(r'"([^"]+)"', m.group(1))]
    # specs / workingRange: [ {label:..., value:...}, ... ]
    for key in ("specs", "workingRange"):
        m = re.search(rf'{key}\s*:\s*\[(.*?)\](?=\s*,\s*(?:image|workingRange|specs|featured|catalogue|\}}))', ts_src, re.DOTALL)
        if not m:
            m = re.search(rf'{key}\s*:\s*\[(.*?)\]\s*,', ts_src, re.DOTALL)
        if m:
            rows = []
            for row in re.finditer(r'\{\s*label\s*:\s*"([^"]*)"\s*,\s*value\s*:\s*"([^"]*)"\s*\}', m.group(1)):
                rows.append({"label": row.group(1), "value": row.group(2)})
            d[key] = rows
    return d

# --- Image resolver ------------------------------------------------------
def resolve_image(spec: str) -> Path | None:
    # spec is like: 'C:\\...' or '@/assets/robots/...' from the TS import chain.
    # But we parse it from the string field which we didn't capture — instead
    # infer by robot id.
    return None

IMAGE_BY_ID = {
    "ts4-560":  ASSETS / "air4-560-grey.png",
    "ts6-0808": ASSETS / "zdfx0808.png",
    "ts6-1215": ASSETS / "zdft1215.png",
    "ts6-2518": ASSETS / "zdgt2518.png",
    "tsa700-6n": ASSETS / "kla700-scara.png",
    "tscr-05e": ASSETS / "cr-05e-cobot.png",
    "amr-300":  ASSETS / "amr-300.png",
}

# --- Layout helpers ------------------------------------------------------
PAGE_W, PAGE_H = A4
MARGIN = 15 * mm

def draw_header(c: canvas.Canvas, robot: dict, page_num: int, total: int):
    # top slim navy band
    c.setFillColor(NAVY_DEEP)
    c.rect(0, PAGE_H - 12 * mm, PAGE_W, 12 * mm, fill=1, stroke=0)
    # cyan accent under it
    c.setFillColor(CYAN)
    c.rect(0, PAGE_H - 14 * mm, PAGE_W, 2 * mm, fill=1, stroke=0)

    # brand text (fallback if logo not usable)
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 12)
    c.drawString(MARGIN, PAGE_H - 8 * mm, "TEXSONICS SYSTEMS INDIA PRIVATE LIMITED")

    # right side: model badge
    label = robot["model"]
    c.setFont(DISPLAY, 10)
    tw = c.stringWidth(label, DISPLAY, 10)
    c.setFillColor(CYAN)
    c.rect(PAGE_W - MARGIN - tw - 10 * mm, PAGE_H - 10 * mm, tw + 8 * mm, 6 * mm, fill=1, stroke=0)
    c.setFillColor(NAVY_DEEP)
    c.drawString(PAGE_W - MARGIN - tw - 6 * mm, PAGE_H - 8.5 * mm, label)

    # page footer marker
    c.setFillColor(GREY_MID)
    c.setFont(BODY, 8)
    c.drawRightString(PAGE_W - MARGIN, 8 * mm, f"{robot['model']}  ·  Page {page_num} of {total}")

def draw_footer_contact(c: canvas.Canvas):
    # navy strip footer
    c.setFillColor(NAVY_DEEP)
    c.rect(0, 0, PAGE_W, 15 * mm, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.rect(0, 15 * mm, PAGE_W, 1.5 * mm, fill=1, stroke=0)

    c.setFillColor(WHITE)
    c.setFont(BODY_BOLD, 9)
    c.drawString(MARGIN, 10 * mm, "TEXSONICS SYSTEMS INDIA PRIVATE LIMITED")
    c.setFont(BODY, 8)
    c.drawString(MARGIN, 6.2 * mm, "1/6-1, Keerakaran Thottam, Keeranatham, Coimbatore 641035, TN, India")
    c.drawString(MARGIN, 3.2 * mm, "Phone +91 94426 24304  ·  Email dharmar@texsonics.net  ·  Web www.texsonics.net")

def draw_image_boxed(c: canvas.Canvas, img_path: Path, x, y, w, h):
    if not img_path.exists():
        c.setStrokeColor(GREY_MID)
        c.rect(x, y, w, h, fill=0, stroke=1)
        return
    im = Image.open(img_path).convert("RGBA")
    iw, ih = im.size
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    # background tint block
    c.setFillColor(BG_TINT)
    c.rect(x, y, w, h, fill=1, stroke=0)
    # Draw image via ImageReader (supports alpha PNG)
    from reportlab.lib.utils import ImageReader
    c.drawImage(ImageReader(im), dx, dy, dw, dh, mask="auto")

def draw_spec_table(c, x, y_top, w, rows, row_h=6.2 * mm, label_w_frac=0.55, header="SPECIFICATIONS"):
    """rows: list[(label, value)]. header=None hides the header bar."""
    label_w = w * label_w_frac
    val_w = w - label_w
    header_h = 7 * mm if header else 0

    # header
    if header:
        c.setFillColor(NAVY)
        c.rect(x, y_top - header_h, w, header_h, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(BODY_BOLD, 9.5)
        c.drawString(x + 3 * mm, y_top - header_h + 2.3 * mm, header)

    y = y_top - header_h
    for i, (lbl, val) in enumerate(rows):
        # measure — wrap value if too wide
        c.setFont(BODY_BOLD, 8.6)
        max_val_w = val_w - 4 * mm
        val_lines = wrap_text(val, max_val_w, BODY_BOLD, 8.6, c)
        # measure — wrap label
        c.setFont(BODY, 8.6)
        max_lbl_w = label_w - 4 * mm
        lbl_lines = wrap_text(lbl, max_lbl_w, BODY, 8.6, c)
        rows_needed = max(len(val_lines), len(lbl_lines))
        this_row_h = max(row_h, rows_needed * 3.6 * mm + 2.4 * mm)
        y -= this_row_h
        # zebra
        if i % 2 == 0:
            c.setFillColor(GREY_LIGHT)
            c.rect(x, y, w, this_row_h, fill=1, stroke=0)
        # label
        c.setFillColor(NAVY_DEEP)
        c.setFont(BODY, 8.6)
        ly = y + this_row_h - 3.6 * mm
        for line in lbl_lines:
            c.drawString(x + 3 * mm, ly, line)
            ly -= 3.6 * mm
        # value
        c.setFillColor(GREY_DARK)
        c.setFont(BODY_BOLD, 8.6)
        vy = y + this_row_h - 3.6 * mm
        for line in val_lines:
            c.drawString(x + label_w + 1 * mm, vy, line)
            vy -= 3.6 * mm
    # border
    c.setStrokeColor(HexColor("#C9D3DC"))
    c.setLineWidth(0.5)
    c.rect(x, y, w, y_top - y, fill=0, stroke=1)
    return y  # bottom-y

def draw_highlight_grid(c, x, y_top, w, applications):
    """4–6 highlight pills spread across w."""
    n = min(len(applications), 4)
    apps = applications[:n]
    if n == 0:
        return y_top
    gap = 3 * mm
    tile_w = (w - gap * (n - 1)) / n
    tile_h = 20 * mm
    for i, a in enumerate(apps):
        tx = x + i * (tile_w + gap)
        # bg
        c.setFillColor(CYAN_LIGHT)
        c.rect(tx, y_top - tile_h, tile_w, tile_h, fill=1, stroke=0)
        # cyan top bar
        c.setFillColor(CYAN)
        c.rect(tx, y_top - 2, tile_w, 2, fill=1, stroke=0)
        # centered text (wrapped)
        c.setFillColor(NAVY_DEEP)
        c.setFont(BODY_BOLD, 8)
        lines = wrap_text(a, tile_w - 4 * mm, BODY_BOLD, 8, c)
        total_h = len(lines) * 4 * mm
        cy = y_top - tile_h / 2 + total_h / 2 - 3 * mm
        for line in lines:
            lw = c.stringWidth(line, BODY_BOLD, 8)
            c.drawString(tx + (tile_w - lw) / 2, cy, line)
            cy -= 4 * mm
    return y_top - tile_h

def wrap_text(text, max_w, font, size, c):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines or [""]

def draw_body_paragraph(c, text, x, y_top, w, max_lines=None, size=9, leading=4.3 * mm):
    c.setFont(BODY, size)
    c.setFillColor(GREY_DARK)
    lines = []
    for para in text.split("\n"):
        lines.extend(wrap_text(para, w, BODY, size, c))
    if max_lines:
        lines = lines[:max_lines]
    y = y_top
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y

def draw_section_title(c, text, x, y):
    c.setFillColor(CYAN)
    c.rect(x, y, 3 * mm, 5.2 * mm, fill=1, stroke=0)
    c.setFillColor(NAVY_DEEP)
    c.setFont(DISPLAY, 12)
    c.drawString(x + 5 * mm, y + 1.4 * mm, text)
    return y - 3 * mm

# --- Page builders -------------------------------------------------------
def build_page1(c, robot, img_path):
    draw_header(c, robot, 1, 2)
    y = PAGE_H - 20 * mm

    # Model name + tagline
    c.setFillColor(NAVY_DEEP)
    c.setFont(DISPLAY, 26)
    c.drawString(MARGIN, y - 8 * mm, robot["model"] + "  INDUSTRIAL ROBOT" if robot["axes"].startswith("6") or robot["axes"].startswith("4") else robot["model"] + "  MOBILE ROBOT")

    c.setFont(BODY, 11)
    c.setFillColor(CYAN)
    c.drawString(MARGIN, y - 14 * mm, robot["tagline"].upper())

    top = y - 20 * mm

    # Left: image
    img_w = 80 * mm
    img_h = 95 * mm
    draw_image_boxed(c, img_path, MARGIN, top - img_h, img_w, img_h)

    # Right: description
    desc_x = MARGIN + img_w + 8 * mm
    desc_w = PAGE_W - MARGIN - desc_x
    c.setFillColor(NAVY_DEEP)
    c.setFont(BODY_BOLD, 11)
    c.drawString(desc_x, top - 2 * mm, "OVERVIEW")
    c.setStrokeColor(CYAN)
    c.setLineWidth(1.2)
    c.line(desc_x, top - 4 * mm, desc_x + 25 * mm, top - 4 * mm)

    y_after = draw_body_paragraph(c, robot["longDescription"], desc_x, top - 9 * mm, desc_w, max_lines=11, size=9, leading=4.4 * mm)

    # Applications strip below description
    y_apps = y_after - 3 * mm
    c.setFont(BODY_BOLD, 9)
    c.setFillColor(NAVY_DEEP)
    c.drawString(desc_x, y_apps, "PRIMARY APPLICATIONS")
    y_apps -= 4 * mm
    y_apps = draw_highlight_grid(c, desc_x, y_apps, desc_w, robot.get("applications", []))

    # Specs table across full width below
    specs_top = top - img_h - 8 * mm
    rows = [(s["label"], s["value"]) for s in robot.get("specs", [])]
    draw_spec_table(c, MARGIN, specs_top, PAGE_W - 2 * MARGIN, rows)

    draw_footer_contact(c)

def build_page2(c, robot):
    draw_header(c, robot, 2, 2)
    y = PAGE_H - 22 * mm

    # Working range / joint envelope
    y = draw_section_title(c, "WORKING RANGE", MARGIN, y - 5 * mm)
    y -= 3 * mm
    wr = robot.get("workingRange", [])
    if wr:
        col_w = (PAGE_W - 2 * MARGIN - 6 * mm) / 2
        left_rows = wr[: (len(wr) + 1) // 2]
        right_rows = wr[(len(wr) + 1) // 2:]
        y_left = draw_spec_table(c, MARGIN, y, col_w,
                                 [(r["label"], r["value"]) for r in left_rows],
                                 row_h=6 * mm, label_w_frac=0.62, header=None)
        y_right = draw_spec_table(c, MARGIN + col_w + 6 * mm, y, col_w,
                                  [(r["label"], r["value"]) for r in right_rows],
                                  row_h=6 * mm, label_w_frac=0.62, header=None) if right_rows else y
        y = min(y_left, y_right)

    y -= 10 * mm
    y = draw_section_title(c, "KEY HIGHLIGHTS", MARGIN, y)
    y -= 4 * mm
    is_amr = robot["series"].startswith("AMR")
    if is_amr:
        highlights = [
            f"Payload capacity {robot['payload']}",
            f"Docking accuracy {robot['repeatability']}",
            "LiDAR-based natural navigation (no tape, no reflectors)",
            "Designed, manufactured and supported from Coimbatore, India",
            "Fleet manager with ERP / MES integration",
            "Dual safety LiDAR, bumpers and emergency stop",
        ]
    else:
        highlights = [
            f"Payload capacity {robot['payload']}",
            f"Maximum reach {robot['reach']}",
            f"Positional repeatability {robot['repeatability']}",
            "Designed, manufactured and supported from Coimbatore, India",
            "In-house Texsonics RC series controller, drives and teach pendant",
            "Compatible with Texsonics CAM software and vision packages",
        ]
    c.setFont(BODY, 9)
    c.setFillColor(GREY_DARK)
    for h in highlights:
        c.setFillColor(CYAN)
        c.rect(MARGIN, y, 2 * mm, 2 * mm, fill=1, stroke=0)
        c.setFillColor(GREY_DARK)
        c.drawString(MARGIN + 4.5 * mm, y - 0.2 * mm, h)
        y -= 5.5 * mm

    y -= 6 * mm
    y = draw_section_title(c, "WORK ENVELOPE & INSTALLATION", MARGIN, y)
    y -= 4 * mm

    # navy panel with description
    panel_h = 40 * mm
    c.setFillColor(HexColor("#E5F0FA"))
    c.rect(MARGIN, y - panel_h, PAGE_W - 2 * MARGIN, panel_h, fill=1, stroke=0)
    c.setFillColor(CYAN)
    c.rect(MARGIN, y - 2, PAGE_W - 2 * MARGIN, 2, fill=1, stroke=0)
    if is_amr:
        envelope_text = (
            f"The {robot['model']} operates fleet-wide across your facility "
            f"with a {robot['payload']} payload and LiDAR-based natural "
            f"navigation. Every unit ships with the Texsonics fleet manager, "
            f"opportunity charging, and is supported locally by our "
            f"engineering team from Coimbatore."
        )
    else:
        envelope_text = (
            f"The {robot['model']} delivers dependable performance across its "
            f"work envelope with a maximum reach of {robot['reach']} and payload "
            f"of {robot['payload']}. Every unit ships pre-integrated with the "
            f"Texsonics RC series controller, teach pendant, safety I/O, and "
            f"is supported locally by our engineering team from Coimbatore."
        )
    draw_body_paragraph(c, envelope_text, MARGIN + 4 * mm, y - 6 * mm,
                        PAGE_W - 2 * MARGIN - 8 * mm, size=9.2, leading=4.6 * mm)

    y -= panel_h + 8 * mm

    # Disclaimer strip
    c.setFillColor(GREY_LIGHT)
    c.rect(MARGIN, y - 20 * mm, PAGE_W - 2 * MARGIN, 20 * mm, fill=1, stroke=0)
    c.setFillColor(NAVY_DEEP)
    c.setFont(BODY_BOLD, 8)
    c.drawString(MARGIN + 3 * mm, y - 6 * mm, "DISCLAIMER")
    disc = (
        "Specifications and visuals may change without notice as part of "
        "ongoing product improvements. Images are for reference only; actual "
        "performance may vary by application. Unauthorized reproduction of "
        "this catalogue is prohibited without written permission from "
        "Texsonics Systems India Private Limited."
    )
    draw_body_paragraph(c, disc, MARGIN + 3 * mm, y - 10 * mm,
                        PAGE_W - 2 * MARGIN - 6 * mm, size=7.6, leading=3.4 * mm)

    draw_footer_contact(c)

# --- Main ----------------------------------------------------------------
def generate(robot):
    out = OUT_DIR / f"{robot['model']}.pdf"
    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle(f"{robot['model']} — Texsonics Product Catalogue")
    c.setAuthor("Texsonics Systems India Private Limited")
    c.setSubject(robot["name"])

    img = IMAGE_BY_ID.get(robot["id"])
    build_page1(c, robot, img)
    c.showPage()
    build_page2(c, robot)
    c.showPage()
    c.save()
    print(f"[OK] {out}")

def main():
    robots = parse_robots()
    print(f"parsed {len(robots)} robots")
    for r in robots:
        if "model" in r and "id" in r:
            generate(r)

if __name__ == "__main__":
    main()
