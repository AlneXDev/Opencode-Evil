"""Recolor the dark evil icon background to red while keeping the silver center."""
import os
import sys
from PIL import Image

directory = sys.argv[1]


def recolor(path):
    with Image.open(path) as im:
        rgba = im.convert("RGBA")
        pixels = rgba.load()
        width, height = rgba.size
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                # Treat near-grayscale dark pixels as the black background.
                spread = max(r, g, b) - min(r, g, b)
                luminance = (r + g + b) // 3
                if a > 0 and spread < 28 and luminance < 110:
                    # Preserve shading: brighter greys map to brighter reds.
                    level = luminance / 110.0
                    nr = int(120 + 135 * level)
                    ng = int(8 + 45 * level)
                    nb = int(8 + 45 * level)
                    pixels[x, y] = (min(255, nr), min(255, ng), min(255, nb), a)
        rgba.save(path)


for name in os.listdir(directory):
    if name.lower().endswith(".png"):
        recolor(os.path.join(directory, name))

# Rebuild the Windows .ico from the recolored 256px image.
source = os.path.join(directory, "128x128@2x.png")
with Image.open(source) as im:
    base = im.convert("RGBA")
    base.save(
        os.path.join(directory, "icon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )

print("recolor complete")
