from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse

from app.api import companies, quiz
from app.config import HOST, PORT

# 프로젝트 루트 경로 (easy-dart/)
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

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

# 백엔드 API 헬스체크
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "Easy-DART Backend API Server",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

# 물리 파일 경로 직접 접근 시 깔끔한 URL로 리다이렉트
@app.get("/frontend/src/pages/company_list/index.html")
@app.get("/frontend/src/pages/company_list")
def redirect_company_list():
    return RedirectResponse(url="/company-list")

@app.get("/frontend/src/pages/company_detail/index.html")
@app.get("/frontend/src/pages/company_detail")
def redirect_company_detail(request: Request):
    query = str(request.query_params)
    target = f"/company-details?{query}" if query else "/company-details"
    return RedirectResponse(url=target)

@app.get("/frontend/src/pages/quiz_terms/index.html")
@app.get("/frontend/src/pages/quiz_terms")
def redirect_quiz():
    return RedirectResponse(url="/quiz")

@app.get("/frontend/src/pages/quiz_terms/mock_invest.html")
@app.get("/frontend/src/pages/quiz_terms/mock_invest")
@app.get("/frontend/src/pages/mock_invest/index.html")
@app.get("/frontend/src/pages/mock_invest")
def redirect_mock_invest():
    return RedirectResponse(url="/mock-invest")

@app.get("/frontend/src/pages/quiz_terms/judge.html")
@app.get("/frontend/src/pages/quiz_terms/judge")
def redirect_judge():
    return RedirectResponse(url="/judge")

@app.get("/frontend/src/pages/quiz_terms/runner.html")
@app.get("/frontend/src/pages/quiz_terms/runner")
def redirect_runner():
    return RedirectResponse(url="/runner")

@app.get("/frontend/src/pages/quiz_terms/radar_shooter.html")
@app.get("/frontend/src/pages/quiz_terms/radar_shooter")
def redirect_radar_shooter():
    return RedirectResponse(url="/radar-shooter")

# 프론트엔드 및 기업 데이터 정적 서빙
if (ROOT_DIR / "frontend").exists():
    app.mount("/frontend", StaticFiles(directory=str(ROOT_DIR / "frontend")), name="frontend")

if (ROOT_DIR / "company_data").exists():
    app.mount("/company_data", StaticFiles(directory=str(ROOT_DIR / "company_data")), name="company_data")

# 프론트엔드 실제 페이지 경로
COMPANY_LIST_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "company_list" / "index.html"
COMPANY_DETAIL_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "company_detail" / "index.html"
MOCK_INVEST_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "mock_invest" / "index.html"
QUIZ_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "quiz_terms" / "index.html"
JUDGE_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "quiz_terms" / "judge.html"
RUNNER_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "quiz_terms" / "runner.html"
RADAR_SHOOTER_PAGE = ROOT_DIR / "frontend" / "src" / "pages" / "quiz_terms" / "radar_shooter.html"

# 깔끔한 URL 라우팅
@app.get("/")
def root_redirect():
    """메인 접속 시 /company-list로 이동"""
    return RedirectResponse(url="/company-list")

@app.get("/company-list")
@app.get("/compay-list")
def page_company_list():
    """1. 기업 파헤치기 메인 목록 페이지"""
    return FileResponse(COMPANY_LIST_PAGE)

@app.get("/company-details")
@app.get("/company-detail")
def page_company_details():
    """2. 기업 공시 상세 해설 페이지"""
    return FileResponse(COMPANY_DETAIL_PAGE)

@app.get("/mock-invest")
@app.get("/mock-investment")
def page_mock_invest():
    """3. 실전 모의투자 시뮬레이션 페이지"""
    return FileResponse(MOCK_INVEST_PAGE)

@app.get("/quiz")
def page_quiz():
    """4. DART 오락실 & 금융 퀴즈 센터 페이지"""
    return FileResponse(QUIZ_PAGE)

@app.get("/judge")
@app.get("/judge.html")
def page_judge():
    """5. DART 실전 투자 심사관 (BUY/SELL)"""
    return FileResponse(JUDGE_PAGE)

@app.get("/runner")
@app.get("/runner.html")
def page_runner():
    """6. DART 급행 레인 러너"""
    return FileResponse(RUNNER_PAGE)

@app.get("/radar-shooter")
@app.get("/radar_shooter.html")
@app.get("/dart-shooter")
def page_radar_shooter():
    """7. 공시 레이더 미사일 슈팅"""
    return FileResponse(RADAR_SHOOTER_PAGE)







if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)



