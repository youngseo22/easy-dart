"""
[팀원 A & B 담당] 20대 일상 기업 목록 및 상세 분석 API 라우터
"""
from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "company_mapping.json")

def load_companies():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

@router.get("/")
def get_company_list(category: str = None, query: str = None):
    """20대 일상 기업 목록 조회 (검색 및 카테고리 필터링)"""
    companies = load_companies()
    if category and category != "all":
        companies = [c for c in companies if c.get("category") == category]
    if query:
        companies = [c for c in companies if query.lower() in c.get("name", "").lower()]
    return {"count": len(companies), "companies": companies}

@router.get("/{company_id}")
def get_company_detail(company_id: str):
    """선택한 기업의 공시 상세 분석 데이터 (손익계산서, AI 요약) 조회"""
    companies = load_companies()
    target = next((c for c in companies if c.get("id") == company_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="해당 기업을 찾을 수 없습니다.")
    
    # 예시 상세 반환값 (팀원 A의 DART/AI 서비스와 결합)
    return {
        "company": target,
        "financials": {
            "revenue": "3조 8,682억",
            "cost": "3조 4,022억",
            "operating_profit": "4,660억 (12.2%)",
            "net_profit": "3,640억 (9.4%)"
        },
        "ai_summary": {
            "summary": ["매출 역대 최고", "오늘드림 온라인 비중 30% 돌파", "동종업계 대비 3배 영업이익률"],
            "good_points": ["오프라인 독점력", "외국인 관광객 매출 급증"],
            "risks": ["공정위 납품업체 상생 규제", "국내 출점 한계"]
        }
    }
