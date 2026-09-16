"""
[팀원 C 담당] 주식 기초 용어 퀴즈 및 기업별 복습 퀴즈 채점/조회 서비스
"""
import json
import os

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
        return quizzes

    @classmethod
    def get_company_quiz(cls, company_id: str):
        data = cls.load_data()
        return data.get("company_quizzes", {}).get(company_id)
