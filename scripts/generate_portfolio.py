"""
Generate the Texsonics company portfolio PDF at C:/Texsonics/texsonics-portfolio.pdf

Reuses the design vocabulary of the robot catalogues:
  - White page background
  - Mono meta header line + hairline
  - Cyan chip section markers (01, 02, ...) with UPPERCASE titles
  - Two-column mono-label tables and dashed row separators
  - Chip-cloud lists (applications, industries)
  - Cyan back-cover callout

Content is a real company profile: cover / at-a-glance / who we are /
the stack / robot lineup / industries / capabilities / contact.
"""

from __future__ import annotations

from pathlib import Path
from datetime import date

# Import shared drawing primitives from the catalogue generator.
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_catalogues import (  # noqa: E402
    # geometry & tokens
    A4, PAGE_W, PAGE_H, MARGIN_X, MARGIN_Y_TOP, MARGIN_Y_BOT, CONTENT_W,
    mm, HexColor, ImageReader, Image,
    # colors
    WHITE, INK, INK_SOFT, MUTED, MUTED_SOFT, HAIRLINE, HAIRLINE_SOFT,
    CYAN, CYAN_INK, TINT, CALLOUT_H,
    # fonts
    SANS, SANS_BOLD, MONO, MONO_BOLD,
    # helpers
    wrap, draw_wrapped, draw_backdrop, draw_hairline, draw_dashed_hairline,
    draw_spec_column, draw_chip_cloud, draw_section_head,
    IMAGE_BY_ID, ASSETS,
    # canvas
    canvas,
)

ROOT = Path(__file__).resolve().parent.parent
LOGO_PATH = ROOT / "src" / "assets" / "texsonics-logo.png"
FACTORY_IMG = ASSETS / "workshop-air6.jpg"
OUT_PATH = Path("C:/Texsonics/texsonics-portfolio.pdf")


# ---------- page chrome specific to portfolio ------------------------------
REV_LABEL = f"PORTFOLIO · REV. {date.today().strftime('%Y-%m')}"


def draw_page_header(c):
    """Same layout as the catalogue header: bold TEXSONICS + · INDUSTRIAL
    ROBOTICS mono, right-side rev label, hairline underneath."""
    y = PAGE_H - MARGIN_Y_TOP
    c.setFillColor(INK)
    c.setFont(MONO_BOLD, 8)
    c.drawString(MARGIN_X, y, "TEXSONICS")
    c.setFont(MONO, 8)
    c.setFillColor(MUTED)
    lw = c.stringWidth("TEXSONICS", MONO_BOLD, 8)
    c.drawString(MARGIN_X + lw, y, " · COMPANY PORTFOLIO")
    c.drawRightString(PAGE_W - MARGIN_X, y, REV_LABEL)
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, y - 3 * mm, PAGE_W - MARGIN_X, y - 3 * mm)
    return y - 8 * mm  # content-top y


def draw_page_footer(c, page, total):
    y = MARGIN_Y_BOT
    c.setStrokeColor(HAIRLINE)
    c.setLineWidth(0.5)
    c.line(MARGIN_X, y + 6 * mm, PAGE_W - MARGIN_X, y + 6 * mm)
    c.setFillColor(MUTED_SOFT)
    c.setFont(MONO, 7)
    c.drawString(MARGIN_X, y, "TEXSONICS SYSTEMS INDIA")
    c.drawRightString(PAGE_W - MARGIN_X, y,
                      f"PAGE {page:02d} / {total:02d}")


class Flow:
    FOOTER_RESERVE = MARGIN_Y_BOT + 10 * mm

    def __init__(self, c, total_pages):
        self.c = c
        self.page = 1
        self.total = total_pages
        self.y = 0
        self._start_page()

    def _start_page(self):
        draw_backdrop(self.c)
        self.y = draw_page_header(self.c)

    def new_page(self):
        draw_page_footer(self.c, self.page, self.total)
        self.c.showPage()
        self.page += 1
        self._start_page()

    def ensure(self, needed_h):
        if self.y - needed_h < self.FOOTER_RESERVE:
            self.new_page()

    def close(self, with_footer=True):
        if with_footer:
            draw_page_footer(self.c, self.page, self.total)


# ---------- section drawers ------------------------------------------------
def sec_cover(flow):
    """Cover-style hero: series chip, kicker, big display, tagline paragraph,
    then the feature strip."""
    y = flow.y

    # Chip
    label = "COMPANY PORTFOLIO"
    flow.c.setFont(MONO_BOLD, 7.5)
    sw = flow.c.stringWidth(label, MONO_BOLD, 7.5)
    chip_h = 5.5 * mm
    chip_w = sw + 6 * mm
    flow.c.setFillColor(CYAN)
    flow.c.rect(MARGIN_X, y - chip_h, chip_w, chip_h, fill=1, stroke=0)
    flow.c.setFillColor(INK)
    flow.c.drawString(MARGIN_X + 3 * mm, y - chip_h + 1.9 * mm, label)
    y -= chip_h + 6 * mm

    # Mono kicker
    flow.c.setFillColor(MUTED)
    flow.c.setFont(MONO, 8)
    flow.c.drawString(MARGIN_X, y, "TEXSONICS SYSTEMS INDIA PRIVATE LIMITED")
    y -= 14 * mm

    # Big display statement
    flow.c.setFillColor(INK_SOFT)
    flow.c.setFont(SANS_BOLD, 30)
    for line in ("Industrial Robots.", "Made in India."):
        flow.c.drawString(MARGIN_X, y, line)
        y -= 34
    y -= 4 * mm

    # Description
    desc = ("Texsonics designs, manufactures and supports industrial robot "
            "arms, collaborative robots, autonomous mobile robots, and the "
            "controller and CAM software that drive them — entirely from "
            "our Coimbatore facility. 25+ years of precision engineering, "
            "one integrated stack.")
    y = draw_wrapped(flow.c, desc, MARGIN_X, y, CONTENT_W - 20 * mm,
                     SANS, 10.5, MUTED, leading=14)
    y -= 6 * mm

    # Feature strip (4 pillars)
    features = [
        ("Founded 2004", "Coimbatore, Tamil Nadu · 25+ years engineering"),
        ("Whole Stack", "Arm · controller · drives · pendant · CAM"),
        ("100+ Team", "Mechanical, electrical, firmware, software"),
        ("150+ Customers", "Automotive, foundries, machine builders, OEMs"),
    ]
    n = len(features)
    gap = 6 * mm
    tile_w = (CONTENT_W - gap * (n - 1)) / n
    draw_hairline(flow.c, MARGIN_X, y, CONTENT_W)
    y -= 5 * mm
    for i, (label, desc) in enumerate(features):
        x = MARGIN_X + i * (tile_w + gap)
        flow.c.setFillColor(INK)
        flow.c.setFont(SANS_BOLD, 9.5)
        flow.c.drawString(x, y, label)
        flow.c.setFillColor(MUTED)
        flow.c.setFont(MONO, 7.6)
        yy = y - 4.5 * mm
        for line in wrap(desc, tile_w, MONO, 7.6, flow.c):
            flow.c.drawString(x, yy, line)
            yy -= 3.6 * mm
    y -= 16 * mm
    draw_hairline(flow.c, MARGIN_X, y, CONTENT_W)
    flow.y = y - 6 * mm


def sec_at_a_glance(flow):
    flow.ensure(65 * mm)
    flow.y = draw_section_head(flow.c, 1, "At a Glance", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 2 * mm

    left_rows = [
        ("LEGAL NAME", "Texsonics Systems India Private Limited"),
        ("FOUNDED", "2004"),
        ("HEAD OFFICE", "Coimbatore, Tamil Nadu, India"),
        ("FACILITY", "25,000 sq.ft manufacturing works"),
        ("TEAM", "100+ engineers and technicians"),
    ]
    right_rows = [
        ("SECTORS", "Industrial robotics, factory automation"),
        ("CUSTOMERS", "150+ across India and export markets"),
        ("EXPORTS", "UAE · Singapore · Malaysia · South Africa"),
        ("CERTIFICATIONS", "ISO-aligned engineering & QA processes"),
        ("BUSINESS TYPE", "OEM · turnkey integrator · service"),
    ]
    col_w = (CONTENT_W - 12 * mm) / 2
    y_l = draw_spec_column(flow.c, "Company", left_rows,
                           MARGIN_X, flow.y, col_w)
    y_r = draw_spec_column(flow.c, "Market", right_rows,
                           MARGIN_X + col_w + 12 * mm, flow.y, col_w)
    flow.y = min(y_l, y_r) - 8 * mm


def sec_who_we_are(flow):
    """Statement + numbered pillars."""
    flow.ensure(95 * mm)
    flow.y = draw_section_head(flow.c, 2, "Who We Are", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 4 * mm

    y_top = flow.y
    left_w = CONTENT_W * 0.44
    right_x = MARGIN_X + left_w + 8 * mm
    right_w = CONTENT_W - left_w - 8 * mm

    # Left — big statement + paragraph
    statement = "25 Years of engineering. Now building robots."
    flow.c.setFillColor(INK)
    flow.c.setFont(SANS_BOLD, 20)
    yl = y_top
    for line in wrap(statement.upper(), left_w, SANS_BOLD, 20, flow.c):
        flow.c.drawString(MARGIN_X, yl, line); yl -= 24
    yl -= 4 * mm
    para = (
        "Founded in 2004 in Coimbatore, Texsonics spent two decades "
        "mastering precision manufacturing for automation, machine "
        "building and OEM customers. That discipline — tight tolerances, "
        "fast turnarounds, everything under one roof — is exactly what "
        "building robots demands. Today robotics is our focus, and every "
        "arm, controller, pendant, and software layer is designed and "
        "supported by our own engineers."
    )
    yl = draw_wrapped(flow.c, para, MARGIN_X, yl, left_w,
                      SANS, 9.6, MUTED, leading=13)

    # Right — numbered pillars
    items = [
        ("ENGINEERING FIRST",
         "Every machine we ship is designed, built and tested by our own "
         "engineers — no rebadged imports, no black boxes."),
        ("CUSTOMER PARTNERSHIP",
         "We automate your process, not just sell you hardware. Cell "
         "scoping, integration, operator training — one team, one throat "
         "to choke."),
        ("PRECISION HERITAGE",
         "25+ years of tight-tolerance manufacturing discipline now applied "
         "to robot arms, drives, and motion controllers."),
    ]
    yr = y_top
    for idx, (title, body) in enumerate(items, start=1):
        flow.c.setFillColor(CYAN_INK)
        flow.c.setFont(MONO_BOLD, 8)
        flow.c.drawString(right_x, yr, f"{idx:02d}")
        flow.c.setFillColor(INK)
        flow.c.setFont(SANS_BOLD, 10)
        flow.c.drawString(right_x, yr - 4.5 * mm, title)
        y_body = draw_wrapped(flow.c, body, right_x, yr - 8.6 * mm,
                              right_w, SANS, 9, MUTED, leading=12)
        yr = y_body - 4 * mm
        draw_hairline(flow.c, right_x, yr, right_w)
        yr -= 4 * mm

    flow.y = min(yl, yr) - 2 * mm


def sec_workshop_hero(flow):
    """Big factory photo hero — like the catalogue's product-photo card."""
    HEAD = 8 * mm
    CAPTION = 6 * mm
    MIN_H = 70 * mm
    MAX_H = 110 * mm
    reserve = HEAD + CAPTION + 4 * mm
    avail = flow.y - flow.FOOTER_RESERVE - reserve
    if avail < MIN_H:
        flow.new_page()
        avail = flow.y - flow.FOOTER_RESERVE - reserve
    target_h = min(avail, MAX_H)

    flow.y = draw_section_head(flow.c, 3, "Coimbatore Works", MARGIN_X,
                               flow.y - 2 * mm)
    flow.y -= 4 * mm
    photo_top = flow.y
    _draw_photo(flow.c, FACTORY_IMG, MARGIN_X, photo_top, CONTENT_W, target_h)
    flow.c.setFillColor(MUTED)
    flow.c.setFont(MONO, 7.6)
    flow.c.drawString(MARGIN_X, photo_top - target_h - 4 * mm,
                      "25,000 SQ.FT MANUFACTURING FACILITY · KEERANATHAM, COIMBATORE")
    flow.y = photo_top - target_h - 10 * mm


def _draw_photo(c, path, x, y_top, w, h):
    c.setFillColor(TINT)
    c.rect(x, y_top - h, w, h, fill=1, stroke=0)
    if path.exists():
        im = Image.open(path).convert("RGBA")
        iw, ih = im.size
        scale = min(w / iw, h / ih)
        dw, dh = iw * scale, ih * scale
        dx = x + (w - dw) / 2
        dy = y_top - h + (h - dh) / 2
        c.drawImage(ImageReader(im), dx, dy, dw, dh, mask="auto")


def sec_the_stack(flow):
    """4-column integration strip — same widget as the catalogue's
    Control & Integration section, but framed as the company stack."""
    flow.ensure(52 * mm)
    flow.y = draw_section_head(flow.c, 4, "The Stack", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 4 * mm
    stack = [
        ("MECHANICAL", "Robot arms & AMRs",
         "in-house design, cast bodies, harmonic-drive joints"),
        ("ELECTRICAL", "Controller & drives",
         "RC series real-time controller, servo drives, safety I/O"),
        ("SOFTWARE", "TEXCAM & pendant",
         "offline CAM, digital twin sim, 11.5″ teach pendant"),
        ("SUPPORT", "Local service",
         "cell design, integration, spares, pan-India field service"),
    ]
    col_w = (CONTENT_W - 3 * 6 * mm) / 4
    y_top = flow.y
    block_h = 34 * mm
    for i, (label, headline, body) in enumerate(stack):
        x = MARGIN_X + i * (col_w + 6 * mm)
        flow.c.setFillColor(CYAN_INK)
        flow.c.setFont(MONO_BOLD, 7.5)
        flow.c.drawString(x, y_top, label)
        flow.c.setFillColor(INK)
        flow.c.setFont(SANS_BOLD, 10.5)
        hl_lines = wrap(headline, col_w, SANS_BOLD, 10.5, flow.c)
        yy = y_top - 5 * mm
        for line in hl_lines:
            flow.c.drawString(x, yy, line); yy -= 12
        flow.c.setFillColor(MUTED)
        flow.c.setFont(SANS, 8.6)
        for line in wrap(body, col_w, SANS, 8.6, flow.c):
            flow.c.drawString(x, yy, line); yy -= 11
        if i < 3:
            flow.c.setStrokeColor(HAIRLINE)
            flow.c.setLineWidth(0.5)
            flow.c.setDash(2, 3)
            flow.c.line(x + col_w + 3 * mm, y_top + 2 * mm,
                        x + col_w + 3 * mm, y_top - block_h + 4 * mm)
            flow.c.setDash()
    flow.y = y_top - block_h - 4 * mm


def sec_robot_lineup(flow):
    """A 2×4 grid showing each robot in the lineup with model + one-line
    positioning + payload/reach mono-labels."""
    lineup = [
        ("TS4-560",   "TS SERIES",   "Compact 6-axis for 3C assembly.",
         "6-AXIS · 4 kg · 560 mm"),
        ("TS6-0808",  "TS SERIES",   "Compact 6-axis for machine tending.",
         "6-AXIS · 8 kg · 827 mm"),
        ("TS6-1215",  "TS SERIES",   "General purpose 6-axis with 1.46 m reach.",
         "6-AXIS · 12 kg · 1463 mm"),
        ("TS6-2518",  "TS SERIES",   "Heavy-payload 6-axis for palletizing.",
         "6-AXIS · 25 kg · 1808 mm"),
        ("TSA700-6N", "TSA SERIES",  "4-axis SCARA for planar high-cycle work.",
         "4-AXIS SCARA · 6 kg · 700 mm"),
        ("TSCR-05E",  "TSCR SERIES", "Collaborative robot for fence-free cells.",
         "6-AXIS COBOT · 5 kg · 800 mm"),
        ("AMR-300",   "AMR SERIES",  "AGV/AMR for intralogistics.",
         "AUTONOMOUS · 300 kg PAYLOAD"),
    ]
    flow.ensure(55 * mm)
    flow.y = draw_section_head(flow.c, 5, "Robot Lineup", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 4 * mm
    intro = ("Seven robot platforms in production — 4- and 6-axis industrial "
             "arms, a SCARA, a collaborative robot, and an AMR — each with a "
             "detailed individual catalogue.")
    flow.y = draw_wrapped(flow.c, intro, MARGIN_X, flow.y - 2 * mm,
                          CONTENT_W - 20 * mm, SANS, 10, MUTED, leading=13)
    flow.y -= 4 * mm

    cols = 2
    gap_x = 6 * mm
    tile_w = (CONTENT_W - gap_x * (cols - 1)) / cols
    tile_h = 26 * mm
    row_gap = 4 * mm

    for i, (model, series, tag, meta) in enumerate(lineup):
        col = i % cols
        row = i // cols
        needed = tile_h + row_gap
        # if the NEXT row would overflow, page-break early
        if col == 0 and flow.y - tile_h < flow.FOOTER_RESERVE:
            flow.new_page()
        x = MARGIN_X + col * (tile_w + gap_x)
        y_top = flow.y

        # tile bg
        flow.c.setFillColor(TINT)
        flow.c.rect(x, y_top - tile_h, tile_w, tile_h, fill=1, stroke=0)
        # cyan accent
        flow.c.setFillColor(CYAN)
        flow.c.rect(x, y_top - 2, tile_w, 2, fill=1, stroke=0)

        # mono series
        flow.c.setFillColor(CYAN_INK)
        flow.c.setFont(MONO_BOLD, 7.5)
        flow.c.drawString(x + 5 * mm, y_top - 6 * mm, series)
        # model
        flow.c.setFillColor(INK)
        flow.c.setFont(SANS_BOLD, 15)
        flow.c.drawString(x + 5 * mm, y_top - 12 * mm, model)
        # tag
        flow.c.setFillColor(MUTED)
        flow.c.setFont(SANS, 9)
        for line in wrap(tag, tile_w - 10 * mm, SANS, 9, flow.c)[:2]:
            flow.c.drawString(x + 5 * mm, y_top - 17 * mm, line)
            break  # single line to keep tiles compact
        # meta line
        flow.c.setFillColor(INK)
        flow.c.setFont(MONO, 7.8)
        flow.c.drawString(x + 5 * mm, y_top - 22 * mm, meta)

        # move flow.y after every second tile
        if col == cols - 1:
            flow.y = y_top - tile_h - row_gap
    # if odd count ends on col=0 without advancing, still advance
    if len(lineup) % cols != 0:
        flow.y -= tile_h + row_gap


def sec_industries(flow):
    industries = [
        "Automotive", "Foundries", "Sheet Metal", "CNC Workshops",
        "Textiles", "Plastic Molding", "Electronics", "Pharmaceutical",
        "Engineering Components", "Machine Builders", "Stamping", "OEMs",
    ]
    flow.ensure(40 * mm)
    flow.y = draw_section_head(flow.c, 6, "Industries Served", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 2 * mm
    intro = ("From automotive line automation to foundry press-tending, we "
             "engineer cells that hold up on real factory floors — not lab "
             "demos.")
    flow.y = draw_wrapped(flow.c, intro, MARGIN_X, flow.y - 2 * mm,
                          CONTENT_W - 20 * mm, SANS, 10, MUTED, leading=13)
    flow.y -= 4 * mm
    flow.y = draw_chip_cloud(flow.c, industries, MARGIN_X, flow.y, CONTENT_W)
    flow.y -= 4 * mm


def sec_applications(flow):
    apps = [
        "Machine Tending", "CNC Loading / Unloading", "Palletizing",
        "Welding", "Spray Painting", "Assembly", "Packaging",
        "Material Handling", "Vision Inspection", "Pick & Place",
    ]
    flow.ensure(40 * mm)
    flow.y = draw_section_head(flow.c, 7, "Applications", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 2 * mm
    flow.y = draw_chip_cloud(flow.c, apps, MARGIN_X, flow.y, CONTENT_W)
    flow.y -= 4 * mm


def sec_capabilities(flow):
    """Two-column bullet list of what we do."""
    caps = [
        "Turnkey robot cells", "Robot arm manufacture",
        "In-house RC controller", "Servo drives & motors",
        "Teach pendant hardware", "TEXCAM offline programming",
        "Machine vision integration", "End-of-arm tooling",
        "Cell design & simulation", "Operator training",
        "Field service & AMC", "Spares from Coimbatore",
    ]
    flow.ensure(60 * mm)
    flow.y = draw_section_head(flow.c, 8, "Capabilities", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 4 * mm
    col_w = (CONTENT_W - 12 * mm) / 2
    rows_per_col = (len(caps) + 1) // 2
    y_top = flow.y
    for i, item in enumerate(caps):
        col = 0 if i < rows_per_col else 1
        row = i if col == 0 else i - rows_per_col
        x = MARGIN_X + col * (col_w + 12 * mm)
        yy = y_top - row * 8 * mm
        flow.c.setFillColor(CYAN)
        flow.c.rect(x, yy - 0.5 * mm, 2.6 * mm, 2.6 * mm, fill=1, stroke=0)
        flow.c.setFillColor(INK)
        flow.c.setFont(SANS, 9.6)
        flow.c.drawString(x + 5 * mm, yy, item)
        if row < rows_per_col - 1:
            draw_hairline(flow.c, x, yy - 4 * mm, col_w)
    flow.y = y_top - rows_per_col * 8 * mm - 4 * mm


def sec_ready_to_talk(flow):
    """Cyan-tinted CTA panel like the catalogue's Ready to Integrate."""
    panel_h = 55 * mm
    flow.ensure(panel_h + 12 * mm)
    flow.y = draw_section_head(flow.c, 9, "Ready to Talk", MARGIN_X, flow.y - 2 * mm)
    flow.y -= 4 * mm
    y_top = flow.y
    flow.c.setFillColor(HexColor("#E7FAFE"))
    flow.c.rect(MARGIN_X, y_top - panel_h, CONTENT_W, panel_h, fill=1, stroke=0)
    flow.c.setFillColor(CYAN)
    flow.c.rect(MARGIN_X, y_top - panel_h, 3 * mm, panel_h, fill=1, stroke=0)

    stmt = "Talk to an engineer about automating your line."
    flow.c.setFillColor(INK)
    flow.c.setFont(SANS_BOLD, 18)
    stmt_x = MARGIN_X + 10 * mm
    stmt_w = CONTENT_W * 0.55 - 10 * mm
    yy = y_top - 12 * mm
    for line in wrap(stmt, stmt_w, SANS_BOLD, 18, flow.c):
        flow.c.drawString(stmt_x, yy, line); yy -= 21
    flow.c.setFillColor(MUTED)
    flow.c.setFont(SANS, 9.5)
    sub = ("Cell scoping, cycle-time sizing, integration, training, and "
           "AMC support — included on every project.")
    yy -= 2 * mm
    for line in wrap(sub, stmt_w, SANS, 9.5, flow.c):
        flow.c.drawString(stmt_x, yy, line); yy -= 12.5

    # Contact block
    rx = MARGIN_X + CONTENT_W * 0.60
    ry = y_top - 12 * mm
    flow.c.setFillColor(CYAN_INK)
    flow.c.setFont(MONO_BOLD, 7.5)
    flow.c.drawString(rx, ry, "CONTACT"); ry -= 5.5 * mm
    flow.c.setFillColor(INK)
    flow.c.setFont(SANS_BOLD, 11)
    flow.c.drawString(rx, ry, "Dharmar R"); ry -= 5 * mm
    flow.c.setFillColor(INK)
    flow.c.setFont(MONO, 9)
    flow.c.drawString(rx, ry, "Managing Director"); ry -= 5 * mm
    flow.c.drawString(rx, ry, "+91 94426 24304"); ry -= 4 * mm
    flow.c.drawString(rx, ry, "dharmar@texsonics.net"); ry -= 4 * mm
    flow.c.drawString(rx, ry, "www.texsonics.net")

    flow.y = y_top - panel_h - 6 * mm


def sec_disclaimer_and_callout(flow):
    """Reuse the catalogue-style back-cover: disclaimer + big cyan callout
    pinned to page bottom."""
    disc = ("SPECIFICATIONS AND VISUALS MAY CHANGE WITHOUT NOTICE AS PART OF "
            "ONGOING PRODUCT IMPROVEMENTS. UNAUTHORIZED REPRODUCTION OF THIS "
            "PORTFOLIO IS PROHIBITED WITHOUT WRITTEN PERMISSION FROM "
            "TEXSONICS SYSTEMS INDIA PRIVATE LIMITED.")
    flow.c.setFont(MONO, 6.8)
    disc_lines = wrap(disc, CONTENT_W, MONO, 6.8, flow.c)
    line_leading = 9
    disc_block_h = len(disc_lines) * line_leading + 2 * mm

    callout_top_from_bottom = MARGIN_Y_BOT + 4 * mm + CALLOUT_H
    disc_top_needed = callout_top_from_bottom + 4 * mm + disc_block_h
    if flow.y < disc_top_needed + 4 * mm:
        flow.new_page()

    flow.c.setFillColor(MUTED)
    flow.c.setFont(MONO, 6.8)
    yy = callout_top_from_bottom + 4 * mm + disc_block_h - 4
    for line in disc_lines:
        flow.c.drawString(MARGIN_X, yy, line); yy -= line_leading

    # Custom callout (not per-robot — company-wide)
    panel_h = CALLOUT_H
    y_top = callout_top_from_bottom
    flow.c.setFillColor(CYAN)
    flow.c.rect(0, y_top - panel_h, PAGE_W, panel_h, fill=1, stroke=0)

    flow.c.setFillColor(INK)
    flow.c.setFont(SANS_BOLD, 26)
    flow.c.drawString(MARGIN_X, y_top - 12 * mm, "TEXSONICS")

    flow.c.setFont(MONO, 8)
    flow.c.drawString(MARGIN_X, y_top - 20 * mm,
                      "Texsonics Systems India Private Limited")
    flow.c.drawString(MARGIN_X, y_top - 24 * mm,
                      "1/6-1, Keerakaran Thottam, Keeranatham, Coimbatore 641035 · Ph: +91 94426 24304")

    flow.c.setFont(MONO_BOLD, 8)
    flow.c.drawString(MARGIN_X, y_top - 34 * mm, "INDUSTRIAL ROBOTICS")
    flow.c.setFont(MONO, 8)
    flow.c.drawString(MARGIN_X, y_top - 38 * mm,
                      "TS · TSA · TSCR · AMR SERIES · CONTROLLER · CAM · SERVICE")

    flow.c.setFont(MONO, 7.5)
    flow.c.drawRightString(PAGE_W - MARGIN_X, y_top - 38 * mm,
                           "dharmar@texsonics.net  ·  www.texsonics.net")


# ---------- main -----------------------------------------------------------
def _fill(flow):
    sec_cover(flow)
    sec_at_a_glance(flow)
    sec_who_we_are(flow)
    sec_workshop_hero(flow)
    sec_the_stack(flow)
    sec_robot_lineup(flow)
    sec_industries(flow)
    sec_applications(flow)
    sec_capabilities(flow)
    sec_ready_to_talk(flow)
    sec_disclaimer_and_callout(flow)


def main():
    import io
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    # Pass 1 — measure total pages
    dummy = canvas.Canvas(io.BytesIO(), pagesize=A4)
    d_flow = Flow(dummy, total_pages=99)
    _fill(d_flow)
    d_flow.close()
    total = d_flow.page

    # Pass 2 — real output
    c = canvas.Canvas(str(OUT_PATH), pagesize=A4)
    c.setTitle("Texsonics — Company Portfolio")
    c.setAuthor("Texsonics Systems India Private Limited")
    c.setSubject("Company portfolio — Texsonics industrial robotics")

    flow = Flow(c, total_pages=total)
    _fill(flow)
    flow.close()
    c.save()
    print(f"[OK] {OUT_PATH}  ({total} pages)")


if __name__ == "__main__":
    main()
