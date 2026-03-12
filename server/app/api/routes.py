from typing import List
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.api.schemas import ConvertRequest, ValidationResponse
from app.services.image_validator import validate_image_service
from app.services.image_converter import convert_image_service
from app.services.zip_compress_service import compress_to_zip

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

@router.post("/convert")
async def convert_image(req: ConvertRequest):

    converted_files = []

    for file_id in req.file_ids:
        converted_file = convert_image_service(
            file_id,
            req.target_size,
            req.target_width,
            req.target_height,
            req.target_extensions
        )
        converted_files.append(converted_file)

    zip_buffer = compress_to_zip(converted_files)
        
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=ValidAi_converted_files.zip"}
    )