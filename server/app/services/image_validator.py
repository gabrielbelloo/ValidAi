from pathlib import Path
from fastapi import UploadFile
from app.services.file_storage_service import save_file
from app.shared.validation.rules import validate_nomenclature
from app.shared.validation.rules import validate_size
from app.shared.validation.rules import validate_dimensions

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def validate_image_service(uploaded_file: UploadFile, max_size_mb: float | None, expected_width: int | None, expected_height: int | None, expected_extensions: str | None):
    file_path, file_url = save_file(uploaded_file, upload_dir=UPLOAD_DIR)

    checks = []
    
    # Validate file format
    if expected_extensions:   
        file_extension = Path(uploaded_file.filename).suffix.lower()
        allowed_formats = [f.lower().lstrip('.') for f in expected_extensions.split(',')]
        if not any(file_extension.lstrip('.') == fmt or file_extension == f'.{fmt}' for fmt in allowed_formats):
            return {
                "approved": False,
                "summary": "Formato inválido",
                "checks": [{
                "name": "Formato",
                "status": "error",
                "errors": [{
                    "code": "invalid_format",
                    "message": f"O formato do arquivo deve ser {expected_extensions}."
                }]
                }]
            }
        
    max_size_bytes = None
    if max_size_mb is not None:
        max_size_bytes = max_size_mb * 1024 * 1024 
    if max_size_bytes is not None: 
        print(f"Validando tamanho do arquivo: {file_path} (tamanho máximo: {max_size_mb} mb)")
        size_validation = validate_size(file_path, max_size_bytes, max_size_mb)
        file_size = size_validation["size"]
        if not size_validation["valid"]:
            checks.append({
                "name": "Tamanho",
                "status": "error",
                "value": str(f"{file_size / 1024 / 1024:.2f}") + " mb",
                "errors": [{
                    "code": "file_too_large",
                    "message": f"O tamanho do arquivo excede o limite de {max_size_mb} mb."
                }]
            })
        else:
            checks.append({
                "name": "Tamanho",
                "status": "ok",
                "value": str(f"{file_size / 1024 / 1024:.2f}") + " mb",
                "errors": None
            })
        
    if expected_width is not None and expected_height is not None:
        expected_dimensions = (expected_width, expected_height)
        dimension_validation = validate_dimensions(file_path, expected_dimensions)
        width, height = dimension_validation["dimensions"]
        if not dimension_validation["valid"]:
            checks.append({
                "name": "Dimensões",
                "status": "error",
                "value": f"{width}x{height}",
                "errors": [{
                    "code": "invalid_dimensions",
                    "message": f"As dimensões da imagem devem ser {expected_dimensions[0]}x{expected_dimensions[1]} pixels."
                }]
            })
        else: 
            checks.append({
                "name": "Dimensões",
                "status": "ok",
                "value": f"{width}x{height}",
                "errors": None
            })

    if not validate_nomenclature(uploaded_file.filename):
        checks.append({
            "name": "Nomenclatura",
            "status": "error",
            "value": uploaded_file.filename,
            "errors": [{
                "code": "invalid_nomenclature",
                "message": "A nomenclatura não corresponde ao esperado (ex: 9999 99 99999#1.jpg)."
            }]
        })
    else:
        checks.append({
            "name": "Nomenclatura",
            "status": "ok",
            "value": uploaded_file.filename,
            "errors": None        
    })
    
    approved = not any(c["status"] == "error" for c in checks)
    
    return {
        "stage": "validation",
        "approved": approved,
        "summary": "Imagem validada com sucesso" if approved else "Falha na validação da imagem",
        "file_url": file_url,
        "checks": checks
    }