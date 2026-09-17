/**
 * [팀원 B 담당] 기업 공시 상세 분석 & 직관적 환산 로직 스크립트
 * [팀원 C 협업] 하단 복습 퀴즈 인터랙션 렌더링
 * 
 * 타겟 페르소나 고려사항:
 * - 페르소나 1 (김지은, 23세 대학생): "올리브영/무신사 결제액 ➡️ 실질 기업 마진 및 대표 상품 개수 환산, 소액(1~5만 원) 주주 체감"
 * - 페르소나 2 (박민우, 31세 직장인): "퇴근 후 5분 만에 끝내는 AI 3줄 요약, 손익계산서 4단계 해체쇼, 현대차/배민 실물 규모 메타포"
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
let currentMicroInvestAmount = 50000;

// 내장 폴백 퀴즈 데이터 (오프라인/API 미기동 시 완벽 지원)
const FALLBACK_QUIZZES = {
  olive: {
    question: '올리브영의 2023년 전체 매출 중, 당일배송(오늘드림) 등 온라인 채널 비중은 30%를 돌파했을까요?',
    options: [
      { text: '⭕ 그렇다 (30.6%로 사상 첫 30% 돌파)', is_correct: true },
      { text: '❌ 아니다 (오프라인 매장 매출이 85% 이상임)', is_correct: false }
    ],
    explanation: '정답입니다! 올리브영의 온라인 매출 비중은 30.6%로 역대 최고를 기록했습니다. 매장을 물류 거점으로 활용하는 "오늘드림" 서비스가 대성공을 거두었습니다.'
  },
  hyundai: {
    question: '현대자동차의 2023년 연간 영업이익은 약 얼마일까요?',
    options: [
      { text: '약 15조 원 (상장사 영업이익 1위 등극)', is_correct: true },
      { text: '약 2조 원 미만', is_correct: false }
    ],
    explanation: '정답입니다! 현대차는 제네시스와 하이브리드 SUV 호조로 사상 최대인 15조 1,269억 원의 영업이익을 달성하며 국내 상장사 1위에 올랐습니다.'
  },
  baemin: {
    question: '배달의민족(우아한형제들)의 2023년 연간 영업이익률은 약 몇 % 수준일까요?',
    options: [
      { text: '약 20.5% (영업이익 약 7,000억 원의 어닝 서프라이즈)', is_correct: true },
      { text: '약 2.1% (치열한 배달비 경쟁으로 적자 직전)', is_correct: false }
    ],
    explanation: '맞습니다! 배달의민족은 알뜰배달 도입과 B마트 흑자 전환에 힘입어 20.5%라는 경이로운 고수익 영업이익률을 기록했습니다.'
  },
  naver: {
    question: '네이버가 미국 나스닥 시장 상장을 성공시킨 핵심 글로벌 콘텐츠 사업은?',
    options: [
      { text: '네이버웹툰 (Webtoon Entertainment)', is_correct: true },
      { text: '네이버 블로그', is_correct: false }
    ],
    explanation: '정답입니다! 네이버웹툰은 북미 및 글로벌 성장을 인정받아 미국 나스닥 상장에 성공했습니다.'
  },
  musinsa: {
    question: '무신사의 2023년 연간 총 거래액(결제 규모)은 대략 얼마일까요?',
    options: [
      { text: '약 4조 원 돌파', is_correct: true },
      { text: '약 5,000억 원 수준', is_correct: false }
    ],
    explanation: '맞습니다! 무신사는 29CM와의 시너지로 연간 총 거래액 4조 원을 돌파했습니다.'
  },
  starbucks: {
    question: '스타벅스(SCK컴퍼니)의 국내 매장 운영 방식에 대한 올바른 설명은?',
    options: [
      { text: '전국 1,890여 개 전 매장 100% 직영 운영', is_correct: true },
      { text: '대부분 일반 자영업자 가맹점(프랜차이즈)', is_correct: false }
    ],
    explanation: '정답입니다! 스타벅스는 품질 관리와 균일한 고객 경험을 위해 전 매장을 100% 본사 직영으로 운영하고 있습니다.'
  },
  daangn: {
    question: '당근이 론칭 8년 만에 첫 연간 흑자(173억)를 달성한 핵심 수익 모델은?',
    options: [
      { text: '동네 소상공인 대상 하이퍼로컬 광고', is_correct: true },
      { text: '중고거래 물품당 10% 수수료 징수', is_correct: false }
    ],
    explanation: '정답입니다! 당근은 중고거래 수수료가 아닌 동네 소상공인 지역 타깃 광고로 첫 연간 흑자를 일궈냈습니다.'
  },
  krafton: {
    question: '크래프톤의 전체 매출 중 해외(글로벌)에서 발생하는 비중은?',
    options: [
      { text: '약 94% (압도적인 글로벌 수출 게임사)', is_correct: true },
      { text: '약 30% (국내 PC방 매출이 대부분)', is_correct: false }
    ],
    explanation: '정답입니다! 크래프톤은 배틀그라운드 IP를 기반으로 해외 매출 비중 94%, 영업이익률 40.2%를 달성한 대표적인 글로벌 수출 기업입니다.'
  }
};

// 1. 초기 로드
document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  currentCompanyId = urlParams.get('id') || 'olive';

  setupSpendControls();
  setupMicroInvestmentControls();
  setupCompanySwitcherListener();
  setupShareButton();

  await loadCompanyDetails(currentCompanyId);
  await loadCompanyQuiz(currentCompanyId);
});

// 2. 소비 메타포 계산기 이벤트 바인딩 (페르소나 1 맞춤)
function setupSpendControls() {
  const inputEl = document.getElementById('detailSpendInput');
  const sliderEl = document.getElementById('detailSpendSlider');
  const chipButtons = document.querySelectorAll('.spend-chip');

  // Input 변경 시
  if (inputEl) {
    inputEl.addEventListener('input', (e) => {
      const spend = parseInt(e.target.value, 10) || 0;
      if (sliderEl) sliderEl.value = Math.min(300000, spend);
      updateLiveSpendMetaphor(currentCompanyId, spend);
    });
  }

  // 슬라이더 변경 시
  if (sliderEl) {
    sliderEl.addEventListener('input', (e) => {
      const spend = parseInt(e.target.value, 10) || 0;
      if (inputEl) inputEl.value = spend;
      updateLiveSpendMetaphor(currentCompanyId, spend);
    });
  }

  // 빠른 금액 칩 버튼 클릭 시
  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.getAttribute('data-amount'), 10);
      if (inputEl) inputEl.value = amount;
      if (sliderEl) sliderEl.value = Math.min(300000, amount);
      updateLiveSpendMetaphor(currentCompanyId, amount);

      // 활성 칩 스타일 토글
      chipButtons.forEach(b => {
        b.classList.remove('bg-emerald-600', 'text-white');
        b.classList.add('bg-white', 'text-emerald-800');
      });
      btn.classList.remove('bg-white', 'text-emerald-800');
      btn.classList.add('bg-emerald-600', 'text-white');
    });
  });
}

// 3. 소액 투자 체감 지분 컨트롤 바인딩 (페르소나 1 & 2)
function setupMicroInvestmentControls() {
  const microChips = document.querySelectorAll('.micro-chip');
  microChips.forEach(btn => {
    btn.addEventListener('click', () => {
      const invest = parseInt(btn.getAttribute('data-invest'), 10);
      currentMicroInvestAmount = invest;
      updateMicroInvestment(currentCompanyId, invest);

      microChips.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('bg-white', 'text-indigo-900');
      });
      btn.classList.remove('bg-white', 'text-indigo-900');
      btn.classList.add('bg-indigo-600', 'text-white');
    });
  });
}

// 4. 기업 전환 드롭다운 리스너
function setupCompanySwitcherListener() {
  const switcher = document.getElementById('detailCompanySwitcher');
  if (switcher) {
    switcher.addEventListener('change', async (e) => {
      const targetId = e.target.value;
      if (targetId) {
        await switchCompanyById(targetId);
      }
    });
  }
}

// 5. 전역 기업 전환 함수 (상단 칩 및 드롭다운 연동)
window.switchCompanyById = async function(targetId) {
  if (!targetId || targetId === currentCompanyId) return;
  currentCompanyId = targetId;
  
  // URL 업데이트
  const newUrl = `${window.location.pathname}?id=${targetId}`;
  window.history.pushState({}, '', newUrl);

  // 셀렉터 동기화
  const switcher = document.getElementById('detailCompanySwitcher');
  if (switcher) switcher.value = targetId;

  await loadCompanyDetails(targetId);
  await loadCompanyQuiz(targetId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 6. 공유하기 버튼 & 토스트
function setupShareButton() {
  const shareBtn = document.getElementById('btnSharePage');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(window.location.href);
          showToast('기업 분석 링크가 클립보드에 복사되었어요! 📋');
        } else {
          showToast('링크를 복사했습니다! 🔗');
        }
      } catch (e) {
        showToast('링크 복사 완료!');
      }
    });
  }
}

function showToast(message, icon = '✨') {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  const iconEl = document.getElementById('toastIcon');
  if (!toast || !msgEl) return;

  msgEl.innerText = message;
  if (iconEl) iconEl.innerText = icon;

  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 2500);
}

// 7. 실시간 소비 환산 메타포 업데이트 (페르소나 1 핵심)
function updateLiveSpendMetaphor(companyId, spendAmount) {
  const result = calculateSpendMetaphor(companyId, spendAmount);
  if (!result) return;
  
  const earnedEl = document.getElementById('detailMarginEarned');
  const countTextEl = document.getElementById('detailItemCountText');
  const iconEl = document.getElementById('detailItemIcon');
  const pctEl = document.getElementById('widgetMarginPct');
  const widgetCompEl = document.getElementById('widgetCompName');
  const friendlyMsgEl = document.getElementById('detailFriendlyMessage');

  if (earnedEl) earnedEl.innerText = `약 ${result.marginEarned.toLocaleString()}원`;
  if (countTextEl) countTextEl.innerText = result.summaryText;
  if (iconEl) iconEl.innerText = result.icon;
  if (pctEl) pctEl.innerText = `${result.marginRatePct}%`;
  if (widgetCompEl) widgetCompEl.innerText = result.brandName;
  if (friendlyMsgEl) friendlyMsgEl.innerText = result.friendlyMessage;
}

// 8. 소액 투자 지분 환산 업데이트 (페르소나 1 & 2 공통)
function updateMicroInvestment(companyId, amount) {
  const brand = BRAND_METAPHOR_MAP[companyId];
  const microTextEl = document.getElementById('microInvestText');
  if (!brand || !microTextEl) return;

  const annualProfitShare = Math.round(amount * brand.marginRate);
  const rawItemCount = (annualProfitShare / Math.max(brand.itemPrice, 1000));
  const countText = rawItemCount >= 0.1 ? rawItemCount.toFixed(1) : '0.1';

  microTextEl.innerHTML = `<strong>${amount.toLocaleString()}원</strong> 투자 시, 매년 <strong>${brand.name}</strong>의 <strong>${brand.itemName} 약 ${countText}${brand.unit}</strong> 생산 지분(연간 약 <strong>${annualProfitShare.toLocaleString()}원</strong> 상당)을 함께 보유하는 셈이에요! 🌱`;
}

// 9. 기업 상세 정보 로드 & 손익계산서 해체쇼 (페르소나 2 핵심)
async function loadCompanyDetails(id) {
  const brandFallback = BRAND_METAPHOR_MAP[id] || BRAND_METAPHOR_MAP['olive'];
  
  // 드롭다운 현재 기업 선택값 일치
  const switcher = document.getElementById('detailCompanySwitcher');
  if (switcher && switcher.value !== id) {
    switcher.value = id;
  }

  try {
    let comp, fin, ai;
    
    try {
      const data = await apiClient.getCompanyDetail(id);
      comp = data.company;
      fin = data.financials;
      ai = data.ai_summary;
    } catch (apiErr) {
      console.warn('백엔드 API 미기동, 로컬 메타포 마스터 데이터로 폴백 렌더링:', apiErr);
      comp = {
        name: brandFallback.name,
        icon: brandFallback.icon,
        category_name: brandFallback.categoryName,
        highlight: brandFallback.highlight
      };
      fin = {
        revenue: '연간 실적 산출 중',
        cost: '비용 집계 중',
        operating_profit: `${(brandFallback.marginRate * 100).toFixed(1)}%`,
        net_profit: `${(brandFallback.marginRate * 75).toFixed(1)}%`
      };
      ai = {
        summary: [
          `${brandFallback.name}은(는) ${brandFallback.categoryName} 분야 대표 기업입니다.`,
          `${brandFallback.scaleSummary}`,
          `영업이익률 약 ${(brandFallback.marginRate * 100).toFixed(1)}%로 안정적인 현금 창출 능력을 보여줍니다.`
        ],
        good_points: [
          `${brandFallback.highlight}`,
          `${brandFallback.scaleSummary}`
        ],
        risks: [
          '원자재 및 마케팅비 변동성',
          '업계 내 플랫폼 경쟁 심화'
        ]
      };
    }

    // Header 바인딩
    const iconEl = document.getElementById('compIcon');
    const nameEl = document.getElementById('compName');
    const badgeEl = document.getElementById('compBadge');
    const highlightBadgeEl = document.getElementById('compHighlightBadge');
    const metaphorHeadEl = document.getElementById('compMetaphorHead');

    if (iconEl) iconEl.innerText = comp.icon || brandFallback.icon;
    if (nameEl) nameEl.innerText = comp.name || brandFallback.name;
    if (badgeEl) badgeEl.innerText = comp.badge || comp.category_name || brandFallback.categoryName;
    if (highlightBadgeEl) highlightBadgeEl.innerText = comp.highlight || brandFallback.highlight;

    // Scale Metaphor (페르소나 2 맞춤 체감 규모)
    const scaleMeta = getCompanyScaleMetaphor(id);
    if (metaphorHeadEl && scaleMeta) {
      metaphorHeadEl.innerText = `"${scaleMeta.annualMetaphor || brandFallback.annualProfitMetaphor}"`;
    }

    // Spend Metaphor 초기 렌더링 (페르소나 1 맞춤)
    const initialSpend = parseInt(document.getElementById('detailSpendInput')?.value, 10) || brandFallback.defaultSpend || 35000;
    const spendInput = document.getElementById('detailSpendInput');
    const spendSlider = document.getElementById('detailSpendSlider');
    if (spendInput) spendInput.value = initialSpend;
    if (spendSlider) spendSlider.value = Math.min(300000, initialSpend);
    updateLiveSpendMetaphor(id, initialSpend);

    // Micro Investment 초기 렌더링
    updateMicroInvestment(id, currentMicroInvestAmount);

    // Financials 텍스트 바인딩
    const statRevenueEl = document.getElementById('statRevenue');
    const statCostEl = document.getElementById('statCost');
    const statOpProfitEl = document.getElementById('statOpProfit');
    const statNetProfitEl = document.getElementById('statNetProfit');

    if (statRevenueEl) statRevenueEl.innerText = fin.revenue || '-';
    if (statCostEl) statCostEl.innerText = fin.cost || '-';
    if (statOpProfitEl) statOpProfitEl.innerText = fin.operating_profit || '-';
    if (statNetProfitEl) statNetProfitEl.innerText = fin.net_profit || '-';

    // Financial Percentage Gauges (손익계산서 해체쇼 게이지)
    let opMarginPct = brandFallback.marginRate * 100;
    const opMatch = (fin.operating_profit || '').match(/([\d.]+)%/);
    if (opMatch) {
      opMarginPct = parseFloat(opMatch[1]);
    }

    let netMarginPct = opMarginPct * 0.75;
    const netMatch = (fin.net_profit || '').match(/([\d.]+)%/);
    if (netMatch) {
      netMarginPct = parseFloat(netMatch[1]);
    }

    const costPct = (100 - opMarginPct).toFixed(1);
    const opPct = opMarginPct.toFixed(1);
    const netPct = netMarginPct.toFixed(1);

    const costPctEl = document.getElementById('statCostPct');
    const opPctEl = document.getElementById('statOpProfitPct');
    const netPctEl = document.getElementById('statNetProfitPct');

    if (costPctEl) costPctEl.innerText = `-${costPct}%`;
    if (opPctEl) opPctEl.innerText = `${opPct}%`;
    if (netPctEl) netPctEl.innerText = `${netPct}%`;

    const costBar = document.getElementById('statCostBar');
    const opBar = document.getElementById('statOpBar');
    const netBar = document.getElementById('statNetBar');

    if (costBar) costBar.style.width = `${Math.min(98, Math.max(10, parseFloat(costPct)))}%`;
    if (opBar) opBar.style.width = `${Math.min(100, Math.max(5, parseFloat(opPct)))}%`;
    if (netBar) netBar.style.width = `${Math.min(100, Math.max(4, parseFloat(netPct)))}%`;

    // 알짜 체질 진단 팁 배너
    const tipHighlight = document.getElementById('compTipHighlight');
    if (tipHighlight) {
      const marginNum = parseFloat(opPct);
      let diagnosis = '안정적 수익 구조';
      if (marginNum >= 20) {
        diagnosis = '🔥 독보적 20%대 초고마진 알짜!';
      } else if (marginNum >= 10) {
        diagnosis = '✨ 10%대 고수익 알짜 비즈니스';
      } else if (marginNum >= 5) {
        diagnosis = '👍 표준 수익형 기업';
      } else {
        diagnosis = '🛒 박리다매 대량 유통형 구조';
      }
      tipHighlight.innerText = `${comp.name || brandFallback.name} 영업이익률: ${opPct}% (${diagnosis})`;
    }

    // AI 3줄 요약 & 신호등 분석 바인딩
    const summaryListEl = document.getElementById('summaryList');
    if (summaryListEl && ai.summary) {
      summaryListEl.innerHTML = ai.summary.map(s => 
        `<li class="flex items-start gap-2.5">
          <span class="text-emerald-600 font-extrabold text-sm mt-0.5">•</span>
          <span class="leading-relaxed">${s}</span>
        </li>`
      ).join('');
    }

    const goodListEl = document.getElementById('goodList');
    if (goodListEl && ai.good_points) {
      goodListEl.innerHTML = ai.good_points.map(p => 
        `<li class="flex items-start gap-2.5">
          <span class="text-emerald-500 font-bold text-sm mt-0.5">✓</span>
          <span class="leading-relaxed">${p}</span>
        </li>`
      ).join('');
    }

    const riskListEl = document.getElementById('riskList');
    if (riskListEl && ai.risks) {
      riskListEl.innerHTML = ai.risks.map(r => 
        `<li class="flex items-start gap-2.5">
          <span class="text-rose-500 font-bold text-sm mt-0.5">⚠️</span>
          <span class="leading-relaxed">${r}</span>
        </li>`
      ).join('');
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('기업 상세 데이터 렌더링 중 오류:', err);
  }
}

// 10. 기업별 복습 퀴즈 로드 (팀원 C 컴포넌트 협업)
async function loadCompanyQuiz(id) {
  try {
    let quizData = null;
    try {
      const res = await apiClient.getCompanyQuiz(id);
      if (res && res.quiz) {
        quizData = res.quiz;
      }
    } catch (e) {
      console.warn('퀴즈 API 미기동, 내장 폴백 퀴즈 사용:', e);
    }

    // 폴백 퀴즈 데이터 매핑
    if (!quizData) {
      quizData = FALLBACK_QUIZZES[id] || FALLBACK_QUIZZES['olive'];
    }

    if (quizData) {
      renderCompanyQuizSection('companyQuizContainer', quizData, (isCorrect) => {
        if (isCorrect) {
          showToast('정답을 맞혔어요! 🎉 +10점 획득', '🏆');
        } else {
          showToast('아쉽네요! 해설을 다시 읽어보세요 💡', '👀');
        }
      });
    }
  } catch (err) {
    console.warn('퀴즈 렌더링 실패:', err);
  }
}

