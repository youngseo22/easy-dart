# 📈 Easy-DART (핑거다트)
> **20대 주린이를 위한 체감형 DART 공시 해설, 실전 아케이드 & 주식 용어 퀴즈 플랫폼**

---

## 📌 프로젝트 소개
**Easy-DART**는 난해하고 딱딱한 금융감독원 전자공시시스템(DART) 문서를 20대 사회초년생과 주린이의 눈높이에 맞추어 재해석한 플랫폼입니다.
- 일상 소비 기업(올리브영, 다이소, 스타벅스 등)의 실제 공시를 쉽고 직관적으로 해설합니다.
- 단순 암기식 학습을 탈피하여 **"손끝으로 체감하는 3대 실전 금융 아케이드"**와 **"1분 기초 용어 퀴즈"**를 제공합니다.
- 로그인 없이도 누구나 즐길 수 있는 **브라우저 로컬 랭킹 & 명예의 전당 시스템**을 탑재하였습니다.

---

## 👥 팀원별 담당 영역 (3인 분업)

| 팀원 | 역할 | 주요 담당 디렉토리 및 작업 내용 | 진행 상태 |
| :--- | :--- | :--- | :---: |
| **👤 팀원 A** | **DART 데이터 & AI 백엔드** | `backend/app/services/dart_service.py`, `ai_summary_service.py`, `data/company_mapping.json` | 진행 중 |
| **👤 팀원 B** | **기업 목록 & 상세 UI / 환산 로직** | `company_preview.html`, `company_detail_preview.html`, `frontend/src/utils/metaphor_calculator.js` | 진행 중 |
| **👤 팀원 C (은경)** | **퀴즈 풀스택 & 3대 금융 아케이드 게임** | `frontend/src/pages/quiz_terms/`, `backend/app/api/quiz.py`, `services/quiz_service.py` | **완성 (배포 완료)** |

---

## 🕹️ 팀원 C 게이미피케이션 & 퀴즈 개발 완료 현황

### 1. 3대 실전 금융 아케이드 라인업

| 머신 번호 | 게임 타이틀 | 핵심 플레이 메커니즘 | 실전 교육 효과 | 실행 경로 |
| :--- | :--- | :--- | :--- | :--- |
| **Machine 01** | 🚀 **DART 공시 레이더 미사일** | 위에서 쏟아지는 공시 중 **악재 지뢰(감사의견 거절, 완전자본잠식 등)는 미사일 요격**, **우량 호재(영업흑자, 자사주 소각 등)는 비행선 몸체로 직접 흡수 & 시총 회복**하는 2원화 피아식별 슈팅 | 상장폐지 위험 키워드 즉각 식별력 훈련 | [radar_shooter.html](frontend/src/pages/quiz_terms/radar_shooter.html) |
| **Machine 02** | ⚖️ **DART 실전 투자 심사관** | 올리브영·다이소 등 실제 기업 공시 카드를 정독하고 **◀(손절) vs ▶(매수)** 판정 (3단계 속도 모드 & 3초 번개 판단 보너스) | 인지 부하 없는 심층 독해력 및 가치 판단력 훈련 | [judge.html](frontend/src/pages/quiz_terms/judge.html) |
| **Machine 03** | 🏎️ **DART 급행 레인 러너** | 3차선 고속도로를 질주하며 **▲(전진 가속 부스터), ▼(후진 급제동), ◀ ▶(차선 변경)** 4방향 기동으로 호재 수집 & 악재 지뢰 회피 | 동체 시력과 반사신경 기반 호재/악재 직관 감별 | [runner.html](frontend/src/pages/quiz_terms/runner.html) |

---

### 2. 무계정(No-Login) 실시간 명예의 전당 & 등급 시스템
로그인 절차 없이도 웹 브라우저의 `localStorage`를 활용하여 레트로 오락실 감성의 랭킹 시스템을 구현하였습니다:

1. **게임 종료 시 닉네임 등록**:
   - 게임 오버 모달에서 닉네임을 입력하고 **[기록 저장 🏅]** 클릭 시 브라우저에 최고 기록 영구 보존.
   - 신기록 달성 시 `🔥 최고 기록 갱신!` 배지 활성화.
2. **실시간 명예의 전당 (TOP 5)**:
   - 메인 허브(`quiz_terms/index.html`) 하단에 🥇 1위 ~ 5위 랭킹 전광판 실시간 출력.
   - 내가 달성한 기록에는 시안색 네온 하이라이트와 **`MY` 배지** 부여.
3. **경험치 기반 주린이 자동 승급제**:
   - 누적 점수와 격퇴한 공시 수에 따라 등급 자동 부여:
     - 🐣 `새싹 주린이 (LV.1)`
     - 🔍 `노련한 지뢰 감별사 (LV.2)`
     - 🐜🔥 `날렵한 여의도 불개미 (LV.3)`
     - 👑 `스마트 머니 (LV.MAX)`
4. **상단 닉네임 원클릭 편집**:
   - 메인 화면 상단 `[👤 닉네임: ○○○ ✏️]` 버튼으로 언제든지 닉네임 즉시 변경 가능.

---

### 3. 통합 퀴즈 & 아케이드 허브 (`quiz_terms/index.html`)
팀원 C의 공식 지정 경로(`frontend/src/pages/quiz_terms`) 하나로 모든 기능이 일원화되었습니다:
- **🕹️ DART 실전 오락실 탭**: 3개 게임 캐비닛 선택, 인서트 코인 사운드 이펙트, 실시간 명예의 전당.
- **📚 1분 주식 & 회계 기초 용어 퀴즈 탭**: 손익계산서/감사의견 토픽별 퀴즈 풀이 및 오답노트 해설 (`script.js` 및 백엔드 API 연동).
- URL 해시(`#arcade`, `#quiz`) 딥링크 지원.

---

## 📂 최신 프로젝트 폴더 구조

```text
easy-dart/
├── 📄 GAMIFICATION_PLAN.md        # [팀원 C] 게이미피케이션 마스터 기획서
├── 📄 .env                        # [환경변수] DART, GEMINI API 키 설정 파일
├── 📄 run.sh                      # [Bash] 백엔드 서버 원클릭 실행 스크립트
├── 📄 README.md                   # 프로젝트 전체 문서 및 진행상황 보고서
│
├── 📄 dart_shooter_preview.html   # [단독 프리뷰] 🚀 공시 레이더 미사일 슈팅
├── 📄 judge_preview.html          # [단독 프리뷰] ⚖️ DART 실전 투자 심사관
├── 📄 runner_preview.html         # [단독 프리뷰] 🏎️ DART 급행 레인 러너
├── 📄 game_arcade_preview.html    # [단독 프리뷰] 🕹️ 핑거다트 레트로 오락실 메인
├── 📄 company_preview.html        # [단독 프리뷰] 기업 파헤치기 메인
├── 📄 company_detail_preview.html # [단독 프리뷰] 기업 상세 해설
├── 📄 quiz_preview.html           # [단독 프리뷰] 1분 기초 용어 퀴즈
│
├── 📁 backend/                    # FastAPI 백엔드
│   ├── requirements.txt
│   └── app/
│       ├── main.py                # FastAPI 엔트리포인트 (CORS, 라우터)
│       ├── config.py              # 환경변수 로딩 모듈
│       ├── api/
│       │   ├── companies.py       # [팀원 A & B] 기업 목록/상세 API
│       │   └── quiz.py            # [팀원 C] 퀴즈 & 게임 데이터 조회 API
│       ├── services/
│       │   ├── dart_service.py    # [팀원 A] DART OpenAPI 파싱
│       │   ├── ai_summary_service.py # [팀원 A] LLM 공시 요약
│       │   └── quiz_service.py    # [팀원 C] 퀴즈/게임 데이터셋 제공 서비스
│       └── data/
│           ├── company_mapping.json # 20개 기업 매핑 데이터
│           └── quiz_dataset.json    # 퀴즈 및 공시 데이터셋
│
└── 📁 frontend/                   # 프론트엔드 모듈
    └── src/
        ├── styles/
        │   └── common.css         # 글로벌 공통 디자인 시스템
        ├── api/
        │   └── client.js          # 백엔드 API 클라이언트
        └── pages/
            ├── company_list/      # [팀원 B] 기업 목록 & 소비 환산기
            ├── company_detail/    # [팀원 B] 기업 공시 상세 해설 (손익계산서)
            └── quiz_terms/        # [팀원 C] 🕹️ 실전 아케이드 & 📚 기초 용어 퀴즈 통합 허브
                ├── 📄 index.html                # 듀얼 모드 메인 허브 + 명예의 전당
                ├── 📄 radar_shooter.html         # Machine 01: 공시 레이더 슈팅
                ├── 📄 judge.html                 # Machine 02: 실전 투자 심사관
                ├── 📄 runner.html                # Machine 03: 급행 레인 러너
                ├── 📁 games/
                │   ├── 📄 radar_shooter.js       # 슈팅 캔버스 60fps 코어 엔진
                │   ├── 📄 disclosure_dataset.js  # 호재/악재 실전 공시 데이터셋
                │   └── 📄 ranking_helper.js      # 로컬 랭킹 & 명예의 전당 매니저
                ├── 📄 script.js                  # 1분 용어 퀴즈 모듈 (API 통신)
                └── 📄 style.css                  # 아케이드 네온 & 퀴즈 통합 CSS
```

---

## 🚀 빠른 시작 가이드

### 1. 프론트엔드 바로 즐기기 (추천 ⭐)
프론트엔드 게임 및 퀴즈는 **순수 HTML / CSS / JavaScript**로 제작되어 별도의 파이썬/Node 가상환경 없이 바로 즐기실 수 있습니다:
- 파일 탐색기에서 [`frontend/src/pages/quiz_terms/index.html`](frontend/src/pages/quiz_terms/index.html)을 브라우저(Chrome, Edge 등)로 열거나 VS Code의 **Live Server**로 실행하세요.
- 루트 경로의 단독 프리뷰 파일(`dart_shooter_preview.html`, `judge_preview.html` 등)도 언제든 바로 열어보실 수 있습니다.

### 2. 백엔드 환경변수 설정 (`.env`)
루트 경로의 [`.env`](.env) 파일에 필요한 API 키를 입력합니다 (Git에는 자동 무시됩니다):
```env
DART_API_KEY=your_dart_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
HOST=0.0.0.0
PORT=8000
```

### 3. 백엔드 FastAPI 서버 실행 (`run.sh`)
Git Bash 터미널에서 아래 명령어를 실행하면 가상환경 구성, 패키지 설치, 서버 구동이 자동으로 진행됩니다:
```bash
bash run.sh
```
- 서버 주소: `http://localhost:8000`
- API 문서(Swagger): `http://localhost:8000/docs`