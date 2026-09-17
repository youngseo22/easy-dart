"""
[팀원 C 담당] 주식 기초 용어 퀴즈 및 기업별 복습 퀴즈 채점/조회 서비스
"""
import json
import os
import random

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "quiz_dataset.json")

class QuizService:
    @classmethod
    def load_data(cls):
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"basic_terms": [], "company_quizzes": {}}

    @classmethod
    def get_basic_quizzes(cls, topic: str = None):
        data = cls.load_data()
        quizzes = data.get("basic_terms", [])
        if topic and topic != "all":
            quizzes = [q for q in quizzes if q.get("topic") == topic]
        # 매번 순서가 달라지도록 랜덤 셔플
        shuffled = list(quizzes)
        random.shuffle(shuffled)
        return shuffled

    @classmethod
    def get_company_quiz(cls, company_id: str):
        data = cls.load_data()
        return data.get("company_quizzes", {}).get(company_id)

    @classmethod
    def get_game_disclosures(cls):
        """DART 레이더 미사일 슈팅 게임용 악재/호재 공시 데이터셋 반환"""
        data = cls.load_data()
        return data.get("radar_shooter_disclosures", [])

    @classmethod
    async def generate_ai_debrief(cls, missed_items: list, game_title: str = "아케이드 게임"):
        """
        [팀원 C 인게임 AI] 게임 오버 시 실수한 공시 목록을 분석하여
        20대 주린이 눈높이의 1:1 하브루타(소크라테스식 문답) 오답 처방전 생성
        """
        from app.config import GEMINI_API_KEY

        if not missed_items:
            return {
                "coach_title": "🎯 퍼펙트 플레이어!",
                "message": "상폐 지뢰를 단 하나도 밟지 않고 완벽하게 식별하셨습니다! 실전 공시 감각이 이미 상위 1% 수준입니다.",
                "havruta_question": "다음 단계로 실전 DART 원문 공시 카드를 읽고 3초 만에 판정하는 [심사관 게임]에 도전해보는 건 어떨까요?",
                "key_takeaway": "위험 회피 완벽 성공"
            }

        # 오프라인/키 미설정 시 휴리스틱 하브루타 룰베이스 처방전
        fallback_map = {
            "감사의견 거절": {
                "coach_title": "🚨 감사의견 거절: 상폐 급행열차 경보!",
                "message": "회계법인이 '이 회사의 장부는 도저히 믿을 수 없어서 검토를 포기합니다'라고 선언한 최악의 경고등입니다.",
                "havruta_question": "만약 친구가 돈을 빌려달라면서 가계부를 절대 안 보여준다면 믿고 빌려줄 수 있을까요? 기업도 똑같답니다!",
                "key_takeaway": "의견거절 공시가 뜨면 묻지도 따지지도 말고 즉시 탈출해야 합니다."
            },
            "전환사채": {
                "coach_title": "⚠️ 전환사채(CB): 주주가치 희석 주의보!",
                "message": "회사가 빚을 냈는데, 나중에 이 빚이 '새 주식'으로 바뀌어 시장에 쏟아져 나오는 마법의 채권입니다.",
                "havruta_question": "피자 한 판을 4명이 나눠 먹다가 갑자기 8명이 더 와서 12조각으로 나누면 내 피자 조각은 어떻게 될까요?",
                "key_takeaway": "CB 물량이 대량 주식으로 전환되면 기존 주주의 1주당 가치(EPS)가 쪼그라들어 주가가 급락합니다."
            },
            "완전자본잠식": {
                "coach_title": "💣 완전자본잠식: 밑 빠진 독 경보!",
                "message": "회사가 번 돈은커녕 처음 시작할 때 모았던 밑천(자본금)까지 적자로 100% 몽땅 까먹은 상태입니다.",
                "havruta_question": "월급 200만 원인데 매달 카드값이 300만 원씩 나와서 통장 잔고가 마이너스로 뚫리면 어떻게 될까요?",
                "key_takeaway": "완전자본잠식은 코스닥·코스피 즉시 퇴출(상장폐지) 실질심사 대상입니다."
            },
            "횡령·배임": {
                "coach_title": "🚔 횡령·배임: 신뢰 붕괴 경보!",
                "message": "회사 임직원이 회삿돈을 개인 쌈짓돈처럼 빼돌렸다는 충격적인 공시입니다.",
                "havruta_question": "믿었던 동업자가 금고에서 돈을 몰래 빼내 도망쳤다면 그 가게에 계속 투자하고 싶을까요?",
                "key_takeaway": "횡령 배임 규모가 자기자본의 일정 비율 이상이면 즉시 거래정지 및 상폐 심사로 직행합니다."
            }
        }

        # 첫 번째 놓친 아이템 기준
        first_missed = str(missed_items[0])
        matched_fallback = None
        for key, val in fallback_map.items():
            if key in first_missed:
                matched_fallback = val
                break

        if not matched_fallback:
            matched_fallback = {
                "coach_title": f"💡 [{first_missed}] 핵심 복기 처방전",
                "message": f"'{first_missed}' 공시는 주가와 기업 생존에 결정적인 영향을 미치는 주요 공시입니다.",
                "havruta_question": "이 공시가 떴을 때 과연 회사의 통장에 현금이 더 들어올까요, 아니면 주주들의 지분이 쪼그라들까요?",
                "key_takeaway": "공시 제목을 보고 회사의 진짜 주머니 사정을 3초 안에 떠올리는 연습이 필요합니다."
            }

        # Gemini API 키가 있으면 LLM으로 실시간 생성 시도
        if GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = f"""
당신은 20대 주린이를 위한 친절하고 유쾌한 소크라테스식 AI 금융 튜터 '핑거코치'입니다.
사용자가 방금 '{game_title}' 게임을 플레이하다가 다음 공시에서 실수(지뢰 피격 또는 오판)를 했습니다:
{missed_items}

다음 JSON 규격으로만 응답하세요:
{{
  "coach_title": "20대 눈높이 펀치라인 제목 (이모지 포함)",
  "message": "왜 이것이 위험한지(또는 왜 호재인지) 20대 일상(알바, 월급, 넷플릭스 등) 비유를 담은 2줄 설명",
  "havruta_question": "사용자가 스스로 핵심 원리를 깨닫게 만드는 소크라테스식 반문 질문 1개",
  "key_takeaway": "1줄 요약 투자 생존 팁"
}}
"""
                response = await model.generate_content_async(prompt)
                text = response.text.strip()
                if "{" in text and "}" in text:
                    json_str = text[text.find("{"):text.rfind("}")+1]
                    return json.loads(json_str)
            except Exception:
                pass

        return matched_fallback

    @classmethod
    async def generate_ai_scenario(cls, category: str = "mix"):
        """
        [팀원 C 인게임 AI] 20대 일상 기업(배민, 무신사, 토스, 당근 등)의
        실전/가상 공시 딜레마 카드를 AI로 무한 생성
        """
        from app.config import GEMINI_API_KEY

        sample_scenarios = [
            {
                "company": "배달의민족 (우아한형제들)",
                "title": "라이더 기본배달료 15% 인상 및 당기순손실 120억 전환",
                "type": "SELL",
                "reason": "영업비용 급증으로 흑자 기조가 깨지며 수익성 악화",
                "action_tip": "플랫폼 기업은 마진 방어가 최우선! 비용 통제 실패는 단기 악재입니다.",
                "emoji": "🛵"
            },
            {
                "company": "무신사 (MUSINSA)",
                "title": "글로벌 패션 K-브랜드 수출액 전년비 +140% 돌파",
                "type": "BUY",
                "reason": "내수 한계를 뚫고 해외 시장에서 본격적인 외형 성장",
                "action_tip": "글로벌 확장 성공 공시는 기업 밸류에이션 리레이팅의 대표 호재입니다.",
                "emoji": "👗"
            },
            {
                "company": "당근 (당근마켓)",
                "title": "지역 생활 광고 매출 분기 흑자 달성 및 배당 20억 공시",
                "type": "BUY",
                "reason": "적자 유니콘에서 자체 현금창출이 가능한 흑자 기업으로 체질 개선",
                "action_tip": "만년 적자 플랫폼의 첫 흑자 및 배당은 가장 강력한 매수 신호입니다.",
                "emoji": "🥕"
            },
            {
                "company": "토스 (비바리퍼블리카)",
                "title": "운영자금 조달 목적 제3자배정 유상증자 2,000억 단행",
                "type": "SELL",
                "reason": "신주 대량 발행으로 기존 주주 지분 가치 단기 희석",
                "action_tip": "시설 투자가 아닌 단순 '운영자금' 유증은 회사 곳간이 비었다는 방증!",
                "emoji": "💙"
            }
        ]

        if GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GEMINI_API_KEY)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = """
당신은 Easy-DART 실전 투자 심사관 게임을 위한 공시 출제위원입니다.
20대에게 친숙한 유니콘/소비 기업(올리브영, 다이소, 무신사, 배민, 당근, 토스 등)의 현실적인 공시 1개를 창작해주세요.
반드시 아래 JSON 형식으로만 답하세요:
{
  "company": "기업명",
  "title": "공시 제목 (예: 제3자배정 유상증자 1,000억 결정)",
  "type": "BUY 또는 SELL",
  "reason": "20대 눈높이 1줄 판정 이유",
  "action_tip": "투자 심사관 꿀팁 1줄",
  "emoji": "대표 이모지"
}
"""
                response = await model.generate_content_async(prompt)
                text = response.text.strip()
                if "{" in text and "}" in text:
                    json_str = text[text.find("{"):text.rfind("}")+1]
                    return json.loads(json_str)
            except Exception:
                pass

        return random.choice(sample_scenarios)

