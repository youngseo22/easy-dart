import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv()
DART_API_KEY = os.getenv("DART_API_KEY")
BASE_URL = "https://opendart.fss.or.kr/api"

async def check():
    async with httpx.AsyncClient() as client:
        # 1. 현대자동차 사업보고서(11011) 전체 재무제표
        r_hyundai = await client.get(f"{BASE_URL}/fnlttSinglAcntAll.json", params={
            "crtfc_key": DART_API_KEY,
            "corp_code": "00164742",
            "bsns_year": "2023",
            "reprt_code": "11011",
            "fs_div": "CFS"
        })
        h_data = r_hyundai.json()
        print(f"현대자동차 fnlttSinglAcntAll: status={h_data.get('status')}, count={len(h_data.get('list', []))}")

        # 3. 올리브영 공시문서(document.xml) 확인
        r_doc = await client.get(f"{BASE_URL}/document.xml", params={
            "crtfc_key": DART_API_KEY,
            "rcept_no": "20240329003214"
        })
        print(f"올리브영 감사보고서 document.xml 다운로드 상태: {r_doc.status_code}, 길이: {len(r_doc.content)}")




asyncio.run(check())
