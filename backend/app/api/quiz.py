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
def get_basic_term_quizzes(topic: str = None, limit: int = None):
    """주식 & 회계 기초 용어 퀴즈 목록 조회 (60+ 대용량 DB 연동 및 랜덤 셔플)"""
    quizzes = QuizService.get_basic_quizzes(topic, limit)
    return {"count": len(quizzes), "quizzes": quizzes}

@router.get("/infinite")
def get_infinite_quizzes(topic: str = None, batch_size: int = 10, exclude_ids: str = None):
    """무한 퀴즈 스트림용 배치 반환 API (최대한 많은 퀴즈가 끊김 없이 순환)"""
    excluded = [i.strip() for i in exclude_ids.split(",")] if exclude_ids else []
    quizzes = QuizService.get_infinite_quiz_stream(topic, batch_size, excluded)
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

class AIDebriefRequest(BaseModel):
    missed_items: list = []
    game_title: str = "3대 금융 아케이드"

@router.post("/ai-debrief")
async def get_ai_postgame_debrief(req: AIDebriefRequest):
    """
    [팀원 C 인게임 AI] 게임 종료 후 실수한 공시 분석 및 1:1 하브루타 오답 처방전 반환
    """
    debrief = await QuizService.generate_ai_debrief(req.missed_items, req.game_title)
    return debrief

@router.get("/ai-scenario")
async def get_ai_dynamic_scenario(category: str = "mix"):
    """
    [팀원 C 인게임 AI] 실전 심사관/슈팅 게임용 20대 일상 기업 공시 딜레마 카드 실시간 생성
    """
    scenario = await QuizService.generate_ai_scenario(category)
    return scenario
