import shutil
from pathlib import Path
from fastapi import UploadFile
from app.shared.validation.rules import sanitize_filename

def save_file(uploaded_file: UploadFile, upload_dir: Path):
    safe_filename = sanitize_filename(uploaded_file.filename)
    file_path = upload_dir / safe_filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)

    file_url = f"/uploads/{safe_filename}"
    
    return file_path, file_url