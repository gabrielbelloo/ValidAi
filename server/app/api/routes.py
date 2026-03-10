from typing import List
from fastapi import APIRouter, UploadFile, File, Form
from app.api.schemas import ValidationResponse
from app.services.image_validator import validate_image_service

router = APIRouter(prefix="/api", tags=["validation"])

@router.post("/validate", response_model=ValidationResponse)
async def validate_image(
    files: List[UploadFile] = File(...), 
    max_size: float | None = Form(None), 
    expected_width: int | None = Form(None), 
    expected_height: int | None = Form(None), 
    expected_extensions: str | None = Form(None)
):
    results = []

    for file in files:
        
        result = validate_image_service(
            file, 
            max_size, 
            expected_width, 
            expected_height, 
            expected_extensions
        )

        results.append({
            "filename": file.filename,
            **result
        })
    
    return {"results": results}