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
let currentFinancialYear = '2024';

// 1~3단계 스크롤 이동 및 탭 하이라이트 함수
function scrollToSection(stepNumber) {
  const step = parseInt(stepNumber, 10) || 1;
  const targetSection = document.getElementById(`stepSection${step}`);
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateActiveTab(step);
  }
}
window.scrollToSection = scrollToSection;
window.switchMainStep = scrollToSection; // 하위 호환성 유지

// 탭 버튼 활성화 스타일 업데이트
function updateActiveTab(step) {
  [1, 2, 3].forEach(s => {
    const btn = document.getElementById(`tabBtnStep${s}`);
    if (btn) {
      const badge = btn.querySelector('.step-num-badge');
      if (s === step) {
        btn.className = 'step-tab-btn active flex-1 py-3 px-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all';
        if (badge) {
          badge.className = 'step-num-badge w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-xs';
        }
      } else {
        btn.className = 'step-tab-btn flex-1 py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer transition-all';
        if (badge) {
          badge.className = 'step-num-badge w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-black shadow-xs';
        }
      }
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}
window.updateActiveTab = updateActiveTab;

// 스크롤 위치 기반 스크롤 스파이 (Scroll Spy)
function setupScrollSpy() {
  const sections = [1, 2, 3].map(s => document.getElementById(`stepSection${s}`)).filter(Boolean);
  
  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const stepNum = parseInt(id.replace('stepSection', ''), 10);
        if (stepNum) {
          updateActiveTab(stepNum);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

// 1단계: 3대 공시 서류 인터랙티브 프리뷰 렌더러
const DOC_PREVIEW_DATA = {
  IS: {
    badge: '손익계산서 (IS : Income Statement)',
    badgeColor: 'bg-emerald-600',
    title: '연결 포괄손익계산서 (DART 실제 공시 양식)',
    tipBg: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    tipText: '<strong>손익계산서 핵심 포인트:</strong> 매출이 늘어나는 것도 중요하지만, 본업의 실력인 <strong>"영업이익"</strong>과 최종 알짜 이익인 <strong>"당기순이익"</strong>이 매년 우상향하는지 확인하는 것이 가장 중요해요!',
    html: `
      <div class="border-b border-slate-200 pb-2 mb-2 flex justify-between items-center text-[11px] font-bold text-slate-500">
        <span>과목 (계정과목)</span>
        <div class="flex gap-8">
          <span>당기 (2024년)</span>
          <span>전기 (2023년)</span>
        </div>
      </div>
      <div class="space-y-1.5 leading-tight text-[11.5px]">
        <div class="flex justify-between items-center py-1 px-2 rounded bg-sky-50 text-sky-950 font-bold border border-sky-200">
          <span class="flex items-center gap-1"><span>Ⅰ.</span> <span>매출액 (총 결제액)</span></span>
          <span class="font-mono font-black">3,868,236 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>Ⅱ. 매출원가 (상품 떼온 값)</span>
          <span class="font-mono">2,154,200 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-700 font-semibold">
          <span>Ⅲ. 매출총이익 (원가 뺀 이익)</span>
          <span class="font-mono font-bold">1,714,036 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>Ⅳ. 판매비와관리비 (임대료/알바비/배송비)</span>
          <span class="font-mono">1,248,310 백만원</span>
        </div>
        <div class="flex justify-between items-center py-1 px-2 rounded bg-amber-50 text-amber-950 font-bold border border-amber-200">
          <span class="flex items-center gap-1"><span>Ⅴ.</span> <span>영업이익 (본업 알짜 이익) 👑</span></span>
          <span class="font-mono font-black text-amber-900">465,726 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>Ⅵ. 금융수익 및 기타이익/손실</span>
          <span class="font-mono">+12,500 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>Ⅶ. 법인세비용 (세금)</span>
          <span class="font-mono">112,040 백만원</span>
        </div>
        <div class="flex justify-between items-center py-1 px-2 rounded bg-emerald-100 text-emerald-950 font-black border border-emerald-300">
          <span class="flex items-center gap-1"><span>Ⅷ.</span> <span>당기순이익 (최종 금고에 남은 돈) ⭐</span></span>
          <span class="font-mono text-emerald-800">366,186 백만원</span>
        </div>
      </div>
    `
  },
  BS: {
    badge: '재무상태표 (BS : Balance Sheet)',
    badgeColor: 'bg-blue-600',
    title: '연결 재무상태표 (DART 실제 공시 양식)',
    tipBg: 'bg-blue-50 border-blue-200 text-blue-950',
    tipText: '<strong>재무상태표 핵심 공식:</strong> <strong>자산(전체) = 부채(빚) + 자본(순수 내 돈)</strong>! 부채비율(부채 ÷ 자본)이 200% 이하로 안정적인지, 매년 이익이 쌓여 자본이 불어나는지가 핵심이에요.',
    html: `
      <div class="border-b border-slate-200 pb-2 mb-2 flex justify-between items-center text-[11px] font-bold text-slate-500">
        <span>자산 / 부채 / 자본 구성</span>
        <div class="flex gap-8">
          <span>당기 (2024년)</span>
          <span>전기 (2023년)</span>
        </div>
      </div>
      <div class="space-y-1.5 leading-tight text-[11.5px]">
        <div class="flex justify-between items-center py-1 px-2 rounded bg-blue-50 text-blue-950 font-bold border border-blue-200">
          <span class="flex items-center gap-1"><span>Ⅰ.</span> <span>자산총계 (회사의 모든 재산)</span></span>
          <span class="font-mono font-black">2,410,500 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>ㆍ유동자산 (1년 내 현금화 가능 자산)</span>
          <span class="font-mono">1,120,300 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>ㆍ비유동자산 (매장 설비/물류센터/부동산)</span>
          <span class="font-mono">1,290,200 백만원</span>
        </div>
        <div class="flex justify-between items-center py-1 px-2 rounded bg-rose-50 text-rose-950 font-bold border border-rose-200 mt-1">
          <span class="flex items-center gap-1"><span>Ⅱ.</span> <span>부채총계 (갚아야 할 빚) 💳</span></span>
          <span class="font-mono font-black text-rose-700">1,340,200 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-slate-500 pl-4">
          <span>ㆍ유동부채 (1년 내 갚을 외상/단기채무)</span>
          <span class="font-mono">980,100 백만원</span>
        </div>
        <div class="flex justify-between items-center py-1 px-2 rounded bg-emerald-50 text-emerald-950 font-bold border border-emerald-300 mt-1">
          <span class="flex items-center gap-1"><span>Ⅲ.</span> <span>자본총계 (진짜 순수한 내 돈) 💰</span></span>
          <span class="font-mono font-black text-emerald-800">1,070,300 백만원</span>
        </div>
        <div class="flex justify-between items-center py-0.5 px-2 text-emerald-700 font-semibold pl-4">
          <span>ㆍ이익잉여금 (그동안 장사해 쌓아둔 순이익)</span>
          <span class="font-mono font-bold">950,200 백만원</span>
        </div>
      </div>
    `
  },
  CF: {
    badge: '현금흐름표 (CF : Cash Flow)',
    badgeColor: 'bg-purple-600',
    title: '연결 현금흐름표 (DART 실제 공시 양식)',
    tipBg: 'bg-purple-50 border-purple-200 text-purple-950',
    tipText: '<strong>현금흐름표 황금 패턴:</strong> 가장 우량한 기업은 <strong>영업(+) / 투자(-) / 재무(-)</strong> 조합입니다. 본업으로 현금을 넉넉히 벌어(+), 미래 성장을 위해 적극 투자하고(-), 빚을 갚아나가는(-) 구조예요.',
    html: `
      <div class="border-b border-slate-200 pb-2 mb-2 flex justify-between items-center text-[11px] font-bold text-slate-500">
        <span>현금 흐름 3대 활동</span>
        <div class="flex gap-8">
          <span>당기 (2024년)</span>
          <span>상태 평가</span>
        </div>
      </div>
      <div class="space-y-1.5 leading-tight text-[11.5px]">
        <div class="flex justify-between items-center py-1.5 px-2 rounded bg-emerald-50 text-emerald-950 font-bold border border-emerald-200">
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-600 text-base">🟢</span>
            <span>1. 영업활동 현금흐름 (장사로 번 현금)</span>
          </div>
          <span class="font-mono font-black text-emerald-700">+512,400 백만원 (플러스 👍)</span>
        </div>
        <div class="flex justify-between items-center py-1.5 px-2 rounded bg-sky-50 text-sky-950 font-bold border border-sky-200">
          <div class="flex items-center gap-1.5">
            <span class="text-sky-600 text-base">🔵</span>
            <span>2. 투자활동 현금흐름 (설비/미래 투자)</span>
          </div>
          <span class="font-mono font-black text-sky-700">-185,300 백만원 (미래 투자 👍)</span>
        </div>
        <div class="flex justify-between items-center py-1.5 px-2 rounded bg-indigo-50 text-indigo-950 font-bold border border-indigo-200">
          <div class="flex items-center gap-1.5">
            <span class="text-indigo-600 text-base">🟣</span>
            <span>3. 재무활동 현금흐름 (차입금 상환/배당)</span>
          </div>
          <span class="font-mono font-black text-indigo-700">-120,500 백만원 (빚 상환/배당 👍)</span>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center px-2 py-1 bg-purple-50 rounded text-purple-950 font-black">
          <span>기말의 현금및현금성자산 (통장 잔고)</span>
          <span class="font-mono text-purple-800">428,900 백만원</span>
        </div>
      </div>
    `
  }
};

function selectDocType(type) {
  const docKey = type && DOC_PREVIEW_DATA[type] ? type : 'IS';
  const data = DOC_PREVIEW_DATA[docKey];

  // 좌측 3개 카드 활성화 상태 토글
  ['IS', 'BS', 'CF'].forEach(k => {
    const card = document.getElementById(`docCard${k}`);
    if (card) {
      if (k === docKey) {
        card.className = 'doc-card selected cursor-pointer p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-xs space-y-2 transition-all';
      } else {
        card.className = 'doc-card cursor-pointer p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 space-y-2 transition-all';
      }
    }
  });

  // 우측 프리뷰 내용 교체
  const badgeEl = document.getElementById('docPreviewBadge');
  const contentEl = document.getElementById('docPreviewContent');
  const tipEl = document.getElementById('docPreviewTip');
  const tipTextEl = document.getElementById('docPreviewTipText');

  if (badgeEl) {
    badgeEl.textContent = data.badge;
    badgeEl.className = `px-2.5 py-1 ${data.badgeColor} text-white text-[11px] font-black rounded-lg shadow-2xs`;
  }
  if (contentEl) {
    contentEl.innerHTML = data.html;
  }
  if (tipEl) {
    tipEl.className = `p-3.5 rounded-xl ${data.tipBg} text-xs font-medium leading-relaxed flex items-start gap-2.5`;
  }
  if (tipTextEl) {
    tipTextEl.innerHTML = data.tipText;
  }
}
window.selectDocType = selectDocType;

// 1단계 내 4대 핵심 카드 선택 인터랙션 함수
function selectStatCard(index) {
  const cardIdx = parseInt(index, 10) || 4;
  
  // 1~4번 카드 스타일 토글
  [1, 2, 3, 4].forEach(i => {
    const card = document.getElementById(`statCard${i}`);
    if (card) {
      card.classList.remove('selected', 'selected-1', 'selected-2', 'selected-3', 'selected-4');
      if (i === cardIdx) {
        card.classList.add('selected', `selected-${i}`);
      }
    }
  });

  // 하단 해석 텍스트 동적 교체
  const insightEl = document.getElementById('compOpInsightText');
  const highlightEl = document.getElementById('compTipHighlight');

  const cardInsights = {
    1: {
      insight: '손님이 결제한 총매출 규모예요. 매출이 전년 대비 지속 성장하고 있다면 브랜드의 시장 점유율과 제품 인기가 계속 확장되고 있다는 강력한 신호입니다.',
      highlight: '1. 매출액 (외형 성장 분석)'
    },
    2: {
      insight: '물건을 떼온 원가와 매장 임대료, 알바비, 물류 배송비 등 운영비의 총합이에요. 매출 성장률보다 비용 증가율을 낮게 통제할수록 회사의 마진 방어력이 뛰어납니다.',
      highlight: '2. 빠져나간 비용 (원가 통제력 분석)'
    },
    3: {
      insight: '본업 장사로 순수하게 남긴 알짜배기 이익이에요! 주가와 기업가치에 가장 직접적인 영향을 미치며, 매출보다 영업이익이 더 가파르게 늘어날 때 영업 레버리지 황금기가 찾아옵니다.',
      highlight: '3. 영업이익 (본업 수익성 분석)'
    },
    4: {
      insight: '이자 비용과 법인세 세금까지 싹 털고 주주와 회사의 최종 금고에 남은 진짜 최종 순이익이에요! 이 돈이 매년 쌓여 회사의 튼튼한 순자산(자본)이 됩니다.',
      highlight: '4. 당기순이익 (최종 귀속 순이익)'
    }
  };

  const selectedData = cardInsights[cardIdx] || cardInsights[4];
  if (insightEl) insightEl.innerText = selectedData.insight;
  if (highlightEl) highlightEl.innerText = selectedData.highlight;
}
window.selectStatCard = selectStatCard;

// 연도 변경 함수 (글로벌 window 바인딩)
async function changeFinancialYear(year) {
  currentFinancialYear = String(year);
  
  // 연도 버튼 스타일 업데이트
  ['2023', '2024', '2025'].forEach(y => {
    const btn = document.getElementById(`btnYear${y}`);
    if (btn) {
      if (y === currentFinancialYear) {
        btn.className = 'px-3 py-1.5 rounded-xl bg-slate-900 text-white shadow-sm transition-all cursor-pointer';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl text-slate-600 hover:text-slate-900 transition-all cursor-pointer';
      }
    }
  });

  await loadCompanyDetails(currentCompanyId, currentFinancialYear);
}
window.changeFinancialYear = changeFinancialYear;

// 기본 DART 원본 표 샘플 (DART 공시 실데이터 기반 연도별 fallback)
const FALLBACK_DART_TABLES = {
  olive: {
    '2025': [
      { account_nm: '수익(매출액)', easy_name: '손님이 낸 돈 (매출액)', description: '손님들이 매장에서 상품을 사고 결제한 총 금액이에요.', thstrm_amount: '5,833,494,914,003', frmtrm_amount: '4,789,961,250,065', growth_rate: '+21.8%' },
      { account_nm: '매출원가', easy_name: '물건 떼온 값 (원가 밑천)', description: '화장품/생필품을 납품받아 오는 데 든 순수 밑천이에요.', thstrm_amount: '3,062,092,206,973', frmtrm_amount: '2,482,376,964,937', growth_rate: '+23.4%' },
      { account_nm: '매출총이익', easy_name: '기본 마진 (원가 뺀 돈)', description: '손님이 낸 돈에서 공장 원가만 빼고 1차로 남긴 마진이에요.', thstrm_amount: '2,771,402,707,030', frmtrm_amount: '2,307,584,285,128', growth_rate: '+20.1%' },
      { account_nm: '판매비와관리비', easy_name: '매장 굴리는 데 든 비용 (판관비)', description: '알바 월급, 강남역 매장 임대료, 오늘드림 배송비, 광고비예요.', thstrm_amount: '2,026,713,473,778', frmtrm_amount: '1,699,911,998,436', growth_rate: '+19.2%' },
      { account_nm: '영업이익', easy_name: '본업 장사로 남긴 돈 (영업이익)', description: '화장품 팔아서 순수 본업으로 남긴 알짜배기 이익이에요.', thstrm_amount: '744,689,233,252', frmtrm_amount: '607,672,286,692', growth_rate: '+22.5%' },
      { account_nm: '법인세비용', easy_name: '국가에 낸 기업 세금', description: '회사가 1년 동안 돈을 많이 벌어서 국가에 낸 세금이에요.', thstrm_amount: '156,467,929,810', frmtrm_amount: '156,854,705,669', growth_rate: '-0.2%' },
      { account_nm: '당기순이익', easy_name: '진짜 내 금고에 남은 돈 (순이익)', description: '세금까지 싹 다 내고 금고에 남은 진짜 최종 순이익이에요.', thstrm_amount: '554,716,452,987', frmtrm_amount: '478,872,465,122', growth_rate: '+15.8%' },
      { account_nm: '자산총계', easy_name: '회사의 모든 재산 총합', description: '올리브영이 가진 내 돈과 빚을 모두 합친 총 재산이에요.', thstrm_amount: '2,551,720,284,530', frmtrm_amount: '2,267,977,800,343', growth_rate: '+12.5%' },
      { account_nm: '부채총계', easy_name: '회사가 갚아야 할 빚', description: '납품대금 외상값, 은행 빚 등 갚아야 할 남의 돈이에요.', thstrm_amount: '1,548,903,724,827', frmtrm_amount: '1,265,931,343,943', growth_rate: '+22.4%' },
      { account_nm: '자본총계', easy_name: '진짜 순수한 내 돈 (순자산)', description: '총 재산에서 빚을 빼고 남은 순수한 알짜 밑천이에요.', thstrm_amount: '1,002,816,559,703', frmtrm_amount: '1,002,046,456,400', growth_rate: '+0.1%' }
    ],
    '2024': [
      { account_nm: '수익(매출액)', easy_name: '손님이 낸 돈 (매출액)', description: '손님들이 매장에서 상품을 사고 결제한 총 금액이에요.', thstrm_amount: '4,789,961,250,065', frmtrm_amount: '3,861,182,100,138', growth_rate: '+24.1%' },
      { account_nm: '매출원가', easy_name: '물건 떼온 값 (원가 밑천)', description: '화장품/생필품을 납품받아 오는 데 든 순수 밑천이에요.', thstrm_amount: '2,482,376,964,937', frmtrm_amount: '2,001,074,163,948', growth_rate: '+24.1%' },
      { account_nm: '매출총이익', easy_name: '기본 마진 (원가 뺀 돈)', description: '손님이 낸 돈에서 공장 원가만 빼고 1차로 남긴 마진이에요.', thstrm_amount: '2,307,584,285,128', frmtrm_amount: '1,860,107,936,190', growth_rate: '+24.1%' },
      { account_nm: '판매비와관리비', easy_name: '매장 굴리는 데 든 비용 (판관비)', description: '알바 월급, 강남역 매장 임대료, 오늘드림 배송비, 광고비예요.', thstrm_amount: '1,699,911,998,436', frmtrm_amount: '1,394,092,680,513', growth_rate: '+21.9%' },
      { account_nm: '영업이익', easy_name: '본업 장사로 남긴 돈 (영업이익)', description: '화장품 팔아서 순수 본업으로 남긴 알짜배기 이익이에요.', thstrm_amount: '607,672,286,692', frmtrm_amount: '466,015,255,677', growth_rate: '+30.4%' },
      { account_nm: '법인세비용', easy_name: '국가에 낸 기업 세금', description: '회사가 1년 동안 돈을 많이 벌어서 국가에 낸 세금이에요.', thstrm_amount: '156,854,705,669', frmtrm_amount: '111,775,900,211', growth_rate: '+40.3%' },
      { account_nm: '당기순이익', easy_name: '진짜 내 금고에 남은 돈 (순이익)', description: '세금까지 싹 다 내고 금고에 남은 진짜 최종 순이익이에요.', thstrm_amount: '478,872,465,122', frmtrm_amount: '347,298,269,234', growth_rate: '+37.9%' },
      { account_nm: '자산총계', easy_name: '회사의 모든 재산 총합', description: '올리브영이 가진 내 돈과 빚을 모두 합친 총 재산이에요.', thstrm_amount: '2,267,977,800,343', frmtrm_amount: '2,010,430,204,828', growth_rate: '+12.8%' },
      { account_nm: '부채총계', easy_name: '회사가 갚아야 할 빚', description: '납품대금 외상값, 은행 빚 등 갚아야 할 남의 돈이에요.', thstrm_amount: '1,265,931,343,943', frmtrm_amount: '1,031,970,974,984', growth_rate: '+22.7%' },
      { account_nm: '자본총계', easy_name: '진짜 순수한 내 돈 (순자산)', description: '총 재산에서 빚을 빼고 남은 순수한 알짜 밑천이에요.', thstrm_amount: '1,002,046,456,400', frmtrm_amount: '978,459,229,844', growth_rate: '+2.4%' }
    ],
    '2023': [
      { account_nm: '수익(매출액)', easy_name: '손님이 낸 돈 (매출액)', description: '손님들이 매장에서 상품을 사고 결제한 총 금액이에요.', thstrm_amount: '3,861,182,100,138', frmtrm_amount: '2,777,471,418,699', growth_rate: '+39.0%' },
      { account_nm: '매출원가', easy_name: '물건 떼온 값 (원가 밑천)', description: '화장품/생필품을 납품받아 오는 데 든 순수 밑천이에요.', thstrm_amount: '2,001,074,163,948', frmtrm_amount: '1,461,535,202,186', growth_rate: '+36.9%' },
      { account_nm: '매출총이익', easy_name: '기본 마진 (원가 뺀 돈)', description: '손님이 낸 돈에서 공장 원가만 빼고 1차로 남긴 마진이에요.', thstrm_amount: '1,860,107,936,190', frmtrm_amount: '1,315,936,216,513', growth_rate: '+41.4%' },
      { account_nm: '판매비와관리비', easy_name: '매장 굴리는 데 든 비용 (판관비)', description: '알바 월급, 강남역 매장 임대료, 오늘드림 배송비, 광고비예요.', thstrm_amount: '1,394,092,680,513', frmtrm_amount: '1,041,416,760,769', growth_rate: '+33.9%' },
      { account_nm: '영업이익', easy_name: '본업 장사로 남긴 돈 (영업이익)', description: '화장품 팔아서 순수 본업으로 남긴 알짜배기 이익이에요.', thstrm_amount: '466,015,255,677', frmtrm_amount: '274,519,455,744', growth_rate: '+69.8%' },
      { account_nm: '법인세비용', easy_name: '국가에 낸 기업 세금', description: '회사가 1년 동안 돈을 많이 벌어서 국가에 낸 세금이에요.', thstrm_amount: '111,775,900,211', frmtrm_amount: '60,606,754,835', growth_rate: '+84.4%' },
      { account_nm: '당기순이익', easy_name: '진짜 내 금고에 남은 돈 (순이익)', description: '세금까지 싹 다 내고 금고에 남은 진짜 최종 순이익이에요.', thstrm_amount: '347,298,269,234', frmtrm_amount: '208,061,367,751', growth_rate: '+66.9%' },
      { account_nm: '자산총계', easy_name: '회사의 모든 재산 총합', description: '올리브영이 가진 내 돈과 빚을 모두 합친 총 재산이에요.', thstrm_amount: '2,010,430,204,828', frmtrm_amount: '1,619,407,824,768', growth_rate: '+24.1%' },
      { account_nm: '부채총계', easy_name: '회사가 갚아야 할 빚', description: '납품대금 외상값, 은행 빚 등 갚아야 할 남의 돈이에요.', thstrm_amount: '1,031,970,974,984', frmtrm_amount: '879,815,496,331', growth_rate: '+17.3%' },
      { account_nm: '자본총계', easy_name: '진짜 순수한 내 돈 (순자산)', description: '총 재산에서 빚을 빼고 남은 순수한 알짜 밑천이에요.', thstrm_amount: '978,459,229,844', frmtrm_amount: '739,592,328,437', growth_rate: '+32.3%' }
    ]
  },
  hyundai: {
    '2025': [
      { account_nm: '수익(매출액)', easy_name: '손님이 낸 돈 (매출액)', description: '전 세계 고객들이 현대차를 사고 지불한 총 금액이에요.', thstrm_amount: '186,254,472,000,000', frmtrm_amount: '175,231,153,000,000', growth_rate: '+6.3%' },
      { account_nm: '영업이익', easy_name: '본업 장사로 남긴 돈 (영업이익)', description: '차 팔아서 순수 본업으로 남긴 알짜배기 이익이에요.', thstrm_amount: '11,467,851,000,000', frmtrm_amount: '14,239,592,000,000', growth_rate: '-19.5%' },
      { account_nm: '당기순이익', easy_name: '진짜 내 금고에 남은 돈 (순이익)', description: '세금까지 싹 내고 최종적으로 현대차 주머니에 남은 돈이에요.', thstrm_amount: '10,364,775,000,000', frmtrm_amount: '13,229,908,000,000', growth_rate: '-21.7%' },
      { account_nm: '자산총계', easy_name: '회사의 모든 재산 총합', description: '전 세계 공장, 연구소, 현금 등 현대차의 모든 자산 총합이에요.', thstrm_amount: '368,844,849,000,000', frmtrm_amount: '339,798,429,000,000', growth_rate: '+8.6%' },
      { account_nm: '부채총계', easy_name: '회사가 갚아야 할 빚', description: '글로벌 조달 채권, 할부금융 부채 등 갚아야 할 빚이에요.', thstrm_amount: '241,196,612,000,000', frmtrm_amount: '219,522,496,000,000', growth_rate: '+9.9%' },
      { account_nm: '자본총계', easy_name: '진짜 순수한 내 돈 (순자산)', description: '총 자산에서 부채를 뺀 현대차의 순수 자본이에요.', thstrm_amount: '127,648,237,000,000', frmtrm_amount: '120,275,933,000,000', growth_rate: '+6.1%' }
    ],
    '2024': [
      { account_nm: '수익(매출액)', easy_name: '손님이 낸 돈 (매출액)', description: '전 세계 고객들이 현대차를 사고 지불한 총 금액이에요.', thstrm_amount: '175,231,153,000,000', frmtrm_amount: '162,663,579,000,000', growth_rate: '+7.7%' },
      { account_nm: '영업이익', easy_name: '본업 장사로 남긴 돈 (영업이익)', description: '차 팔아서 순수 본업으로 남긴 알짜배기 이익이에요.', thstrm_amount: '14,239,592,000,000', frmtrm_amount: '15,126,901,000,000', growth_rate: '-5.9%' },
      { account_nm: '당기순이익', easy_name: '진짜 내 금고에 남은 돈 (순이익)', description: '세금까지 싹 내고 최종적으로 현대차 주머니에 남은 돈이에요.', thstrm_amount: '13,229,908,000,000', frmtrm_amount: '12,272,301,000,000', growth_rate: '+7.8%' },
      { account_nm: '자산총계', easy_name: '회사의 모든 재산 총합', description: '전 세계 공장, 연구소, 현금 등 현대차의 모든 자산 총합이에요.', thstrm_amount: '339,798,429,000,000', frmtrm_amount: '282,463,355,000,000', growth_rate: '+20.3%' },
      { account_nm: '부채총계', easy_name: '회사가 갚아야 할 빚', description: '글로벌 조달 채권, 할부금융 부채 등 갚아야 할 빚이에요.', thstrm_amount: '219,522,496,000,000', frmtrm_amount: '184,184,893,000,000', growth_rate: '+19.2%' },
      { account_nm: '자본총계', easy_name: '진짜 순수한 내 돈 (순자산)', description: '총 자산에서 부채를 뺀 현대차의 순수 자본이에요.', thstrm_amount: '120,275,933,000,000', frmtrm_amount: '98,278,462,000,000', growth_rate: '+22.4%' }
    ],
    '2023': [
      { account_nm: '수익(매출액)', easy_name: '손님이 낸 돈 (매출액)', description: '전 세계 고객들이 현대차를 사고 지불한 총 금액이에요.', thstrm_amount: '162,663,579,000,000', frmtrm_amount: '142,151,529,000,000', growth_rate: '+14.4%' },
      { account_nm: '매출원가', easy_name: '물건 떼온 값 (원가 밑천)', description: '차량 강판, 배터리, 부품값과 생산공장 가동비예요.', thstrm_amount: '129,598,382,000,000', frmtrm_amount: '114,815,489,000,000', growth_rate: '+12.9%' },
      { account_nm: '판매비와관리비', easy_name: '매장 굴리는 데 든 비용 (판관비)', description: '직원 월급, 전 세계 대리점 운영비, R&D 연구비예요.', thstrm_amount: '17,938,296,000,000', frmtrm_amount: '17,511,889,000,000', growth_rate: '+2.4%' },
      { account_nm: '영업이익', easy_name: '본업 장사로 남긴 돈 (영업이익)', description: '차 팔아서 순수 본업으로 남긴 알짜배기 이익 (상장사 1위!)', thstrm_amount: '15,126,901,000,000', frmtrm_amount: '9,824,151,000,000', growth_rate: '+54.0%' },
      { account_nm: '당기순이익', easy_name: '진짜 내 금고에 남은 돈 (순이익)', description: '세금까지 싹 내고 최종적으로 현대차 주머니에 남은 돈이에요.', thstrm_amount: '12,272,301,000,000', frmtrm_amount: '7,983,674,000,000', growth_rate: '+53.7%' },
      { account_nm: '자산총계', easy_name: '회사의 모든 재산 총합', description: '전 세계 공장, 연구소, 현금 등 현대차의 모든 자산 총합이에요.', thstrm_amount: '282,463,355,000,000', frmtrm_amount: '255,742,462,000,000', growth_rate: '+10.4%' },
      { account_nm: '부채총계', easy_name: '회사가 갚아야 할 빚', description: '글로벌 조달 채권, 할부금융 부채 등 갚아야 할 빚이에요.', thstrm_amount: '184,184,893,000,000', frmtrm_amount: '170,050,477,000,000', growth_rate: '+8.3%' },
      { account_nm: '자본총계', easy_name: '진짜 순수한 내 돈 (순자산)', description: '총 자산에서 부채를 뺀 현대차의 순수 자본이에요.', thstrm_amount: '98,278,462,000,000', frmtrm_amount: '85,691,985,000,000', growth_rate: '+14.7%' }
    ]
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  currentCompanyId = urlParams.get('id') || 'olive';
  currentFinancialYear = urlParams.get('year') || '2024';

  // 버튼 초기 상태 반영
  changeFinancialYear(currentFinancialYear);
  selectDocType('IS');

  setupSpendInputListener();
  setupFinancialModeToggle();
  setupScrollSpy();
  await loadCompanyDetails(currentCompanyId, currentFinancialYear);
  await loadCompanyQuiz(currentCompanyId);
});


function setupFinancialModeToggle() {
  const easyBtn = document.getElementById('btnEasyMode');
  const dartBtn = document.getElementById('btnDartMode');
  if (easyBtn) easyBtn.addEventListener('click', () => setFinancialMode('easy'));
  if (dartBtn) dartBtn.addEventListener('click', () => setFinancialMode('dart'));
}

function setFinancialMode(mode) {
  const easyBtn = document.getElementById('btnEasyMode');
  const dartBtn = document.getElementById('btnDartMode');
  const easyView = document.getElementById('easyViewContainer');
  const dartView = document.getElementById('dartViewContainer');

  if (!easyView || !dartView) return;

  if (mode === 'easy') {
    easyView.classList.remove('hidden');
    dartView.classList.add('hidden');
    if (easyBtn) easyBtn.className = 'px-3.5 py-1.5 rounded-xl bg-white text-emerald-700 shadow-sm flex items-center gap-1.5 transition-all';
    if (dartBtn) dartBtn.className = 'px-3.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-all';
  } else {
    easyView.classList.add('hidden');
    dartView.classList.remove('hidden');
    if (dartBtn) dartBtn.className = 'px-3.5 py-1.5 rounded-xl bg-white text-blue-700 shadow-sm flex items-center gap-1.5 transition-all';
    if (easyBtn) easyBtn.className = 'px-3.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-all';
  }
}

// 전역 window 바인딩 (인라인 onclick 지원)
window.setFinancialMode = setFinancialMode;


function renderDartTable(rows, companyInfo = null) {
  const tbody = document.getElementById('dartTableBody');
  if (!tbody || !rows || rows.length === 0) return;

  // 회사별 공시 문서 헤더 업데이트 (DART 정식 표기)
  const corpHeaderEl = document.getElementById('dartCorpNameHeader');
  const docTitleEl = document.getElementById('dartDocTitle');
  const thstrmColHeader = document.getElementById('dartThstrmColHeader');
  const frmtrmColHeader = document.getElementById('dartFrmtrmColHeader');

  const compId = currentCompanyId || 'olive';
  const yr = parseInt(currentFinancialYear || '2024', 10);
  const prevYr = yr - 1;

  if (compId === 'hyundai') {
    // 현대차: 2023년=56기, 2024년=57기, 2025년=58기
    const gisu = 56 + (yr - 2023);
    if (corpHeaderEl) corpHeaderEl.innerText = '현대자동차주식회사 (00164742)';
    if (docTitleEl) docTitleEl.innerText = `제 ${gisu} 기 연결재무제표 (포괄손익계산서)`;
    if (thstrmColHeader) thstrmColHeader.innerText = `제 ${gisu} 기 (${yr}년)`;
    if (frmtrmColHeader) frmtrmColHeader.innerText = `제 ${gisu - 1} 기 (${prevYr}년)`;
  } else if (compId === 'olive') {
    // 올리브영: 2023년=25기, 2024년=26기, 2025년=27기
    const gisu = 25 + (yr - 2023);
    if (corpHeaderEl) corpHeaderEl.innerText = '씨제이올리브영 주식회사 (01423068)';
    if (docTitleEl) docTitleEl.innerText = `제 ${gisu} 기 연결재무제표 (손익계산서)`;
    if (thstrmColHeader) thstrmColHeader.innerText = `제 ${gisu} 기 (${yr}년)`;
    if (frmtrmColHeader) frmtrmColHeader.innerText = `제 ${gisu - 1} 기 (${prevYr}년)`;
  } else if (companyInfo) {
    if (corpHeaderEl) corpHeaderEl.innerText = `${companyInfo.name || ''} 주식회사`;
    if (docTitleEl) docTitleEl.innerText = `제 ${yr} 기 연결재무제표 (손익계산서)`;
    if (thstrmColHeader) thstrmColHeader.innerText = `당기 (${yr}년)`;
    if (frmtrmColHeader) frmtrmColHeader.innerText = `전기 (${prevYr}년)`;
  }


  // 회계 차감 항목(비용, 원가 등) 체크 함수: 회계 관례상 (괄호) 처리
  const isDeductionAccount = (name) => {
    return ['매출원가', '판매비와관리비', '법인세비용', '영업외비용', '금융원가'].some(k => name.includes(k));
  };

  // 회계 로마자/순번 목차 매핑
  const getOfficialItemPrefix = (name) => {
    if (name.includes('수익') || name === '매출액') return 'I. ';
    if (name.includes('매출원가')) return 'II. ';
    if (name.includes('매출총이익')) return 'III. ';
    if (name.includes('판매비와관리비')) return 'IV. ';
    if (name.includes('영업이익')) return 'V. ';
    if (name.includes('법인세비용')) return 'VI. ';
    if (name.includes('당기순이익')) return 'VII. ';
    if (name.includes('자산총계')) return '[자산총계] ';
    if (name.includes('부채총계')) return '[부채총계] ';
    if (name.includes('자본총계')) return '[자본총계] ';
    return '';
  };

  // 숫자 회계 포맷팅: 음수이거나 비용 계정인 경우 (1,234) 형식으로 표시
  const formatAccountingValue = (valStr, isDeduct) => {
    if (!valStr || valStr === '-') return '-';
    let clean = valStr.toString().trim();
    if (clean.startsWith('-')) {
      return `(${clean.replace('-', '')})`;
    }
    if (isDeduct && !clean.startsWith('(')) {
      return `(${clean})`;
    }
    return clean;
  };

  tbody.innerHTML = rows.map((r) => {
    const isMajor = ['수익(매출액)', '매출액', '영업이익', '영업이익(손실)', '당기순이익', '당기순이익(손실)'].includes(r.account_nm);
    const isTotal = ['자산총계', '자본총계', '당기순이익', '당기순이익(손실)'].includes(r.account_nm);
    const isSubItem = ['매출원가', '판매비와관리비', '법인세비용'].includes(r.account_nm);
    const isDeduct = isDeductionAccount(r.account_nm);

    const prefix = getOfficialItemPrefix(r.account_nm);
    const thstrmFormatted = formatAccountingValue(r.thstrm_amount, isDeduct);
    const frmtrmFormatted = formatAccountingValue(r.frmtrm_amount, isDeduct);

    // 증감률 스타일
    const yoyGrowth = r.growth_rate || '-';
    let yoyClass = 'text-slate-600';
    if (yoyGrowth.startsWith('+')) {
      yoyClass = 'text-blue-700 font-semibold';
    } else if (yoyGrowth.startsWith('-')) {
      yoyClass = 'text-rose-600 font-semibold';
    }

    // 행 스타일
    let rowClass = '';
    if (isTotal) {
      rowClass = 'dart-row-total';
    } else if (isMajor) {
      rowClass = 'dart-row-highlight';
    }

    const indentClass = isSubItem ? 'pl-7' : 'pl-4';

    return `
      <tr class="${rowClass} transition-colors">
        <td class="py-2.5 ${indentClass} pr-4 align-middle">
          <div class="flex items-center justify-between gap-2">
            <span class="text-slate-900 tracking-tight">
              <span class="font-serif font-bold text-slate-700">${prefix}</span>${r.account_nm}
            </span>
            <!-- 주린이 친절 스마트 툴팁 (모바일 터치 & 데스크톱 호버 완벽 지원) -->
            <div class="smart-tooltip-trigger relative inline-block cursor-help shrink-0" onmouseleave="this.classList.remove('active')" onclick="this.classList.toggle('active')">
              <span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold transition-colors shadow-xs">💡</span>
              <div class="tooltip-bubble w-64 sm:w-72 p-3 bg-slate-900/95 backdrop-blur-sm text-white text-[11px] rounded-xl shadow-2xl border border-slate-700">
                <div class="font-extrabold text-blue-400 flex items-center justify-between gap-1.5 mb-1">
                  <span>${r.easy_name || r.account_nm}</span>
                  <span class="text-[9px] text-slate-400 font-normal">터치 시 고정/해제</span>
                </div>
                <p class="text-slate-200 leading-snug font-normal text-[11px] break-keep">${r.description || '재무제표 계정과목입니다.'}</p>
              </div>
            </div>
          </div>
        </td>
        <td class="py-2.5 px-4 text-right dart-num text-slate-900 font-medium whitespace-nowrap">
          ${thstrmFormatted}
        </td>
        <td class="py-2.5 px-4 text-right dart-num text-slate-600 whitespace-nowrap">
          ${frmtrmFormatted}
        </td>
        <td class="py-2.5 px-3 text-right dart-num ${yoyClass} whitespace-nowrap text-[11px]">
          ${yoyGrowth}
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * 저장된 기업 재무제표(DART 공시 실제 데이터)를 변수화하여
 * 실제 수치를 바탕으로 "어떤 상황으로 읽히는지"와 "투자 액션"을 동적으로 분석/생성
 */
function renderDynamicSituationalAnalysis(rows, companyInfo, year) {
  const container = document.getElementById('dynamicSituationalCards');
  if (!container || !rows || rows.length === 0) return;

  const targetCorpEl = document.getElementById('readingTargetCorpName');
  const targetYearBadge = document.getElementById('readingYearBadge');
  if (targetCorpEl && companyInfo) targetCorpEl.innerText = companyInfo.name || '해당 기업';
  if (targetYearBadge) targetYearBadge.innerText = `${year}년 결산 실데이터 분석`;

  // 1. 숫자 파싱 헬퍼 함수
  const parseNum = (val) => {
    if (!val) return 0;
    const str = val.toString().replace(/,/g, '').replace(/\(/g, '-').replace(/\)/g, '').trim();
    return parseFloat(str) || 0;
  };

  const parseRate = (val) => {
    if (!val || val === '-') return 0;
    const clean = val.replace('%', '').replace('+', '').trim();
    return parseFloat(clean) || 0;
  };

  // 2. 주요 계정과목 찾기
  const findRow = (keys) => rows.find(r => keys.some(k => r.account_nm.includes(k)));
  const revRow = findRow(['수익(매출액)', '매출액']);
  const costRow = findRow(['매출원가']);
  const opRow = findRow(['영업이익', '영업이익(손실)']);
  const netRow = findRow(['당기순이익', '당기순이익(손실)']);
  const assetRow = findRow(['자산총계']);
  const debtRow = findRow(['부채총계']);
  const equityRow = findRow(['자본총계']);
  const finCostRow = findRow(['이자비용', '금융원가', '금융비용']);

  const revThstrm = revRow ? parseNum(revRow.thstrm_amount) : 0;
  const revFrmtrm = revRow ? parseNum(revRow.frmtrm_amount) : 0;
  const revGrowth = revRow ? parseRate(revRow.growth_rate) : 0;

  const costThstrm = costRow ? parseNum(costRow.thstrm_amount) : 0;
  const costFrmtrm = costRow ? parseNum(costRow.frmtrm_amount) : 0;

  const opThstrm = opRow ? parseNum(opRow.thstrm_amount) : 0;
  const opFrmtrm = opRow ? parseNum(opRow.frmtrm_amount) : 0;
  const opGrowth = opRow ? parseRate(opRow.growth_rate) : 0;

  const netThstrm = netRow ? parseNum(netRow.thstrm_amount) : 0;
  const netGrowth = netRow ? parseRate(netRow.growth_rate) : 0;

  const debtThstrm = debtRow ? parseNum(debtRow.thstrm_amount) : 0;
  const equityThstrm = equityRow ? parseNum(equityRow.thstrm_amount) : 0;

  // 원가율 계산 (%)
  const costRateThstrm = revThstrm > 0 && costThstrm > 0 ? (costThstrm / revThstrm) * 100 : 0;
  const costRateFrmtrm = revFrmtrm > 0 && costFrmtrm > 0 ? (costFrmtrm / revFrmtrm) * 100 : 0;
  const costRateDiff = costRateThstrm - costRateFrmtrm;

  // 부채비율 계산 (%)
  const debtRatio = equityThstrm > 0 ? (debtThstrm / equityThstrm) * 100 : 0;

  // 동적 분석 카드 리스트 생성
  const analysisCards = [];

  // [분석 1] 매출 성장률 vs 영업이익 성장률 (영업 레버리지 / 출혈 경쟁)
  if (revRow && opRow) {
    if (opGrowth > revGrowth && opGrowth > 0) {
      analysisCards.push({
        icon: '📈',
        title: `매출 증가(+${revGrowth.toFixed(1)}%) < 영업이익 폭발(+${opGrowth.toFixed(1)}%)`,
        tag: '영업 레버리지 폭발',
        tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
        quote: `"이제 공장 더 안 짓고 사람 더 안 뽑아도 팔리는 족족 순수 마진으로 금고에 쌓이는 황금기예요!"`,
        desc: `당기 매출이 +${revGrowth.toFixed(1)}% 늘어나는 동안 본업 영업이익은 +${opGrowth.toFixed(1)}%로 훨씬 가파르게 폭발했어요. 고정비 부담을 완벽히 넘어서서 파는 족족 마진이 남는 최상의 체력으로 읽혀요.`,
        actionText: '적극 매수 검토',
        actionType: 'buy'
      });
    } else if (revGrowth > 0 && opGrowth < 0) {
      analysisCards.push({
        icon: '📉',
        title: `매출은 증가(+${revGrowth.toFixed(1)}%)했으나 영업이익은 감소(${opGrowth.toFixed(1)}%)`,
        tag: '마진 훼손 / 출혈 경쟁',
        tagColor: 'bg-rose-50 text-rose-600 border-rose-200/60',
        quote: `"손님은 매장에 많이 모았는데, 실은 원가와 할인 행사 비용 감당이 안 돼서 밑지고 팔고 있어요."`,
        desc: `매출 볼륨은 커졌으나 영업이익이 역성장했습니다. 원자재값 인상을 판매가에 전가하지 못했거나 할인 경쟁으로 실속이 훼손된 상황으로 읽혀요.`,
        actionText: '관망 (마진 훼손)',
        actionType: 'watch'
      });
    } else if (opGrowth > 0) {
      analysisCards.push({
        icon: '📊',
        title: `매출(+${revGrowth.toFixed(1)}%)과 영업이익(+${opGrowth.toFixed(1)}%) 동반 순항`,
        tag: '안정적 성장세',
        tagColor: 'bg-blue-50 text-blue-600 border-blue-200/60',
        quote: `"장사 규모도 커지고 있고, 번 돈도 정직하게 함께 불어나고 있어요."`,
        desc: `외형(매출)과 실속(이익)이 나란히 성장 궤도를 달리고 있어 기초 체력이 견고한 상태로 읽혀요.`,
        actionText: '적극 매수 검토',
        actionType: 'buy'
      });
    }
  }

  // [분석 2] 원가율 변화 분석 (가격 결정권 & 마진 방어력)
  if (costThstrm > 0 && costRateThstrm > 0) {
    if (costRateDiff <= 0) {
      analysisCards.push({
        icon: '🏷️',
        title: `원가율 안정 (${costRateThstrm.toFixed(1)}%, 전기대비 ${costRateDiff.toFixed(1)}%p)`,
        tag: '가격 결정권 확보',
        tagColor: 'bg-blue-50 text-blue-600 border-blue-200/60',
        quote: `"우리가 시장 1위 큰손이라 부품/납품단가를 통제했거나, 고마진 인기 상품 위주로 똑똑하게 팔았어요."`,
        desc: `매출 100원 중 원가가 차지하는 비중이 ${costRateThstrm.toFixed(1)}% 수준으로 억제되어 있어, 원자재 가격 파동에도 끄떡없는 마진 방어력을 갖춘 것으로 읽혀요.`,
        actionText: '적극 매수 검토',
        actionType: 'buy'
      });
    } else {
      analysisCards.push({
        icon: '📦',
        title: `원가율 상승 (${costRateThstrm.toFixed(1)}%, 전기대비 +${costRateDiff.toFixed(1)}%p)`,
        tag: '원가 압박 감지',
        tagColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
        quote: `"물건 떼오는 밑천 가격이 올라서 마진이 전년보다 다소 빡빡해졌어요."`,
        desc: `원가 비중이 ${costRateThstrm.toFixed(1)}%로 소폭 상승했습니다. 향후 판매 가격을 인상해 손님에게 전가할 수 있는지 모니터링이 필요한 상황으로 읽혀요.`,
        actionText: '관망 (마진 훼손)',
        actionType: 'watch'
      });
    }
  }

  // [분석 3] 본업 영업이익 vs 최종 당기순이익 (일회성 착시 검증)
  if (opRow && netRow) {
    if (opThstrm > 0 && netThstrm > 0) {
      const opMargin = (opThstrm / revThstrm * 100).toFixed(1);
      analysisCards.push({
        icon: '👑',
        title: `영업이익률 ${opMargin}% & 순이익(+${netGrowth.toFixed(1)}%)의 고순도 결실`,
        tag: '진짜 순수 흑자',
        tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
        quote: `"부동산이나 땅을 팔아 꼼수 부린 게 아니라, 오직 본업 장사만으로 금고를 꽉 채웠어요!"`,
        desc: `영업이익과 당기순이익이 모두 견고한 동반 흑자를 기록하고 있습니다. 일회성 매각 착시가 없는 고품질 이익 구조로 읽혀요.`,
        actionText: '적극 매수 검토',
        actionType: 'buy'
      });
    } else if (opThstrm < 0 && netThstrm > 0) {
      analysisCards.push({
        icon: '⚠️',
        title: `영업이익 적자 but 당기순이익만 흑자`,
        tag: '일회성 착시 주의',
        tagColor: 'bg-amber-50 text-amber-600 border-amber-200/60',
        quote: `"장사는 망쳤는데, 사옥이나 부동산을 팔아서 급하게 장부 구멍을 메워놨어요."`,
        desc: `본업은 마이너스인데 일회성 자산 처분으로 낸 가짜 흑자이므로 다음 분기 역풍을 맞을 수 있는 착시 위험 신호로 읽혀요.`,
        actionText: '매수 주의',
        actionType: 'caution'
      });
    }
  }

  // [분석 4] 재무 건전성 (부채비율 vs 이자보상배율)
  if (equityThstrm > 0) {
    if (debtRatio <= 150) {
      analysisCards.push({
        icon: '🛡️',
        title: `부채비율 ${debtRatio.toFixed(1)}%로 안정적인 자본 방어벽`,
        tag: '흑자도산 차단',
        tagColor: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
        quote: `"내 밑천(자본)이 빚보다 든든하게 받쳐주고 있어서 금융위기가 와도 끄떡없어요."`,
        desc: `자본총계 대비 부채 비율이 적정선(${debtRatio.toFixed(1)}%)으로 관리되고 있어, 단기 충격이나 금리 인상에도 쓰러지지 않을 안전성을 보유한 것으로 읽혀요.`,
        actionText: '적극 매수 검토',
        actionType: 'buy'
      });
    } else {
      analysisCards.push({
        icon: '⚖️',
        title: `부채비율 ${debtRatio.toFixed(1)}%로 레버리지 활용 중`,
        tag: '재무 레버리지 체크',
        tagColor: 'bg-slate-100 text-slate-700 border-slate-300',
        quote: `"신규 매장 출점과 물류센터 확장을 위해 남의 돈(부채)을 적극 활용하고 있어요."`,
        desc: `영업활동에서 창출되는 현금흐름으로 부채 이자를 충분히 감당 가능한지 주기적인 모니터링이 권장되는 구조로 읽혀요.`,
        actionText: debtRatio > 300 ? '매수 주의' : '관망 (마진 훼손)',
        actionType: debtRatio > 300 ? 'caution' : 'watch'
      });
    }
  }

  // 액션 타입별 배지 HTML 렌더링 헬퍼
  const renderActionBadge = (type, text) => {
    if (type === 'buy') {
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200 shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-xs"></span> ${text}
        </span>`;
    }
    if (type === 'watch') {
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-[11px] border border-amber-200 shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-amber-500 shadow-xs"></span> ${text}
        </span>`;
    }
    if (type === 'caution') {
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-extrabold text-[11px] border border-rose-200 shadow-2xs">
          <span class="w-2 h-2 rounded-full bg-rose-500 shadow-xs"></span> ${text}
        </span>`;
    }
    return `
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-black text-[11px] border border-rose-300 shadow-2xs">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-600 flex items-center justify-center text-white text-[9px] font-bold leading-none">−</span> ${text}
      </span>`;
  };

  // HTML 렌더링
  container.innerHTML = analysisCards.map(card => `
    <div class="p-3.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs space-y-2 flex flex-col justify-between">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-extrabold text-slate-800 flex items-center gap-1.5 text-[11px]">
            <span>${card.icon}</span> ${card.title}
          </span>
          <span class="text-[10px] font-bold px-1.5 py-0.2 rounded border ${card.tagColor}">${card.tag}</span>
        </div>
        <p class="text-[11px] text-slate-600 leading-relaxed">
          💬 <strong class="text-slate-800">${card.quote}</strong><br>
          <span class="text-slate-500 text-[10.5px]">${card.desc}</span>
        </p>
      </div>
      <!-- 투자 액션 결론 -->
      <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span class="text-[10.5px] font-bold text-slate-400">투자 액션 결론</span>
        ${renderActionBadge(card.actionType, card.actionText)}
      </div>
    </div>
  `).join('');
}



function setupSpendInputListener() {
  const inputEl = document.getElementById('detailSpendInput');
  if (inputEl) {
    inputEl.addEventListener('input', (e) => {
      const spend = parseInt(e.target.value, 10) || 0;
      updateLiveSpendMetaphor(currentCompanyId, spend);
    });
  }
}

/**
 * [페르소나 1 김지은 특화] 실시간 소비 이익 + 기업 매출 기여도 + 스케일 환산
 */
function updateLiveSpendMetaphor(companyId, spendAmount) {
  const result = calculateSpendMetaphor(companyId, spendAmount);
  if (!result) return;
  
  const earnedEl = document.getElementById('detailMarginEarned');
  const countTextEl = document.getElementById('detailItemCountText');
  const iconEl = document.getElementById('detailItemIcon');
  const pctEl = document.getElementById('widgetMarginPct');
  const widgetCompEl = document.getElementById('widgetCompName');
  const spendContribEl = document.getElementById('spendContributionText');
  const spendScaleEl = document.getElementById('spendNationalScaleText');

  if (earnedEl) earnedEl.innerText = `${result.marginEarned.toLocaleString()}원 남김`;
  if (countTextEl) countTextEl.innerText = result.summaryText || `${result.itemCount}${result.unit}`;
  if (iconEl) iconEl.innerText = result.icon || '🎁';
  if (pctEl) pctEl.innerText = `${result.marginRatePct}%`;
  if (widgetCompEl) widgetCompEl.innerText = result.brandName;

  // 기업 매출 대비 기여도 (%) 계산
  const brandData = BRAND_METAPHOR_MAP[companyId];
  let approxRev = 4000000000000; // 4조 기본값
  if (companyId === 'hyundai') approxRev = 175000000000000;
  if (companyId === 'olive') approxRev = 4800000000000;
  if (companyId === 'musinsa') approxRev = 1000000000000;

  const contributionPct = ((spendAmount / approxRev) * 100).toFixed(7);
  if (spendContribEl) {
    spendContribEl.innerHTML = `이 기업 연 매출의 <span class="text-emerald-600 font-black">${contributionPct}%</span>를 기여했어요!`;
  }

  if (spendScaleEl && brandData) {
    spendScaleEl.innerText = `"${brandData.scaleSummary || '20대 청년들이 함께 만든 거대한 소비 생태계'}"`;
  }
}

/**
 * [페르소나 2 박민우 특화] 🔥 5분 DART 스스로 진단 프레임워크 계산 엔진
 */
function renderSelfCheckingDashboard(rows, comp, year) {
  const parseNum = (val) => {
    if (!val) return 0;
    const str = val.toString().replace(/,/g, '').replace(/\(/g, '-').replace(/\)/g, '').trim();
    return parseFloat(str) || 0;
  };

  const parseRate = (val) => {
    if (!val || val === '-') return 0;
    const clean = val.replace('%', '').replace('+', '').trim();
    return parseFloat(clean) || 0;
  };

  const findRow = (keys) => rows.find(r => keys.some(k => r.account_nm.includes(k)));
  const revRow = findRow(['수익(매출액)', '매출액']);
  const opRow = findRow(['영업이익', '영업이익(손실)']);
  const debtRow = findRow(['부채총계']);
  const equityRow = findRow(['자본총계']);

  const revGrowth = revRow ? parseRate(revRow.growth_rate) : 0;
  const revThstrm = revRow ? parseNum(revRow.thstrm_amount) : 1;
  const opThstrm = opRow ? parseNum(opRow.thstrm_amount) : 0;
  const opRate = revThstrm > 0 ? (opThstrm / revThstrm) * 100 : 0;
  
  const debtThstrm = debtRow ? parseNum(debtRow.thstrm_amount) : 0;
  const equityThstrm = equityRow ? parseNum(equityRow.thstrm_amount) : 1;
  const debtRatio = equityThstrm > 0 ? (debtThstrm / equityThstrm) * 100 : 0;

  // 진단표 타이틀 업데이트
  const corpNameEl = document.getElementById('diagCorpName');
  const noteCorpNameEl = document.getElementById('noteCorpName');
  if (corpNameEl) corpNameEl.innerText = comp.name || '이 기업';
  if (noteCorpNameEl) noteCorpNameEl.innerText = comp.name || '이 기업';

  // 1. 성장성 (매출 성장률 > 0)
  const isGrowthPassed = revGrowth > 0;
  const valGrowthEl = document.getElementById('diagGrowthValue');
  const badgeGrowthEl = document.getElementById('badgeGrowth');
  const cardGrowth = document.getElementById('cardGrowth');
  const chkGrowth = document.getElementById('chkGrowth');

  if (valGrowthEl) valGrowthEl.innerText = `${revGrowth >= 0 ? '+' : ''}${revGrowth.toFixed(1)}% YoY 매출 성장`;
  if (badgeGrowthEl) {
    badgeGrowthEl.className = isGrowthPassed 
      ? 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200'
      : 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200';
    badgeGrowthEl.innerText = isGrowthPassed ? '통과 🟢' : '주의 ⚠️';
  }
  if (chkGrowth) chkGrowth.checked = isGrowthPassed;
  if (cardGrowth) cardGrowth.className = `diag-card p-4 sm:p-5 rounded-2xl border space-y-3 ${isGrowthPassed ? 'passed' : 'caution'}`;

  // 2. 수익성 (영업이익률 > 8%)
  const isProfitPassed = opRate >= 8;
  const valProfitEl = document.getElementById('diagProfitValue');
  const badgeProfitEl = document.getElementById('badgeProfit');
  const cardProfit = document.getElementById('cardProfit');
  const chkProfit = document.getElementById('chkProfit');

  if (valProfitEl) valProfitEl.innerText = `영업이익률 ${opRate.toFixed(1)}% (${opRate >= 10 ? '두 자릿수 고마진' : '수익 방어'})`;
  if (badgeProfitEl) {
    badgeProfitEl.className = isProfitPassed 
      ? 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200'
      : 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200';
    badgeProfitEl.innerText = isProfitPassed ? '통과 🟢' : '보통 🟡';
  }
  if (chkProfit) chkProfit.checked = isProfitPassed;
  if (cardProfit) cardProfit.className = `diag-card p-4 sm:p-5 rounded-2xl border space-y-3 ${isProfitPassed ? 'passed' : 'caution'}`;

  // 3. 안전성 (부채비율 < 200%)
  const isSafetyPassed = debtRatio > 0 && debtRatio <= 200;
  const valSafetyEl = document.getElementById('diagSafetyValue');
  const badgeSafetyEl = document.getElementById('badgeSafety');
  const cardSafety = document.getElementById('cardSafety');
  const chkSafety = document.getElementById('chkSafety');

  if (valSafetyEl) valSafetyEl.innerText = `부채비율 ${debtRatio.toFixed(0)}% (200% 이하 건전)`;
  if (badgeSafetyEl) {
    badgeSafetyEl.className = isSafetyPassed 
      ? 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200'
      : 'text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200';
    badgeSafetyEl.innerText = isSafetyPassed ? '안전 🟢' : '주의 ⚠️';
  }
  if (chkSafety) chkSafety.checked = isSafetyPassed;
  if (cardSafety) cardSafety.className = `diag-card p-4 sm:p-5 rounded-2xl border space-y-3 ${isSafetyPassed ? 'passed' : 'caution'}`;

  // 점수 계산 및 리스너 등록
  const updateDiagScore = () => {
    let score = 0;
    if (chkGrowth && chkGrowth.checked) score += 35;
    if (chkProfit && chkProfit.checked) score += 35;
    if (chkSafety && chkSafety.checked) score += 30;

    const scoreEl = document.getElementById('diagScoreText');
    const gradeIconEl = document.getElementById('diagGradeIcon');
    const commentEl = document.getElementById('diagSummaryComment');

    if (scoreEl) scoreEl.innerText = score;
    if (gradeIconEl) {
      if (score >= 90) gradeIconEl.innerText = '🎯';
      else if (score >= 60) gradeIconEl.innerText = '⚖️';
      else gradeIconEl.innerText = '⚠️';
    }
    if (commentEl) {
      if (score === 100) {
        commentEl.innerText = '3개 핵심 지표를 모두 충족했습니다! 실전에서도 안정적인 실적 기반 투자 대상에 속해요.';
      } else if (score >= 65) {
        commentEl.innerText = '일부 지표에서 주의가 필요하지만, 본업 경쟁력은 유지되고 있어요. 추가 분기 실적을 체크해보세요.';
      } else {
        commentEl.innerText = '수익성 또는 재무 안정성에 신호가 켜졌습니다. 보수적인 관망 후 진입을 추천해요.';
      }
    }
  };

  [chkGrowth, chkProfit, chkSafety].forEach(chk => {
    if (chk) chk.onchange = updateDiagScore;
  });

  const btnReset = document.getElementById('btnResetDiag');
  if (btnReset) {
    btnReset.onclick = () => {
      if (chkGrowth) chkGrowth.checked = isGrowthPassed;
      if (chkProfit) chkProfit.checked = isProfitPassed;
      if (chkSafety) chkSafety.checked = isSafetyPassed;
      updateDiagScore();
    };
  }

  updateDiagScore();
}

/**
 * [페르소나 2 박민우 특화] 📝 나만의 매수 결정 스위치 & 로컬스토리지 저장
 */
let currentUserDecision = 'BUY';

function setUserDecision(decision) {
  currentUserDecision = decision;
  const buyBtn = document.getElementById('btnDecisionBuy');
  const holdBtn = document.getElementById('btnDecisionHold');
  const watchBtn = document.getElementById('btnDecisionWatch');
  const statusText = document.getElementById('decisionStatusText');

  [buyBtn, holdBtn, watchBtn].forEach(b => {
    if (b) {
      b.classList.remove('active-buy', 'active-hold', 'active-watch');
      b.className = 'decision-btn py-2.5 px-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 flex flex-col items-center gap-1 cursor-pointer';
    }
  });

  if (decision === 'BUY' && buyBtn) {
    buyBtn.classList.add('active-buy');
    if (statusText) statusText.innerHTML = '<span class="text-emerald-700 font-semibold">현재 상태: [적극 매수] — DART 실적 지표가 탄탄하여 분할 매수 고려</span>';
  } else if (decision === 'HOLD' && holdBtn) {
    holdBtn.classList.add('active-hold');
    if (statusText) statusText.innerHTML = '<span class="text-amber-700 font-semibold">현재 상태: [관망 / 홀딩] — 다음 분기 실적 및 밸류에이션 추이를 지켜봄</span>';
  } else if (decision === 'WATCH' && watchBtn) {
    watchBtn.classList.add('active-watch');
    if (statusText) statusText.innerHTML = '<span class="text-slate-600 font-semibold">현재 상태: [매수 보류] — 재무 리스크 해소 전까지 진입 보류</span>';
  }
}
window.setUserDecision = setUserDecision;

function saveUserInvestmentNote() {
  const noteEl = document.getElementById('userInvestmentNote');
  const noteContent = noteEl ? noteEl.value : '';
  const payload = {
    decision: currentUserDecision,
    note: noteContent,
    updatedAt: new Date().toLocaleDateString('ko-KR') + ' ' + new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  };

  localStorage.setItem(`easydart_note_${currentCompanyId}`, JSON.stringify(payload));

  const noteStatusEl = document.getElementById('noteSavedStatus');
  if (noteStatusEl) {
    noteStatusEl.innerText = `마지막 저장: ${payload.updatedAt}`;
  }

  // 토스트 알림 표시
  showToast(`[${currentCompanyId.toUpperCase()}] 매수 결정(${currentUserDecision})과 원칙 노트가 저장되었습니다.`);
}
window.saveUserInvestmentNote = saveUserInvestmentNote;

function loadUserInvestmentNote(companyId) {
  try {
    const saved = localStorage.getItem(`easydart_note_${companyId}`);
    const noteEl = document.getElementById('userInvestmentNote');
    const noteStatusEl = document.getElementById('noteSavedStatus');

    if (saved) {
      const data = JSON.parse(saved);
      if (data.decision) setUserDecision(data.decision);
      if (noteEl && data.note) noteEl.value = data.note;
      if (noteStatusEl && data.updatedAt) noteStatusEl.innerText = `마지막 저장: ${data.updatedAt}`;
    } else {
      setUserDecision('BUY');
      if (noteEl) noteEl.value = '';
      if (noteStatusEl) noteStatusEl.innerText = '마지막 저장: 없음';
    }
  } catch (e) {
    console.warn('노트 불러오기 실패:', e);
  }
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 2500);
}

async function loadCompanyDetails(id, year = '') {
  const selectedYear = year || currentFinancialYear || '2024';
  try {
    const data = await apiClient.getCompanyDetail(id, selectedYear);
    const comp = data.company;
    const fin = data.financials;
    const ai = data.ai_summary;
    const vp = data.visual_pipeline;

    // Header
    const iconEl = document.getElementById('compIcon');
    const nameEl = document.getElementById('compName');
    const badgeEl = document.getElementById('compBadge');
    const highlightBadgeEl = document.getElementById('compHighlightBadge');
    const metaphorHeadEl = document.getElementById('compMetaphorHead');
    const docEl = document.getElementById('compDoc');

    if (iconEl) iconEl.innerText = comp.icon;
    if (nameEl) nameEl.innerText = comp.name;
    if (badgeEl) badgeEl.innerText = comp.category_name;
    if (highlightBadgeEl) highlightBadgeEl.innerText = comp.highlight || '실적 분석';
    if (docEl && comp.doc) {
      docEl.innerHTML = `<i data-lucide="file-text" class="w-3.5 h-3.5"></i> 금융감독원 전자공시(DART) ${comp.doc} 기반`;
    }

    // Scale Metaphor (페르소나 2 맞춤)
    const scaleMeta = getCompanyScaleMetaphor(id);
    if (metaphorHeadEl && scaleMeta) {
      metaphorHeadEl.innerText = `"${scaleMeta.headline || scaleMeta.annualMetaphor || scaleMeta.scaleSummary || comp.highlight || '연간 실적 체감 환산'}"`;
    }

    // Spend Metaphor Initial Render (페르소나 1 맞춤)
    const initialSpend = parseInt(document.getElementById('detailSpendInput')?.value, 10) || 35000;
    updateLiveSpendMetaphor(id, initialSpend);

    // Financials (기본)
    document.getElementById('statRevenue').innerText = fin.revenue;
    document.getElementById('statCost').innerText = fin.cost;
    document.getElementById('statOpProfit').innerText = fin.operating_profit;
    document.getElementById('statNetProfit').innerText = fin.net_profit;

    // YoY 증감 표시 (백엔드 visual_pipeline 제공 시)
    const revYoyEl = document.getElementById('statRevenueYoy');
    const opYoyEl = document.getElementById('statOpYoy');
    const netYoyEl = document.getElementById('statNetYoy');

    if (vp) {
      if (revYoyEl && vp.revenue?.growth_yoy) revYoyEl.innerText = `전년비 ${vp.revenue.growth_yoy}`;
      if (opYoyEl && vp.op_profit?.growth_yoy) opYoyEl.innerText = `전년비 ${vp.op_profit.growth_yoy}`;
      if (netYoyEl && vp.net_profit?.growth_yoy) netYoyEl.innerText = `전년비 ${vp.net_profit.growth_yoy}`;
    }

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

    const opInsightText = document.getElementById('compOpInsightText');
    if (opInsightText && vp) {
      const revGrowth = vp.revenue?.growth_yoy || '';
      const opGrowth = vp.op_profit?.growth_yoy || '';
      if (opGrowth.startsWith('+') && parseFloat(opGrowth) > parseFloat(revGrowth)) {
        opInsightText.innerText = `매출(${revGrowth})보다 영업이익(${opGrowth})이 훨씬 가파르게 증가했어요! 고수익 상품 위주로 잘 팔려 '영업 레버리지' 효과를 톡톡히 보고 있는 신호예요.`;
      } else {
        opInsightText.innerText = `매출과 영업이익 흐름을 비교해 보면, 원가와 판관비 통제력이 기업 실적 방어의 핵심 열쇠임을 알 수 있어요.`;
      }
    }

    // DART 원본 테이블 렌더링 (연도별 데이터셋 매칭)
    const companyFallbacks = FALLBACK_DART_TABLES[id] || FALLBACK_DART_TABLES['olive'];
    const dartRows = data.dart_raw_table || (companyFallbacks[selectedYear] || companyFallbacks['2024']);
    renderDartTable(dartRows, comp);

    // 실제 DART 데이터 수치를 변수화하여 "어떤 상황으로 읽히는지 & 투자 액션" 동적 분석 수행
    renderDynamicSituationalAnalysis(dartRows, comp, selectedYear);

    // [신규] 5분 스스로 진단 프레임워크 렌더링 & 나만의 매수 원칙 노트 로드
    renderSelfCheckingDashboard(dartRows, comp, selectedYear);
    loadUserInvestmentNote(id);

    // Micro Investment Metaphor
    const microInvest = calculateMicroInvestmentMetaphor(id, 50000);
    const microTextEl = document.getElementById('microInvestText');
    if (microTextEl && microInvest) {
      microTextEl.innerHTML = microInvest.text || `5만 원 투자 시, 이 기업의 연간 기대 귀속 순이익: <strong>${(microInvest.annualProfitShare || 0).toLocaleString()}원</strong> 수준을 향유하는 것과 같아요.`;
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
    console.warn('API 연동 실패, 로컬 실데이터 기반 렌더링:', err);
    
    // 오프라인/로컬 직접 실행 시에도 DART 실제 데이터 렌더링
    const offlineMock = {
      olive: {
        company: { name: 'CJ올리브영', icon: '🧴', category_name: '뷰티 & 헬스케어', highlight: '영업이익 4,660억 (12.1%)' },
        financials: {
          revenue: '3조 8,612억', cost: '3조 3,952억', operating_profit: '4,660억 (12.1%)', net_profit: '3,473억 (9.0%)',
          raw_revenue: 3861182100138, raw_cost: 3395166844461, raw_op_profit: 466015255677, raw_net_profit: 347298269234
        },
        ai_summary: {
          summary: [
            '연간 매출 3조 8,612억 원(+39%)으로 창사 이래 최대 실적을 달성했습니다.',
            '오늘드림(당일 배송) 인기로 온라인 매출 비중이 사상 처음 30.6%를 돌파했습니다.',
            '영업이익률 12.1%로 일반 유통마트(3~5%) 대비 3배 이상의 고수익성을 기록했습니다.'
          ],
          good_points: ['오프라인 매장 1,340개 독점력', 'K-뷰티 외국인 관광객 매출 급증', 'PB 브랜드 마진율 강화'],
          risks: ['국내 출점 한계에 따른 글로벌 확장 과제', '공정위 납품업체 상생 규제 이슈']
        },
        visual_pipeline: {
          revenue: { growth_yoy: '+39.0%' },
          op_profit: { growth_yoy: '+69.8%' },
          net_profit: { growth_yoy: '+66.9%' }
        }
      },
      hyundai: {
        company: { name: '현대자동차', icon: '🚗', category_name: '모빌리티 & 완성차', highlight: '영업익 15조 (상장사 1위)' },
        financials: {
          revenue: '162조 6,636억', cost: '147조 5,367억', operating_profit: '15조 1,269억 (9.3%)', net_profit: '12조 2,723억 (7.5%)',
          raw_revenue: 162663579000000, raw_cost: 147536678000000, raw_op_profit: 15126901000000, raw_net_profit: 12272301000000
        },
        ai_summary: {
          summary: [
            '영업이익 15조 1,269억 원으로 삼성전자를 제치고 2023년 상장사 영업이익 1위에 등극했습니다.',
            '고수익 제네시스와 싼타페/투싼 등 SUV 판매 호조가 이익 성장을 견인했습니다.',
            '전기차 캐즘 속에서 하이브리드(HEV) 판매 급증으로 완벽하게 방어했습니다.'
          ],
          good_points: ['글로벌 완성차 최고 수준의 하이브리드 경쟁력', '제네시스 브랜드의 럭셔리 라인업 안착'],
          risks: ['미국/유럽 전기차 보조금 축소 정책 리스크', '글로벌 고금리에 따른 자동차 할부 부담']
        },
        visual_pipeline: {
          revenue: { growth_yoy: '+14.4%' },
          op_profit: { growth_yoy: '+54.0%' },
          net_profit: { growth_yoy: '+53.7%' }
        }
      }
    };

    const target = offlineMock[id] || offlineMock['olive'];
    const comp = target.company;
    const fin = target.financials;
    const ai = target.ai_summary;
    const vp = target.visual_pipeline;

    // Header & Metaphor
    if (document.getElementById('compIcon')) document.getElementById('compIcon').innerText = comp.icon;
    if (document.getElementById('compName')) document.getElementById('compName').innerText = comp.name;
    if (document.getElementById('compBadge')) document.getElementById('compBadge').innerText = comp.category_name;
    if (document.getElementById('compHighlightBadge')) document.getElementById('compHighlightBadge').innerText = comp.highlight;
    
    const scaleMeta = getCompanyScaleMetaphor(id);
    if (document.getElementById('compMetaphorHead')) {
      document.getElementById('compMetaphorHead').innerText = `"${scaleMeta?.headline || scaleMeta?.annualMetaphor || scaleMeta?.scaleSummary || comp.highlight || '연간 실적 체감 환산'}"`;
    }
    updateLiveSpendMetaphor(id, parseInt(document.getElementById('detailSpendInput')?.value, 10) || 35000);

    // Financials
    document.getElementById('statRevenue').innerText = fin.revenue;
    document.getElementById('statCost').innerText = fin.cost;
    document.getElementById('statOpProfit').innerText = fin.operating_profit;
    document.getElementById('statNetProfit').innerText = fin.net_profit;

    if (document.getElementById('statRevenueYoy') && vp.revenue?.growth_yoy) document.getElementById('statRevenueYoy').innerText = `전년비 ${vp.revenue.growth_yoy}`;
    if (document.getElementById('statOpYoy') && vp.op_profit?.growth_yoy) document.getElementById('statOpYoy').innerText = `전년비 ${vp.op_profit.growth_yoy}`;
    if (document.getElementById('statNetYoy') && vp.net_profit?.growth_yoy) document.getElementById('statNetYoy').innerText = `전년비 ${vp.net_profit.growth_yoy}`;

    const revRaw = fin.raw_revenue || 1;
    const costPct = ((fin.raw_cost / revRaw) * 100).toFixed(1);
    const opPct = ((fin.raw_op_profit / revRaw) * 100).toFixed(1);
    const netPct = ((fin.raw_net_profit / revRaw) * 100).toFixed(1);

    if (document.getElementById('statCostPct')) document.getElementById('statCostPct').innerText = `${costPct}%`;
    if (document.getElementById('statOpProfitPct')) document.getElementById('statOpProfitPct').innerText = `${opPct}%`;
    if (document.getElementById('statNetProfitPct')) document.getElementById('statNetProfitPct').innerText = `${netPct}%`;

    if (document.getElementById('statCostBar')) document.getElementById('statCostBar').style.width = `${costPct}%`;
    if (document.getElementById('statOpBar')) document.getElementById('statOpBar').style.width = `${opPct}%`;
    if (document.getElementById('statNetBar')) document.getElementById('statNetBar').style.width = `${netPct}%`;

    const opInsightText = document.getElementById('compOpInsightText');
    if (opInsightText && vp) {
      const revGrowth = vp.revenue?.growth_yoy || '';
      const opGrowth = vp.op_profit?.growth_yoy || '';
      if (opGrowth.startsWith('+') && parseFloat(opGrowth) > parseFloat(revGrowth)) {
        opInsightText.innerText = `매출(${revGrowth})보다 영업이익(${opGrowth})이 훨씬 가파르게 증가했어요! 고수익 상품 위주로 잘 팔려 '영업 레버리지' 효과를 톡톡히 보고 있는 신호예요.`;
      } else {
        opInsightText.innerText = `매출과 영업이익 흐름을 비교해 보면, 원가와 판관비 통제력이 기업 실적 방어의 핵심 열쇠임을 알 수 있어요.`;
      }
    }

    // DART Table
    const companyFallbacks = FALLBACK_DART_TABLES[id] || FALLBACK_DART_TABLES['olive'];
    const fallbackRows = companyFallbacks[selectedYear] || companyFallbacks['2024'];
    renderDartTable(fallbackRows, comp);
    renderDynamicSituationalAnalysis(fallbackRows, comp, selectedYear);

    // [신규] 5분 스스로 진단 프레임워크 렌더링 & 나만의 매수 원칙 노트 로드
    renderSelfCheckingDashboard(fallbackRows, comp, selectedYear);
    loadUserInvestmentNote(id);

    // Summary
    document.getElementById('summaryList').innerHTML = ai.summary.map(s => 
      `<li class="flex items-start gap-2.5"><span class="text-emerald-600 font-extrabold">•</span><span class="leading-relaxed">${s}</span></li>`
    ).join('');
    document.getElementById('goodList').innerHTML = ai.good_points.map(p => 
      `<li class="flex items-start gap-2.5"><span class="text-emerald-500 font-bold">✓</span><span class="leading-relaxed">${p}</span></li>`
    ).join('');
    document.getElementById('riskList').innerHTML = ai.risks.map(r => 
      `<li class="flex items-start gap-2.5"><span class="text-rose-500 font-bold">⚠️</span><span class="leading-relaxed">${r}</span></li>`
    ).join('');

    if (window.lucide) lucide.createIcons();
  }
}

const FALLBACK_QUIZZES = {
  olive: {
    question: 'CJ올리브영의 2024년 영업이익률은 12.2%에 달합니다. 일반 대형마트(3~5%) 대비 이렇게 압도적인 마진을 낼 수 있는 핵심 비결은 무엇일까요?',
    options: [
      { text: '인기 PB 상품 확대 및 오늘드림 온·오프라인 옴니채널 독점력', is_correct: true },
      { text: '매장 수를 절반으로 줄여 임대료를 대폭 절감했기 때문', is_correct: false },
      { text: '해외 지사를 모두 철수하고 국내 배달만 집중했기 때문', is_correct: false },
      { text: '화장품 가격을 10배 이상 인상했기 때문', is_correct: false }
    ],
    explanation: '올리브영은 전국 1,340여 개 매장을 거점으로 하는 당일 배송(오늘드림)과 고마진 자체 브랜드(PB) 판매 확대로 압도적인 영업이익률을 달성했습니다.'
  },
  hyundai: {
    question: '현대자동차가 2023~2024년 역대 최대 영업이익(상장사 1위)을 달성할 수 있었던 일등공신은 무엇일까요?',
    options: [
      { text: '경차와 저가 승용차 위주의 대량 박리다매 판매', is_correct: false },
      { text: '고수익 제네시스 럭셔리 라인업과 하이브리드(HEV)·SUV 판매 호조', is_correct: true },
      { text: '모든 생산 공장을 100% 무인 로봇으로 전환했기 때문', is_correct: false },
      { text: '전기차 전 차종에 대한 50% 파격 할인 프로모션', is_correct: false }
    ],
    explanation: '현대차는 단가가 높은 제네시스 럭셔리 브랜드와 SUV, 그리고 전기차 캐즘 속에서 하이브리드(HEV) 차량 판매가 폭발하며 역대급 실적을 기록했습니다.'
  },
  musinsa: {
    question: '무신사의 DART 공시에서 주목할 만한 성장 동력과 수익 모델의 핵심은 무엇일까요?',
    options: [
      { text: '입점 브랜드 중개 수수료와 자체 브랜드(무신사 스탠다드)의 동반 성장', is_correct: true },
      { text: '해외 명품 직수입 독점 판매', is_correct: false },
      { text: '오프라인 백화점 단독 입점 전략', is_correct: false },
      { text: '배송비 전액 유료화 정책', is_correct: false }
    ],
    explanation: '무신사는 20대 패션 플랫폼 1위 지배력을 바탕으로 중개 수수료와 가성비/고품질 PB인 무신사 스탠다드 오프라인 매장 확장을 통해 성장하고 있습니다.'
  }
};

async function loadCompanyQuiz(id) {
  try {
    const res = await apiClient.getCompanyQuiz(id);
    if (res && res.quiz) {
      renderCompanyQuizSection('companyQuizContainer', res.quiz);
      return;
    }
  } catch (err) {
    console.warn('퀴즈 API 연동 실패, 로컬 fallback 퀴즈 로드:', err);
  }

  // Fallback 퀴즈 로드
  const quiz = FALLBACK_QUIZZES[id] || FALLBACK_QUIZZES['olive'];
  if (quiz) {
    renderCompanyQuizSection('companyQuizContainer', quiz);
  }
}


