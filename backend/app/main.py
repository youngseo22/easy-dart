from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import companies, quiz

app = FastAPI(
    title="Easy-DART API",
    description="주린이를 위한 20대 일상 기업 DART 공시 해설 & 퀴즈 API",
    version="1.0.0"
)

# CORS Middleware (Frontend 독립 개발 환경 연동 지원)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API 라우터 등록
app.include_router(companies.router, prefix="/api/companies", tags=["기업 파헤치기 (팀원 A & B)"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["퀴즈 아레나 (팀원 C)"])

@app.get("/")
def root():
    """백엔드 서버 헬스 체크 엔드포인트"""
    return {
        "status": "ok",
        "service": "Easy-DART Backend API Server",
        "version": "1.0.0",
        "docs_url": "/docs"
    }


