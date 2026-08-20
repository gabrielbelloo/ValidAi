from io import BytesIO
from pathlib import Path

from PIL import Image

from app.services.file_storage_service import find_file

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

FORMAT_MAP={
    "jpg": "JPEG",
    "jpeg": "JPEG",
    "png": "PNG",
}

def convert_image_service(
    file_id: str, 
    max_size_mb: float | None, 
    expected_width: int | None, 
    expected_height: int | None, 
    expected_format: str | None
) -> str:
    
    file_path = find_file(file_id, upload_dir=UPLOAD_DIR)
    
    if file_path is None:
        return ""
    
    image = Image.open(file_path)
    
    image = resize_image(
        image,
        expected_width,
        expected_height,
    )
    
    image_format = normalize_format(expected_format)
    
    image = prepare_image_for_format(
        image,
        image_format,
    )
    
    output_path = build_output_path(
        file_id,
        expected_format,
    )
    
    save_image(
        image,
        output_path,
        image_format,
        max_size_mb,
    )
    
    return str(output_path)
    
def resize_image(
    image: Image.Image,
    expected_width: int | None,
    expected_height: int | None,
) -> Image.Image:
    
    if expected_width is None or expected_height is None:
        return image
    
    if image.size == (expected_width, expected_height):
        return image
    
    return image.resize((expected_width, expected_height))

def normalize_format(
    format: str | None
)-> str:
    
    format = format.lower().lstrip(".")
    
    try:
        return FORMAT_MAP[format]
    except KeyError:
        raise ValueError(
            f"Unsupported image format: {format}. Supported formats are: {', '.join(FORMAT_MAP.keys())}"
        )
    
def prepare_image_for_format(
    image: Image.Image,
    image_format: str,
) -> Image.Image:
    
    if image_format == "JPEG" and image.mode != "RGB":
        return image.convert("RGB")
    
    return image

def build_output_path(
    file_id: str,
    format: str | None
) -> Path:
    
    format = format.lower().lstrip(".")
    
    return UPLOAD_DIR / f"{file_id}_converted.{format}"

def save_image(
    image: Image.Image,
    output_path: Path,
    image_format: str,
    max_size_mb: float | None,
) -> None:
    
    if max_size_mb is not None:
        image = compress_image_to_size(image, image_format, max_size_mb)
        
    image.save(
        output_path,
        format=image_format,
        optimize=True,
    )
    
def compress_image_to_size(
    image: Image.Image,
    image_format: str,
    max_size_mb: float,
) -> Image.Image:
    
    if image_format not in ("JPEG", "PNG"):
        raise ValueError(f"Compression not supported for format: {image_format}")
    
    max_size_bytes = max_size_mb * 1024 * 1024
    
    if image_format == "PNG":
        buffer = BytesIO()
            
        image.save(
            buffer, 
            format=image_format,
            optimize=True, 
            compress_level=9
            )

        return Image.open(buffer).copy()
            
    elif image_format == "JPEG":
        low_quality = 10
        high_quality = 95
        best_image_bytes = None
                    
        while low_quality <= high_quality:
            quality = (low_quality + high_quality) // 2

            buffer = BytesIO()
            image.save(buffer, format=image_format, quality=quality, optimize=True)
                        
            size = buffer.tell()
                        
            if size <= max_size_bytes:
                best_image_bytes = buffer.getvalue()
                low_quality = quality + 1
            else:
                high_quality = quality - 1
                    
        if best_image_bytes is not None:
            buffer = BytesIO(best_image_bytes)
            return Image.open(buffer).copy()
            
    raise ValueError("Cannot compress image to the desired size.")