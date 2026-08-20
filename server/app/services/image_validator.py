import uuid
from pathlib import Path

from fastapi import UploadFile

from app.services.file_storage_service import save_file
from app.shared.validation.rules import (
    validate_nomenclature,
    validate_size,
    validate_dimensions,
)

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_image_service(
    uploaded_file: UploadFile, 
    max_size_mb: float | None, 
    expected_width: int | None, 
    expected_height: int | None, 
    expected_format: str | None
):
    
    file_id = str(uuid.uuid4())
    file_path, file_url = save_file(
        uploaded_file, 
        file_id, 
        upload_dir=UPLOAD_DIR
    )

    checks = []
    
    if expected_format:
        file_format = Path(uploaded_file.filename or "").suffix.lower()

        if file_format.lstrip(".") != expected_format.lower().lstrip("."):
            checks.append(
                {
                    "name": "Formato",
                    "status": "error",
                    "value": file_format,
                    "errors": [
                        {
                            "code": "invalid_format",
                            "message": (
                                f"O formato do arquivo deve ser "
                                f"{expected_format}."
                            ),
                        }
                    ],
                }
            )
        
    if max_size_mb is not None:
        max_size_bytes = max_size_mb * 1024 * 1024 
        size_validation = validate_size(
            file_path,
            max_size_bytes, 
            max_size_mb
        )
        
        file_size = size_validation["size"]
        formatted_size = f"{file_size / 1024 / 1024:.2f} MB"
        
        checks.append(
            {
                "name": "Tamanho",
                "status": "ok" if size_validation["valid"] else "error",
                "value": formatted_size,
                "errors": (
                    None if size_validation["valid"] else [
                        {
                            "code": "file_too_large",
                            "message": f"O tamanho do arquivo excede o limite de {max_size_mb} MB."
                        }
                    ]
                ),
            }
        )
        
    if expected_width is not None and expected_height is not None:
        expected_dimensions = (expected_width, expected_height)
        
        dimension_validation = validate_dimensions(
            file_path, 
            expected_dimensions
            )
        
        width, height = dimension_validation["dimensions"]
        dimensions = f"{width}x{height}"
        
        checks.append(
            {
                "name": "Dimensões",
                "status": "ok" if dimension_validation["valid"] else "error",
                "value": dimensions,
                "errors": ( 
                    None if dimension_validation["valid"] else [
                        {
                            "code": "invalid_dimensions",
                            "message": f"As dimensões da imagem devem ser {expected_width}x{expected_height} pixels."
                        }
                    ]
                ),
            }
        )
        
    filename = uploaded_file.filename or ""
    nomenclature_valid = validate_nomenclature(filename)

    checks.append(
        {
            "name": "Nomenclatura",
            "status": "ok" if nomenclature_valid else "error",
            "value": filename,
            "errors": (
                None if nomenclature_valid else [
                    {
                        "code": "invalid_nomenclature",
                        "message": "A nomenclatura não corresponde ao esperado (ex: 9999 99 99999#1.jpg)."
                    }
                ]
            ),
        }
    )
    
    approved = not any(check["status"] == "error" for check in checks)
    
    return {
        "id": file_id,
        "stage": "validation",
        "approved": approved,
        "summary": (
            "Imagem validada com sucesso" if approved 
            else "Falha na validação da imagem"
        ),
        "file_url": file_url,
        "checks": checks
    }