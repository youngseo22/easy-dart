/**
 * [팀원 B 담당] 20대 일상 기업 대표 상품 단가 및 소비 환산 알고리즘 모듈
 */
export const BRAND_METAPHOR_MAP = {
  olive: {
    name: 'CJ올리브영',
    icon: '🧴',
    category: '뷰티/헬스',
    marginRate: 0.122,
    itemPrice: 3000,
    itemName: '독도토너/스킨케어',
    unit: '병'
  },
  daiso: {
    name: '아성다이소',
    icon: '🛒',
    category: '생활용품',
    marginRate: 0.088,
    itemPrice: 1000,
    itemName: '1,000원 균일가 생필품',
    unit: '개'
  },
  starbucks: {
    name: '스타벅스(SCK)',
    icon: '☕',
    category: '카페/음료',
    marginRate: 0.075,
    itemPrice: 1500,
    itemName: '아메리카노 Tall',
    unit: '잔'
  },
  hyundai: {
    name: '현대자동차',
    icon: '🚗',
    category: '모빌리티',
    marginRate: 0.093,
    itemPrice: 20000,
    itemName: '차량 정비/방향제',
    unit: '개'
  },
  kakao: {
    name: '카카오',
    icon: '🎁',
    category: '플랫폼/콘텐츠',
    marginRate: 0.081,
    itemPrice: 800,
    itemName: '이모티콘 플러스',
    unit: '세트'
  },
  baemin: {
    name: '우아한형제들 (배달의민족)',
    icon: '🛵',
    category: '배달/푸드',
    marginRate: 0.205,
    itemPrice: 2500,
    itemName: '치킨 한 마리 배달건',
    unit: '회'
  },
  musinsa: {
    name: '무신사',
    icon: '👕',
    category: '패션/커머스',
    marginRate: 0.085,
    itemPrice: 4000,
    itemName: '무지 맨투맨 티셔츠',
    unit: '장'
  },
  hybe: {
    name: '하이브',
    icon: '🎤',
    category: '엔터/팬덤',
    marginRate: 0.136,
    itemPrice: 2700,
    itemName: 'K-POP 포토카드 팩',
    unit: '팩'
  },
  bgf: {
    name: 'CU 편의점 (BGF리테일)',
    icon: '🏪',
    category: '편의점/유통',
    marginRate: 0.052,
    itemPrice: 300,
    itemName: '연세우유 생크림빵',
    unit: '개'
  },
  ottogi: {
    name: '오뚜기',
    icon: '🍜',
    category: '식품',
    marginRate: 0.074,
    itemPrice: 500,
    itemName: '진라면 1봉지',
    unit: '봉지'
  }
};

/**
 * 결제 금액에 따른 기업 영업이익금 및 상품 수량 환산 계산
 * @param {string} brandKey - 브랜드 고유 키 (예: 'olive', 'daiso')
 * @param {number} spendAmount - 결제 금액 (원 단위)
 * @returns {object|null} 환산 결과 객체
 */
export function calculateMetaphor(brandKey, spendAmount) {
  const brand = BRAND_METAPHOR_MAP[brandKey];
  if (!brand) return null;

  const validSpend = Math.max(0, Number(spendAmount) || 0);
  const marginEarned = Math.round(validSpend * brand.marginRate);
  const rawCount = marginEarned / brand.itemPrice;
  const itemCount = rawCount >= 10 ? Math.round(rawCount).toLocaleString() : rawCount.toFixed(1);

  return {
    brandKey,
    brandName: brand.name,
    icon: brand.icon,
    marginRatePct: (brand.marginRate * 100).toFixed(1),
    spendAmount: validSpend,
    marginEarned,
    itemCount,
    itemName: brand.itemName,
    unit: brand.unit,
    summaryText: `${brand.itemName} ${itemCount}${brand.unit}`
  };
}
