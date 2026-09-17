/**
 * [팀원 C 담당] 20대 사회초년생 맞춤 주식 & 회계 기초 용어 퀴즈 모듈
 * 트렌디한 카피라이팅과 다크 네온 아케이드 UI/UX 지원
 */
import { apiClient } from '../../api/client.js';

// 20대 사회초년생 맞춤 트렌디 퀴즈 데이터셋 (오프라인 & API 연동 듀얼 지원)
const FALLBACK_20S_QUIZZES = [
  {
    id: "fq_01",
    topic: "income",
    category: "💰 손익계산서 알짜 마진",
    question: "손님들에게 물건을 팔고 받은 총 금액에서 알바비, 재료비, 매장 월세를 빼고 본업으로 순수하게 남긴 '진짜 돈벌이'는?",
    options: [
      { text: "1. 매출액 (총 판매액)", is_correct: false },
      { text: "2. 영업이익 (순수 본업 마진)", is_correct: true },
      { text: "3. 자본금 (주주들의 밑천)", is_correct: false },
      { text: "4. 부채 (빌린 빚)", is_correct: false }
    ],
    explanation: "💡 <b>영업이익(Operating Profit)</b>이 회사의 진짜 체력입니다! 매출이 1,000억이어도 영업이익이 마이너스면 회사는 팔수록 손해보는 중입니다."
  },
  {
    id: "fq_02",
    topic: "income",
    category: "💰 성과급과 직결되는 성적표",
    question: "1년 동안 장사해서 번 돈에서 대출 이자, 세금, 투자 손실까지 싹 다 정산하고 최종적으로 주주들 금고에 남긴 돈은?",
    options: [
      { text: "1. 매출원가 (제품 원가)", is_correct: false },
      { text: "2. 감가상각비 (기계 낡은 비용)", is_correct: false },
      { text: "3. 당기순이익 (최종 알짜 수익)", is_correct: true },
      { text: "4. 매출총이익 (단순 마진)", is_correct: false }
    ],
    explanation: "💡 <b>당기순이익(Net Income)</b>이 회사의 최종 성적표입니다! 영업이익이 흑자여도 대출 이자 폭탄을 맞으면 당기순손실(적자)이 날 수 있습니다."
  },
  {
    id: "fq_03",
    topic: "audit",
    category: "📋 상장폐지 1순위 지뢰",
    question: "회계사가 기업 장부를 전혀 믿을 수 없다고 선언하여 주식이 즉시 거래정지되고 상장폐지 실질심사 대상이 되는 가장 무서운 감사의견은?",
    options: [
      { text: "1. 적정 의견 (장부 합격)", is_correct: false },
      { text: "2. 한정 의견 (일부 주의)", is_correct: false },
      { text: "3. 감사의견 거절 (상폐 직행 열차)", is_correct: true },
      { text: "4. 재무제표 승인", is_correct: false }
    ],
    explanation: "🚨 <b>감사의견 거절</b>은 회계사가 '이 장부는 가짜가 너무 많아 감사를 포기한다'고 선언한 것입니다. 주식이 휴지조각이 되는 퇴출 1순위 신호!"
  },
  {
    id: "fq_04",
    topic: "audit",
    category: "📋 깡통 기업 판별법",
    question: "적자가 수년간 누적되어 주주들이 낸 밑천(자본금)마저 전부 까먹고, 자본총계가 마이너스가 되어버린 빈털터리 상태는?",
    options: [
      { text: "1. 흑자전환", is_correct: false },
      { text: "2. 완전자본잠식 (퇴출 경고)", is_correct: true },
      { text: "3. 유상증자", is_correct: false },
      { text: "4. 자사주 매입", is_correct: false }
    ],
    explanation: "🚨 <b>완전자본잠식</b>은 뼈대까지 다 갉아먹은 상태로, 코스닥 시장에서 즉시 퇴출(상장폐지) 사유가 됩니다."
  },
  {
    id: "fq_05",
    topic: "income",
    category: "🍀 주가 급등 슈퍼 호재",
    question: "기업이 시장에서 유통되는 자기 회사 주식을 직접 사들여 흔적도 없이 소각(파괴)해버리는 대표적인 주주환원 호재는?",
    options: [
      { text: "1. 자사주 소각 (1주당 가치 상승)", is_correct: true },
      { text: "2. 전환사채(CB) 폭탄 발행", is_correct: false },
      { text: "3. 무상감자", is_correct: false },
      { text: "4. 대표이사 대출", is_correct: false }
    ],
    explanation: "🍀 <b>자사주 소각</b>은 시중의 주식 총수를 줄여 1주당 가치(EPS)를 높여주는 가장 정직하고 강력한 주가 부양 호재입니다!"
  }
];

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
    // API 연결 실패 시 자체 20대 초년생 퀴즈셋으로 즉시 전환
    filterFallback(topic);
  }
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
        <span class="group-hover:text-cyan-300 transition-colors">${opt.text}</span>
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
  if (contentEl) contentEl.innerHTML = q.explanation;
  lucide.createIcons();
}
