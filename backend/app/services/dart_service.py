"""
[팀원 A 담당] DART OpenAPI 연동 및 20개 기업 공시/재무제표 데이터 파싱 서비스
"""
import httpx
from app.config import DART_API_KEY

class DartService:
    BASE_URL = "https://opendart.fss.or.kr/api"

    @classmethod
    async def get_financial_statements(cls, corp_code: str, bsns_year: str = "2023", reprt_code: str = "11011"):
        """
        DART 주요계정 및 재무제표(손익계산서, 재무상태표) 조회
        - reprt_code: 11011(사업보고서), 11012(반기), 11013(1분기), 11014(3분기)
        """
        if not DART_API_KEY:
            # API 키 미설정 시 mock 데이터 반환 (개발 편의)
            return {"status": "mock", "message": "DART_API_KEY is not configured."}

        url = f"{cls.BASE_URL}/fnlttSinglAcnt.json"
        params = {
            "crtfc_key": DART_API_KEY,
            "corp_code": corp_code,
            "bsns_year": bsns_year,
            "reprt_code": reprt_code
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            return response.json()

    @classmethod
    async def get_company_overview(cls, corp_code: str):
        """기업 개황 정보 조회"""
        url = f"{cls.BASE_URL}/company.json"
        params = {"crtfc_key": DART_API_KEY, "corp_code": corp_code}
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            return response.json()
