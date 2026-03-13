from pathlib import Path
from pickletools import optimize
from PIL import Image
from io import BytesIO
from app.services.file_storage_service import find_file

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def convert_image_service(file_id: str, max_size_mb: float | None, expected_width: int | None, expected_height: int | None, expected_extensions: str | None):
    file_path = find_file(file_id, upload_dir=UPLOAD_DIR)
    
    if file_path is None:
        return ""
    
    img = Image.open(file_path)
    
    if expected_width is not None and expected_height is not None:
        if img.size != (expected_width, expected_height):
            img = img.resize((expected_width, expected_height))
        
    format = expected_extensions.upper() if expected_extensions else "JPEG"
    
    if format == "JPEG":
        img = img.convert("RGB")

    new_img_path = UPLOAD_DIR / f"{file_id}_converted.{format.lower()}"
    
    if format == "PNG":
        img.save(new_img_path, format="PNG", optimize=True)
            
    elif max_size_mb is not None:
        target_bytes = max_size_mb * 1024 * 1024
            
        low_quality = 10
        high_quality = 95
        best_data = None
            
        while low_quality <= high_quality:
            quality = (low_quality + high_quality) // 2
            
            buffer = BytesIO()
            img.save(buffer, format=format, quality=quality)
                
            size = buffer.tell()
                
            if size <= target_bytes:
                best_data = buffer.getvalue()
                low_quality = quality + 1
            else:
                high_quality = quality - 1
            
        if best_data is not None:
            with open(new_img_path, "wb") as f:
                f.write(best_data)
        else:
            img.save(new_img_path, format=format, optimize=True)
    else:
        img.save(new_img_path, format=format, optimize=True)
    
    return str(new_img_path)