/**
 * [공통] 백엔드 FastAPI 서버와 통신하는 API 클라이언트 모듈
 */
const API_BASE_URL = '/api';


export const apiClient = {
  // 기업 목록 및 상세 (팀원 A & B)
  async getCompanies(category = 'all', query = '') {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query) params.append('query', query);
    
    const res = await fetch(`${API_BASE_URL}/companies?${params.toString()}`);
    return res.json();
  },

  async getCompanyDetail(companyId, year = '') {
    const url = year ? `${API_BASE_URL}/companies/${companyId}?year=${year}` : `${API_BASE_URL}/companies/${companyId}`;
    const res = await fetch(url);
    return res.json();
  },


  // 퀴즈 API (팀원 C)
  async getBasicTermQuizzes(topic = 'all') {
    const params = new URLSearchParams();
    if (topic && topic !== 'all') params.append('topic', topic);
    
    const res = await fetch(`${API_BASE_URL}/quiz/basic?${params.toString()}`);
    return res.json();
  },

  async getCompanyQuiz(companyId) {
    const res = await fetch(`${API_BASE_URL}/quiz/company/${companyId}`);
    return res.json();
  }
};
