/**
 * [공통] 백엔드 FastAPI 서버와 통신하는 API 클라이언트 모듈
 */
const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = {
  // 기업 목록 및 상세 (팀원 A & B)
  async getCompanies(category = 'all', query = '') {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query) params.append('query', query);
    
    const res = await fetch(`${API_BASE_URL}/companies?${params.toString()}`);
    return res.json();
  },

  async getCompanyDetail(companyId) {
    const res = await fetch(`${API_BASE_URL}/companies/${companyId}`);
    return res.json();
  },

  // 퀴즈 API (팀원 C)
  async getBasicTermQuizzes(topic = 'all', limit = null) {
    const params = new URLSearchParams();
    if (topic && topic !== 'all') params.append('topic', topic);
    if (limit) params.append('limit', limit);
    
    const res = await fetch(`${API_BASE_URL}/quiz/basic?${params.toString()}`);
    return res.json();
  },

  async getInfiniteQuizzes(topic = 'all', batchSize = 10, excludeIds = []) {
    const params = new URLSearchParams();
    if (topic && topic !== 'all') params.append('topic', topic);
    if (batchSize) params.append('batch_size', batchSize);
    if (excludeIds && excludeIds.length > 0) params.append('exclude_ids', excludeIds.join(','));

    const res = await fetch(`${API_BASE_URL}/quiz/infinite?${params.toString()}`);
    return res.json();
  },

  async getCompanyQuiz(companyId) {
    const res = await fetch(`${API_BASE_URL}/quiz/company/${companyId}`);
    return res.json();
  },

  // 팀원 C 인게임 AI API
  async getAIDebrief(missedItems, gameTitle = '아케이드 게임') {
    const res = await fetch(`${API_BASE_URL}/quiz/ai-debrief`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missed_items: missedItems, game_title: gameTitle })
    });
    return res.json();
  },

  async getAIScenario(category = 'mix') {
    const res = await fetch(`${API_BASE_URL}/quiz/ai-scenario?category=${category}`);
    return res.json();
  }
};

