from pathlib import Path
import re

from PIL import Image, ImageOps


PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT.parent / "图片"
PUBLIC = PROJECT / "public"
OUTPUT = PUBLIC / "图片"


def convert_images() -> tuple[int, int]:
    converted = 0
    failures = []
    for source in SOURCE.rglob("*"):
        if not source.is_file() or source.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        relative = source.relative_to(SOURCE).with_suffix(".webp")
        target = OUTPUT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        try:
            with Image.open(source) as opened:
                image = ImageOps.exif_transpose(opened)
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
                if "A" in image.getbands():
                    image = image.convert("RGBA")
                else:
                    image = image.convert("RGB")
                image.save(target, "WEBP", quality=76, method=6)
            converted += 1
        except Exception as exc:
            failures.append(f"{source}: {exc}")
    if failures:
        raise RuntimeError("Image conversion failed:\n" + "\n".join(failures))
    return converted, sum(p.stat().st_size for p in OUTPUT.rglob("*.webp"))


def rewrite_asset_paths(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = re.sub(
        r"(图片/[^\"']+?)\.(?:png|jpe?g)",
        lambda match: match.group(1) + ".webp",
        text,
        flags=re.IGNORECASE,
    )
    path.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    count, size = convert_images()
    for asset_file in (PUBLIC / "portfolio-data.js", PUBLIC / "script.js", PUBLIC / "portfolio.html"):
        rewrite_asset_paths(asset_file)
    print(f"Converted {count} images to {size / 1024 / 1024:.1f} MB")
