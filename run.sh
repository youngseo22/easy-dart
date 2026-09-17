#!/usr/bin/env bash

# Easy-DART 백엔드 실행 스크립트 (가상환경 자동 관리)

echo "🚀 [Easy-DART] 백엔드 서버 환경 구성 및 실행 중..."

# backend 디렉토리로 이동
cd "$(dirname "$0")/backend" || exit

# 1. 가상환경(venv) 확인 및 없으면 자동 생성
if [ ! -d "venv" ] && [ ! -d "../venv" ]; then
    echo "📦 가상환경(venv)이 감지되지 않아 새로 생성합니다..."
    if command -v python &> /dev/null; then
        python -m venv venv
    elif command -v python3 &> /dev/null; then
        python3 -m venv venv
    elif command -v py &> /dev/null; then
        py -m venv venv
    else
        echo "❌ 파이썬이 설치되어 있지 않습니다. Python을 설치해주세요."
        exit 1
    fi
    echo "✅ 가상환경(venv) 생성 완료!"
fi

# 2. 가상환경 활성화
if [ -d "venv" ]; then
    echo "⚡ 가상환경(backend/venv) 활성화 중..."
    if [ -f "venv/Scripts/activate" ]; then
        source venv/Scripts/activate
    elif [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
elif [ -d "../venv" ]; then
    echo "⚡ 상위 가상환경(venv) 활성화 중..."
    if [ -f "../venv/Scripts/activate" ]; then
        source ../venv/Scripts/activate
    elif [ -f "../venv/bin/activate" ]; then
        source ../venv/bin/activate
    fi
fi

# 3. 필수 패키지 설치 및 동기화
echo "📥 필요한 패키지 설치 및 동기화 중 (requirements.txt)..."
pip install -r requirements.txt --quiet

# 4. FastAPI 서버 실행 (uvicorn)
echo "✨ [Easy-DART] 서버가 가상환경에서 성공적으로 시작되었습니다!"
echo "👉 기업 목록: http://localhost:8080/company-list"
echo "👉 기업 상세: http://localhost:8080/company-details"
echo "👉 퀴즈: http://localhost:8080/quiz"
echo "👉 API 문서: http://localhost:8080/docs"
echo "----------------------------------------------------"

uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
