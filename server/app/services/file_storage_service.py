import shutil, glob
from pathlib import Path
from fastapi import UploadFile
from app.shared.validation.rules import sanitize_filename

def save_file(uploaded_file: UploadFile, file_id: str, upload_dir: Path):
    safe_filename = sanitize_filename(uploaded_file.filename, file_id)
    file_path = upload_dir / safe_filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)

    file_url = f"/uploads/{safe_filename}"
    
    return file_path, file_url

def find_file(file_id: str, upload_dir: Path):
    files = glob.glob(f"{upload_dir}/{file_id}.*")
    
    return files[0] if files else None