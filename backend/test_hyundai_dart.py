"""
현대자동차 DART 재무제표 수집 및 전처리 테스트 코드
"""
import asyncio
import os
import json
import httpx
from dotenv import load_dotenv

load_dotenv()
DART_API_KEY = os.getenv("DART_API_KEY")
BASE_URL = "https://opendart.fss.or.kr/api"


def format_krw_units(amount: int) -> str:
    """
    원 단위 정수를 주린이 친화적인 '조/억 원' 문자열로 포맷팅
    예: 162663584000000 -> '162조 6,636억 원'
    """
    if amount == 0:
        return "0원"
    
    is_neg = amount < 0
    abs_val = abs(amount)
    
    jo = abs_val // (10**12)
    eok = round((abs_val % (10**12)) / (10**8))
    
    # 억 단위 반올림으로 10,000억이 된 경우 처리
    if eok >= 10000:
        jo += 1
        eok -= 10000
        
    parts = []
    if jo > 0:
        parts.append(f"{jo:,}조")
    if eok > 0 or (jo > 0 and eok == 0):
        parts.append(f"{eok:,}억")
        
    res = " ".join(parts) + " 원"
    return f"-{res}" if is_neg else res


def calculate_growth_rate(current: int, previous: int) -> str:
    """전년 대비 증감률(YoY) 계산"""
    if not previous or previous == 0:
        return "N/A"
    rate = ((current - previous) / abs(previous)) * 100
    sign = "+" if rate > 0 else ""
    return f"{sign}{rate:.1f}%"


async def get_and_preprocess_hyundai(year: str = "2023"):
    """
    현대자동차(상장사, corp_code: 00164742) DART 주요계정 수집 및 쉬운 재무제표 전처리
    """
    corp_code = "00164742"
    url = f"{BASE_URL}/fnlttSinglAcnt.json"
    params = {
        "crtfc_key": DART_API_KEY,
        "corp_code": corp_code,
        "bsns_year": year,
        "reprt_code": "11011"  # 사업보고서
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url, params=params)
        data = resp.json()

    if data.get("status") != "000":
        print(f"DART API 오류: {data.get('message')}")
        return None

    # 연결재무제표(CFS) 데이터만 추출
    items = [item for item in data.get("list", []) if item.get("fs_div") == "CFS"]

    # 파싱할 핵심 계정 매핑
    raw_figures = {}
    prev_figures = {}

    for item in items:
        account_nm = item.get("account_nm", "").strip()
        thstrm_amt = item.get("thstrm_amount", "").replace(",", "").strip()
        frmtrm_amt = item.get("frmtrm_amount", "").replace(",", "").strip()

        val_cur = int(thstrm_amt) if thstrm_amt and thstrm_amt != "-" else 0
        val_prev = int(frmtrm_amt) if frmtrm_amt and frmtrm_amt != "-" else 0

        if account_nm in ["매출액", "수익(매출액)"]:
            raw_figures["revenue"] = val_cur
            prev_figures["revenue"] = val_prev
        elif account_nm in ["영업이익", "영업이익(손실)"]:
            raw_figures["operating_profit"] = val_cur
            prev_figures["operating_profit"] = val_prev
        elif account_nm in ["당기순이익", "당기순이익(손실)"]:
            raw_figures["net_profit"] = val_cur
            prev_figures["net_profit"] = val_prev
        elif account_nm == "자산총계":
            raw_figures["assets"] = val_cur
        elif account_nm == "부채총계":
            raw_figures["liabilities"] = val_cur
        elif account_nm == "자본총계":
            raw_figures["equity"] = val_cur

    # 전처리 계산
    revenue = raw_figures.get("revenue", 0)
    op_profit = raw_figures.get("operating_profit", 0)
    net_profit = raw_figures.get("net_profit", 0)
    cost = revenue - op_profit  # 총 비용 (손님이 낸 돈에서 기업이 남긴 돈을 뺀 비용)

    op_margin = (op_profit / revenue * 100) if revenue else 0
    net_margin = (net_profit / revenue * 100) if revenue else 0

    # 체감 환산 (현대자동차 대표 상품: 차량용 방향제 18,000원)
    item_name = "차량용 프리미엄 방향제"
    item_price = 18000
    item_count = net_profit // item_price if item_price else 0

    preprocessed_result = {
        "company_info": {
            "name": "현대자동차",
            "corp_code": corp_code,
            "stock_code": "005380",
            "bsns_year": f"{year}년 연간",
            "statement_type": "연결재무제표 (CFS)"
        },
        # 주린이 눈높이 쉬운 손익계산서 (Visual Income Statement)
        "visual_income_statement": {
            "step_1_revenue": {
                "title": "손님이 낸 돈 (매출액)",
                "amount": format_krw_units(revenue),
                "growth_yoy": calculate_growth_rate(revenue, prev_figures.get("revenue", 0)),
                "raw": revenue,
                "description": "현대차가 전 세계 고객들에게 자동차와 서비스를 팔아 벌어들인 총금액"
            },
            "step_2_cost": {
                "title": "나간 비용 (원가+인건비+연구개발비 등)",
                "amount": format_krw_units(cost),
                "ratio": f"{(cost / revenue * 100):.1f}%",
                "raw": cost,
                "description": "차량 부품값, 공장 운영비, 직원 월급 및 연구개발비로 쓰인 돈"
            },
            "step_3_operating_profit": {
                "title": "남은 돈 (영업이익)",
                "amount": format_krw_units(op_profit),
                "profit_margin": f"{op_margin:.1f}%",
                "growth_yoy": calculate_growth_rate(op_profit, prev_figures.get("operating_profit", 0)),
                "raw": op_profit,
                "description": f"차 팔아서 순수 영업으로 남긴 알짜배기 이익 (100원 팔면 약 {round(op_margin)}원 남김)"
            },
            "step_4_net_profit": {
                "title": "진짜 내 돈 (당기순이익)",
                "amount": format_krw_units(net_profit),
                "profit_margin": f"{net_margin:.1f}%",
                "growth_yoy": calculate_growth_rate(net_profit, prev_figures.get("net_profit", 0)),
                "raw": net_profit,
                "description": "세금(법인세)과 금융이자까지 싹 털고 진짜 현대차 주머니에 남은 최종 순이익"
            }
        },
        # 일상 소비 체감 환산 지표 (Metaphor)
        "metaphor_conversion": {
            "item_name": item_name,
            "item_price": f"{item_price:,}원",
            "item_count": f"{item_count:,}개",
            "summary_text": f"현대차의 1년 순이익({format_krw_units(net_profit)})은 {item_name}을 약 {format_krw_units(item_count * item_price).replace(' 원', '')}치, 즉 {round(item_count / 100000000, 1)}억 개를 판매한 것과 같은 이익입니다!"
        }
    }

    return preprocessed_result


async def main():
    print(">>> DART API에서 현대자동차 2023년 재무 데이터 수집 및 전처리 실행 중...")
    result = await get_and_preprocess_hyundai("2023")
    if result:
        print("\n[전처리 완료된 데이터 결과]")
        print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
