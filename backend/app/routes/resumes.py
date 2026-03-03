from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Response
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Resume
from ..schemas import ResumeResponse, ResumeCreate, JobMatchRequest
from ..services.extraction_service import ExtractionService
from ..services.ai_service import AIService
from ..services.report_service import ReportService
from jose import JWTError, jwt
import os
from fastapi.security import OAuth2PasswordBearer
from ..auth.auth_handler import SECRET_KEY, ALGORITHM
from dotenv import load_dotenv

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/resumes", tags=["resumes"])

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content
    content = await file.read()
    
    # 5MB limit
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")
    
    # Extract text
    try:
        text = ExtractionService.extract_text_from_pdf(content)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # AI Analysis
    try:
        ai_result = await AIService.analyze_resume(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Save to DB
    new_resume = Resume(
        user_id=current_user.id,
        original_filename=file.filename,
        extracted_text=text,
        overall_score=ai_result.get("overall_score", 0),
        ats_score=ai_result.get("ats_score", 0),
        ai_response_json=ai_result
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    return new_resume

@router.get("/", response_model=List[ResumeResponse])
def get_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Resume deleted successfully"}

@router.get("/{resume_id}/report")
def download_report(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    resume_data = {
        "original_filename": resume.original_filename,
        "overall_score": resume.overall_score,
        "ats_score": resume.ats_score,
        "ai_response_json": resume.ai_response_json
    }
    
    pdf_content = ReportService.generate_resume_report(resume_data)
    
    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Resulyze_Report_{resume.id}.pdf"'
        }
    )

@router.post("/{resume_id}/match")
async def match_resume_to_job(
    resume_id: int,
    request: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    try:
        match_result = await AIService.match_job(resume.extracted_text, request.job_description)
        return match_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

