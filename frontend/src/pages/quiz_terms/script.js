/**
 * [팀원 C 담당] 주식 기초 용어 퀴즈 페이지 스크립트
 */
import { apiClient } from '../../api/client.js';

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
      document.querySelectorAll('.topic-btn').forEach(b => {
        b.className = 'topic-btn px-4 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all';
      });
      e.target.className = 'topic-btn active px-4 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm transition-all';
      const topic = e.target.getAttribute('data-topic');
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
    quizList = res.quizzes || [];
    currentIndex = 0;
    if (quizList.length > 0) {
      renderCurrentQuiz();
    }
  } catch (err) {
    console.warn('퀴즈 API 연동 실패:', err);
  }
}

function renderCurrentQuiz() {
  const q = quizList[currentIndex];
  if (!q) return;

  document.getElementById('quizCategory').innerText = q.category;
  document.getElementById('quizProgress').innerText = `Q ${currentIndex + 1} / ${quizList.length}`;
  document.getElementById('quizQuestion').innerText = `"${q.question}"`;

  const container = document.getElementById('quizOptionsContainer');
  container.innerHTML = q.options.map((opt, idx) => `
    <button data-index="${idx}" class="term-opt-btn w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 font-bold text-xs sm:text-sm text-slate-800 flex items-center justify-between transition-all">
      <span>${opt.text}</span>
      <span class="text-xs text-slate-400">선택</span>
    </button>
  `).join('');

  const fb = document.getElementById('feedbackBox');
  fb.classList.add('hidden');

  container.querySelectorAll('.term-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      handleOptionClick(idx);
    });
  });
}

function handleOptionClick(idx) {
  const q = quizList[currentIndex];
  const opt = q.options[idx];
  const fb = document.getElementById('feedbackBox');

  fb.classList.remove('hidden');
  if (opt.is_correct) {
    fb.className = 'p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-950 space-y-2';
    document.getElementById('feedbackTitle').innerText = '🎉 정답입니다!';
  } else {
    fb.className = 'p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-950 space-y-2';
    document.getElementById('feedbackTitle').innerText = '💡 아쉽지만 오답이에요!';
  }
  document.getElementById('feedbackContent').innerHTML = q.explanation;
}
