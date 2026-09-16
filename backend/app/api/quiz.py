"""
[팀원 C 담당] 주식 용어 퀴즈 및 기업 공시 퀴즈 API 라우터
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.quiz_service import QuizService

router = APIRouter()

class CheckAnswerRequest(BaseModel):
    quiz_id: str
    selected_index: int

@router.get("/basic")
def get_basic_term_quizzes(topic: str = None):
    """주식 & 회계 기초 용어 퀴즈 목록 조회"""
    quizzes = QuizService.get_basic_quizzes(topic)
    return {"count": len(quizzes), "quizzes": quizzes}

@router.get("/company/{company_id}")
def get_company_review_quiz(company_id: str):
    """기업 상세 페이지 하단용 공시 복습 퀴즈 조회"""
    quiz = QuizService.get_company_quiz(company_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="해당 기업의 복습 퀴즈를 찾을 수 없습니다.")
    return {"company_id": company_id, "quiz": quiz}

@router.get("/game/disclosures")
def get_game_disclosures():
    """DART 공시 레이더 미사일 슈팅 게임용 악재/호재 공시 데이터 조회"""
    disclosures = QuizService.get_game_disclosures()
    return {"count": len(disclosures), "disclosures": disclosures}
