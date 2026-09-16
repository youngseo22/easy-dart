"""
[팀원 A 담당] LLM(Gemini) 기반 공시 3줄 요약, 올해의 자랑거리, 주린이 리스크 자동 추출 서비스
"""
from app.config import GEMINI_API_KEY

class AISummaryService:
    @classmethod
    async def summarize_report(cls, company_name: str, financial_text: str):
        """
        주린이 눈높이에 맞춘 3줄 요약 + 자랑거리(초록불) + 리스크(빨간불) 생성 프롬프트
        """
        # TODO: google.generativeai 연동
        return {
            "company_name": company_name,
            "summary": [
                f"{company_name}의 2023년 매출이 역대 최고치를 기록했습니다.",
                "대표 상품의 마진율이 견고하게 유지되고 있습니다.",
                "온라인 및 글로벌 채널 비중이 지속 확대 중입니다."
            ],
            "good_points": ["독보적인 시장 점유율", "안정적인 현금흐름"],
            "risks": ["신규 경쟁업체 출혈 경쟁", "원가 상승 압박"]
        }
