/**
 * [팀원 B & C 담당] 기업 공시 상세 분석 및 하단 퀴즈 인터랙션 스크립트
 */
import { apiClient } from '../../api/client.js';
import { renderCompanyQuizSection } from '../../components/company_quiz.js';

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get('id') || 'olive';

  await loadCompanyDetails(companyId);
  await loadCompanyQuiz(companyId);
});

async function loadCompanyDetails(id) {
  try {
    const data = await apiClient.getCompanyDetail(id);
    const comp = data.company;
    const fin = data.financials;
    const ai = data.ai_summary;

    document.getElementById('compIcon').innerText = comp.icon;
    document.getElementById('compName').innerText = comp.name;
    document.getElementById('compBadge').innerText = comp.category_name;
    document.getElementById('statRevenue').innerText = fin.revenue;
    document.getElementById('statCost').innerText = fin.cost;
    document.getElementById('statOpProfit').innerText = fin.operating_profit;
    document.getElementById('statNetProfit').innerText = fin.net_profit;

    document.getElementById('summaryList').innerHTML = ai.summary.map(s => 
      `<li class="flex items-start gap-2"><span class="text-indigo-500 font-bold">•</span><span>${s}</span></li>`
    ).join('');

    document.getElementById('goodList').innerHTML = ai.good_points.map(p => 
      `<li class="flex items-start gap-2"><span class="text-emerald-500 font-bold">✓</span><span>${p}</span></li>`
    ).join('');

    document.getElementById('riskList').innerHTML = ai.risks.map(r => 
      `<li class="flex items-start gap-2"><span class="text-rose-500 font-bold">⚠️</span><span>${r}</span></li>`
    ).join('');
  } catch (err) {
    console.warn('API 연동 실패, mock 데이터 로드:', err);
  }
}

async function loadCompanyQuiz(id) {
  try {
    const res = await apiClient.getCompanyQuiz(id);
    if (res && res.quiz) {
      renderCompanyQuizSection('companyQuizContainer', res.quiz);
    }
  } catch (err) {
    console.warn('퀴즈 API 연동 실패:', err);
  }
}
