/**
 * [팀원 B 담당] 기업 목록 & 소비 환산기 메인 페이지 로직 (모듈화)
 */
import { calculateMetaphor } from '../../utils/metaphor_calculator.js';
import { apiClient } from '../../api/client.js';

// 20개 기업 로컬 폴백 마스터 데이터셋 (API 호출 실패 또는 오프라인 대비)
const FALLBACK_COMPANIES = [
  // 1. 뷰티 / 패션
  {
    id: 'olive',
    name: 'CJ올리브영',
    category: 'beauty',
    category_name: '뷰티 & 헬스케어',
    icon: '🧴',
    status_badge: '성장세 📈',
    keywords: '올리브영 cj올리브영 화장품 스킨 독도토너 뷰티 오늘드림',
    metaphor: '연간 매출 3.8조 원 돌파! 전 국민이 립밤 10개씩 구매한 규모',
    stat1: { label: '영업이익률', val: '12.2%' },
    stat2: { label: '온라인 비중', val: '30.6%' },
    doc_name: '2023 정기 사업보고서'
  },
  {
    id: 'musinsa',
    name: '무신사',
    category: 'beauty',
    category_name: '패션 & 커머스',
    icon: '👕',
    status_badge: '거래액 4조 🛍️',
    keywords: '무신사 패션 옷 쇼핑 29cm 무진장 세일',
    metaphor: '연간 거래액 4조 돌파! 5만 원짜리 맨투맨 8,000만 장 거래 규모',
    stat1: { label: '연간 매출', val: '9,931억 원' },
    stat2: { label: '회원 수', val: '1,500만 명' },
    doc_name: '2023 감사보고서'
  },
  {
    id: 'amore',
    name: '아모레퍼시픽',
    category: 'beauty',
    category_name: 'K-뷰티 코스메틱',
    icon: '💄',
    status_badge: '체질개선 🔄',
    keywords: '아모레퍼시픽 설화수 이니스프리 코스알엑스 라네즈',
    metaphor: '코스알엑스 인수로 미국 아마존 화장품 1위 달성!',
    stat1: { label: '글로벌 매출', val: '북미/유럽 +58%' },
    stat2: { label: '대표 브랜드', val: '설화수, 라네즈' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'ably',
    name: '에이블리 (에이블리코퍼레이션)',
    category: 'beauty',
    category_name: 'AI 스타일 커머스',
    icon: '👗',
    status_badge: '첫 연간흑자 🎉',
    keywords: '에이블리 여성의류 쇼핑몰 뷰티 10대 지그재그',
    metaphor: '1020 여성 앱 사용자 1위! 론칭 후 첫 연간 흑자 달성!',
    stat1: { label: '연간 매출', val: '2,595억 원' },
    stat2: { label: '영업이익', val: '33억 (흑자전환)' },
    doc_name: '2023 감사보고서'
  },
  {
    id: 'fnf',
    name: 'F&F (에프앤에프)',
    category: 'beauty',
    category_name: 'K-패션 & 아웃도어',
    icon: '🧢',
    status_badge: '해외대박 🌏',
    keywords: '에프앤에프 mlb 디스커버리 모자 패딩',
    metaphor: '중국에서만 MLB 모자/의류 1조 원 넘게 팔아치운 저력!',
    stat1: { label: '영업이익률', val: '22.8% (초고마진)' },
    stat2: { label: '중국 매장수', val: '1,100여 개' },
    doc_name: '2023 사업보고서'
  },

  // 2. IT / 플랫폼 / 콘텐츠
  {
    id: 'naver',
    name: '네이버',
    category: 'tech',
    category_name: '포털 & 커머스 & AI',
    icon: '🟢',
    status_badge: '매출 9.6조 🌐',
    keywords: '네이버 웹툰 네이버페이 스마트스토어 ai 하이퍼클로바',
    metaphor: '연간 매출 9.6조! 대한민국 전 국민이 네이버 쇼핑 20만 원씩 이용',
    stat1: { label: '연간 매출', val: '9조 6,706억' },
    stat2: { label: '영업이익', val: '1조 4,888억' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'kakao',
    name: '카카오',
    category: 'tech',
    category_name: '메신저 & 콘텐츠',
    icon: '💬',
    status_badge: '조정기 ⚠️',
    keywords: '카카오 카카오톡 선물하기 이모티콘 톡비즈',
    metaphor: '선물하기 거래액 2.5조! 국민 1인당 커피 12잔씩 선물한 셈',
    stat1: { label: '카톡 이용자', val: '4,800만 명' },
    stat2: { label: '연간 매출', val: '7조 5,570억' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'daangn',
    name: '당근 (당근마켓)',
    category: 'tech',
    category_name: '지역 생활 커뮤니티',
    icon: '🥕',
    status_badge: '첫 흑자달성 🎉',
    keywords: '당근 당근마켓 중고거래 당근페이 동네생활 로컬광고',
    metaphor: '가입자 3,600만 명! 동네 광고 매출 급증으로 사상 첫 흑자 달성!',
    stat1: { label: '연간 매출', val: '1,276억 원' },
    stat2: { label: '영업이익', val: '173억 (흑자)' },
    doc_name: '2023 감사보고서'
  },
  {
    id: 'hybe',
    name: '하이브 (HYBE)',
    category: 'tech',
    category_name: '엔터 & 글로벌 팬덤',
    icon: '🎤',
    status_badge: '매출 2조 🎵',
    keywords: '하이브 bts 세븐틴 뉴진스 위버스 엔터 앨범 포카',
    metaphor: '연간 앨범 판매 4,300만 장! K-POP 엔터 최초 매출 2조 돌파!',
    stat1: { label: '연간 매출', val: '2조 1,780억' },
    stat2: { label: '음반 판매량', val: '4,360만 장' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'krafton',
    name: '크래프톤',
    category: 'tech',
    category_name: '게임 & 글로벌 IP',
    icon: '🎮',
    status_badge: '영업익 7,600억 🚀',
    keywords: '크래프톤 배틀그라운드 펍지 치킨 모바일게임 스팀',
    metaphor: '배틀그라운드 인도(BGMI) 대박! 게임업계 최고 수준 40% 영업이익률!',
    stat1: { label: '연간 매출', val: '1조 9,106억' },
    stat2: { label: '영업이익률', val: '40.2% (초대박)' },
    doc_name: '2023 사업보고서'
  },

  // 3. 카페 / 푸드 / 배달
  {
    id: 'starbucks',
    name: '스타벅스 (SCK컴퍼니)',
    category: 'fnb',
    category_name: '식음료 & 카페',
    icon: '☕',
    status_badge: '안정적 ☕',
    keywords: '스타벅스 sck 커피 아메리카노 사이렌오더 텀블러',
    metaphor: '하루 커피 120만 잔! 1.8초마다 아메리카노 1잔씩 팔리는 규모',
    stat1: { label: '연간 매출', val: '2조 9,295억' },
    stat2: { label: '전국 매장수', val: '1,890개점' },
    doc_name: '2023 감사보고서'
  },
  {
    id: 'baemin',
    name: '우아한형제들 (배달의민족)',
    category: 'fnb',
    category_name: '배달 & 커머스',
    icon: '🛵',
    status_badge: '영업익 7,000억 🍗',
    keywords: '배달의민족 우아한형제들 배민 치킨 b마트 야식 배달',
    metaphor: '영업이익 7,000억 원! 치킨 3,500만 마리 순이익에 해당하는 규모',
    stat1: { label: '연간 매출', val: '3조 4,155억' },
    stat2: { label: '영업이익률', val: '20.5% (초고마진)' },
    doc_name: '2023 감사보고서'
  },
  {
    id: 'cj_food',
    name: 'CJ제일제당',
    category: 'fnb',
    category_name: 'K-푸드 & 바이오',
    icon: '🥟',
    status_badge: '비비고 글로벌 🥟',
    keywords: 'cj제일제당 비비고 만두 햇반 슈완스 고메 스팸',
    metaphor: '미국 만두 시장 점유율 1위! 비비고 만두로만 글로벌 1조 원 돌파!',
    stat1: { label: '식품 매출', val: '11조 2,644억' },
    stat2: { label: '미국 점유율', val: '만두 1위 (42%)' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'bgf',
    name: 'BGF리테일 (CU 편의점)',
    category: 'fnb',
    category_name: '편의점 유통',
    icon: '🏪',
    status_badge: '연세대빵 신드롬 🥖',
    keywords: 'bgf리테일 cu 편의점 연세우유빵 편스토랑 삼각김밥 득템',
    metaphor: '전국 CU 매장 17,700개! 연세우유 생크림빵 5,000만 개 판매!',
    stat1: { label: '연간 매출', val: '8조 1,948억' },
    stat2: { label: '전국 점포수', val: '17,762개점' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'ottogi',
    name: '오뚜기',
    category: 'fnb',
    category_name: '종합 식품',
    icon: '🍜',
    status_badge: '갓뚜기 💛',
    keywords: '오뚜기 진라면 카레 케찹 오뚜기밥 3분카레 마요네즈',
    metaphor: '진라면 연간 7억 개 판매! 전 국민이 1년에 14봉지씩 끓여먹은 셈',
    stat1: { label: '연간 매출', val: '3조 4,545억' },
    stat2: { label: '영업이익', val: '2,549억 원' },
    doc_name: '2023 사업보고서'
  },

  // 4. 모빌리티 / 라이프
  {
    id: 'hyundai',
    name: '현대자동차',
    category: 'mobility',
    category_name: '모빌리티 & 완성차',
    icon: '🚗',
    status_badge: '영업익 15조 🚀',
    keywords: '현대차 현대자동차 아반떼 싼타페 제네시스 전기차 하이브리드',
    metaphor: '연간 영업이익 15조 원 신기록! 아반떼 75만 대 순마진 규모',
    stat1: { label: '영업이익', val: '15조 1,269억' },
    stat2: { label: '글로벌 순위', val: '완성차 TOP 3' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'kia',
    name: '기아 (KIA)',
    category: 'mobility',
    category_name: '모빌리티 & 레저차량',
    icon: '🚘',
    status_badge: '영업익률 11.6% 🔥',
    keywords: '기아 기아차 카니발 쏘렌토 ev9 스포티지 셀토스',
    metaphor: '쏘렌토·카니발 품귀 현상! 글로벌 완성차 최고 수준 두 자릿수 마진율!',
    stat1: { label: '영업이익', val: '11조 6,079억' },
    stat2: { label: '영업이익률', val: '11.6% (글로벌 톱)' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'daiso',
    name: '아성다이소',
    category: 'mobility',
    category_name: '균일가 생활용품',
    icon: '🛒',
    status_badge: '매출 3조 돌파 🪙',
    keywords: '아성다이소 다이소 천원 뷰티 리들샷 생필품 문구 가성비',
    metaphor: '연간 매출 3조 원 돌파! 1,000원짜리 생필품 30억 개 판매한 규모',
    stat1: { label: '연간 매출', val: '3조 4,604억' },
    stat2: { label: '1000원 비중', val: '약 50% 유지' },
    doc_name: '2023 감사보고서'
  },
  {
    id: 'cgv',
    name: 'CJ CGV',
    category: 'mobility',
    category_name: '극장 & 멀티플렉스',
    icon: '🍿',
    status_badge: '흑자전환 🎬',
    keywords: 'cj cgv cgv 영화관 팝콘 아이맥스 4dx 티켓 예매',
    metaphor: '서울의 봄·파묘 천만 관객 돌파! IMAX/4DX 특별관 매출 급증!',
    stat1: { label: '연간 매출', val: '1조 5,458억' },
    stat2: { label: '영업이익', val: '491억 (흑자)' },
    doc_name: '2023 사업보고서'
  },
  {
    id: 'yanolja',
    name: '야놀자',
    category: 'mobility',
    category_name: '여행 & 여가 테크',
    icon: '✈️',
    status_badge: '글로벌 테크 🏨',
    keywords: '야놀자 호텔 모텔 숙박 비행기 인터파크트리플 여행 패키지',
    metaphor: '인터파크트리플 인수로 항공·여행 1위! 미국 나스닥 상장 추진!',
    stat1: { label: '연간 매출', val: '7,667억 원' },
    stat2: { label: '클라우드', val: '영업익 흑자 견인' },
    doc_name: '2023 사업보고서'
  }
];

let allCompanies = [];
let currentCategory = 'all';

async function init() {
  if (window.lucide) lucide.createIcons();
  setupEventListeners();
  updateMetaphorDisplay();
  await fetchCompaniesData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


/**
 * 이벤트 리스너 등록
 */
function setupEventListeners() {
  const brandSelect = document.getElementById('brandSelect');
  const spendInput = document.getElementById('spendInput');
  const searchInput = document.getElementById('companySearchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');

  if (brandSelect) brandSelect.addEventListener('change', updateMetaphorDisplay);
  if (spendInput) spendInput.addEventListener('input', updateMetaphorDisplay);

  // 프리셋 칩 클릭
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const amount = Number(chip.getAttribute('data-amount')) || 0;
      if (spendInput) {
        spendInput.value = amount;
        updateMetaphorDisplay();
      }
    });
  });

  // 실시간 검색
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim();
      if (btnClearSearch) btnClearSearch.classList.toggle('hidden', q.length === 0);
      applyFilterAndRender();
    });
  }

  // 검색 클리어
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      btnClearSearch.classList.add('hidden');
      applyFilterAndRender();
    });
  }

  // 카테고리 탭
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-btn').forEach(b => {
        b.className = 'category-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0';
      });
      e.currentTarget.className = 'category-btn active px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm shrink-0';
      currentCategory = e.currentTarget.getAttribute('data-category') || 'all';
      applyFilterAndRender();
    });
  });
}

/**
 * 소비 환산기 실시간 계산 및 렌더링
 */
function updateMetaphorDisplay() {
  const brandSelect = document.getElementById('brandSelect');
  const spendInput = document.getElementById('spendInput');
  if (!brandSelect || !spendInput) return;

  const brandKey = brandSelect.value;
  const spendVal = Number(spendInput.value) || 0;
  const result = calculateMetaphor(brandKey, spendVal);
  if (!result) return;

  const resultIcon = document.getElementById('resultIcon');
  const resultTitle = document.getElementById('resultTitle');
  const resultSub = document.getElementById('resultSub');
  const dispSpend = document.getElementById('dispSpend');
  const resultBrandTarget = document.getElementById('resultBrandTarget');
  const dispMetaphor = document.getElementById('dispMetaphor');
  const dispMargin = document.getElementById('dispMargin');
  const btnGoDetail = document.getElementById('btnGoDetail');
  const resultCard = document.getElementById('resultCard');

  if (resultIcon) resultIcon.innerText = result.icon;
  if (resultTitle) resultTitle.innerText = `${result.brandName} 체감 분석`;
  if (resultSub) resultSub.innerText = `최근 공시 영업이익률 약 ${result.marginRatePct}% 적용`;
  if (dispSpend) dispSpend.innerText = `${result.spendAmount.toLocaleString()}원`;
  if (resultBrandTarget) resultBrandTarget.innerText = result.brandName.split('(')[0].trim();
  if (dispMetaphor) dispMetaphor.innerText = result.summaryText;
  if (dispMargin) {
    dispMargin.innerHTML = `순수 기업 이익금 환산액 : <span class="font-bold text-slate-800">약 ${result.marginEarned.toLocaleString()}원</span>`;
  }
  if (btnGoDetail) {
    btnGoDetail.href = `/company-details?id=${result.brandKey}`;
  }

  // 애니메이션 효과
  if (resultCard) {
    resultCard.classList.remove('bounce-highlight');
    void resultCard.offsetWidth; // Reflow
    resultCard.classList.add('bounce-highlight');
  }
}

/**
 * 백엔드 API에서 20개 기업 데이터 로드 (실패 시 Fallback 적용)
 */
async function fetchCompaniesData() {
  try {
    const res = await apiClient.getCompanies();
    if (res && res.companies && res.companies.length > 0) {
      allCompanies = res.companies;
    } else {
      allCompanies = FALLBACK_COMPANIES;
    }
  } catch (err) {
    console.warn('[Easy-DART] API 통신 실패, 자체 마스터 데이터셋을 사용합니다:', err);
    allCompanies = FALLBACK_COMPANIES;
  }
  applyFilterAndRender();
}

/**
 * 검색어 및 카테고리 필터 통합 적용 및 그리드 렌더링
 */
function applyFilterAndRender() {
  const query = (document.getElementById('companySearchInput')?.value || '').toLowerCase().trim();
  
  let list = allCompanies;
  if (currentCategory !== 'all') {
    list = list.filter(c => c.category === currentCategory);
  }

  if (query) {
    list = list.filter(c => {
      const nameMatch = (c.name || '').toLowerCase().includes(query);
      const catMatch = (c.category_name || '').toLowerCase().includes(query);
      const keyMatch = (c.keywords || '').toLowerCase().includes(query);
      const itemMatch = (c.item_name || '').toLowerCase().includes(query);
      return nameMatch || catMatch || keyMatch || itemMatch;
    });
  }

  renderCards(list);
}

const SUPPORTED_COMPANY_IDS = ['olive', 'hyundai', 'musinsa', 'naver', 'starbucks'];

/**
 * 기업 카드 HTML 그리드 렌더링
 */
function renderCards(items) {
  const grid = document.getElementById('companyGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  if (items.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.classList.remove('hidden');
    return;
  }

  if (noResults) noResults.classList.add('hidden');

  grid.innerHTML = items.map(c => {
    const isSupported = SUPPORTED_COMPANY_IDS.includes(c.id);
    const catName = c.category_name || '일상 기업';
    const badge = isSupported ? (c.status_badge || '공시 분석 📈') : '준비중 ⏳';
    const metaphorText = c.metaphor || `영업이익으로 ${c.item_name || '대표 상품'} 대량 판매 효과!`;
    const docName = c.doc_name || '2023 사업보고서';
    const stat1Label = c.stat1?.label || '대표 상품';
    const stat1Val = c.stat1?.val || (c.item_name || '-');
    const stat2Label = c.stat2?.label || '이익률';
    const stat2Val = c.stat2?.val || (c.margin_rate ? `${(c.margin_rate * 100).toFixed(1)}%` : '-');

    if (isSupported) {
      return `
        <div class="company-card bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle cursor-pointer group flex flex-col justify-between hover:border-emerald-300 hover:shadow-md transition-all" onclick="location.href='/company-details?id=${c.id}'">
          <div>
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm">
                  ${c.icon || '🏢'}
                </div>
                <div>
                  <h3 class="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">${c.name}</h3>
                  <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">${catName}</span>
                </div>
              </div>
              <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">${badge}</span>
            </div>

            <!-- Metaphor Highlight Box -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 mb-4">
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">체감 환산 💡</p>
              <p class="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
                "${metaphorText}"
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-slate-50">
                <p class="text-[10px] text-slate-400">${stat1Label}</p>
                <p class="font-black text-slate-800 text-sm truncate">${stat1Val}</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-50">
                <p class="text-[10px] text-slate-400">${stat2Label}</p>
                <p class="font-black text-emerald-700 text-sm truncate">${stat2Val}</p>
              </div>
            </div>
          </div>

          <!-- Footer Link -->
          <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>DART ${docName}</span>
            <span class="font-bold text-emerald-600 group-hover:translate-x-1.5 transition-transform flex items-center gap-0.5">
              상세 파헤치기 ➡️
            </span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="company-card bg-slate-100/60 rounded-3xl p-6 border border-slate-200/80 shadow-none cursor-not-allowed flex flex-col justify-between opacity-50 grayscale-[40%] select-none">
          <div>
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-slate-200/80 text-slate-500 flex items-center justify-center text-2xl shadow-none">
                  ${c.icon || '🏢'}
                </div>
                <div>
                  <h3 class="font-extrabold text-base text-slate-600">${c.name}</h3>
                  <span class="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">${catName}</span>
                </div>
              </div>
              <span class="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full border border-slate-300">준비중 ⏳</span>
            </div>

            <!-- Metaphor Highlight Box -->
            <div class="p-4 rounded-2xl bg-slate-200/40 border border-slate-200/60 space-y-1 mb-4">
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">체감 환산 💡</p>
              <p class="text-xs sm:text-sm font-bold text-slate-500 leading-snug">
                "${metaphorText}"
              </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-slate-200/50">
                <p class="text-[10px] text-slate-400">${stat1Label}</p>
                <p class="font-bold text-slate-600 text-sm truncate">${stat1Val}</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-200/50">
                <p class="text-[10px] text-slate-400">${stat2Label}</p>
                <p class="font-bold text-slate-500 text-sm truncate">${stat2Val}</p>
              </div>
            </div>
          </div>

          <!-- Footer Link -->
          <div class="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>DART 데이터 연동 준비중</span>
            <span class="font-semibold text-slate-400 flex items-center gap-1">
              <span>🔒 준비중</span>
            </span>
          </div>
        </div>
      `;
    }
  }).join('');

  if (window.lucide) lucide.createIcons();
}
