FROM python:3.11-slim

# 작업 디렉토리 설정
WORKDIR /app

# 시스템 필수 유틸리티 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# requirements.txt 복사 및 의존성 패키지 설치 (캐시 활용)
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# 프로젝트 전체 소스 코드 복사 (frontend, company_data, backend 등)
COPY . .

# Python 모듈 경로 및 포트 환경변수 설정
ENV PYTHONPATH=/app/backend:$PYTHONPATH
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Cloud Run 실행 (PORT 환경변수를 동적으로 주입받아 uvicorn 실행)
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
