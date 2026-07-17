from pathlib import Path
from PIL import Image

source = Path("school-logo.png")
backup = Path("assets/original-transparent-logo.png")
if not backup.exists():
    backup.parent.mkdir(parents=True, exist_ok=True)
    backup.write_bytes(source.read_bytes())

with Image.open(source).convert("RGBA") as logo:
    background = Image.new("RGBA", logo.size, "white")
    background.alpha_composite(logo)
    background.convert("RGB").save(source, "PNG", optimize=True)
