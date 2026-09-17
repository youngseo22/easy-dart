/**
 * [팀원 B 담당] 기업 공시 상세 분석 & 환산 로직 스크립트
 * [팀원 C 협업] 하단 퀴즈 인터랙션 렌더링
 */
import { apiClient } from '../../api/client.js';
import { renderCompanyQuizSection } from '../../components/company_quiz.js';
import { 
  calculateSpendMetaphor, 
  getCompanyScaleMetaphor, 
  calculateMicroInvestmentMetaphor, 
  BRAND_METAPHOR_MAP 
} from '../../utils/metaphor_calculator.js';

let currentCompanyId = 'olive';

document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  currentCompanyId = urlParams.get('id') || 'olive';

  setupSpendInputListener();
  setupCompanySwitcherListener();
  await loadCompanyDetails(currentCompanyId);
  await loadCompanyQuiz(currentCompanyId);
});

function setupSpendInputListener() {
  const inputEl = document.getElementById('detailSpendInput');
  if (inputEl) {
    inputEl.addEventListener('input', (e) => {
      const spend = parseInt(e.target.value, 10) || 0;
      updateLiveSpendMetaphor(currentCompanyId, spend);
    });
  }
}

function setupCompanySwitcherListener() {
  const switcher = document.getElementById('detailCompanySwitcher');
  if (switcher) {
    switcher.addEventListener('change', async (e) => {
      const targetId = e.target.value;
      if (targetId) {
        currentCompanyId = targetId;
        const newUrl = `${window.location.pathname}?id=${targetId}`;
        window.history.pushState({}, '', newUrl);
        await loadCompanyDetails(targetId);
        await loadCompanyQuiz(targetId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

function updateLiveSpendMetaphor(companyId, spendAmount) {
  const result = calculateSpendMetaphor(companyId, spendAmount);
  
  const earnedEl = document.getElementById('detailMarginEarned');
  const countTextEl = document.getElementById('detailItemCountText');
  const iconEl = document.getElementById('detailItemIcon');
  const pctEl = document.getElementById('widgetMarginPct');
  const widgetCompEl = document.getElementById('widgetCompName');

  if (earnedEl) earnedEl.innerText = `${result.marginEarned.toLocaleString()}원 남김`;
  if (countTextEl) countTextEl.innerText = result.itemCountText;
  if (iconEl) iconEl.innerText = result.itemIcon;
  if (pctEl) pctEl.innerText = `${(result.operatingMargin * 100).toFixed(1)}%`;
  if (widgetCompEl) widgetCompEl.innerText = result.brandName;
}

async function loadCompanyDetails(id) {
  try {
    const data = await apiClient.getCompanyDetail(id);
    const comp = data.company;
    const fin = data.financials;
    const ai = data.ai_summary;

    // Header
    const iconEl = document.getElementById('compIcon');
    const nameEl = document.getElementById('compName');
    const badgeEl = document.getElementById('compBadge');
    const highlightBadgeEl = document.getElementById('compHighlightBadge');
    const metaphorHeadEl = document.getElementById('compMetaphorHead');

    if (iconEl) iconEl.innerText = comp.icon;
    if (nameEl) nameEl.innerText = comp.name;
    if (badgeEl) badgeEl.innerText = comp.category_name;
    if (highlightBadgeEl) highlightBadgeEl.innerText = comp.highlight || '실적 분석';

    // Scale Metaphor (페르소나 2 맞춤)
    const scaleMeta = getCompanyScaleMetaphor(id);
    if (metaphorHeadEl) {
      metaphorHeadEl.innerText = `"${scaleMeta.headline}"`;
    }

    // Spend Metaphor Initial Render (페르소나 1 맞춤)
    const initialSpend = parseInt(document.getElementById('detailSpendInput')?.value, 10) || 35000;
    updateLiveSpendMetaphor(id, initialSpend);

    // Financials
    document.getElementById('statRevenue').innerText = fin.revenue;
    document.getElementById('statCost').innerText = fin.cost;
    document.getElementById('statOpProfit').innerText = fin.operating_profit;
    document.getElementById('statNetProfit').innerText = fin.net_profit;

    // Financial Percentage Gauges
    const revRaw = fin.raw_revenue || 1;
    const costPct = ((fin.raw_cost / revRaw) * 100).toFixed(1);
    const opPct = ((fin.raw_op_profit / revRaw) * 100).toFixed(1);
    const netPct = ((fin.raw_net_profit / revRaw) * 100).toFixed(1);

    const costPctEl = document.getElementById('statCostPct');
    const opPctEl = document.getElementById('statOpProfitPct');
    const netPctEl = document.getElementById('statNetProfitPct');

    if (costPctEl) costPctEl.innerText = `${costPct}%`;
    if (opPctEl) opPctEl.innerText = `${opPct}%`;
    if (netPctEl) netPctEl.innerText = `${netPct}%`;

    const costBar = document.getElementById('statCostBar');
    const opBar = document.getElementById('statOpBar');
    const netBar = document.getElementById('statNetBar');

    if (costBar) costBar.style.width = `${Math.min(100, Math.max(5, costPct))}%`;
    if (opBar) opBar.style.width = `${Math.min(100, Math.max(5, opPct))}%`;
    if (netBar) netBar.style.width = `${Math.min(100, Math.max(5, netPct))}%`;

    const tipHighlight = document.getElementById('compTipHighlight');
    if (tipHighlight) {
      tipHighlight.innerText = `${comp.name}의 영업이익률: ${opPct}% (${parseFloat(opPct) >= 15 ? '고수익 알짜!' : '안정적 구조'})`;
    }

    // Micro Investment Metaphor
    const microInvest = calculateMicroInvestmentMetaphor(id, 50000);
    const microTextEl = document.getElementById('microInvestText');
    if (microTextEl) {
      microTextEl.innerHTML = `5만 원 투자 시, 이 기업의 약 <strong>${microInvest.shareText}</strong>을 소유하는 것과 같아요. (기대 연간 귀속 순이익: <strong>${microInvest.annualEarnedShareText}</strong>)`;
    }

    // AI Summary
    document.getElementById('summaryList').innerHTML = ai.summary.map(s => 
      `<li class="flex items-start gap-2.5"><span class="text-emerald-600 font-extrabold">•</span><span class="leading-relaxed">${s}</span></li>`
    ).join('');

    document.getElementById('goodList').innerHTML = ai.good_points.map(p => 
      `<li class="flex items-start gap-2.5"><span class="text-emerald-500 font-bold">✓</span><span class="leading-relaxed">${p}</span></li>`
    ).join('');

    document.getElementById('riskList').innerHTML = ai.risks.map(r => 
      `<li class="flex items-start gap-2.5"><span class="text-rose-500 font-bold">⚠️</span><span class="leading-relaxed">${r}</span></li>`
    ).join('');

    if (window.lucide) {
      lucide.createIcons();
    }
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

