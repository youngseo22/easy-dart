/**
 * [팀원 C 담당] 20대 사회초년생 맞춤 주식 & 회계 기초 용어 퀴즈 모듈
 * 15종의 고품격 실전 퀴즈 풀 & 매번 순서가 달라지는 랜덤 셔플(Fisher-Yates) 알고리즘 탑재
 */
import { apiClient } from '../../api/client.js';

// 20대 사회초년생 맞춤 트렌디 퀴즈 데이터셋 (15종 완비)
const FALLBACK_20S_QUIZZES = [
  {
    id: "fq_01",
    topic: "income",
    category: "💰 손익계산서 알짜 마진",
    question: "손님들에게 물건을 팔고 받은 총 금액에서 알바비, 재료비, 매장 월세를 빼고 본업으로 순수하게 남긴 '진짜 돈벌이'는?",
    options: [
      { text: "매출액 (손님이 결제한 총 판매액)", is_correct: false },
      { text: "영업이익 (순수 본업 알짜 마진)", is_correct: true },
      { text: "자본금 (처음 시작할 때 낸 밑천)", is_correct: false },
      { text: "부채 (은행에서 빌린 대출금)", is_correct: false }
    ],
    explanation: "💡 <b>영업이익(Operating Profit)</b>이 회사의 진짜 체력입니다! 매출이 1,000억이어도 영업이익이 마이너스면 회사는 팔수록 손해보는 중입니다."
  },
  {
    id: "fq_02",
    topic: "income",
    category: "💰 성과급과 직결되는 성적표",
    question: "1년 동안 장사해서 번 돈에서 대출 이자, 세금, 투자 손실까지 싹 다 정산하고 최종적으로 주주들 금고에 남긴 돈은?",
    options: [
      { text: "매출원가 (제품 제작 원가)", is_correct: false },
      { text: "감가상각비 (기계 낡은 비용)", is_correct: false },
      { text: "당기순이익 (최종 알짜 수익)", is_correct: true },
      { text: "매출총이익 (단순 마진)", is_correct: false }
    ],
    explanation: "💡 <b>당기순이익(Net Income)</b>이 회사의 최종 성적표입니다! 영업이익이 흑자여도 대출 이자 폭탄을 맞으면 당기순손실(적자)이 날 수 있습니다."
  },
  {
    id: "fq_03",
    topic: "income",
    category: "💰 카페 사장님의 회계 지혜",
    question: "카페를 차릴 때 고가의 에스프레소 머신을 사고 첫 달에 전액 비용 처리하지 않고, 5년에 걸쳐 매달 나누어 비용으로 반영하는 회계 기법은?",
    options: [
      { text: "감가상각비 (비용 분할 반영)", is_correct: true },
      { text: "대손충당금", is_correct: false },
      { text: "영업외비용", is_correct: false },
      { text: "자본준비금", is_correct: false }
    ],
    explanation: "💡 <b>감가상각비(Depreciation)</b>는 오래 쓰는 자산의 가격을 사용하는 기간 동안 쪼개서 장부에 반영하는 회계 원칙입니다."
  },
  {
    id: "fq_04",
    topic: "income",
    category: "💰 장사 수완의 척도",
    question: "회사가 100억 원어치 물건을 팔았을 때 영업이익으로 20억을 남겼다면, 이 회사의 본업 마진율(20%)을 나타내는 지표는?",
    options: [
      { text: "부채비율", is_correct: false },
      { text: "영업이익률 (OPM)", is_correct: true },
      { text: "배당성향", is_correct: false },
      { text: "유보율", is_correct: false }
    ],
    explanation: "💡 <b>영업이익률</b>은 매출액 대비 영업이익의 비율로, 회사가 본업에서 얼마나 높은 부가가치를 창출하는지 보여주는 마진율입니다."
  },
  {
    id: "fq_05",
    topic: "income",
    category: "💰 마케팅과 월급의 정체",
    question: "공장 생산 원가 외에 본사 직원 월급, 광고 마케팅비, 배송 물류비, 임차료 등 영업 활동 전반에 들어간 비용을 묶어 부르는 용어는?",
    options: [
      { text: "판관비 (판매비와 관리비)", is_correct: true },
      { text: "매출원가", is_correct: false },
      { text: "법인세 비용", is_correct: false },
      { text: "이자 비용", is_correct: false }
    ],
    explanation: "💡 <b>판관비(SG&A)</b>는 광고비와 인건비 등이 포함되며, 판관비가 과도하게 늘어나면 매출이 늘어도 적자로 돌아설 수 있습니다."
  },
  {
    id: "fq_06",
    topic: "audit",
    category: "📋 상장폐지 1순위 지뢰",
    question: "회계사가 기업 장부를 전혀 믿을 수 없다고 선언하여 주식이 즉시 거래정지되고 상장폐지 실질심사 대상이 되는 가장 무서운 감사의견은?",
    options: [
      { text: "적정 의견 (장부 합격)", is_correct: false },
      { text: "한정 의견 (일부 주의)", is_correct: false },
      { text: "감사의견 거절 (상폐 직행 열차)", is_correct: true },
      { text: "재무제표 승인", is_correct: false }
    ],
    explanation: "🚨 <b>감사의견 거절</b>은 회계사가 '이 장부는 가짜가 너무 많아 감사를 포기한다'고 선언한 것입니다. 주식이 휴지조각이 되는 퇴출 1순위 신호!"
  },
  {
    id: "fq_07",
    topic: "audit",
    category: "📋 감사보고서 합격증",
    question: "공인회계사가 기업 장부를 꼼꼼히 검토한 뒤 '회계 기준에 맞게 특별한 왜곡 없이 잘 작성되었다'고 내리는 성적표는?",
    options: [
      { text: "적정 의견 (장부 투명성 통과)", is_correct: true },
      { text: "부적정 의견", is_correct: false },
      { text: "감사의견 거절", is_correct: false },
      { text: "관리 의견", is_correct: false }
    ],
    explanation: "💡 <b>적정 의견</b>은 회사가 대박 기업이라는 뜻이 아니라 '장부를 거짓 없이 정직하게 썼다'는 기본 합격증입니다."
  },
  {
    id: "fq_08",
    topic: "audit",
    category: "📋 깡통 기업 판별법",
    question: "적자가 수년간 누적되어 주주들이 낸 밑천(자본금)마저 전부 까먹고, 자본총계가 마이너스가 되어버린 빈털터리 상태는?",
    options: [
      { text: "흑자전환", is_correct: false },
      { text: "완전자본잠식 (퇴출 경고)", is_correct: true },
      { text: "유상증자", is_correct: false },
      { text: "자사주 매입", is_correct: false }
    ],
    explanation: "🚨 <b>완전자본잠식</b>은 뼈대까지 다 갉아먹은 상태로, 코스닥 시장에서 즉시 퇴출(상장폐지) 사유가 됩니다."
  },
  {
    id: "fq_09",
    topic: "audit",
    category: "📋 경영진 모럴헤저드 리스크",
    question: "대표이사나 임직원이 회사 자금을 몰래 빼돌리거나 회사에 막대한 손해를 끼쳐 주가가 급락하고 상장적격성 심사를 받게 되는 사건은?",
    options: [
      { text: "횡령·배임 혐의 (경영진 범죄)", is_correct: true },
      { text: "주식 액면분할", is_correct: false },
      { text: "중간배당 결의", is_correct: false },
      { text: "무상증자 결정", is_correct: false }
    ],
    explanation: "🚨 <b>횡령·배임</b> 공시가 뜨면 회사 신뢰도가 바닥으로 추락하고 거래정지 위험이 매우 커집니다."
  },
  {
    id: "fq_10",
    topic: "audit",
    category: "📋 거래소의 옐로카드",
    question: "연속 적자, 자본잠식, 불성실공시 등으로 인해 한국거래소가 '투자자 주의' 딱지를 붙이고 상폐 직전 단계로 지정하는 종목 분류는?",
    options: [
      { text: "관리종목 (상폐 전 옐로카드)", is_correct: true },
      { text: "코스피 200 종목", is_correct: false },
      { text: "우량기업부 종목", is_correct: false },
      { text: "배당귀족주", is_correct: false }
    ],
    explanation: "🚨 <b>관리종목</b>으로 지정되면 신용거래가 제한되고 추가 부실 발생 시 곧바로 상장폐지 실질심사로 넘어갑니다."
  },
  {
    id: "fq_11",
    topic: "income",
    category: "🍀 주가 급등 슈퍼 호재",
    question: "기업이 시장에서 유통되는 자기 회사 주식을 직접 사들여 흔적도 없이 소각(파괴)해버리는 대표적인 주주환원 호재는?",
    options: [
      { text: "자사주 소각 (1주당 가치 상승)", is_correct: true },
      { text: "전환사채(CB) 폭탄 발행", is_correct: false },
      { text: "무상감자", is_correct: false },
      { text: "대표이사 대출", is_correct: false }
    ],
    explanation: "🍀 <b>자사주 소각</b>은 시중의 주식 총수를 줄여 1주당 가치(EPS)를 높여주는 가장 정직하고 강력한 주가 부양 호재입니다!"
  },
  {
    id: "fq_12",
    topic: "income",
    category: "📈 주가 밸류에이션 상식",
    question: "현재 주가가 회사가 1년에 벌어들이는 순이익 대비 몇 배로 거래되고 있는지를 나타내며, 동종업계 대비 저평가 여부를 따질 때 쓰는 대표 지표는?",
    options: [
      { text: "PER (주가수익비율)", is_correct: true },
      { text: "PBR (주가순자산비율)", is_correct: false },
      { text: "부채비율", is_correct: false },
      { text: "유동비율", is_correct: false }
    ],
    explanation: "💡 <b>PER(Price to Earnings Ratio)</b>은 주가를 주당순이익(EPS)으로 나눈 값으로, 낮을수록 번 돈에 비해 주가가 싸다는 뜻입니다."
  },
  {
    id: "fq_13",
    topic: "income",
    category: "📈 청산 가치 비교 지표",
    question: "회사가 지금 당장 모든 자산을 팔고 빚을 갚은 뒤 주주에게 돌아갈 순자산(장부가치) 대비 현재 주가가 몇 배인지 나타내는 지표는?",
    options: [
      { text: "PBR (주가순자산비율)", is_correct: true },
      { text: "PER (주가수익비율)", is_correct: false },
      { text: "ROE (자기자본이익률)", is_correct: false },
      { text: "배당수익률", is_correct: false }
    ],
    explanation: "💡 <b>PBR(Price to Book-value Ratio)</b>이 1배 미만이면 회사를 당장 청산해서 나눠 갖는 돈보다도 주가가 싸다는 뜻입니다."
  },
  {
    id: "fq_14",
    topic: "income",
    category: "🏢 기업의 진짜 덩치",
    question: "'현재 주가 × 전체 발행 주식 수'로 계산되며, 그 회사를 100% 통째로 사들이려면 필요한 전체 시장 가격(몸값)은?",
    options: [
      { text: "시가총액 (기업의 시장 몸값)", is_correct: true },
      { text: "자본잉여금", is_correct: false },
      { text: "유동부채", is_correct: false },
      { text: "당기순손실", is_correct: false }
    ],
    explanation: "💡 <b>시가총액</b>이 진짜 회사의 크기 순위입니다! 주가가 1만 원이어도 주식 수가 적으면, 1,000원짜리 대기업보다 시가총액이 작을 수 있습니다."
  },
  {
    id: "fq_15",
    topic: "audit",
    category: "🚨 개미 주주들의 눈물 CB 폭탄",
    question: "회사가 돈을 빌릴 때 '나중에 주식으로 바꿀 수 있는 권리'를 붙여 발행한 채권으로, 행사 시 대량의 신주가 쏟아져 기존 주가를 희석시키는 악재는?",
    options: [
      { text: "전환사채 (CB 폭탄)", is_correct: true },
      { text: "국채 10년물", is_correct: false },
      { text: "보통주 배당", is_correct: false },
      { text: "정기예금 증서", is_correct: false }
    ],
    explanation: "🚨 <b>전환사채(CB)</b>가 주식으로 전환되면 시장에 매도 물량이 쏟아져 기존 주주들의 주가가 희석되고 급락하기 쉽습니다."
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

let quizList = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  setupFilterButtons();
  await loadQuizzes('all');
});

function setupFilterButtons() {
  document.querySelectorAll('.topic-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const clickedBtn = e.currentTarget;
      document.querySelectorAll('.topic-btn').forEach(b => {
        b.className = 'topic-btn px-4 py-2 rounded-full text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 hover:bg-slate-800 transition-all flex items-center gap-1.5';
      });
      clickedBtn.className = 'topic-btn active px-4 py-2 rounded-full text-xs font-black bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400 transition-all flex items-center gap-1.5';
      const topic = clickedBtn.getAttribute('data-topic');
      await loadQuizzes(topic);
    });
  });

  const nextBtn = document.getElementById('nextQuizBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % quizList.length;
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
    // API 연결 실패 시 자체 20대 초년생 15종 퀴즈셋으로 즉시 전환
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
  if (progEl) progEl.innerText = `Q ${currentIndex + 1} / ${quizList.length}`;

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

  if (opt.is_correct) {
    fb.className = 'p-5 rounded-2xl bg-emerald-950/85 border-2 border-emerald-500/70 text-xs sm:text-sm text-emerald-200 space-y-2 shadow-lg shadow-emerald-950/40';
    if (titleEl) titleEl.innerHTML = '<span class="text-base">🎉</span> <span>정답입니다! (소중한 내 월급 방어 성공)</span>';
  } else {
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
          const debrief = await apiClient.getAIDebrief([q.question], '1분 기초 용어 퀴즈');
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
          // 오프라인 스마트 대체 설명
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

