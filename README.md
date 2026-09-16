# 📈 Easy-DART (핑거다트)
> **주린이를 위한 20대 일상 기업 DART 공시 해설 & 주식 용어 퀴즈 플랫폼**

---

## 📂 프로젝트 폴더 구조 & 팀원 R&R

```
easy-dart/
├── 📄 PROJECT_PLAN.md             # 프로젝트 마스터 기획서
├── 📄 .env                        # 환경변수 설정 파일 (DART, GEMINI API 키)
├── 📄 run.sh                      # [Bash] 백엔드 서버 원클릭 실행 스크립트
├── 📄 company_preview.html        # [프리뷰] 기업 파헤치기 메인 화면
├── 📄 company_detail_preview.html # [프리뷰] 기업 공시 상세 해설 & 하단 퀴즈
├── 📄 quiz_preview.html           # [프리뷰] 주식 & 회계 기초 용어 퀴즈
│
├── 📁 backend/                    # FastAPI 백엔드
│   ├── requirements.txt
│   └── app/
│       ├── main.py                # FastAPI 진입점 (CORS, 라우터 연결)
│       ├── config.py              # 환경변수 설정 모듈
│       ├── api/
│       │   ├── companies.py       # [팀원 A & B] 기업 목록/상세 API
│       │   └── quiz.py            # [팀원 C] 주식 용어/기업 퀴즈 API
│       ├── services/
│       │   ├── dart_service.py    # [팀원 A] DART OpenAPI 연동 & 파싱
│       │   ├── ai_summary_service.py # [팀원 A] LLM 3줄요약/리스크 추출
│       │   └── quiz_service.py    # [팀원 C] 퀴즈 생성 및 채점 로직
│       └── data/
│           ├── company_mapping.json # [팀원 A] 20개 기업 매핑 데이터
│           └── quiz_dataset.json    # [팀원 C] 퀴즈 데이터셋
│
└── 📁 frontend/                   # 프론트엔드 (HTML/CSS/JS 모듈 분리)
    └── src/
        ├── styles/
        │   └── common.css         # 공통 디자인 토큰 & 글로벌 스타일
        ├── api/
        │   └── client.js          # 백엔드 연동 API 클라이언트 모듈
        ├── utils/
        │   └── metaphor_calculator.js # [팀원 B] 20개 기업 소비 환산 로직
        ├── components/
        │   └── company_quiz.js    # [팀원 C] 기업 상세 하단 복습 퀴즈 웹 컴포넌트
        └── pages/
            ├── company_list/      # [팀원 B] 1. 메인 기업 목록 & 소비 환산기
            │   ├── index.html
            │   ├── style.css
            │   └── script.js
            ├── company_detail/    # [팀원 B] 2. 기업 공시 상세 해설 (손익계산서)
            │   ├── index.html
            │   ├── style.css
            │   └── script.js
            └── quiz_terms/        # [팀원 C] 3. 주식 & 회계 기초 용어 퀴즈
                ├── index.html
                ├── style.css
                └── script.js
```

---

## 👥 팀원별 담당 영역 (3인 분업)

| 팀원 | 역할 | 주요 담당 디렉토리/파일 |
| :--- | :--- | :--- |
| **👤 팀원 A** | **DART 데이터 & AI 백엔드** | `backend/app/services/dart_service.py`, `ai_summary_service.py`, `data/company_mapping.json` |
| **👤 팀원 B** | **기업 목록 & 상세 UI / 환산 로직** | `company_preview.html`, `company_detail_preview.html`, `frontend/src/utils/metaphor_calculator.js` |
| **👤 팀원 C** | **주식 용어 퀴즈 & 기업 퀴즈 풀스택** | `quiz_preview.html`, `backend/app/api/quiz.py`, `services/quiz_service.py`, `frontend/src/components/company_quiz.js` |

---

## 🚀 빠른 시작 가이드

### 1. 환경변수 설정 (`.env`)
루트 경로의 `.env` 파일에 API 키를 입력합니다:
```env
DART_API_KEY=your_dart_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. 백엔드 서버 원클릭 실행 (`run.sh`)

> ⚠️ **주의 (Windows 사용자):**  
> 윈도우 기본 PowerShell이나 CMD가 아닌, **Git Bash 터미널**에서 실행해야 합니다.  
> *(VS Code 터미널 우측 상단 `+` 옆 드롭다운 ➡️ `Git Bash` 선택)*

```bash
bash run.sh
```

- 가상환경(`venv`)이 없으면 자동으로 생성하고, 패키지 설치 및 서버 구동까지 원클릭으로 진행됩니다.

---

- 🌐 **API Swagger 문서**: `http://localhost:8000/docs`
- 🖥️ **웹 화면 미리보기**: `company_preview.html`, `company_detail_preview.html`, `quiz_preview.html` 파일을 브라우저로 직접 열어 확인하실 수 있습니다.