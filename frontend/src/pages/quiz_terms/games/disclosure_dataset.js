/**
 * DART 공시 레이더 슈팅 게임 데이터셋
 * 주린이가 알아야 할 치명적 위험(악재) 공시 vs 우량 기업의 호재 공시
 */

export const DISCLOSURE_DATASET = [
  // 🚨 위험 공시 (격추 대상 - 상장폐지 & 급락 리스크)
  {
    id: "risk_01",
    keyword: "감사의견 거절",
    isDanger: true,
    category: "상장폐지 위기",
    color: "#EF4444", // Red
    score: 100,
    speed: 1.1,
    summary: "회계사가 기업 장부를 전혀 믿을 수 없다고 선언한 상태입니다. 즉시 거래정지 및 상장폐지 실질심사 대상이 되는 가장 위험한 공시입니다.",
    tip: "이 공시가 뜨면 주식은 휴지조각이 될 위험이 큽니다!"
  },
  {
    id: "risk_02",
    keyword: "완전자본잠식",
    isDanger: true,
    category: "재무 파탄",
    color: "#F97316", // Orange-Red
    score: 120,
    speed: 1.0,
    summary: "적자가 수년간 누적되어 주주들이 낸 밑천(자본금)마저 전부 까먹고 마이너스가 된 상태입니다.",
    tip: "기업의 뼈대까지 다 갉아먹은 상태로 퇴출 1순위 신호입니다."
  },
  {
    id: "risk_03",
    keyword: "횡령·배임 혐의",
    isDanger: true,
    category: "경영진 리스크",
    color: "#DC2626",
    score: 130,
    speed: 1.2,
    summary: "대표나 임직원이 회사 공금을 몰래 빼돌리거나 회사에 중대한 손해를 입힌 혐의가 포착된 사건입니다.",
    tip: "경영진의 도덕적 해이는 기업 신뢰도를 바닥으로 떨어뜨립니다."
  },
  {
    id: "risk_04",
    keyword: "부채비율 900%",
    isDanger: true,
    category: "빚더미 경고",
    color: "#EA580C",
    score: 90,
    speed: 0.9,
    summary: "내 돈(자기자본)에 비해 빌린 빚이 9배나 많다는 뜻입니다. 금리가 오르면 이자를 못 버텨 부도날 위험이 높습니다.",
    tip: "통상 부채비율은 100~200% 이하를 건전한 수준으로 봅니다."
  },
  {
    id: "risk_05",
    keyword: "전환사채(CB) 폭탄",
    isDanger: true,
    category: "주가 희석",
    color: "#E11D48",
    score: 110,
    speed: 1.15,
    summary: "나중에 주식으로 바꿀 수 있는 빚 문서를 대량 발행한 것입니다. 신주가 마구 쏟아져 기존 주주들의 주식 가치가 희석됩니다.",
    tip: "시장에 공짜 물량이 풀리는 것과 같아 주가 급락의 원인이 됩니다."
  },
  {
    id: "risk_06",
    keyword: "매출액 미달 경고",
    isDanger: true,
    category: "관리종목 위험",
    color: "#B91C1C",
    score: 95,
    speed: 0.85,
    summary: "코스닥 상장 유지에 필요한 최소 연간 매출액 기준(30억 원 등)을 채우지 못해 상장폐지 경고를 받은 공시입니다.",
    tip: "본업에서 아예 장사가 안 되고 있다는 결정적 증거입니다."
  },

  // 🍀 호재 공시 (사격 금지! - 보존 대상)
  {
    id: "good_01",
    keyword: "적정의견 수령",
    isDanger: false,
    category: "회계 건전성",
    color: "#10B981", // Emerald
    penalty: 60,
    speed: 0.95,
    summary: "외부 회계법인이 기업의 재무제표가 회계 기준에 맞게 성실하고 정확하게 작성되었다고 인증한 정상 성적표입니다.",
    tip: "투자의 기본 전제 조건인 투명한 장부를 의미합니다."
  },
  {
    id: "good_02",
    keyword: "영업이익 흑자전환",
    isDanger: false,
    category: "실적 서프라이즈",
    color: "#059669",
    penalty: 80,
    speed: 1.05,
    summary: "적자에 허덕이던 기업이 드디어 본업에서 순수 이익을 내기 시작했다는 강력한 부활 신호입니다.",
    tip: "주가 턴어라운드의 가장 대표적인 기폭제가 됩니다."
  },
  {
    id: "good_03",
    keyword: "대규모 신규 수주",
    isDanger: false,
    category: "매출 급성장",
    color: "#0D9488",
    penalty: 70,
    speed: 1.0,
    summary: "최근 연간 매출의 수십~수백 %에 달하는 대규모 일감을 따냈다는 공시로, 향후 확실한 매출 증대를 보증합니다.",
    tip: "수주 잔고가 넉넉할수록 기업의 미래 실적이 든든해집니다."
  },
  {
    id: "good_04",
    keyword: "자사주 매입 및 소각",
    isDanger: false,
    category: "주주 환원",
    color: "#2563EB", // Blue
    penalty: 80,
    speed: 0.9,
    summary: "회사가 자기 돈으로 시장의 주식을 사들인 뒤 아예 불태워 없애는 것입니다. 1주당 가치가 높아져 주주에게 최고의 호재입니다.",
    tip: "기업이 주가를 부양하고 주주 가치를 존중한다는 강력한 의지입니다."
  },
  {
    id: "good_05",
    keyword: "주당 배당금 상향",
    isDanger: false,
    category: "배당 호재",
    color: "#0284C7",
    penalty: 50,
    speed: 0.85,
    summary: "주주들에게 나누어주는 현금 배당금을 전년보다 늘리겠다는 공시입니다. 회사의 곳간(현금흐름)이 탄탄함을 증명합니다.",
    tip: "배당을 꾸준히 늘리는 기업은 주가 하방 경직성이 높습니다."
  }
];

export function getRandomDisclosure() {
  const randomIndex = Math.floor(Math.random() * DISCLOSURE_DATASET.length);
  return { ...DISCLOSURE_DATASET[randomIndex] };
}
