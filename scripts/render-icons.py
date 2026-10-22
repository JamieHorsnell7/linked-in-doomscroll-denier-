#!/usr/bin/env python3
"""Draw the Scroll Saver toolbar icons. Original art, no third-party assets."""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "icons"

NAVY = (28, 35, 64, 255)
SKY = (232, 242, 255, 255)
RED = (225, 6, 0, 255)
SKIN = (255, 216, 191, 255)
SUIT = (59, 130, 246, 255)
WHITE = (255, 255, 255, 255)


def draw(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pen = ImageDraw.Draw(image)
    stroke = max(2, round(size / 16))
    radius = max(4, round(size / 4.5))
    pen.rounded_rectangle(
        [1, 1, size - 2, size - 2],
        radius=radius,
        fill=SKY,
        outline=NAVY,
        width=stroke,
    )

    def box(x0: float, y0: float, x1: float, y1: float) -> list[float]:
        return [x0 * size, y0 * size, x1 * size, y1 * size]

    pen.polygon(
        [(0.28 * size, 0.62 * size), (0.18 * size, 0.88 * size), (0.42 * size, 0.72 * size)],
        fill=RED,
    )
    pen.polygon(
        [(0.72 * size, 0.62 * size), (0.82 * size, 0.88 * size), (0.58 * size, 0.72 * size)],
        fill=RED,
    )
    pen.ellipse(box(0.30, 0.46, 0.70, 0.88), fill=SUIT, outline=NAVY, width=max(1, size // 32))
    pen.ellipse(box(0.22, 0.16, 0.78, 0.70), fill=SKIN, outline=NAVY, width=max(1, size // 28))
    pen.pieslice(box(0.30, 0.08, 0.70, 0.42), 200, 340, fill=NAVY)
    eye = max(2, round(size / 14))
    for ex in (0.40, 0.60):
        x, y = ex * size, 0.40 * size
        pen.ellipse([x - eye, y - eye, x + eye, y + eye], fill=NAVY)
        glint = max(1, eye // 3)
        pen.ellipse([x - eye * 0.15, y - eye * 0.35, x - eye * 0.15 + glint, y - eye * 0.35 + glint], fill=WHITE)
    smile = max(2, round(size / 14))
    pen.arc(box(0.32, 0.40, 0.68, 0.66), 15, 165, fill=NAVY, width=smile)
    return image


MARK = [
    "SSSSSSSSSSSSSSSS",
    "SKKKKKKKKKKKKKKS",
    "SKSSSSSSSSSSSSKS",
    "SKSSSKKKKKSSSSKS",
    "SKSSSFFFFFFSSSKS",
    "SKSSSFKKFFKKSSKS",
    "SKSSSFFFFFFSSSKS",
    "SKSSSFMMMMMMSSKS",
    "SKSSSFFFFFFSSSKS",
    "SKSSRRFFFFRRSSKS",
    "SKSSSFFFFFFSSSKS",
    "SKSSSSUUUUSSSSKS",
    "SKSSSSSSSSSSSSKS",
    "SKKKKKKKKKKKKKKS",
    "SSSSSSSSSSSSSSSS",
    "SSSSSSSSSSSSSSSS",
]


def draw_pixels(rows: list[str], scale: int) -> Image.Image:
    palette = {
        "S": SKY,
        "K": NAVY,
        "F": SKIN,
        "R": RED,
        "U": SUIT,
        "M": NAVY,
    }
    height = len(rows)
    width = len(rows[0])
    image = Image.new("RGBA", (width * scale, height * scale), (0, 0, 0, 0))
    pen = ImageDraw.Draw(image)
    for y, row in enumerate(rows):
        if len(row) != width:
            raise SystemExit(f"row {y} is {len(row)} wide, expected {width}")
        for x, pixel in enumerate(row):
            pen.rectangle(
                [x * scale, y * scale, (x + 1) * scale - 1, (y + 1) * scale - 1],
                fill=palette[pixel],
            )
    return image


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    draw_pixels(MARK, 1).save(OUT / "icon16.png")
    draw(32).save(OUT / "icon32.png")
    draw(48).save(OUT / "icon48.png")
    draw(128).save(OUT / "icon128.png")


if __name__ == "__main__":
    main()
