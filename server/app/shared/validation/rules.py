import re
import os
import uuid
from pathlib import Path
from PIL import Image, ImageOps
from app.shared.image.metadata import get_size, get_dimensions

def validate_size(file_path: Path, max_size_bytes: float, max_size_mb: float | None) -> dict:
    if max_size_mb:
        file_size = os.path.getsize(file_path)
        if file_size > max_size_bytes:
            return {
                "valid": False,
                "size": file_size,
            }
    return {
        "valid": True,
        "size": os.path.getsize(file_path),
    }

def validate_dimensions(file_path: Path, expected_dimensions: tuple) -> dict:
        with Image.open(file_path) as img:
            img = ImageOps.exif_transpose(img)
            width, height = img.size

        if (width, height) != expected_dimensions:
            return {
                "valid": False,
                "dimensions": (width, height),
            }
        return {
            "valid": True,
            "dimensions": (width, height),
        }

def sanitize_filename(filename: str) -> str:
    if not filename:
        raise ValueError("Filename inválido")

    ext = Path(filename).suffix

    name = uuid.uuid4()
    return f"{name}{ext}"


def validate_nomenclature(filename: str) -> bool:
    if not filename:
        raise ValueError("Filename inválido")
    
    name = Path(filename).stem
    rule = r"^\d{4} \d{1,2} \d{5}#\d$"
    
    if re.match(rule, name):
        return True
    return False