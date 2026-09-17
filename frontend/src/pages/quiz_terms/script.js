/**
 * [팀원 C 담당] 주식 & 회계 기초 용어 퀴즈 아레나 (MACHINE 01)
 * 62종 대용량 실전 금융 퀴즈 뱅크 & 무한 랜덤 셔플(Fisher-Yates) 스트리밍 엔진 탑재
 */
import { apiClient } from '../../api/client.js';

// 20대 사회초년생 맞춤 대용량 금융 퀴즈 데이터셋 (62종 완비)
const FALLBACK_20S_QUIZZES = [
  {
    "id": "fq_01",
    "topic": "income",
    "category": "💰 손익계산서 알짜 마진",
    "question": "손님들에게 물건을 팔고 받은 총 금액에서 알바비, 재료비, 매장 월세를 빼고 본업으로 순수하게 남긴 '진짜 돈벌이'는?",
    "options": [
      {
        "text": "매출액 (손님이 결제한 총 판매액)",
        "is_correct": false
      },
      {
        "text": "영업이익 (순수 본업 알짜 마진)",
        "is_correct": true
      },
      {
        "text": "자본금 (처음 시작할 때 낸 밑천)",
        "is_correct": false
      },
      {
        "text": "부채 (은행에서 빌린 대출금)",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>영업이익(Operating Profit)</b>이 회사의 진짜 체력입니다! 매출이 1,000억이어도 영업이익이 마이너스면 회사는 팔수록 손해보는 중입니다."
  },
  {
    "id": "fq_02",
    "topic": "income",
    "category": "💰 성과급과 직결되는 성적표",
    "question": "1년 동안 장사해서 번 돈에서 대출 이자, 세금, 투자 손실까지 싹 다 정산하고 최종적으로 주주들 금고에 남긴 돈은?",
    "options": [
      {
        "text": "매출원가 (제품 제작 원가)",
        "is_correct": false
      },
      {
        "text": "감가상각비 (기계 낡은 비용)",
        "is_correct": false
      },
      {
        "text": "당기순이익 (최종 알짜 수익)",
        "is_correct": true
      },
      {
        "text": "매출총이익 (단순 마진)",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>당기순이익(Net Income)</b>이 회사의 최종 성적표입니다! 영업이익이 흑자여도 대출 이자 폭탄을 맞으면 당기순손실(적자)이 날 수 있습니다."
  },
  {
    "id": "fq_03",
    "topic": "income",
    "category": "💰 카페 사장님의 회계 지혜",
    "question": "카페를 차릴 때 고가의 에스프레소 머신을 사고 첫 달에 전액 비용 처리하지 않고, 5년에 걸쳐 매달 나누어 비용으로 반영하는 회계 기법은?",
    "options": [
      {
        "text": "감가상각비 (비용 분할 반영)",
        "is_correct": true
      },
      {
        "text": "대손충당금",
        "is_correct": false
      },
      {
        "text": "영업외비용",
        "is_correct": false
      },
      {
        "text": "자본준비금",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>감가상각비(Depreciation)</b>는 오래 쓰는 자산의 가격을 사용하는 기간 동안 쪼개서 장부에 반영하는 회계 원칙입니다."
  },
  {
    "id": "fq_04",
    "topic": "income",
    "category": "💰 장사 수완의 척도",
    "question": "회사가 100억 원어치 물건을 팔았을 때 영업이익으로 20억을 남겼다면, 이 회사의 본업 마진율(20%)을 나타내는 지표는?",
    "options": [
      {
        "text": "부채비율",
        "is_correct": false
      },
      {
        "text": "영업이익률 (OPM)",
        "is_correct": true
      },
      {
        "text": "배당성향",
        "is_correct": false
      },
      {
        "text": "유보율",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>영업이익률(Operating Profit Margin)</b>은 매출액 대비 영업이익의 비율로, 회사가 본업에서 얼마나 높은 부가가치를 창출하는지 보여주는 마진율입니다."
  },
  {
    "id": "fq_05",
    "topic": "income",
    "category": "💰 마케팅과 월급의 정체",
    "question": "공장 생산 원가 외에 본사 직원 월급, 광고 마케팅비, 배송 물류비, 임차료 등 영업 활동 전반에 들어간 비용을 묶어 부르는 용어는?",
    "options": [
      {
        "text": "판관비 (판매비와 관리비)",
        "is_correct": true
      },
      {
        "text": "매출원가",
        "is_correct": false
      },
      {
        "text": "법인세 비용",
        "is_correct": false
      },
      {
        "text": "이자 비용",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>판관비(SG&A)</b>는 광고비와 인건비 등이 포함되며, 판관비가 과도하게 늘어나면 매출이 늘어도 적자로 돌아설 수 있습니다."
  },
  {
    "id": "fq_06",
    "topic": "income",
    "category": "💰 공시 서프라이즈 호재",
    "question": "지난해까지 적자에 허덕이던 기업이 신제품 대박으로 올해 드디어 플러스 이익을 기록했을 때 뜨는 공시 제목은?",
    "options": [
      {
        "text": "적자지속 (적자 유지)",
        "is_correct": false
      },
      {
        "text": "흑자전환 (턴어라운드)",
        "is_correct": true
      },
      {
        "text": "감사의견 거절",
        "is_correct": false
      },
      {
        "text": "완전자본잠식",
        "is_correct": false
      }
    ],
    "explanation": "🍀 <b>흑자전환(Turnaround)</b>은 주가 급등의 가장 강력한 촉매 중 하나입니다. 부실을 털어내고 본격적인 수익 궤도에 진입했음을 의미합니다."
  },
  {
    "id": "fq_07",
    "topic": "income",
    "category": "💰 공시 쇼크 악재",
    "question": "매출은 전년과 비슷한데 원자재 가격 폭등으로 영업이익이 흑자에서 마이너스로 곤두박질쳤을 때 공시되는 용어는?",
    "options": [
      {
        "text": "적자전환 (손실 발생)",
        "is_correct": true
      },
      {
        "text": "흑자전환",
        "is_correct": false
      },
      {
        "text": "자사주 소각",
        "is_correct": false
      },
      {
        "text": "주식분할",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>적자전환</b>은 실적 쇼크를 의미하며, 단기 주가 급락과 배당 축소의 직접적인 원인이 됩니다."
  },
  {
    "id": "fq_08",
    "topic": "income",
    "category": "💰 현금 창출력 측정기",
    "question": "순이익에 이자비용, 세금, 감가상각비를 다시 더해 기업이 순수하게 현금으로 벌어들인 실질 영업 체력을 평가하는 글로벌 지표는?",
    "options": [
      {
        "text": "EBITDA (에비타)",
        "is_correct": true
      },
      {
        "text": "PBR (장부가치)",
        "is_correct": false
      },
      {
        "text": "BPS (주당순자산)",
        "is_correct": false
      },
      {
        "text": "PER (주가수익비율)",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>EBITDA</b>는 현금 유출이 없는 감가상각비 등을 제외하여 대규모 투자를 하는 기업의 현금 창출력을 정확하게 비교할 수 있게 해줍니다."
  },
  {
    "id": "fq_09",
    "topic": "income",
    "category": "💰 붕어빵 공장의 원가",
    "question": "붕어빵 1개를 만들기 위해 직접 들어간 팥, 밀가루, 가스비처럼 제품 제조에 직결된 비용을 장부에서 무엇이라 부를까요?",
    "options": [
      {
        "text": "매출원가 (직접 제조비용)",
        "is_correct": true
      },
      {
        "text": "광고선전비",
        "is_correct": false
      },
      {
        "text": "영업외수익",
        "is_correct": false
      },
      {
        "text": "법인세",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>매출원가(Cost of Goods Sold)</b>는 제품 생산에 필수적으로 들어간 원자재비와 공장 가동비입니다. 매출액에서 매출원가를 뺀 것이 매출총이익입니다."
  },
  {
    "id": "fq_10",
    "topic": "income",
    "category": "💰 본업 외 횡재 or 낭패",
    "question": "게임 개발사가 게임 판매 본업 외에 회사 소유 건물을 매각해 큰 차익을 얻거나, 환율 급등으로 외화 환차익을 얻었을 때 잡히는 항목은?",
    "options": [
      {
        "text": "영업외수익 (본업 외 수입)",
        "is_correct": true
      },
      {
        "text": "영업이익",
        "is_correct": false
      },
      {
        "text": "매출총이익",
        "is_correct": false
      },
      {
        "text": "자본금",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>영업외수익</b>은 본업과 직접적 관련 없는 일회성 이익(부동산 매각, 이자수익 등)입니다. 지속성이 낮으므로 본업 영업이익과 분리해서 봐야 합니다."
  },
  {
    "id": "fq_11",
    "topic": "income",
    "category": "💰 1주당 돌아오는 몫",
    "question": "회사가 1년간 벌어들인 당기순이익을 전체 발행 주식 수로 나눈 값으로, 1주당 얼마를 벌었는지 알려주는 핵심 지표는?",
    "options": [
      {
        "text": "EPS (주당순이익)",
        "is_correct": true
      },
      {
        "text": "BPS (주당순자산)",
        "is_correct": false
      },
      {
        "text": "DPS (주당배당금)",
        "is_correct": false
      },
      {
        "text": "PBR (주가순자산비율)",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>EPS(Earnings Per Share)</b>는 주주 1명이 보유한 1주당 순이익을 뜻하며, EPS가 매년 꾸준히 증가하는 기업이 진정한 우량주입니다."
  },
  {
    "id": "fq_12",
    "topic": "income",
    "category": "💰 30% 실적 변동 공시",
    "question": "코스닥 상장사는 매출액이나 영업이익이 전년 대비 몇 % 이상 변동하면 의무적으로 DART에 실적 공시를 올려야 할까요?",
    "options": [
      {
        "text": "10% 이상",
        "is_correct": false
      },
      {
        "text": "30% 이상 (대규모 법인은 15%)",
        "is_correct": true
      },
      {
        "text": "50% 이상",
        "is_correct": false
      },
      {
        "text": "100% 이상",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>매출액 또는 손익구조 30% 이상 변동 공시</b>는 실적 발표 시즌에 주가를 크게 흔드는 매우 중요한 정기 수시공시입니다."
  },
  {
    "id": "fq_13",
    "topic": "balance",
    "category": "🏦 회계의 절대 공식",
    "question": "회사가 가진 전체 '자산(총재산)'은 주주들의 순수한 몫인 '자본'과 남에게 빌린 '무엇'의 합으로 이루어질까요?",
    "options": [
      {
        "text": "매출액",
        "is_correct": false
      },
      {
        "text": "부채 (빚)",
        "is_correct": true
      },
      {
        "text": "영업이익",
        "is_correct": false
      },
      {
        "text": "감가상각비",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>자산 = 부채 + 자본</b>은 회계의 제1원칙입니다. 3억짜리 아파트를 살 때 내 돈 1억(자본)과 대출 2억(부채)을 합친 것이 총자산 3억입니다."
  },
  {
    "id": "fq_14",
    "topic": "balance",
    "category": "🏦 빚쟁이 회사 판별기",
    "question": "남의 돈(부채)을 내 돈(자기자본)으로 나눈 비율로, 일반적으로 200%를 초과하면 재무 위험 신호로 간주되는 안전성 지표는?",
    "options": [
      {
        "text": "부채비율 (Debt Ratio)",
        "is_correct": true
      },
      {
        "text": "영업이익률",
        "is_correct": false
      },
      {
        "text": "배당수익률",
        "is_correct": false
      },
      {
        "text": "자기자본이익률 (ROE)",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>부채비율</b>이 100% 이하면 매우 우량하며, 200%를 넘어가면 금리 인상기에 이자 부담으로 도산할 위험이 급격히 커집니다."
  },
  {
    "id": "fq_15",
    "topic": "balance",
    "category": "🏦 1년 내 갚을 빚 감당력",
    "question": "1년 안에 현금화할 수 있는 '유동자산'을 1년 안에 갚아야 하는 '유동부채'로 나눈 비율로, 당장의 부도 위기를 체크하는 지표는?",
    "options": [
      {
        "text": "유동비율 (Current Ratio)",
        "is_correct": true
      },
      {
        "text": "PBR",
        "is_correct": false
      },
      {
        "text": "PER",
        "is_correct": false
      },
      {
        "text": "주가변동성",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>유동비율</b>은 통상 150%~200% 이상일 때 안전합니다. 100% 미만이면 당장 이번 달 만기 대출을 막지 못해 흑자도산할 수 있습니다."
  },
  {
    "id": "fq_16",
    "topic": "balance",
    "category": "🏦 밑천이 깎여나가는 경고",
    "question": "회사의 적자가 쌓여 주주들이 낸 초기 밑천인 '자본금'의 50% 이상을 까먹기 시작했을 때 코스닥 관리종목 지정 대상이 되는 상태는?",
    "options": [
      {
        "text": "부분자본잠식 (자본잠식률 50% 이상)",
        "is_correct": true
      },
      {
        "text": "흑자전환",
        "is_correct": false
      },
      {
        "text": "무상증자",
        "is_correct": false
      },
      {
        "text": "자사주 매입",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>자본잠식률 50% 이상</b>이 2년 연속 지속되거나 사업보고서 제출 시 확인되면 코스닥 시장 상장폐지 실질심사 대상이 됩니다."
  },
  {
    "id": "fq_17",
    "topic": "balance",
    "category": "🏦 깡통 계좌의 종말",
    "question": "주주들이 낸 밑천(자본금)마저 적자로 100% 완전히 소진되어 '자본총계'가 마이너스 숫자로 변해버린 극한의 부실 상태는?",
    "options": [
      {
        "text": "완전자본잠식 (자본총계 마이너스)",
        "is_correct": true
      },
      {
        "text": "영업흑자",
        "is_correct": false
      },
      {
        "text": "이익잉여금 누적",
        "is_correct": false
      },
      {
        "text": "신주인수권 행사",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>완전자본잠식</b>은 회사가 가진 모든 돈이 빚더미에 파묻힌 상태로, 코스닥 시장에서 발견 즉시 거래정지 및 상장폐지 사유입니다."
  },
  {
    "id": "fq_18",
    "topic": "balance",
    "category": "🏦 착실히 모아둔 회사 쌈짓돈",
    "question": "회사가 매년 번 당기순이익 중 주주들에게 배당으로 나눠주고 남은 돈을 차곡차곡 회사 금고에 재투자용으로 쌓아둔 돈은?",
    "options": [
      {
        "text": "이익잉여금 (사내 유보금)",
        "is_correct": true
      },
      {
        "text": "단기차입금 (은행 빚)",
        "is_correct": false
      },
      {
        "text": "미지급금",
        "is_correct": false
      },
      {
        "text": "당기순손실",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>이익잉여금</b>이 많은 회사는 불황에도 버틸 수 있는 튼튼한 맷집과 연구개발(R&D), 무상증자 여력을 갖춘 우량 기업입니다."
  },
  {
    "id": "fq_19",
    "topic": "balance",
    "category": "🏦 장부의 멍에 결손금",
    "question": "반대로 적자가 수년간 누적되어 이익잉여금을 다 까먹고 장부에 마이너스로 기록된 누적 손실액을 무엇이라 부를까요?",
    "options": [
      {
        "text": "결손금 (누적 적자)",
        "is_correct": true
      },
      {
        "text": "자본잉여금",
        "is_correct": false
      },
      {
        "text": "매출총이익",
        "is_correct": false
      },
      {
        "text": "법인세 환급금",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>결손금</b>이 계속 불어나면 결국 자본금을 갉아먹는 '자본잠식'으로 이어지므로 DART 재무제표에서 결손금 유무를 꼭 확인해야 합니다."
  },
  {
    "id": "fq_20",
    "topic": "balance",
    "category": "🏦 안 팔린 재고의 함정",
    "question": "유행 지난 옷이나 팔리지 않는 가전제품처럼 창고에 쌓여 제값을 못 받게 된 상품 가치를 장부에서 깎아 비용으로 떠는 회계 처리는?",
    "options": [
      {
        "text": "재고자산 평가손실",
        "is_correct": true
      },
      {
        "text": "자사주 소각",
        "is_correct": false
      },
      {
        "text": "외환차익",
        "is_correct": false
      },
      {
        "text": "신주발행",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>재고자산 평가손실</b>은 악성 재고를 털어내면서 대규모 영업적자를 유발할 수 있어 의류, 반도체 기업 분석 시 필수 체크 항목입니다."
  },
  {
    "id": "fq_21",
    "topic": "balance",
    "category": "🏦 1주당 순자산 가치",
    "question": "회사의 순자산(자본총계)을 전체 발행 주식 수로 나눈 값으로, '지금 회사를 청산하면 1주당 얼마씩 돌려받을 수 있는가'를 나타내는 지표는?",
    "options": [
      {
        "text": "BPS (주당순자산가치)",
        "is_correct": true
      },
      {
        "text": "EPS (주당순이익)",
        "is_correct": false
      },
      {
        "text": "PER (주가수익비율)",
        "is_correct": false
      },
      {
        "text": "EV/EBITDA",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>BPS(Book-value Per Share)</b>는 주가의 하방 지지선 역할을 합니다. 현재 주가가 BPS보다 낮다면 PBR이 1배 미만이라는 뜻입니다."
  },
  {
    "id": "fq_22",
    "topic": "balance",
    "category": "🏦 은행이 빌려준 이자 받는 빚",
    "question": "외상값(매입채무)처럼 무이자 빚이 아니라, 매달 은행이나 채권자에게 꼬박꼬박 이자를 지급해야 하는 대출금을 통칭하는 용어는?",
    "options": [
      {
        "text": "차입금 (이자발생부채)",
        "is_correct": true
      },
      {
        "text": "자본잉여금",
        "is_correct": false
      },
      {
        "text": "자사주",
        "is_correct": false
      },
      {
        "text": "당기순이익",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>차입금(Borrowings)</b> 규모가 크면 금리가 오를 때 막대한 금융비용(이자)이 발생하여 영업이익을 갉아먹게 됩니다."
  },
  {
    "id": "fq_23",
    "topic": "audit",
    "category": "📋 상장폐지 1순위 사망 선고",
    "question": "회계사가 기업 장부를 전혀 믿을 수 없다고 선언하여 주식이 즉시 거래정지되고 상장폐지 실질심사 대상이 되는 가장 무서운 감사의견은?",
    "options": [
      {
        "text": "적정 의견 (장부 통과)",
        "is_correct": false
      },
      {
        "text": "한정 의견 (일부 주의)",
        "is_correct": false
      },
      {
        "text": "감사의견 거절 (상폐 직행 열차)",
        "is_correct": true
      },
      {
        "text": "재무제표 승인",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>감사의견 거절</b>은 회계사가 '이 장부는 가짜가 너무 많아 감사를 포기한다'고 선언한 것입니다. 주식이 휴지조각이 되는 퇴출 1순위 신호입니다!"
  },
  {
    "id": "fq_24",
    "topic": "audit",
    "category": "📋 감사보고서 합격증",
    "question": "공인회계사가 기업 장부를 꼼꼼히 검토한 뒤 '회계 기준에 맞게 특별한 왜곡 없이 잘 작성되었다'고 내리는 성적표는?",
    "options": [
      {
        "text": "적정 의견 (장부 투명성 통과)",
        "is_correct": true
      },
      {
        "text": "부적정 의견",
        "is_correct": false
      },
      {
        "text": "감사의견 거절",
        "is_correct": false
      },
      {
        "text": "관리 의견",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>적정 의견</b>은 회사가 대박 기업이라는 뜻이 아니라 '장부를 거짓 없이 정직하게 썼다'는 기본 합격증입니다."
  },
  {
    "id": "fq_25",
    "topic": "audit",
    "category": "📋 찝찝한 회계사의 옐로카드",
    "question": "회계사가 전반적인 장부는 괜찮지만 '일부 재고나 소송 금액 등 특정 항목의 자료가 미흡하다'며 내리는 감사의견은?",
    "options": [
      {
        "text": "한정 의견 (주의 경고)",
        "is_correct": true
      },
      {
        "text": "적정 의견",
        "is_correct": false
      },
      {
        "text": "무상증자",
        "is_correct": false
      },
      {
        "text": "배당 공시",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>한정 의견</b>은 상장폐지 사유까지는 아니더라도 관리종목 지정 사유가 될 수 있으며, 주가 급락의 원인이 됩니다."
  },
  {
    "id": "fq_26",
    "topic": "audit",
    "category": "📋 장부 왜곡이 심각한 상태",
    "question": "기업이 작성한 재무제표의 오류와 왜곡이 너무 심각해서 회계기준과 정면으로 배치된다고 회계사가 판단할 때 내리는 의견은?",
    "options": [
      {
        "text": "부적정 의견 (중대 결함)",
        "is_correct": true
      },
      {
        "text": "적정 의견",
        "is_correct": false
      },
      {
        "text": "자율 공시",
        "is_correct": false
      },
      {
        "text": "단일판매 공급계약",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>부적정 의견</b> 또한 거래소 상장폐지 사유에 해당하며, 경영진의 분식회계 의혹이 짙은 최악의 악재입니다."
  },
  {
    "id": "fq_27",
    "topic": "audit",
    "category": "📋 경영진 모럴헤저드 리스크",
    "question": "대표이사나 임직원이 회사 자금을 몰래 빼돌리거나 회사에 막대한 손해를 끼쳐 주가가 급락하고 상장적격성 심사를 받게 되는 사건은?",
    "options": [
      {
        "text": "횡령·배임 혐의 (경영진 범죄)",
        "is_correct": true
      },
      {
        "text": "주식 액면분할",
        "is_correct": false
      },
      {
        "text": "중간배당 결의",
        "is_correct": false
      },
      {
        "text": "무상증자 결정",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>횡령·배임</b> 공시가 뜨면 회사 신뢰도가 바닥으로 추락하고 거래정지 위험이 매우 커집니다."
  },
  {
    "id": "fq_28",
    "topic": "audit",
    "category": "📋 거래소의 옐로카드",
    "question": "연속 적자, 자본잠식, 불성실공시 등으로 인해 한국거래소가 '투자자 주의' 딱지를 붙이고 상폐 직전 단계로 지정하는 종목 분류는?",
    "options": [
      {
        "text": "관리종목 (상폐 전 옐로카드)",
        "is_correct": true
      },
      {
        "text": "코스피 200 종목",
        "is_correct": false
      },
      {
        "text": "우량기업부 종목",
        "is_correct": false
      },
      {
        "text": "배당귀족주",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>관리종목</b>으로 지정되면 신용거래가 제한되고 추가 부실 발생 시 곧바로 상장폐지 실질심사로 넘어갑니다."
  },
  {
    "id": "fq_29",
    "topic": "audit",
    "category": "📋 관리종목 전단계 레드 플래그",
    "question": "코스닥 시장에서 부실 징후가 포착된 기업을 관리종목으로 지정하기 전, 투자자 보호를 위해 사전 경고용으로 지정하는 제도는?",
    "options": [
      {
        "text": "투자주의환기종목",
        "is_correct": true
      },
      {
        "text": "코스닥150",
        "is_correct": false
      },
      {
        "text": "액티브 ETF",
        "is_correct": false
      },
      {
        "text": "우량주 펀드",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>투자주의환기종목</b>으로 지정된 회사는 내부회계관리제도에 심각한 결함이 있는 경우가 많으므로 초보 투자자는 매수를 피해야 합니다."
  },
  {
    "id": "fq_30",
    "topic": "audit",
    "category": "📋 공시 번복의 페널티",
    "question": "회사가 중요한 투자 결정을 공시했다가 손바닥 뒤집듯 번복하거나 지연 공시하여 한국거래소로부터 벌점을 받는 제도는?",
    "options": [
      {
        "text": "불성실공시법인 지정",
        "is_correct": true
      },
      {
        "text": "액면분할",
        "is_correct": false
      },
      {
        "text": "ESG 최우수기업",
        "is_correct": false
      },
      {
        "text": "자율공시 승인",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>불성실공시법인</b>으로 누적 벌점 15점 이상을 받으면 코스닥 상장적격성 실질심사 대상이 되어 거래정지될 수 있습니다."
  },
  {
    "id": "fq_31",
    "topic": "audit",
    "category": "📋 사업보고서 제출 마감 시한",
    "question": "12월 결산 상장법인은 사업연도 종료 후 90일 이내인 매년 몇 월 말까지 DART에 감사보고서와 사업보고서를 의무 제출해야 할까요?",
    "options": [
      {
        "text": "1월 말",
        "is_correct": false
      },
      {
        "text": "3월 말 (공포의 감사 시즌)",
        "is_correct": true
      },
      {
        "text": "6월 말",
        "is_correct": false
      },
      {
        "text": "12월 말",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>3월 말</b>은 '공포의 감사 시즌'으로 불립니다. 기한 내 감사보고서를 못 내거나 비적정 의견을 받으면 무더기 상폐 지뢰가 터집니다."
  },
  {
    "id": "fq_32",
    "topic": "audit",
    "category": "📋 감사보고서 지연 제출의 불길함",
    "question": "정기 주주총회 1주일 전까지 감사보고서를 제출하지 못하고 '감사보고서 제출 지연' 공시를 올린 회사는 왜 위험할까요?",
    "options": [
      {
        "text": "회계사와 회사 간에 장부 숫자가 안 맞아 갈등 중일 확률이 높기 때문",
        "is_correct": true
      },
      {
        "text": "배당금을 너무 많이 주려다 시간이 걸렸기 때문",
        "is_correct": false
      },
      {
        "text": "직원들 성과급 계산이 너무 많아졌기 때문",
        "is_correct": false
      },
      {
        "text": "주가가 너무 올라 거래소가 막았기 때문",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>감사보고서 지연 공시</b>는 회계사가 장부 입증 자료를 받지 못해 '의견 거절'을 고민 중인 경우가 많아 매우 위험한 신호입니다."
  },
  {
    "id": "fq_33",
    "topic": "audit",
    "category": "📋 사형 집행 직전의 심사대",
    "question": "상장폐지 기준에 해당하거나 횡령·배임 등 중대 사유가 발생했을 때, 퇴출 여부를 최종 심의하기 위해 거래소가 여는 심사는?",
    "options": [
      {
        "text": "상장적격성 실질심사",
        "is_correct": true
      },
      {
        "text": "기업공개(IPO) 공모청약",
        "is_correct": false
      },
      {
        "text": "무상감자 승인",
        "is_correct": false
      },
      {
        "text": "신용평가 정기심사",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>상장적격성 실질심사</b>에 들어가면 몇 달 또는 수년간 주식 거래가 정지되며, 최악의 경우 상장폐지 결정이 내려집니다."
  },
  {
    "id": "fq_34",
    "topic": "audit",
    "category": "📋 마지막 7일간의 헐값 정리",
    "question": "상장폐지가 최종 확정된 주식을 보유한 주주들에게 마지막으로 장내에서 주식을 팔 수 있도록 7영업일간 부여하는 거래 기간은?",
    "options": [
      {
        "text": "정리매매 (가격제한폭 없음)",
        "is_correct": true
      },
      {
        "text": "시간외 대량매매 (블록딜)",
        "is_correct": false
      },
      {
        "text": "공모주 청약",
        "is_correct": false
      },
      {
        "text": "동시호가 단일가매매",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>정리매매</b> 기간에는 상한가/하한가 제한(±30%)이 풀려 주가가 90% 이상 폭락하여 사실상 휴지조각이 됩니다."
  },
  {
    "id": "fq_35",
    "topic": "financing",
    "category": "💣 개미 주주들의 눈물 CB 폭탄",
    "question": "회사가 돈을 빌릴 때 '나중에 주식으로 바꿀 수 있는 권리'를 붙여 발행한 채권으로, 행사 시 신주 폭탄이 쏟아져 주가를 희석시키는 것은?",
    "options": [
      {
        "text": "전환사채 (CB)",
        "is_correct": true
      },
      {
        "text": "국채 10년물",
        "is_correct": false
      },
      {
        "text": "보통주 배당",
        "is_correct": false
      },
      {
        "text": "정기예금 증서",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>전환사채(CB)</b>는 채권자가 싼값에 신주로 바꿔 주식시장에 대량 매도할 수 있어 기존 주주의 지분 가치를 갉아먹는 대표 악재입니다."
  },
  {
    "id": "fq_36",
    "topic": "financing",
    "category": "💣 채권도 갖고 신주도 사는 사채",
    "question": "채권 원금은 그대로 만기에 돌려받으면서, 별도로 미리 정해진 가격에 신주를 인수할 수 있는 '워런트'가 붙어있는 사채는?",
    "options": [
      {
        "text": "신주인수권부사채 (BW)",
        "is_correct": true
      },
      {
        "text": "회사채",
        "is_correct": false
      },
      {
        "text": "외화표시채권",
        "is_correct": false
      },
      {
        "text": "양도성예금증서",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>신주인수권부사채(BW)</b> 역시 워런트 행사 시 대규모 신주가 시장에 유입되어 주가 희석(물량 부담)을 유발합니다."
  },
  {
    "id": "fq_37",
    "topic": "financing",
    "category": "💣 보유 주식으로 맞바꾸는 사채",
    "question": "회사가 새로 주식을 찍어내는 대신, 회사가 보유한 자기주식이나 타사 상장주식으로 교환해주는 권리가 붙은 사채는?",
    "options": [
      {
        "text": "교환사채 (EB)",
        "is_correct": true
      },
      {
        "text": "전환사채 (CB)",
        "is_correct": false
      },
      {
        "text": "신주인수권부사채 (BW)",
        "is_correct": false
      },
      {
        "text": "국공채",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>교환사채(EB)</b>는 신주를 새로 발행하지 않으므로 CB나 BW에 비해 주식 총수가 늘어나는 희석 부담은 상대적으로 적습니다."
  },
  {
    "id": "fq_38",
    "topic": "financing",
    "category": "💣 주가 하락 시 전환가격을 깎아주는 꼼수",
    "question": "주가가 떨어지면 CB 채권자가 손해를 보지 않도록 주식으로 바꾸는 전환가격을 자동으로 낮춰주어 신주 발행량을 더 늘리는 조항은?",
    "options": [
      {
        "text": "리픽싱 (Refixing, 전환가 조정)",
        "is_correct": true
      },
      {
        "text": "액면분할",
        "is_correct": false
      },
      {
        "text": "스톡옵션",
        "is_correct": false
      },
      {
        "text": "자사주 매입",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>리픽싱</b>이 발생하면 주가가 떨어질수록 신주가 기하급수적으로 많이 발행되는 '죽음의 나선(Death Spiral)'에 빠질 수 있습니다."
  },
  {
    "id": "fq_39",
    "topic": "financing",
    "category": "💣 기존 주주에게 손 벌리는 유상증자",
    "question": "회사가 운영자금이 부족해 기존 주주들에게 할인된 가격으로 신주를 사달라고 손을 벌리는 방식으로, 통상 주가 급락을 부르는 증자 방식은?",
    "options": [
      {
        "text": "주주배정 유상증자 (악재)",
        "is_correct": true
      },
      {
        "text": "무상증자 (호재)",
        "is_correct": false
      },
      {
        "text": "자사주 소각",
        "is_correct": false
      },
      {
        "text": "현금배당",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>주주배정 유상증자</b>는 기존 주주들이 내 돈을 더 넣거나, 지분 희석을 감수해야 하므로 공시 직후 주가가 크게 떨어지는 경우가 많습니다."
  },
  {
    "id": "fq_40",
    "topic": "financing",
    "category": "💣 대기업이 지분 투자해주는 유상증자",
    "question": "기존 주주가 아닌 글로벌 대기업이나 전략적 투자자(SI) 특정 1곳만을 지정해 신주를 발행해 주는 증자로, 종종 호재로 작용하는 방식은?",
    "options": [
      {
        "text": "제3자배정 유상증자 (전략적 제휴)",
        "is_correct": true
      },
      {
        "text": "주주배정 유상증자",
        "is_correct": false
      },
      {
        "text": "일반공모 증자",
        "is_correct": false
      },
      {
        "text": "감자",
        "is_correct": false
      }
    ],
    "explanation": "🍀 삼성전자나 현대차 같은 대기업을 대상으로 한 <b>제3자배정 유상증자</b>는 대규모 투자 유치 및 사업 협력 호재로 인식되어 주가가 급등하기도 합니다."
  },
  {
    "id": "fq_41",
    "topic": "financing",
    "category": "🍀 주주들에게 공짜 주식을 나눠주는 잔치",
    "question": "회사의 사내 잉여금(주식발행초과금 등)을 자본금으로 전입시키며 주주들에게 공짜로 주식을 1주당 1주씩 나누어주는 대표적인 주가 부양 이벤트는?",
    "options": [
      {
        "text": "무상증자 (Bonus Issue)",
        "is_correct": true
      },
      {
        "text": "유상감자",
        "is_correct": false
      },
      {
        "text": "전환사채 발행",
        "is_correct": false
      },
      {
        "text": "관리종목 지정",
        "is_correct": false
      }
    ],
    "explanation": "🍀 <b>무상증자</b>는 주주에게 공짜 주식을 배정하여 유통 주식 수를 늘리고 재무 건전성을 과시하는 강력한 주가 부양 호재입니다."
  },
  {
    "id": "fq_42",
    "topic": "financing",
    "category": "💣 쏟아질 대기 매물 시한폭탄",
    "question": "보호예수가 해제되거나 대규모 CB/BW의 주식 전환 청구로 언제든 시장에 쏟아져 나와 주가를 억누를 수 있는 잠재적 매도 대기 물량은?",
    "options": [
      {
        "text": "오버행 (Overhang 리스크)",
        "is_correct": true
      },
      {
        "text": "스캘핑",
        "is_correct": false
      },
      {
        "text": "배당락",
        "is_correct": false
      },
      {
        "text": "골든크로스",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>오버행(Overhang)</b> 부담이 큰 종목은 아무리 실적이 좋아도 신규 매물 폭탄 우려로 주가 상승이 제한되는 경우가 많습니다."
  },
  {
    "id": "fq_43",
    "topic": "financing",
    "category": "💣 상장 직후 매도 금지 족쇄",
    "question": "신규 상장(IPO) 시 대주주나 기관투자자가 상장 첫날 주식을 몽땅 팔아치워 주가가 폭락하는 것을 막기 위해 일정 기간 매도를 금지하는 제도는?",
    "options": [
      {
        "text": "의무보유등록 (보호예수, Lock-up)",
        "is_correct": true
      },
      {
        "text": "공매도",
        "is_correct": false
      },
      {
        "text": "서킷브레이커",
        "is_correct": false
      },
      {
        "text": "사이드카",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>보호예수 해제일</b>에는 묶여있던 기관들의 차익 실현 물량이 대거 출회될 수 있으므로 공시 일정을 사전 확인해야 합니다."
  },
  {
    "id": "fq_44",
    "topic": "financing",
    "category": "💣 주식을 무보증으로 쪼개 자본금을 줄이는 형벌",
    "question": "누적 적자로 인한 자본잠식을 해소하기 위해 주주들에게 아무런 보상 없이 주식 수를 강제로 5주를 1주로 합쳐 자본금을 줄이는 눈물의 감자는?",
    "options": [
      {
        "text": "무상감자 (주주 가치 훼손)",
        "is_correct": true
      },
      {
        "text": "유상증자",
        "is_correct": false
      },
      {
        "text": "액면분할",
        "is_correct": false
      },
      {
        "text": "자사주 소각",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>무상감자</b>는 주주들의 지분 가치가 직접 깎여나가는 극악의 악재로, 공시 즉시 하한가로 직행하는 경우가 대다수입니다."
  },
  {
    "id": "fq_45",
    "topic": "valuation",
    "category": "🍀 주가 급등 슈퍼 호재",
    "question": "기업이 시장에서 유통되는 자기 회사 주식을 직접 사들여 흔적도 없이 소각(영구 제거)해버리는 대표적인 주주환원 호재는?",
    "options": [
      {
        "text": "자사주 소각 (1주당 가치 상승)",
        "is_correct": true
      },
      {
        "text": "전환사채 폭탄 발행",
        "is_correct": false
      },
      {
        "text": "무상감자",
        "is_correct": false
      },
      {
        "text": "대표이사 대출",
        "is_correct": false
      }
    ],
    "explanation": "🍀 <b>자사주 소각</b>은 시중의 주식 총수를 영구히 줄여 1주당 순이익(EPS)을 높여주는 가장 정직하고 강력한 주가 부양 호재입니다!"
  },
  {
    "id": "fq_46",
    "topic": "valuation",
    "category": "📈 주가 밸류에이션 상식",
    "question": "현재 주가가 회사가 1년에 벌어들이는 순이익 대비 몇 배로 거래되고 있는지를 나타내며, 동종업계 대비 저평가 여부를 따질 때 쓰는 대표 지표는?",
    "options": [
      {
        "text": "PER (주가수익비율)",
        "is_correct": true
      },
      {
        "text": "PBR (주가순자산비율)",
        "is_correct": false
      },
      {
        "text": "부채비율",
        "is_correct": false
      },
      {
        "text": "유동비율",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>PER(Price to Earnings Ratio)</b>은 주가를 주당순이익(EPS)으로 나눈 값으로, 낮을수록 번 돈에 비해 주가가 싸다는 뜻입니다."
  },
  {
    "id": "fq_47",
    "topic": "valuation",
    "category": "📈 청산 가치 비교 지표",
    "question": "회사가 지금 당장 모든 자산을 팔고 빚을 갚은 뒤 주주에게 돌아갈 순자산(장부가치) 대비 현재 주가가 몇 배인지 나타내는 지표는?",
    "options": [
      {
        "text": "PBR (주가순자산비율)",
        "is_correct": true
      },
      {
        "text": "PER (주가수익비율)",
        "is_correct": false
      },
      {
        "text": "ROE (자기자본이익률)",
        "is_correct": false
      },
      {
        "text": "배당수익률",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>PBR(Price to Book-value Ratio)</b>이 1배 미만이면 회사를 당장 청산해서 나눠 갖는 돈보다도 주가가 싸다는 뜻입니다."
  },
  {
    "id": "fq_48",
    "topic": "valuation",
    "category": "🏢 기업의 진짜 덩치",
    "question": "'현재 주가 × 전체 발행 주식 수'로 계산되며, 그 회사를 100% 통째로 사들이려면 필요한 전체 시장 가격(몸값)은?",
    "options": [
      {
        "text": "시가총액 (Market Cap)",
        "is_correct": true
      },
      {
        "text": "자본잉여금",
        "is_correct": false
      },
      {
        "text": "유동부채",
        "is_correct": false
      },
      {
        "text": "당기순손실",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>시가총액</b>이 진짜 회사의 크기 순위입니다! 주가가 1만 원이어도 주식 수가 적으면, 1,000원짜리 대기업보다 시가총액이 작을 수 있습니다."
  },
  {
    "id": "fq_49",
    "topic": "valuation",
    "category": "📈 워런 버핏의 최애 지표",
    "question": "주주들이 맡긴 순수 자기자본을 굴려 1년 동안 몇 %의 순이익을 창출했는지를 보여주는 자기자본 수익성 척도는?",
    "options": [
      {
        "text": "ROE (자기자본이익률)",
        "is_correct": true
      },
      {
        "text": "부채비율",
        "is_correct": false
      },
      {
        "text": "유보율",
        "is_correct": false
      },
      {
        "text": "감가상각률",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>ROE(Return on Equity)</b>가 매년 15% 이상 유지되는 기업은 주주의 돈을 뛰어난 효율로 불리고 있는 일등 기업입니다."
  },
  {
    "id": "fq_50",
    "topic": "valuation",
    "category": "🍀 주주에게 돌려주는 배당의 통 큰 정도",
    "question": "회사가 1년간 번 당기순이익 100억 중 30억을 주주들에게 현금 배당으로 돌려주었을 때, 이 30% 비율을 뜻하는 용어는?",
    "options": [
      {
        "text": "배당성향 (Payout Ratio)",
        "is_correct": true
      },
      {
        "text": "배당수익률",
        "is_correct": false
      },
      {
        "text": "영업이익률",
        "is_correct": false
      },
      {
        "text": "부채상환율",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>배당성향</b>은 번 돈 중 얼마를 주주에게 환원하는지 보여줍니다. 글로벌 우량주는 40~50% 이상의 높은 배당성향을 보입니다."
  },
  {
    "id": "fq_51",
    "topic": "valuation",
    "category": "🍀 은행 이자보다 짭짤한 주가 대비 배당금",
    "question": "현재 주가 대비 1년에 지급되는 1주당 배당금의 비율로, 은행 정기예금 금리와 직접 비교할 때 사용하는 지표는?",
    "options": [
      {
        "text": "배당수익률 (Dividend Yield)",
        "is_correct": true
      },
      {
        "text": "PER",
        "is_correct": false
      },
      {
        "text": "BPS",
        "is_correct": false
      },
      {
        "text": "PBR",
        "is_correct": false
      }
    ],
    "explanation": "💡 주가가 1만 원인데 연간 배당금이 500원이면 <b>배당수익률은 5%</b>입니다. 안정적인 고배당주는 하락장에서 훌륭한 방패가 됩니다."
  },
  {
    "id": "fq_52",
    "topic": "valuation",
    "category": "🍀 황제주를 국민주로 바꾸는 마법",
    "question": "1주당 250만 원에 달하던 삼성전자 주식을 50대 1로 쪼개어 1주당 5만 원으로 만들어 소액 투자자들의 접근성을 높인 방식은?",
    "options": [
      {
        "text": "주식분할 (액면분할)",
        "is_correct": true
      },
      {
        "text": "주식병합 (액면병합)",
        "is_correct": false
      },
      {
        "text": "유상감자",
        "is_correct": false
      },
      {
        "text": "전환청구",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>주식분할(액면분할)</b>은 기업 가치에는 변함이 없으나 거래 가격이 저렴해져 거래량이 늘어나고 주가가 활성화되는 효과가 있습니다."
  },
  {
    "id": "fq_53",
    "topic": "valuation",
    "category": "🍀 동전주를 탈출하기 위한 합체",
    "question": "100원짜리 싼 동전주 여러 장을 하나로 묶어 5,000원짜리 지폐 주식으로 만드는 방식은?",
    "options": [
      {
        "text": "주식병합 (액면병합)",
        "is_correct": true
      },
      {
        "text": "주식분할",
        "is_correct": false
      },
      {
        "text": "무상증자",
        "is_correct": false
      },
      {
        "text": "자사주 매각",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>주식병합</b>은 유통 주식 수가 너무 많거나 주가가 너무 낮아 관리종목 지정 우려가 있을 때 주가를 외형상 높이기 위해 활용됩니다."
  },
  {
    "id": "fq_54",
    "topic": "valuation",
    "category": "🍀 여름 휴가철에 챙기는 보너스 배당",
    "question": "연말 결산 시점 외에 사업연도 중간인 6월이나 분기 말에 주주들에게 깜짝 배당금을 나누어주는 공시는?",
    "options": [
      {
        "text": "중간배당 / 분기배당",
        "is_correct": true
      },
      {
        "text": "무상감자",
        "is_correct": false
      },
      {
        "text": "전환사채 리픽싱",
        "is_correct": false
      },
      {
        "text": "정리매매",
        "is_correct": false
      }
    ],
    "explanation": "🍀 <b>중간배당</b>을 시행하는 회사는 연중 현금 흐름이 안정적이고 주주 친화적인 기업으로 인정받아 투자자들의 선호도가 높습니다."
  },
  {
    "id": "fq_55",
    "topic": "disclosure",
    "category": "📑 DART 시스템의 정체",
    "question": "금융감독원이 운영하며 모든 상장기업의 재무제표와 주요 경영 공시를 실시간으로 누구나 열람할 수 있는 전자공시시스템의 영문 약칭은?",
    "options": [
      {
        "text": "DART (전자공시시스템)",
        "is_correct": true
      },
      {
        "text": "KOSPI",
        "is_correct": false
      },
      {
        "text": "NASDAQ",
        "is_correct": false
      },
      {
        "text": "SWIFT",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>DART(Data Analysis, Retrieval and Transfer System)</b>는 대한민국 증권시장의 투명성을 책임지는 필수 공시 플랫폼입니다."
  },
  {
    "id": "fq_56",
    "topic": "disclosure",
    "category": "📑 큰손들의 지분 변동 보고서",
    "question": "어떤 투자자가 상장사 주식을 몇 % 이상 취득하면 5일 이내에 DART에 보유 목적과 수량을 의무적으로 공시해야 할까요?",
    "options": [
      {
        "text": "1% 이상",
        "is_correct": false
      },
      {
        "text": "5% 이상 (5% 룰 공시)",
        "is_correct": true
      },
      {
        "text": "10% 이상",
        "is_correct": false
      },
      {
        "text": "30% 이상",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>5% 대량보유상황보고(5% 룰)</b>는 행동주의 펀드나 적대적 M&A, 큰손들의 지분 매집을 파악할 수 있는 핵심 공시입니다."
  },
  {
    "id": "fq_57",
    "topic": "disclosure",
    "category": "📑 대주주가 주식을 팔아치울 때",
    "question": "회사의 내부 사정을 가장 잘 아는 최대주주나 대표이사가 자기 회사 주식을 장내 매도했을 때 투자자들이 긴장하는 이유는?",
    "options": [
      {
        "text": "현재 주가가 꼭지(고점)이거나 회사 미래에 악재가 있을 수 있다는 강력한 경고 신호이기 때문",
        "is_correct": true
      },
      {
        "text": "주주들에게 배당금을 나눠주기 위한 준비이기 때문",
        "is_correct": false
      },
      {
        "text": "주식 거래량을 늘리기 위한 배려이기 때문",
        "is_correct": false
      },
      {
        "text": "법인세를 환급받기 위해서이기 때문",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>최대주주 및 임원 매도 공시</b>는 시장에서 대표적인 꼭지 신호로 해석되어 단기 주가 급락을 유발하기 쉽습니다."
  },
  {
    "id": "fq_58",
    "topic": "disclosure",
    "category": "🍀 매출의 몇 배에 달하는 잭팟 공시",
    "question": "기업이 대규모 수주 계약을 따냈을 때 매출액의 10% 이상 규모일 경우 의무적으로 올리는 단골 호재 공시는?",
    "options": [
      {
        "text": "단일판매·공급계약 체결 공시",
        "is_correct": true
      },
      {
        "text": "주주총회소집공고",
        "is_correct": false
      },
      {
        "text": "최대주주 변경 공시",
        "is_correct": false
      },
      {
        "text": "관리종목 지정 예고",
        "is_correct": false
      }
    ],
    "explanation": "🍀 <b>단일판매·공급계약</b>은 미래 매출을 보장하는 수주 잭팟 공시입니다. 단, 계약 상대방과 해지 조건, 기간을 반드시 확인해야 합니다."
  },
  {
    "id": "fq_59",
    "topic": "disclosure",
    "category": "📑 주인이 바뀌는 위험 신호",
    "question": "실적이 부실한 한계기업의 주인이 사모펀드나 실체 불명의 조합으로 빈번하게 바뀌는 '이 공시'가 반복될 때 조심해야 하는 이유는?",
    "options": [
      {
        "text": "최대주주 변경 공시 (무자본 M&A 및 머니게임 징후)",
        "is_correct": true
      },
      {
        "text": "정기 현금배당 공시",
        "is_correct": false
      },
      {
        "text": "특허권 취득 공시",
        "is_correct": false
      },
      {
        "text": "본점 소재지 이전 공시",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>빈번한 최대주주 변경</b>은 기업 사냥꾼들의 무자본 M&A와 주가 조작, 횡령의 온상이 되는 경우가 많아 요주의 대상입니다."
  },
  {
    "id": "fq_60",
    "topic": "disclosure",
    "category": "📑 찌라시에 대해 거래소가 내리는 조회",
    "question": "주가가 이상 급등하거나 풍문, 언론 보도로 소문이 돌 때 거래소가 상장사에게 '사실 여부를 당장 밝히라'고 요구하는 공시는?",
    "options": [
      {
        "text": "조회공시 요구 (풍문 또는 현저한 시황변동)",
        "is_correct": true
      },
      {
        "text": "자율공시",
        "is_correct": false
      },
      {
        "text": "공모발행실적보고서",
        "is_correct": false
      },
      {
        "text": "합병보고서",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>조회공시 요구</b>에 대해 회사가 '중요 정보 없음'이나 '풍문 사실무근'으로 답변하면 급등하던 테마주 주가가 폭락할 수 있습니다."
  },
  {
    "id": "fq_61",
    "topic": "disclosure",
    "category": "📑 기업의 1년 종합 성적 백과사전",
    "question": "회사의 사업 내용, 임직원 연봉, 재무제표, 계열사 현황, 주주 구성까지 1년 동안의 모든 정보가 집대성된 가장 방대한 정기 보고서는?",
    "options": [
      {
        "text": "사업보고서 (1년 종합 보고서)",
        "is_correct": true
      },
      {
        "text": "분기보고서",
        "is_correct": false
      },
      {
        "text": "반기보고서",
        "is_correct": false
      },
      {
        "text": "주요사항보고서",
        "is_correct": false
      }
    ],
    "explanation": "💡 <b>사업보고서</b>는 기업 분석의 바이블입니다. 회사가 어떤 제품으로 돈을 벌고 어디에 투자하는지 가장 상세하게 적혀 있습니다."
  },
  {
    "id": "fq_62",
    "topic": "disclosure",
    "category": "📑 소송에 휘말린 기업의 위험",
    "question": "회사가 자기자본의 상당 부분에 달하는 대규모 손해배상 소송이나 특허 침해 소송을 당했을 때 의무 공시하는 항목은?",
    "options": [
      {
        "text": "소송 등의 제기·신청 공시",
        "is_correct": true
      },
      {
        "text": "무상증자 결정",
        "is_correct": false
      },
      {
        "text": "자사주 신탁계약 해지",
        "is_correct": false
      },
      {
        "text": "액면분할 공시",
        "is_correct": false
      }
    ],
    "explanation": "🚨 <b>소송 등의 제기 공시</b>는 패소 시 대규모 우발부채(배상금)와 영업 중단 위기를 초래할 수 있으므로 청구 금액 크기를 체크해야 합니다."
  }
];

// Fisher-Yates 랜덤 셔플 알고리즘
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 간단한 Web Audio 효과음 신디사이저
class QuizAudioSynth {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playCorrect() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.18, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.16);
      });
    } catch (e) {}
  }
  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.22);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }
}

const audioSynth = new QuizAudioSynth();

let quizList = [];
let currentIndex = 0;
let currentTopic = 'all';
let solvedCount = 0;
let correctCount = 0;
let currentCombo = 0;
let maxCombo = 0;
let totalScore = 0;

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  setupNavigationAndCabinets();
  setupFilterButtons();
  await loadQuizzes('all');
});

function setupNavigationAndCabinets() {
  const arcadeSec = document.getElementById('arcadeSection');
  const quizSec = document.getElementById('quizSection');
  const tabArcade = document.getElementById('tabBtnArcade');
  const tabQuiz = document.getElementById('tabBtnQuiz');
  const navArcade = document.getElementById('navTabArcade');
  const navQuiz = document.getElementById('navTabQuiz');

  function showArcade() {
    if (arcadeSec && quizSec) {
      arcadeSec.classList.remove('hidden');
      quizSec.classList.add('hidden');
    }
    if (tabArcade && tabQuiz) {
      tabArcade.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 bg-gradient-to-r from-rose-600 to-cyan-600 text-white shadow-lg';
      tabQuiz.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-2';
    }
    if (navArcade && navQuiz) {
      navArcade.className = 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-rose-600 via-purple-600 to-cyan-600 text-white shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all';
      navQuiz.className = 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showQuiz() {
    if (arcadeSec && quizSec) {
      arcadeSec.classList.add('hidden');
      quizSec.classList.remove('hidden');
    }
    if (tabArcade && tabQuiz) {
      tabArcade.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-2';
      tabQuiz.className = 'px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 bg-gradient-to-r from-rose-600 to-cyan-600 text-white shadow-lg';
    }
    if (navArcade && navQuiz) {
      navArcade.className = 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-1.5';
      navQuiz.className = 'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (tabArcade) tabArcade.addEventListener('click', showArcade);
  if (navArcade) navArcade.addEventListener('click', showArcade);
  if (tabQuiz) tabQuiz.addEventListener('click', showQuiz);
  if (navQuiz) navQuiz.addEventListener('click', showQuiz);

  // Machine 01 Cabinet & Quick Go Quiz Buttons
  const startCabinetBtn = document.getElementById('startQuizCabinetBtn');
  if (startCabinetBtn) startCabinetBtn.addEventListener('click', showQuiz);

  const quickGoBtn = document.getElementById('quickGoQuizBtn');
  if (quickGoBtn) quickGoBtn.addEventListener('click', showQuiz);
}

function setupFilterButtons() {
  document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const clickedBtn = e.currentTarget;
      document.querySelectorAll('.topic-btn').forEach(b => {
        b.className = 'topic-btn px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 hover:bg-slate-800 transition-all flex items-center gap-1.5';
      });
      clickedBtn.className = 'topic-btn active px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400 transition-all flex items-center gap-1.5';
      currentTopic = clickedBtn.getAttribute('data-topic');
      await loadQuizzes(currentTopic);
    });
  });

  const nextBtn = document.getElementById('nextQuizBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex++;
      // 무한 순환: 끝에 도달하면 다시 무작위 셔플하여 끝없이 이어짐
      if (currentIndex >= quizList.length) {
        quizList = shuffleArray(quizList);
        currentIndex = 0;
      }
      renderCurrentQuiz();
    });
  }
}

async function loadQuizzes(topic) {
  try {
    const res = await apiClient.getBasicTermQuizzes(topic);
    if (res && res.quizzes && res.quizzes.length > 0) {
      quizList = res.quizzes;
    } else {
      filterFallback(topic);
    }
  } catch (err) {
    filterFallback(topic);
  }

  // 🎲 1단계: 문제 순서 랜덤 셔플
  quizList = shuffleArray(quizList);

  // 🎲 2단계: 각 문제 내부의 보기(options) 순서도 랜덤 셔플
  quizList = quizList.map(q => ({
    ...q,
    options: shuffleArray(q.options || [])
  }));

  currentIndex = 0;
  if (quizList.length > 0) {
    renderCurrentQuiz();
  }
}

function filterFallback(topic) {
  if (!topic || topic === 'all') {
    quizList = [...FALLBACK_20S_QUIZZES];
  } else {
    quizList = FALLBACK_20S_QUIZZES.filter(q => q.topic === topic);
  }
}

function renderCurrentQuiz() {
  const q = quizList[currentIndex];
  if (!q) return;

  const catEl = document.getElementById('quizCategory');
  if (catEl) catEl.innerHTML = `<span>🏷️</span> <span>${q.category}</span>`;

  const progEl = document.getElementById('quizProgress');
  if (progEl) progEl.innerText = `Q ${currentIndex + 1} / ${quizList.length} (무한 스트림)`;

  const questEl = document.getElementById('quizQuestion');
  if (questEl) questEl.innerText = `"${q.question}"`;

  const container = document.getElementById('quizOptionsContainer');
  if (container) {
    container.innerHTML = q.options.map((opt, idx) => `
      <button data-index="${idx}" class="term-opt-btn w-full text-left p-4 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-cyan-400 hover:bg-cyan-950/30 font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between transition-all group shadow-sm">
        <span class="group-hover:text-cyan-300 transition-colors">${idx + 1}. ${opt.text}</span>
        <span class="text-xs text-slate-500 group-hover:text-cyan-400 font-semibold">선택 👆</span>
      </button>
    `).join('');

    container.querySelectorAll('.term-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-index'));
        handleOptionClick(idx);
      });
    });
  }

  const fb = document.getElementById('feedbackBox');
  if (fb) fb.classList.add('hidden');

  lucide.createIcons();
}

function handleOptionClick(idx) {
  const q = quizList[currentIndex];
  const opt = q.options[idx];
  const fb = document.getElementById('feedbackBox');
  if (!fb) return;

  fb.classList.remove('hidden');
  const titleEl = document.getElementById('feedbackTitle');
  const contentEl = document.getElementById('feedbackContent');

  solvedCount++;
  if (opt.is_correct) {
    audioSynth.playCorrect();
    correctCount++;
    currentCombo++;
    if (currentCombo > maxCombo) maxCombo = currentCombo;
    totalScore += 100 + (currentCombo * 20);

    fb.className = 'p-5 rounded-2xl bg-emerald-950/85 border-2 border-emerald-500/70 text-xs sm:text-sm text-emerald-200 space-y-2 shadow-lg shadow-emerald-950/40';
    if (titleEl) titleEl.innerHTML = `<span class="text-base">🎉</span> <span>정답입니다! 🔥 ${currentCombo}연속 정답 콤보! (+${100 + currentCombo * 20}P)</span>`;
  } else {
    audioSynth.playWrong();
    currentCombo = 0;
    fb.className = 'p-5 rounded-2xl bg-rose-950/85 border-2 border-rose-500/70 text-xs sm:text-sm text-rose-200 space-y-2 shadow-lg shadow-rose-950/40';
    if (titleEl) titleEl.innerHTML = '<span class="text-base">💡</span> <span>아쉽지만 오답이에요! (실전 흑우 방지 꿀팁)</span>';
  }

  if (contentEl) {
    contentEl.innerHTML = `
      <div>${q.explanation}</div>
      <div class="mt-3 pt-3 border-t border-slate-700/50 flex flex-col gap-2">
        <button id="btnAskAiCoach" class="self-start text-[11px] font-black px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition-all flex items-center gap-1.5 active:scale-95">
          <span>🤖</span> <span>AI 튜터에게 20대 일상 비유로 더 쉽게 물어보기</span>
        </button>
        <div id="aiCoachAnswerBox" class="hidden p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-100 leading-relaxed">
          <div class="font-bold flex items-center gap-1 text-purple-300 mb-1">
            <span>✨</span> <span>AI 핑거코치의 1:1 눈높이 처방전</span>
          </div>
          <div id="aiCoachText" class="text-[11px] text-slate-200 space-y-1">로딩 중... 💭</div>
        </div>
      </div>
    `;

    const aiBtn = document.getElementById('btnAskAiCoach');
    const aiBox = document.getElementById('aiCoachAnswerBox');
    const aiText = document.getElementById('aiCoachText');

    if (aiBtn && aiBox && aiText) {
      aiBtn.addEventListener('click', async () => {
        aiBtn.classList.add('hidden');
        aiBox.classList.remove('hidden');
        aiText.innerHTML = 'AI 튜터가 20대 일상 비유를 생성하고 있습니다... ⏳';

        try {
          const debrief = await apiClient.getAIDebrief([q.question], '주식 & 회계 기초 퀴즈 아레나');
          if (debrief && debrief.message) {
            aiText.innerHTML = `
              <p class="font-bold text-cyan-300">${debrief.coach_title || '💡 핵심 콕 짚어보기'}</p>
              <p class="text-slate-200">${debrief.message}</p>
              ${debrief.havruta_question ? `<p class="mt-1 text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40 font-medium">❓ <b>스스로 던져보는 하브루타 질문:</b> ${debrief.havruta_question}</p>` : ''}
              ${debrief.key_takeaway ? `<p class="mt-1 text-emerald-300 text-[10px]">📌 <b>핵심 요약:</b> ${debrief.key_takeaway}</p>` : ''}
            `;
          } else {
            throw new Error('No debrief data');
          }
        } catch (e) {
          aiText.innerHTML = `
            <p class="font-bold text-cyan-300">💡 핑거코치의 20대 맞춤 비유</p>
            <p class="text-slate-200">"어려운 한자 용어에 속지 마세요! 이 개념의 핵심은 결국 <b>'내 지갑에서 진짜 돈이 나가는지, 아니면 장부상 숫자놀음인지'</b>를 꿰뚫어 보는 것입니다."</p>
            <p class="mt-1 text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40 font-medium">❓ <b>생각해볼 점:</b> 내가 만약 친구와 동업할 때 이 숫자를 속인다면 어떻게 될까요?</p>
          `;
        }
      });
    }
  }
  lucide.createIcons();
}
