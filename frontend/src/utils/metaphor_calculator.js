/**
 * [팀원 B 담당] 20대 일상 기업 대표 상품 단가 및 소비 환산 알고리즘 모듈
 */
export const BRAND_METAPHOR_MAP = {
  olive: {
    name: 'CJ올리브영',
    icon: '🧴',
    marginRate: 0.122,
    itemPrice: 3000,
    itemName: '독도토너',
    unit: '병'
  },
  daiso: {
    name: '아성다이소',
    icon: '🛒',
    marginRate: 0.088,
    itemPrice: 1000,
    itemName: '1,000원 생필품',
    unit: '개'
  },
  starbucks: {
    name: '스타벅스(SCK)',
    icon: '☕',
    marginRate: 0.075,
    itemPrice: 1500,
    itemName: '아메리카노 Tall',
    unit: '잔'
  },
  hyundai: {
    name: '현대자동차',
    icon: '🚗',
    marginRate: 0.093,
    itemPrice: 18000,
    itemName: '차량용 방향제',
    unit: '개'
  },
  baemin: {
    name: '배달의민족',
    icon: '🛵',
    marginRate: 0.205,
    itemPrice: 2500,
    itemName: '황금올리브 배달건',
    unit: '회'
  }
};

export function calculateMetaphor(brandKey, spendAmount) {
  const brand = BRAND_METAPHOR_MAP[brandKey];
  if (!brand) return null;

  const marginEarned = Math.round(spendAmount * brand.marginRate);
  const itemCount = (marginEarned / brand.itemPrice).toFixed(1);

  return {
    brandName: brand.name,
    icon: brand.icon,
    marginRatePct: (brand.marginRate * 100).toFixed(1),
    spendAmount,
    marginEarned,
    itemCount,
    itemName: brand.itemName,
    unit: brand.unit,
    summaryText: `${brand.itemName} ${itemCount}${brand.unit}`
  };
}
