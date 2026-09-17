/**
 * [팀원 B 담당] 20대 일상 기업 대표 상품 단가 및 소비/기업 실적 환산 알고리즘 모듈
 * 
 * 타겟 페르소나 고려사항:
 * - 페르소나 1 (김지은, 23세 대학생): "올리브영 틴트/토너 몇 개 마진인지, 소액(1~5만원) 소비가 기업에 어떻게 남는지 직관적 비유"
 * - 페르소나 2 (박민우, 31세 직장인): "현대차 아반떼 몇 대 순마진인지, 퇴근 후 체감 가능한 숫자로 기업 체력 파악"
 */

export const BRAND_METAPHOR_MAP = {
  // 1. 뷰티 & 패션
  olive: {
    id: 'olive',
    name: 'CJ올리브영',
    category: 'beauty',
    categoryName: '뷰티 & 헬스케어',
    icon: '🧴',
    marginRate: 0.122, // 12.2%
    itemPrice: 3000,
    itemName: '독도토너',
    unit: '병',
    annualProfitMetaphor: '연간 순이익 = 독도토너 약 1,864만 병!',
    scaleSummary: '전 국민이 1년에 립밤 10개씩 결제한 마진 규모',
    defaultSpend: 35000,
    highlight: '유통업계 최상위 영업이익률 12.2%'
  },
  musinsa: {
    id: 'musinsa',
    name: '무신사',
    category: 'beauty',
    categoryName: '패션 & 커머스',
    icon: '👕',
    marginRate: 0.086, // 8.6%
    itemPrice: 50000,
    itemName: '무탠다드 맨투맨',
    unit: '장',
    annualProfitMetaphor: '연간 거래액 4조 돌파! 5만 원 맨투맨 8,000만 장 규모',
    scaleSummary: '2030 청년 인구 전체가 매달 옷 한 벌씩 구매한 규모',
    defaultSpend: 50000,
    highlight: '거래액 4조원 돌파 1위 패션 플랫폼'
  },
  amore: {
    id: 'amore',
    name: '아모레퍼시픽',
    category: 'beauty',
    categoryName: 'K-뷰티 코스메틱',
    icon: '💄',
    marginRate: 0.068, // 6.8%
    itemPrice: 45000,
    itemName: '설화수 윤조에센스',
    unit: '병',
    annualProfitMetaphor: '글로벌 북미/유럽 매출 58% 급성장!',
    scaleSummary: '코스알엑스 인수로 전 세계 틱톡 뷰티 대박',
    defaultSpend: 45000,
    highlight: '미국 아마존 뷰티 1위 등극'
  },
  ably: {
    id: 'ably',
    name: '에이블리',
    category: 'beauty',
    categoryName: 'AI 스타일 커머스',
    icon: '👗',
    marginRate: 0.045, // 4.5%
    itemPrice: 20000,
    itemName: '트렌드 원피스',
    unit: '벌',
    annualProfitMetaphor: '1020 여성 1위 앱! 창사 이래 첫 연간 흑자 달성',
    scaleSummary: 'MAU 800만 명의 AI 개인화 쇼핑 파워',
    defaultSpend: 25000,
    highlight: '첫 연간 흑자 달성 🎉'
  },
  fnf: {
    id: 'fnf',
    name: 'F&F (에프앤에프)',
    category: 'beauty',
    categoryName: 'K-패션 & 아웃도어',
    icon: '🧢',
    marginRate: 0.228, // 22.8%
    itemPrice: 42000,
    itemName: 'MLB 볼캡 모자',
    unit: '개',
    annualProfitMetaphor: '중국에서만 MLB 1조 판매! 영업이익률 22.8%',
    scaleSummary: '패션업계 독보적 20%대 초고마진 달성',
    defaultSpend: 42000,
    highlight: '패션업계 최고 수준 마진율'
  },

  // 2. IT & 플랫폼 & 콘텐츠
  naver: {
    id: 'naver',
    name: '네이버',
    category: 'tech',
    categoryName: '포털 & 커머스 & AI',
    icon: '🟢',
    marginRate: 0.154, // 15.4%
    itemPrice: 4900,
    itemName: '네이버플러스 멤버십 1개월권',
    unit: '개',
    annualProfitMetaphor: '연간 매출 9.6조! 전 국민 쇼핑 20만 원 이용 규모',
    scaleSummary: '웹툰 미국 상장 + 생성형 AI 하이퍼클로바X',
    defaultSpend: 30000,
    highlight: '사상 최대 연 매출 9.6조 돌파'
  },
  kakao: {
    id: 'kakao',
    name: '카카오',
    category: 'tech',
    categoryName: '메신저 & 콘텐츠',
    icon: '💬',
    marginRate: 0.081, // 8.1%
    itemPrice: 2500,
    itemName: '카톡 이모티콘 플러스',
    unit: '세트',
    annualProfitMetaphor: '선물하기 거래액 2.5조! 국민 1인당 커피 12잔 선물 규모',
    scaleSummary: '카카오톡 4,800만 국민 락인 효과',
    defaultSpend: 15000,
    highlight: '국민 메신저 독점적 트래픽'
  },
  daangn: {
    id: 'daangn',
    name: '당근 (당근마켓)',
    category: 'tech',
    categoryName: '지역 생활 커뮤니티',
    icon: '🥕',
    marginRate: 0.135, // 13.5%
    itemPrice: 3000,
    itemName: '동네 소상공인 광고 1회권',
    unit: '건',
    annualProfitMetaphor: '가입자 3,600만 명! 8년 만의 첫 연간 흑자 173억 달성',
    scaleSummary: '대한민국 3명 중 2명이 쓰는 하이퍼로컬 앱',
    defaultSpend: 10000,
    highlight: '중고거래 넘어 첫 흑자 전환'
  },
  hybe: {
    id: 'hybe',
    name: '하이브 (HYBE)',
    category: 'tech',
    categoryName: '엔터 & 글로벌 팬덤',
    icon: '🎤',
    marginRate: 0.136, // 13.6%
    itemPrice: 22000,
    itemName: 'K-POP 정규 앨범',
    unit: '장',
    annualProfitMetaphor: '연간 앨범 판매 4,360만 장! 엔터 최초 매출 2조 돌파',
    scaleSummary: 'BTS 공백에도 세븐틴/뉴진스 멀티레이블 대성공',
    defaultSpend: 40000,
    highlight: 'K-POP 엔터 사상 최초 2조 클럽'
  },
  krafton: {
    id: 'krafton',
    name: '크래프톤',
    category: 'tech',
    categoryName: '게임 & 글로벌 IP',
    icon: '🎮',
    marginRate: 0.402, // 40.2%
    itemPrice: 15000,
    itemName: '배그 치킨 패스권',
    unit: '개',
    annualProfitMetaphor: '영업이익률 40.2%! 1만 원 벌면 4,000원이 남는 알짜 회사',
    scaleSummary: '해외 매출 비중 94% 달하는 글로벌 게임 IP',
    defaultSpend: 30000,
    highlight: '독보적인 40%대 영업이익률'
  },

  // 3. 카페 & 푸드 & 배달
  starbucks: {
    id: 'starbucks',
    name: '스타벅스 (SCK컴퍼니)',
    category: 'fnb',
    categoryName: '식음료 & 카페',
    icon: '☕',
    marginRate: 0.075, // 7.5%
    itemPrice: 4500,
    itemName: '아메리카노 Tall',
    unit: '잔',
    annualProfitMetaphor: '하루 커피 120만 잔! 1.8초마다 아메리카노 1잔씩 판매',
    scaleSummary: '전국 1,890개 전 매장 100% 직영 운영의 품질력',
    defaultSpend: 12000,
    highlight: '스타벅스 카드 선불충전금 3,000억 현금력'
  },
  baemin: {
    id: 'baemin',
    name: '우아한형제들 (배달의민족)',
    category: 'fnb',
    categoryName: '배달 & 커머스',
    icon: '🛵',
    marginRate: 0.205, // 20.5%
    itemPrice: 20000,
    itemName: '황금올리브 치킨 1마리',
    unit: '마리',
    annualProfitMetaphor: '연간 영업이익 7,000억 = 치킨 3,500만 마리 순마진!',
    scaleSummary: '국내 배달 앱 점유율 65% 압도적 1위 수성',
    defaultSpend: 25000,
    highlight: '영업이익 7,000억 어닝 서프라이즈'
  },
  cj_food: {
    id: 'cj_food',
    name: 'CJ제일제당',
    category: 'fnb',
    categoryName: 'K-푸드 & 바이오',
    icon: '🥟',
    marginRate: 0.065, // 6.5%
    itemPrice: 9900,
    itemName: '비비고 왕교자 만두 1봉',
    unit: '봉지',
    annualProfitMetaphor: '미국 만두 시장 점유율 42% 1위! 비비고 만두로만 1조 매출',
    scaleSummary: '햇반/비비고 프리미엄 가공식품 R&D 글로벌 1위',
    defaultSpend: 20000,
    highlight: '미국 슈완스 인수 시너지 폭발'
  },
  bgf: {
    id: 'bgf',
    name: 'BGF리테일 (CU)',
    category: 'fnb',
    categoryName: '편의점 유통',
    icon: '🏪',
    marginRate: 0.035, // 3.5%
    itemPrice: 2800,
    itemName: '연세우유 생크림빵',
    unit: '개',
    annualProfitMetaphor: '전국 매장 17,700개! 연세우유빵 5,000만 개 판매 신드롬',
    scaleSummary: '1인 가구 일상 밀착형 근거리 유통 플랫폼',
    defaultSpend: 8000,
    highlight: '연 매출 8조원 돌파 편의점 1위'
  },
  ottogi: {
    id: 'ottogi',
    name: '오뚜기',
    category: 'fnb',
    categoryName: '종합 식품',
    icon: '🍜',
    marginRate: 0.074, // 7.4%
    itemPrice: 1000,
    itemName: '진라면 매운맛 1봉',
    unit: '봉지',
    annualProfitMetaphor: '진라면 연간 7억 개 판매! 국민 1인당 연간 14봉지 소비',
    scaleSummary: '카레/케찹 등 1위 품목 30개 이상의 서민 밥상 1위',
    defaultSpend: 15000,
    highlight: '착한 기업 이미지 & BTS 진 효과 해외 수출'
  },

  // 4. 모빌리티 & 라이프스타일
  hyundai: {
    id: 'hyundai',
    name: '현대자동차',
    category: 'mobility',
    categoryName: '모빌리티 & 완성차',
    icon: '🚗',
    marginRate: 0.093, // 9.3%
    itemPrice: 20000000,
    itemName: '아반떼 1대 순마진',
    unit: '대',
    annualProfitMetaphor: '연간 영업이익 15조 원 신기록! 아반떼 75만 대 순마진 규모',
    scaleSummary: '삼성전자 제치고 상장사 영업이익 1위 등극',
    defaultSpend: 100000,
    highlight: '대한민국 기업 영업이익 1위 (15조)'
  },
  kia: {
    id: 'kia',
    name: '기아 (KIA)',
    category: 'mobility',
    categoryName: '모빌리티 & 레저차량',
    icon: '🚘',
    marginRate: 0.116, // 11.6%
    itemPrice: 35000000,
    itemName: '쏘렌토 하이브리드',
    unit: '대',
    annualProfitMetaphor: '영업이익률 11.6%! 테슬라 앞서는 글로벌 최고 수익성',
    scaleSummary: '쏘렌토/카니발 RV 차량의 압도적인 글로벌 인기',
    defaultSpend: 100000,
    highlight: '글로벌 완성차 최고 수준 마진율'
  },
  daiso: {
    id: 'daiso',
    name: '아성다이소',
    category: 'mobility',
    categoryName: '균일가 생활용품',
    icon: '🛒',
    marginRate: 0.076, // 7.6%
    itemPrice: 1000,
    itemName: '1,000원 국민 생필품',
    unit: '개',
    annualProfitMetaphor: '연간 매출 3조 돌파! 1,000원 생필품 30억 개 판매 규모',
    scaleSummary: 'VT 리들샷 뷰티 품절 대란 + 1,000원 비중 50% 유지',
    defaultSpend: 10000,
    highlight: '불황에 더 강한 균일가 신화'
  },
  cgv: {
    id: 'cgv',
    name: 'CJ CGV',
    category: 'mobility',
    categoryName: '극장 & 멀티플렉스',
    icon: '🍿',
    marginRate: 0.032, // 3.2%
    itemPrice: 15000,
    itemName: 'IMAX 영화 티켓 1장',
    unit: '장',
    annualProfitMetaphor: '서울의 봄·파묘 천만 영화 릴레이! 4년 만에 영업흑자 전환',
    scaleSummary: 'IMAX/4DX 특별관 객단가 상승과 콘서트/클라이밍 공간 혁신',
    defaultSpend: 20000,
    highlight: '팬데믹 터널 지나 연간 흑자 전환'
  },
  yanolja: {
    id: 'yanolja',
    name: '야놀자',
    category: 'mobility',
    categoryName: '여행 & 여가 테크',
    icon: '✈️',
    marginRate: 0.082, // 8.2%
    itemPrice: 70000,
    itemName: '도심 호캉스 1박',
    unit: '박',
    annualProfitMetaphor: '인터파크트리플 인수로 항공/여행 1위! 미국 나스닥 상장 준비',
    scaleSummary: '전 세계 200개국 호텔에 공급하는 B2B 클라우드 급성장',
    defaultSpend: 100000,
    highlight: '글로벌 SaaS 솔루션 기업으로 진화'
  }
};

/**
 * 1. 페르소나 1(김지은) 맞춤: 내 일상 소비액 입력 ➡️ 기업 순마진 & 대표 상품 환산
 */
export function calculateSpendMetaphor(brandKey, spendAmount) {
  const brand = BRAND_METAPHOR_MAP[brandKey];
  if (!brand) return null;

  const spend = Number(spendAmount) || 0;
  const marginEarned = Math.round(spend * brand.marginRate);
  
  // 소수점 1자리까지 표기 (예: 토너 1.4병)
  const rawItemCount = marginEarned / (brand.itemPrice > 50000 ? (brand.itemPrice * 0.1) : brand.itemPrice);
  const itemCount = rawItemCount > 0 ? (rawItemCount < 0.1 ? '0.1' : rawItemCount.toFixed(1)) : '0.0';

  return {
    brandKey: brand.id,
    brandName: brand.name,
    icon: brand.icon,
    categoryName: brand.categoryName,
    marginRatePct: (brand.marginRate * 100).toFixed(1),
    spendAmount: spend,
    marginEarned,
    itemCount,
    itemName: brand.itemName,
    unit: brand.unit,
    summaryText: `${brand.itemName} ${itemCount}${brand.unit}`,
    friendlyMessage: `당신이 결제한 ${spend.toLocaleString()}원으로 ${brand.name}은 약 ${marginEarned.toLocaleString()}원의 알짜 마진(${brand.itemName} ${itemCount}${brand.unit} 분량)을 남겼어요!`
  };
}

// 하위 호환성 유지용 alias
export const calculateMetaphor = calculateSpendMetaphor;

/**
 * 2. 페르소나 2(박민우) 맞춤: 기업 연간 실적 ➡️ 실물 체감 규모 환산
 */
export function getCompanyScaleMetaphor(companyId) {
  const brand = BRAND_METAPHOR_MAP[companyId];
  if (!brand) return null;

  return {
    brandName: brand.name,
    icon: brand.icon,
    headline: brand.annualProfitMetaphor || brand.scaleSummary || brand.highlight || '연간 실적 체감 환산',
    annualMetaphor: brand.annualProfitMetaphor || brand.scaleSummary || '연간 실적 체감 환산',
    scaleSummary: brand.scaleSummary || brand.annualProfitMetaphor || '연간 실적 체감 환산',
    highlight: brand.highlight || '실적 분석',
    marginRatePct: (brand.marginRate * 100).toFixed(1)
  };
}

/**
 * 3. 소액 투자자(김지은/박민우 공통) 맞춤: 소액 투자 시 체감 지분 환산
 */
export function calculateMicroInvestmentMetaphor(brandKey, investAmount = 50000) {
  const brand = BRAND_METAPHOR_MAP[brandKey];
  if (!brand) return null;

  const annualProfitShare = Math.round(investAmount * brand.marginRate);
  return {
    investAmount,
    annualProfitShare,
    text: `${investAmount.toLocaleString()}원 투자 시, 매년 ${brand.itemName} 약 ${(annualProfitShare / Math.max(brand.itemPrice, 1000)).toFixed(1)}${brand.unit} 생산 지분을 함께 보유하는 셈이에요!`
  };
}
