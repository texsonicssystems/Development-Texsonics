"""
Generate branded multi-page PDF catalogues for each Texsonics robot,
patterned after the TEXCON MC-2000 brochure design:

  - Blueprint hairline grid backdrop
  - Small mono meta line at page top
  - Cyan chip section markers (01, 02, ...) with UPPERCASE titles
  - Two-column specification tables with mono category labels
  - Statement + numbered-feature callouts
  - Product hero image with subtle tint card
  - Chip-cloud applications
  - Big model callout footer

Reads robots from src/data/robots.ts (naive TS parser — sufficient because the
file is a plain, well-formed literal export we control) and writes one PDF
per robot to public/catalogues/{MODEL}.pdf.
"""

from __future__ import annotations

import re
from pathlib import Path
from datetime import date

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DATA_TS = ROOT / "src" / "data" / "robots.ts"
ASSETS = ROOT / "src" / "assets" / "robots"
OUT_DIR = ROOT / "public" / "catalogues"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Brand palette (matches TEXCON reference) ----------------------------
WHITE = HexColor("#FFFFFF")
INK = HexColor("#0F1720")          # near-black body text
INK_SOFT = HexColor("#1E2B3A")     # slightly lighter for large display
MUTED = HexColor("#6B7B8A")        # mono labels, small caption text
MUTED_SOFT = HexColor("#98A6B3")   # even lighter — page-number footer etc.
HAIRLINE = HexColor("#D8DEE5")     # subtle divider
HAIRLINE_SOFT = HexColor("#EAEEF2")  # blueprint grid + faintest lines
CYAN = HexColor("#14D3EE")         # cyan chip / accent — samples #15CEEA
CYAN_INK = HexColor("#0B90A6")     # darker cyan text on white
TINT = HexColor("#F3F6F8")         # image card backdrop

# --- Fonts ---------------------------------------------------------------
def register_fonts():
    win = Path("C:/Windows/Fonts")
    plan = [
        ("TexSans",       ["segoeui.ttf", "arial.ttf"]),
        ("TexSansBold",   ["segoeuib.ttf", "arialbd.ttf"]),
        ("TexSansLight",  ["segoeuil.ttf", "segoeui.ttf", "arial.ttf"]),
        ("TexMono",       ["consola.ttf", "cour.ttf"]),
        ("TexMonoBold",   ["consolab.ttf", "courbd.ttf"]),
    ]
    got = {}
    for name, files in plan:
        for f in files:
            p = win / f
            if p.exists():
                try:
                    pdfmetrics.registerFont(TTFont(name, str(p)))
                    got[name] = True; break
                except Exception:
                    pass
    return got

FONTS = register_fonts()
SANS       = "TexSans" if "TexSans" in FONTS else "Helvetica"
SANS_BOLD  = "TexSansBold" if "TexSansBold" in FONTS else "Helvetica-Bold"
SANS_LIGHT = "TexSansLight" if "TexSansLight" in FONTS else SANS
MONO       = "TexMono" if "TexMono" in FONTS else "Courier"
MONO_BOLD  = "TexMonoBold" if "TexMonoBold" in FONTS else "Courier-Bold"

# --- Page geometry -------------------------------------------------------
PAGE_W, PAGE_H = A4
MARGIN_X = 18 * mm
MARGIN_Y_TOP = 15 * mm
MARGIN_Y_BOT = 15 * mm
CONTENT_W = PAGE_W - 2 * MARGIN_X

# --- Image resolver ------------------------------------------------------
IMAGE_BY_ID = {
    "ts4-560":   ASSETS / "air4-560-grey.png",
    "ts6-0808":  ASSETS / "zdfx0808.png",
    "ts6-1215":  ASSETS / "zdft1215.png",
    "ts6-2518":  ASSETS / "zdgt2518.png",
    "tsa700-6n": ASSETS / "kla700-scara.png",
    "tscr-05e":  ASSETS / "cr-05e-cobot.png",
    "amr-300":   ASSETS / "amr-300.png",
}

# --- TS data loader (identical to previous — proven to work) -------------
def parse_robots():
    src = DATA_TS.read_text(encoding="utf-8")
    m = re.search(r'export const robots\s*:\s*Robot\[\]\s*=\s*\[', src)
    assert m, "could not find robots array declaration"
    i = m.end()
    objs = []
    depth_arr = 1
    in_s = False; sc = None
    while i < len(src) and depth_arr > 0:
        c = src[i]
        if in_s:
            if c == "\\": i += 2; continue
            if c == sc: in_s = False
            i += 1; continue
        if c in ('"', "'", "`"):
            in_s = True; sc = c; i += 1; continue
        if c == "[":
            depth_arr += 1; i += 1; continue
        if c == "]":
            depth_arr -= 1; i += 1; continue
        if c == "{" and depth_arr == 1:
            obj_start = i
            depth = 1
            j = i + 1
            in_ss = False; ssc = None
            while j < len(src):
                cj = src[j]
                if in_ss:
                    if cj == "\\": j += 2; continue
                    if cj == ssc: in_ss = False
                    j += 1; continue
                if cj in ('"', "'", "`"):
                    in_ss = True; ssc = cj; j += 1; continue
                if cj == "{": depth += 1
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
    d = {}
    for key in ("id", "model", "name", "series", "tagline", "axes", "payload",
                "reach", "repeatability", "description", "longDescription",
                "image", "catalogue"):
        m = re.search(rf'{key}\s*:\s*"((?:[^"\\]|\\.)*)"', ts_src)
        if m:
            d[key] = m.group(1)
    m = re.search(r'applications\s*:\s*\[(.*?)\]', ts_src, re.DOTALL)
    if m:
        d["applications"] = [s.strip().strip('"') for s in re.findall(r'"([^"]+)"', m.group(1))]
    for key in ("specs", "workingRange"):
        m = re.search(rf'{key}\s*:\s*\[(.*?)\]\s*,', ts_src, re.DOTALL)
        if m:
            rows = []
            for row in re.finditer(r'\{\s*label\s*:\s*"([^"]*)"\s*,\s*value\s*:\s*"([^"]*)"\s*\}', m.group(1)):
                rows.append({"label": row.group(1), "value": row.group(2)})
            d[key] = rows
    return d

# --- Text utilities ------------------------------------------------------
def wrap(text, max_w, font, size, c):
    """Word-wrap text into a list of lines that fit max_w in the given font."""
    words = str(text).split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines or [""]

def draw_wrapped(c, text, x, y_top, max_w, font, size, color, leading=None):
    """Draw wrapped text starting from y_top; returns bottom-y after last line."""
    leading = leading or size * 1.35
    c.setFont(font, size)
    c.setFillColor(color)
    lines = wrap(text, max_w, font, size, c)
    y = y_top
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y + leading  # baseline of last line

# --- Page chrome ---------------------------------------------------------
def draw_backdrop(c):
    """Very faint blueprint grid across the whole page."""
    c.setStrokeColor(HAIRLINE_SOFT)
    c.setLineWidth(0.25)
    step = 14 * mm
    x = 0.0
    while x < PAGE_W:
        c.line(x, 0, x, PAGE_H); x += step
    y = 0.0
    while y < PAGE_H:
        c.line(0, y, PAGE_W, y); y += step

def draw_page_header(c, robot, rev_label):
    y = PAGE_H - MARGIN_Y_TOP
    # mono meta line
    c.setFillColor(INK)
    c.setFont(MONO_BOLD, 8)
    c.drawString(MARGIN_X, y, "TEXSONICS")
    c.setFont(MONO, 8)
    c.setFillColor(MUTED)
    left_txt = "TEXSONICS"
    lw = c.stringWidth(left_txt, MONO_BOLD, 8)
    c.drawString(MARGIN_X + lw, y, " · INDUSTRIAL ROBOTICS")
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - MARGIN_X, y, rev_label)
    # hairline
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, y - 3 * mm, PAGE_W - MARGIN_X, y - 3 * mm)
    return y - 8 * mm  # content-top y

def draw_page_footer(c, robot, page_num, total):
    y = MARGIN_Y_BOT
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, y + 6 * mm, PAGE_W - MARGIN_X, y + 6 * mm)
    c.setFillColor(MUTED_SOFT)
    c.setFont(MONO, 7)
    c.drawString(MARGIN_X, y, robot["model"])
    c.drawRightString(PAGE_W - MARGIN_X, y,
                      f"PAGE {page_num:02d} / {total:02d}")

def draw_section_head(c, num, title, x, y):
    """Cyan chip with 2-digit number + uppercase title. Returns y after."""
    chip_w = 8 * mm
    chip_h = 6.4 * mm
    c.setFillColor(CYAN)
    c.rect(x, y - chip_h + 1.6 * mm, chip_w, chip_h, fill=1, stroke=0)
    c.setFillColor(INK)
    c.setFont(MONO_BOLD, 8)
    tw = c.stringWidth(f"{num:02d}", MONO_BOLD, 8)
    c.drawString(x + (chip_w - tw) / 2, y - chip_h + 4 * mm, f"{num:02d}")
    c.setFillColor(INK)
    c.setFont(SANS_BOLD, 13)
    c.drawString(x + chip_w + 4 * mm, y - chip_h + 4 * mm, title.upper())
    return y - chip_h - 1 * mm

def draw_hairline(c, x, y, w, color=HAIRLINE):
    c.setStrokeColor(color)
    c.setLineWidth(0.5)
    c.line(x, y, x + w, y)

def draw_dashed_hairline(c, x, y, w, color=HAIRLINE):
    c.setStrokeColor(color)
    c.setLineWidth(0.5)
    c.setDash(2, 3)
    c.line(x, y, x + w, y)
    c.setDash()  # reset

# --- Spec table (2-col mono-label style) ---------------------------------
def draw_spec_column(c, category, rows, x, y_top, col_w, label_font_size=7.4,
                     value_font_size=9.2, row_gap=6 * mm):
    """Column: mono uppercase category header, then rows of small mono label +
    value text, separated by dashed hairlines. Returns bottom-y."""
    # Category header (mono uppercase small)
    c.setFillColor(MUTED)
    c.setFont(MONO_BOLD, label_font_size + 0.4)
    c.drawString(x, y_top, category.upper())
    y = y_top - 3 * mm
    draw_hairline(c, x, y, col_w)
    y -= 3.5 * mm

    label_col_w = col_w * 0.40
    value_col_w = col_w - label_col_w - 4 * mm

    for i, (lbl, val) in enumerate(rows):
        # Prep value wrap
        val_lines = wrap(val, value_col_w, SANS, value_font_size, c)
        block_h = max(len(val_lines), 1) * (value_font_size * 1.35) + 2 * mm
        block_h = max(block_h, row_gap)

        # Draw mono label (uppercase, top-aligned)
        c.setFillColor(MUTED)
        c.setFont(MONO, label_font_size)
        # wrap label to label_col_w too — keeps things tidy
        lbl_lines = wrap(lbl.upper(), label_col_w, MONO, label_font_size, c)
        ly = y
        for line in lbl_lines:
            c.drawString(x, ly, line)
            ly -= label_font_size * 1.35

        # Value (regular sans, near-black)
        c.setFillColor(INK)
        c.setFont(SANS, value_font_size)
        vy = y
        for line in val_lines:
            c.drawString(x + label_col_w + 4 * mm, vy, line)
            vy -= value_font_size * 1.35

        y -= block_h
        # dashed row separator
        draw_dashed_hairline(c, x, y + 1.5 * mm, col_w)

    return y

# --- Content sections ----------------------------------------------------
def draw_top_hero(c, robot, y_top):
    """Series chip + MODEL kicker + big display name + tagline + description.
    Returns bottom-y."""
    y = y_top

    # Series chip
    series = robot["series"].upper()
    c.setFont(MONO_BOLD, 7.5)
    sw = c.stringWidth(series, MONO_BOLD, 7.5)
    chip_h = 5.5 * mm
    chip_w = sw + 6 * mm
    c.setFillColor(CYAN)
    c.rect(MARGIN_X, y - chip_h, chip_w, chip_h, fill=1, stroke=0)
    c.setFillColor(INK)
    c.drawString(MARGIN_X + 3 * mm, y - chip_h + 1.9 * mm, series)
    y -= chip_h + 6 * mm

    # "MODEL" mono kicker
    c.setFillColor(MUTED)
    c.setFont(MONO, 8)
    c.drawString(MARGIN_X, y, "MODEL")
    y -= 12 * mm

    # Big display: the model number
    c.setFillColor(INK_SOFT)
    c.setFont(SANS_BOLD, 34)
    c.drawString(MARGIN_X, y, robot["model"])
    y -= 14 * mm

    # Tagline in slightly muted body
    y = draw_wrapped(c, robot["longDescription"], MARGIN_X, y,
                     CONTENT_W - 20 * mm, SANS, 10.2, MUTED,
                     leading=13.5)
    y -= 4 * mm
    return y

def draw_feature_strip(c, features, y_top):
    """Four (or fewer) vertical stacks across the page:
       bold label + small description each."""
    n = len(features)
    if n == 0: return y_top
    gap = 6 * mm
    tile_w = (CONTENT_W - gap * (n - 1)) / n
    y = y_top

    strip_h = 20 * mm
    # top hairline
    draw_hairline(c, MARGIN_X, y, CONTENT_W)
    y -= 5 * mm

    for i, (label, desc) in enumerate(features):
        x = MARGIN_X + i * (tile_w + gap)
        c.setFillColor(INK)
        c.setFont(SANS_BOLD, 9.5)
        c.drawString(x, y, label)
        c.setFillColor(MUTED)
        c.setFont(MONO, 7.6)
        wrap_lines = wrap(desc, tile_w, MONO, 7.6, c)
        yy = y - 4.5 * mm
        for line in wrap_lines[:3]:
            c.drawString(x, yy, line)
            yy -= 3.6 * mm

    y -= 16 * mm
    draw_hairline(c, MARGIN_X, y, CONTENT_W)
    return y - 5 * mm

def draw_statement_and_features(c, statement, description, items, y_top,
                                left_frac=0.44):
    """Section 02-style: left big bold statement + description, right
    numbered features. Returns bottom-y."""
    left_w = CONTENT_W * left_frac
    right_x = MARGIN_X + left_w + 8 * mm
    right_w = CONTENT_W - left_w - 8 * mm

    # LEFT: big statement + supporting paragraph
    c.setFillColor(INK)
    c.setFont(SANS_BOLD, 20)
    lines = wrap(statement.upper(), left_w, SANS_BOLD, 20, c)
    yl = y_top
    for line in lines:
        c.drawString(MARGIN_X, yl, line)
        yl -= 24
    yl -= 4 * mm
    yl = draw_wrapped(c, description, MARGIN_X, yl, left_w,
                      SANS, 9.6, MUTED, leading=13)

    # RIGHT: numbered items with dashed separators
    yr = y_top
    for idx, (title, body) in enumerate(items, start=1):
        c.setFillColor(CYAN_INK)
        c.setFont(MONO_BOLD, 8)
        c.drawString(right_x, yr, f"{idx:02d}")
        c.setFillColor(INK)
        c.setFont(SANS_BOLD, 10)
        c.drawString(right_x, yr - 4.5 * mm, title.upper())
        y_body = draw_wrapped(c, body, right_x, yr - 8.6 * mm,
                              right_w, SANS, 9, MUTED, leading=12)
        yr = y_body - 4 * mm
        draw_hairline(c, right_x, yr, right_w)
        yr -= 4 * mm

    return min(yl, yr) - 2 * mm

def draw_product_photo(c, img_path, x, y_top, w, h):
    """Draw product photo centered inside a soft tint card."""
    c.setFillColor(TINT)
    c.rect(x, y_top - h, w, h, fill=1, stroke=0)
    if img_path and img_path.exists():
        im = Image.open(img_path).convert("RGBA")
        iw, ih = im.size
        scale = min((w - 12 * mm) / iw, (h - 12 * mm) / ih)
        dw, dh = iw * scale, ih * scale
        dx = x + (w - dw) / 2
        dy = y_top - h + (h - dh) / 2
        c.drawImage(ImageReader(im), dx, dy, dw, dh, mask="auto")
    return y_top - h

def draw_chip_cloud(c, items, x, y_top, w, chip_h=8 * mm, gap=3 * mm,
                    highlight_first=True):
    """Applications rendered as outlined pill/rectangle chips."""
    cur_x = x
    y = y_top
    c.setFont(SANS, 9)
    for i, txt in enumerate(items):
        tw = c.stringWidth(txt, SANS, 9)
        cw = tw + 8 * mm
        if cur_x + cw > x + w:
            cur_x = x
            y -= chip_h + gap
        highlight = (i == 0 and highlight_first)
        if highlight:
            c.setStrokeColor(CYAN)
            c.setFillColor(WHITE)
            c.setLineWidth(1.2)
            c.rect(cur_x, y - chip_h, cw, chip_h, fill=1, stroke=1)
            c.setFillColor(CYAN_INK)
            c.setFont(MONO, 9)
            c.drawString(cur_x + 4 * mm, y - chip_h + 2.6 * mm, txt)
        else:
            c.setStrokeColor(HAIRLINE)
            c.setFillColor(WHITE)
            c.setLineWidth(0.7)
            c.rect(cur_x, y - chip_h, cw, chip_h, fill=1, stroke=1)
            c.setFillColor(INK)
            c.setFont(SANS, 9)
            c.drawString(cur_x + 4 * mm, y - chip_h + 2.6 * mm, txt)
        cur_x += cw + gap
    return y - chip_h - 2 * mm

def draw_big_footer_callout(c, robot):
    """Cyan-tinted panel at the bottom of the last page with model name +
    brand + tagline."""
    panel_h = 62 * mm
    y_top = MARGIN_Y_BOT + 8 * mm + panel_h
    c.setFillColor(CYAN)
    c.rect(0, MARGIN_Y_BOT + 8 * mm, PAGE_W, panel_h, fill=1, stroke=0)

    c.setFillColor(INK)
    c.setFont(SANS_BOLD, 26)
    c.drawString(MARGIN_X, y_top - 14 * mm, robot["model"])

    c.setFont(MONO, 8)
    c.setFillColor(INK)
    c.drawString(MARGIN_X, y_top - 22 * mm, "Texsonics Systems India Private Limited")
    c.drawString(MARGIN_X, y_top - 26 * mm,
                 "1/6-1, Keerakaran Thottam, Keeranatham, Coimbatore 641035 · Ph: +91 94426 24304")

    # tagline / category line
    c.setFont(MONO_BOLD, 8)
    c.setFillColor(INK)
    cat = robot["series"].upper()
    axes = robot["axes"].upper()
    c.drawString(MARGIN_X, y_top - 36 * mm, cat)
    c.setFont(MONO, 8)
    c.drawString(MARGIN_X, y_top - 40 * mm,
                 f"{axes} · PAYLOAD {robot['payload']} · REACH {robot['reach']}")

    c.setFont(MONO, 7.5)
    c.drawRightString(PAGE_W - MARGIN_X, y_top - 40 * mm,
                      "dharmar@texsonics.net  ·  www.texsonics.net")

# --- Content generators (robot-specific) ---------------------------------
def build_feature_strip(robot):
    """Four bold-label / mono-desc pairs summarizing the robot."""
    is_amr = robot["series"].startswith("AMR")
    if is_amr:
        return [
            (robot["axes"], f"Payload {robot['payload']}"),
            ("LiDAR SLAM", "Natural navigation, no tape / reflectors"),
            ("Fleet Manager", "ERP / MES integration, opportunity charging"),
            ("Safety Rated", "Dual safety LiDAR + bumpers"),
        ]
    return [
        (robot["axes"], f"Payload {robot['payload']} · Reach {robot['reach']}"),
        ("Repeatability", f"{robot['repeatability']} positional accuracy"),
        ("Texsonics RC", "In-house controller, drives and teach pendant"),
        ("Site-ready", "Floor / Wall / Ceiling mount, factory calibrated"),
    ]

def build_statement(robot):
    """Big display statement + descriptive support paragraph + numbered items."""
    is_amr = robot["series"].startswith("AMR")
    if is_amr:
        return (
            f"Intralogistics that drives itself — no tape, no tracks, no operator.",
            (f"The {robot['model']} moves material across your plant "
             f"autonomously using LiDAR-based natural navigation. Jobs are "
             f"dispatched from the Texsonics fleet manager and integrated "
             f"with your ERP or MES."),
            [
                ("NATURAL NAVIGATION",
                 "LiDAR SLAM maps your facility as-is. No floor markers, "
                 "no reflectors, no infrastructure to install."),
                ("FLEET DISPATCH",
                 "Central fleet manager routes jobs to the nearest available "
                 "unit and hands off work between shifts, cells and lines."),
                ("SAFETY BY DESIGN",
                 "Dual safety-rated LiDAR plus bumpers keep the AMR safe "
                 "around operators, forklifts and mixed traffic."),
            ],
        )
    axes = robot["axes"]
    is_scara = "SCARA" in axes.upper()
    is_cobot = "Collaborative" in robot["name"] or "cobot" in robot["name"].lower() or robot["series"].startswith("TSCR")
    if is_cobot:
        return (
            "Works with people, not behind fences.",
            (f"The {robot['model']} is a collaborative robot with "
             f"force-limited harmonic-drive joints, hand-guided teaching "
             f"and safety-rated monitored stop. Deployable on existing "
             f"benches in days, not months."),
            [
                ("HAND-GUIDED TEACHING",
                 "Move the arm through the motion and record waypoints — no "
                 "programming language required."),
                ("FORCE-LIMITED JOINTS",
                 "Every joint monitors torque and halts on unexpected "
                 "contact, per the design intent of ISO/TS 15066."),
                ("SMALL FOOTPRINT",
                 f"A {robot['reach']} reach in a 138 × 138 mm base fits "
                 "beside operators on existing lines."),
            ],
        )
    if is_scara:
        return (
            "High-throughput planar motion, 0.44 s cycle.",
            (f"The {robot['model']} is a 4-axis SCARA built for repetitive "
             f"planar work — assembly, part loading, sorting, inspection "
             f"and dispensing. Integrated pneumatic and signal harness "
             f"keeps end-effector tooling clean and repeatable."),
            [
                ("FAST CYCLE",
                 "0.44 s standard cycle, 8700 mm/s XY speed and 2000°/s "
                 "tool rotation for the shortest possible takt times."),
                ("HARNESS-THROUGH ARM",
                 "15-pin D-Sub signal and dual 6 mm pneumatic lines routed "
                 "through the arm keep tooling wiring clean."),
                ("PLANAR ACCURACY",
                 "±0.02 mm XY, ±0.01 mm Z, ±0.01° tool — precision suited "
                 "to assembly and inspection cells."),
            ],
        )
    # Default: industrial 6-axis
    primary_app = robot["applications"][0] if robot.get("applications") else "production"
    return (
        "Engineered for the factory floor.",
        (f"The {robot['model']} is a {robot['axes'].lower()} industrial "
         f"robot built for {primary_app} and related production work. "
         f"Factory-calibrated, floor or ceiling mount, and pre-integrated "
         f"with the Texsonics RC series controller and teach pendant."),
        [
            ("HIGH-CYCLE MOTION",
             f"Repeatability {robot['repeatability']} across a {robot['reach']} "
             f"envelope — dependable for line-rate production."),
            ("INTEGRATED STACK",
             "Ships with the Texsonics RC controller, safety I/O, teach "
             "pendant and offline programming environment — no third-party "
             "integration needed."),
            ("LOCAL SUPPORT",
             "Engineered and assembled in Coimbatore. Field service and "
             "spares within India — no import lead times."),
        ],
    )

# --- Page builders -------------------------------------------------------
def build_page1(c, robot, rev_label):
    draw_backdrop(c)
    top_y = draw_page_header(c, robot, rev_label)

    y = draw_top_hero(c, robot, top_y)
    features = build_feature_strip(robot)
    y = draw_feature_strip(c, features, y)

    y = draw_section_head(c, 1, "Specifications", MARGIN_X, y - 4 * mm)
    y -= 2 * mm

    # Split specs into physical vs environment/mounting halves
    specs = robot.get("specs", [])
    # naive split: half/half
    half = (len(specs) + 1) // 2
    left = specs[:half]
    right = specs[half:]
    left_rows  = [(r["label"], r["value"]) for r in left]
    right_rows = [(r["label"], r["value"]) for r in right]

    col_w = (CONTENT_W - 12 * mm) / 2
    y_l = draw_spec_column(c, "Mechanical", left_rows, MARGIN_X, y, col_w)
    if right_rows:
        y_r = draw_spec_column(c, "Environment / Control",
                               right_rows, MARGIN_X + col_w + 12 * mm, y, col_w)

    draw_page_footer(c, robot, 1, 4)

def build_page2(c, robot, rev_label):
    draw_backdrop(c)
    top_y = draw_page_header(c, robot, rev_label)

    y = draw_section_head(c, 2, "Overview", MARGIN_X, top_y - 6 * mm)
    statement, desc, items = build_statement(robot)
    y = draw_statement_and_features(c, statement, desc, items, y - 4 * mm)

    y -= 6 * mm
    y = draw_section_head(c, 3, "Product", MARGIN_X, y - 4 * mm)
    y -= 4 * mm

    # Product photo — big card
    img = IMAGE_BY_ID.get(robot["id"])
    photo_h = min(y - MARGIN_Y_BOT - 20 * mm, 105 * mm)
    photo_h = max(photo_h, 80 * mm)
    photo_w = CONTENT_W
    photo_top = y
    draw_product_photo(c, img, MARGIN_X, photo_top, photo_w, photo_h)

    # caption underneath
    c.setFillColor(MUTED)
    c.setFont(MONO, 7.6)
    c.drawString(MARGIN_X, photo_top - photo_h - 4 * mm,
                 f"{robot['model'].upper()} · {robot['series'].upper()}")

    draw_page_footer(c, robot, 2, 4)

def build_page3(c, robot, rev_label):
    draw_backdrop(c)
    top_y = draw_page_header(c, robot, rev_label)

    y = draw_section_head(c, 4, "Working Range", MARGIN_X, top_y - 6 * mm)
    y -= 2 * mm

    wr = robot.get("workingRange", [])
    if wr:
        half = (len(wr) + 1) // 2
        col_w = (CONTENT_W - 12 * mm) / 2
        y_l = draw_spec_column(c, "Motion — Group A",
                               [(r["label"], r["value"]) for r in wr[:half]],
                               MARGIN_X, y, col_w)
        if wr[half:]:
            y_r = draw_spec_column(c, "Motion — Group B",
                                   [(r["label"], r["value"]) for r in wr[half:]],
                                   MARGIN_X + col_w + 12 * mm, y, col_w)
        y = min(y_l, y_r) if wr[half:] else y_l

    y -= 8 * mm
    y = draw_section_head(c, 5, "Control & Integration", MARGIN_X, y - 4 * mm)
    y -= 4 * mm

    # 4-column integration grid
    integ = [
        ("CONTROLLER",
         "Texsonics RC series",
         "in-house motion controller, dual-kernel real-time OS"),
        ("TEACH PENDANT",
         "11.5″ touch tablet",
         "drag-teaching, Wi-Fi, on-device offline programming"),
        ("FIELDBUS",
         "EtherCAT / Modbus TCP",
         "industrial fieldbus, dual-protocol support"),
        ("SOFTWARE",
         "TEXCAM offline CAM",
         "toolpath generation, digital twin simulation, vision"),
    ]
    col_w = (CONTENT_W - 3 * 6 * mm) / 4
    for i, (label, headline, body) in enumerate(integ):
        x = MARGIN_X + i * (col_w + 6 * mm)
        c.setFillColor(CYAN_INK)
        c.setFont(MONO_BOLD, 7.5)
        c.drawString(x, y, label)
        c.setFillColor(INK)
        c.setFont(SANS_BOLD, 10.5)
        # wrap headline
        hl_lines = wrap(headline, col_w, SANS_BOLD, 10.5, c)
        yy = y - 5 * mm
        for line in hl_lines:
            c.drawString(x, yy, line)
            yy -= 12
        c.setFillColor(MUTED)
        c.setFont(SANS, 8.6)
        body_lines = wrap(body, col_w, SANS, 8.6, c)
        for line in body_lines:
            c.drawString(x, yy, line)
            yy -= 11
        # dashed vertical divider
        if i < 3:
            c.setStrokeColor(HAIRLINE)
            c.setLineWidth(0.5)
            c.setDash(2, 3)
            c.line(x + col_w + 3 * mm, y + 2 * mm,
                   x + col_w + 3 * mm, y - 32 * mm)
            c.setDash()

    draw_page_footer(c, robot, 3, 4)

def build_page4(c, robot, rev_label):
    draw_backdrop(c)
    top_y = draw_page_header(c, robot, rev_label)

    y = draw_section_head(c, 6, "Applications", MARGIN_X, top_y - 6 * mm)
    y -= 2 * mm

    # 1-line intro
    is_amr = robot["series"].startswith("AMR")
    intro = (
        "Autonomous material movement across production, warehousing and "
        "finished-goods flows — dispatched from the Texsonics fleet manager."
        if is_amr else
        f"Deployable across the primary applications the {robot['model']} was "
        "engineered for — full production-line integration with the Texsonics "
        "control stack."
    )
    y = draw_wrapped(c, intro, MARGIN_X, y - 2 * mm,
                     CONTENT_W - 20 * mm, SANS, 10, MUTED, leading=13)
    y -= 4 * mm

    apps = robot.get("applications", []) + [
        "Machine Tending", "CNC Loading", "Palletizing", "Assembly",
        "Packaging", "Vision Inspection",
    ]
    # dedupe preserving order
    seen = set(); dedup = []
    for a in apps:
        if a not in seen:
            seen.add(a); dedup.append(a)

    y = draw_chip_cloud(c, dedup[:12], MARGIN_X, y, CONTENT_W)

    y -= 6 * mm
    y = draw_section_head(c, 7, "Built for the Operator", MARGIN_X, y - 4 * mm)
    y -= 4 * mm

    ops = [
        "Live 3D position display",
        "Online command execution",
        "Position editor",
        "Variable monitor",
        "I/O monitor",
        "Error diagnostics",
        "Dynamic teach-in",
        "Digital twin simulation",
    ]
    # 2-column bulleted list
    col_w = (CONTENT_W - 12 * mm) / 2
    rows_per_col = (len(ops) + 1) // 2
    for i, item in enumerate(ops):
        col = 0 if i < rows_per_col else 1
        row = i if col == 0 else i - rows_per_col
        x = MARGIN_X + col * (col_w + 12 * mm)
        yy = y - row * 8 * mm
        c.setFillColor(CYAN)
        c.rect(x, yy - 0.5 * mm, 2.6 * mm, 2.6 * mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont(SANS, 9.6)
        c.drawString(x + 5 * mm, yy, item)
        if i < len(ops) - 1 and row < rows_per_col - 1:
            draw_hairline(c, x, yy - 4 * mm, col_w)

    # Disclaimer strip above footer callout
    y_disc = MARGIN_Y_BOT + 8 * mm + 62 * mm + 8 * mm
    c.setFillColor(MUTED)
    c.setFont(MONO, 6.8)
    disc = ("SPECIFICATIONS AND VISUALS MAY CHANGE WITHOUT NOTICE AS PART OF "
            "ONGOING PRODUCT IMPROVEMENTS. IMAGES ARE FOR REFERENCE ONLY. "
            "UNAUTHORIZED REPRODUCTION OF THIS CATALOGUE IS PROHIBITED WITHOUT "
            "WRITTEN PERMISSION FROM TEXSONICS SYSTEMS INDIA PRIVATE LIMITED.")
    disc_lines = wrap(disc, CONTENT_W, MONO, 6.8, c)
    yy = y_disc
    for line in disc_lines:
        c.drawString(MARGIN_X, yy, line)
        yy -= 9

    draw_big_footer_callout(c, robot)
    # No page-num footer on last page — the callout is the footer

# --- Main ----------------------------------------------------------------
def generate(robot):
    out = OUT_DIR / f"{robot['model']}.pdf"
    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle(f"{robot['model']} — Texsonics Product Catalogue")
    c.setAuthor("Texsonics Systems India Private Limited")
    c.setSubject(robot["name"])

    rev_label = f"DATASHEET · REV. {date.today().strftime('%Y-%m')}"

    build_page1(c, robot, rev_label); c.showPage()
    build_page2(c, robot, rev_label); c.showPage()
    build_page3(c, robot, rev_label); c.showPage()
    build_page4(c, robot, rev_label); c.showPage()

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
