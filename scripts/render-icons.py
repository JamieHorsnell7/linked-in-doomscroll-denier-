#!/usr/bin/env python3
"""Draw the Scrollhog toolbar icons. Original art, no third-party assets."""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "icons"

INK = (27, 23, 20, 255)
CREAM = (255, 246, 234, 255)
RED = (225, 6, 0, 255)
QUILL = (196, 81, 43, 255)
QUILL_DARK = (138, 61, 34, 255)
BODY = (243, 199, 164, 255)
SNOUT = (231, 165, 122, 255)


def draw(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pen = ImageDraw.Draw(image)
    stroke = max(2, round(size / 16))
    radius = max(3, round(size / 5))
    pen.rounded_rectangle(
        [1, 1, size - 2, size - 2],
        radius=radius,
        fill=CREAM,
        outline=INK,
        width=stroke,
    )

    def at(x: float, y: float) -> tuple[float, float]:
        return (x * size, y * size)

    def spike(cx: float, cy: float, height: float, fill: tuple[int, int, int, int]) -> None:
        x, y = at(cx, cy)
        h = height * size
        w = h * 0.62
        pen.polygon([(x, y - h), (x + w, y + h * 0.15), (x - w, y + h * 0.15)], fill=fill, outline=INK)

    spike(0.34, 0.40, 0.16, QUILL)
    spike(0.50, 0.30, 0.18, QUILL_DARK)
    spike(0.66, 0.40, 0.16, QUILL)

    pen.ellipse([at(0.20, 0.40)[0], at(0.20, 0.40)[1], at(0.80, 0.88)[0], at(0.80, 0.88)[1]], fill=BODY, outline=INK, width=max(1, size // 32))
    pen.ellipse([at(0.55, 0.50)[0], at(0.55, 0.50)[1], at(0.86, 0.74)[0], at(0.86, 0.74)[1]], fill=SNOUT, outline=INK, width=max(1, size // 32))
    pen.ellipse([at(0.74, 0.55)[0], at(0.74, 0.55)[1], at(0.84, 0.66)[0], at(0.84, 0.66)[1]], fill=RED)

    eye = max(2, round(size / 14))
    for ex in (0.40, 0.56):
        x, y = at(ex, 0.56)
        pen.ellipse([x - eye, y - eye, x + eye, y + eye], fill=INK)
        glint = max(1, eye // 3)
        pen.ellipse([x - eye * 0.2, y - eye * 0.35, x - eye * 0.2 + glint, y - eye * 0.35 + glint], fill=CREAM)
    return image


def draw_pixels(rows: list[str], scale: int) -> Image.Image:
    palette = {
        ".": (0, 0, 0, 0),
        "C": CREAM,
        "K": INK,
        "Q": QUILL,
        "D": QUILL_DARK,
        "B": BODY,
        "S": SNOUT,
        "R": RED,
        "W": (255, 246, 234, 255),
    }
    height = len(rows)
    width = len(rows[0])
    image = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 0))
    pen = ImageDraw.Draw(image)
    for y, row in enumerate(rows):
        if len(row) != width:
            raise SystemExit(f"row {y} is {len(row)} wide, expected {width}")
        for x, pixel in enumerate(row):
            color = palette[pixel]
            if color[3] == 0:
                continue
            pen.rectangle([x * scale, y * scale, (x + 1) * scale - 1, (y + 1) * scale - 1], fill=color)
    return image


# 16×16 mark, scaled up so the toolbar icons stay crisp.
MARK = [
    "CCCCCCCCCCCCCCCC",
    "CKKKKKKKKKKKKKKC",
    "CKCCCQCCCCQCCCCK",
    "CKCCQQQCCQQQCCCK",
    "CKCCCQBBBBBQCCCK",
    "CKCCBBBBBBBBBBCK",
    "CKCBBBBBBBBBBBCK",
    "CKCBBKKBBBKKBBCK",
    "CKCBBBBBBBBBBBCK",
    "CKCBBBBBSSSSSCCK",
    "CKCBBBBBSSRRRCCK",
    "CKCCBBBBBSSSCCCK",
    "CKCCCBBBBBBCCCCK",
    "CKCCCCCCCCCCCCCK",
    "CKKKKKKKKKKKKKKC",
    "CCCCCCCCCCCCCCCC",
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    draw_pixels(MARK, 1).save(OUT / "icon16.png")
    draw_pixels(MARK, 2).save(OUT / "icon32.png")
    draw(48).save(OUT / "icon48.png")
    draw(128).save(OUT / "icon128.png")


if __name__ == "__main__":
    main()
