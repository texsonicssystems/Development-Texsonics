"""
Replace third-party vendor logos on robot product photos with the
Texsonics brand mark.

For each (image, [logo regions]) pair:
  1. Inpaint the old logo out by cloning a clean patch of the same surface
     from nearby (feathered blend so there's no visible seam).
  2. Stamp the Texsonics gradient wordmark (RGBA, transparent bg) into the
     same spot, scaled to fit and rotated to roughly match the surface
     angle.

Run from repo root: python scripts/rebrand_robot_logos.py
"""

from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets" / "robots"
BRAND_LOGO = ROOT / "src" / "assets" / "texsonics-logo.png"


def feathered_ellipse_mask(size, feather=8):
    w, h = size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, w - 1, h - 1), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask


def inpaint_clone(im, bbox, source_dy, pad=10, feather=10):
    """Clone a patch from (bbox shifted vertically by source_dy) over bbox,
    feathered so it blends into the surrounding shaded surface."""
    x0, y0, x1, y1 = bbox
    x0 -= pad; y0 -= pad; x1 += pad; y1 += pad
    w, h = x1 - x0, y1 - y0
    sx0, sy0 = x0, y0 + source_dy
    patch = im.crop((sx0, sy0, sx0 + w, sy0 + h))
    mask = feathered_ellipse_mask((w, h), feather=feather)
    im.paste(patch, (x0, y0), mask)


def stamp_logo(im, brand, center, target_w, rotation=0, opacity=255):
    """Composite the brand logo (RGBA) centered at `center`, scaled to
    target_w wide (aspect-preserved), rotated by `rotation` degrees."""
    scale = target_w / brand.width
    target_h = int(brand.height * scale)
    logo = brand.resize((int(target_w), target_h), Image.LANCZOS)
    if opacity < 255:
        r, g, b, a = logo.split()
        a = a.point(lambda v: int(v * opacity / 255))
        logo = Image.merge("RGBA", (r, g, b, a))
    if rotation:
        logo = logo.rotate(rotation, expand=True, resample=Image.BICUBIC)
    lx, ly = center
    px = int(lx - logo.width / 2)
    py = int(ly - logo.height / 2)
    im.alpha_composite(logo, (px, py))


def process_air4560():
    path = ASSETS / "air4-560-grey.png"
    im = Image.open(path).convert("RGBA")
    brand = Image.open(BRAND_LOGO).convert("RGBA")

    # Logo A — left pose, edge-on/foreshortened sliver near the wrist.
    # Small and barely legible at this angle; inpaint it away and place a
    # small vertically-oriented brand mark to match the surface orientation.
    bboxA = (282, 258, 352, 322)
    inpaint_clone(im, bboxA, source_dy=-(bboxA[3]-bboxA[1])-14, pad=8, feather=9)
    cxA = (bboxA[0] + bboxA[2]) / 2
    cyA = (bboxA[1] + bboxA[3]) / 2
    stamp_logo(im, brand, (cxA, cyA), target_w=58, rotation=90)

    # Logo B — right pose, flat/legible "a2" badge on the wrist face.
    bboxB = (1032, 322, 1165, 372)
    inpaint_clone(im, bboxB, source_dy=-(bboxB[3]-bboxB[1])-16, pad=10, feather=10)
    cxB = (bboxB[0] + bboxB[2]) / 2
    cyB = (bboxB[1] + bboxB[3]) / 2
    stamp_logo(im, brand, (cxB, cyB), target_w=95)

    im.save(path)
    print(f"[OK] {path}")


def process_scara():
    path = ASSETS / "kla700-scara.png"
    im = Image.open(path).convert("RGBA")
    brand = Image.open(BRAND_LOGO).convert("RGBA")

    # Pose 1 — left robot, flat clear "RONSAKI".
    bbox1 = (266, 500, 392, 538)
    inpaint_clone(im, bbox1, source_dy=-(bbox1[3]-bbox1[1])-14, pad=8, feather=9)
    c1 = ((bbox1[0]+bbox1[2])/2, (bbox1[1]+bbox1[3])/2)
    stamp_logo(im, brand, c1, target_w=100)

    # Pose 2 — middle robot, text wraps the curved front-left edge.
    bbox2 = (608, 500, 700, 538)
    inpaint_clone(im, bbox2, source_dy=-(bbox2[3]-bbox2[1])-14, pad=8, feather=9)
    c2 = ((bbox2[0]+bbox2[2])/2, (bbox2[1]+bbox2[3])/2)
    stamp_logo(im, brand, c2, target_w=72)

    # Pose 3 — right robot, tilted slightly with the panel's angle.
    bbox3 = (878, 488, 992, 532)
    inpaint_clone(im, bbox3, source_dy=-(bbox3[3]-bbox3[1])-14, pad=8, feather=9)
    c3 = ((bbox3[0]+bbox3[2])/2, (bbox3[1]+bbox3[3])/2)
    stamp_logo(im, brand, c3, target_w=90, rotation=-7)

    im.save(path)
    print(f"[OK] {path}")


if __name__ == "__main__":
    process_air4560()
    process_scara()
