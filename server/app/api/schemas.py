from typing import List, Optional
from pydantic import BaseModel

class ValidationError(BaseModel):
    code: str
    message: str

class ValidationCheck(BaseModel):
    name: str
    value: Optional[str] = None
    status: str # ok | error
    errors: Optional[List[ValidationError]] = None

class ValidationResult(BaseModel):
    id: str
    filename: str
    approved: bool
    stage: str
    summary: str
    file_url: str
    checks: List[ValidationCheck]

class ValidationResponse(BaseModel):
    results: List[ValidationResult]
    
class ConvertRequest(BaseModel):
    file_ids: List[str]
    target_size: Optional[float] = None
    target_width: Optional[int] = None
    target_height: Optional[int] = None
    target_extensions: Optional[str] = None