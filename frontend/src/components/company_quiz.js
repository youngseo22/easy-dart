/**
 * [팀원 C 담당] 기업 상세 페이지 하단에 임베딩되는 복습 퀴즈 웹 컴포넌트
 */
export function renderCompanyQuizSection(containerId, quizData, onAnswerCallback) {
  const container = document.getElementById(containerId);
  if (!container || !quizData) return;

  container.innerHTML = `
    <div class="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-indigo-700/60">
        <div class="flex items-center gap-2.5">
          <span class="text-2xl">🎯</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-white">방금 배운 공시 내용 팩트체크 퀴즈</h3>
            <p class="text-xs text-indigo-200 mt-0.5">문서를 제대로 이해했는지 바로 확인해보세요!</p>
          </div>
        </div>
        <span class="px-2.5 py-0.5 bg-indigo-800 text-indigo-200 text-xs font-bold rounded-full">복습 퀴즈</span>
      </div>

      <div class="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-700/80">
        <p class="text-sm sm:text-base font-extrabold text-white">${quizData.question}</p>
      </div>

      <div id="quizOptionsList" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${quizData.options.map((opt, idx) => `
          <button data-index="${idx}" class="quiz-opt-item p-4 rounded-2xl bg-indigo-950/80 border border-indigo-700 hover:border-yellow-400 font-bold text-xs sm:text-sm text-left text-white transition-all flex items-center justify-between">
            <span>${opt.text}</span>
            <span class="text-indigo-400 text-xs">선택</span>
          </button>
        `).join('')}
      </div>

      <div id="quizFeedbackBox" class="hidden p-4 rounded-2xl border transition-all space-y-1 text-xs sm:text-sm"></div>
    </div>
  `;

  // 옵션 클릭 이벤트 바인딩
  container.querySelectorAll('.quiz-opt-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(btn.getAttribute('data-index'));
      const opt = quizData.options[idx];
      const fb = container.querySelector('#quizFeedbackBox');
      
      fb.classList.remove('hidden');
      if (opt.is_correct) {
        fb.className = 'p-4 rounded-2xl bg-emerald-900/60 border border-emerald-500/80 text-white space-y-1';
        fb.innerHTML = `<strong>🎉 정답입니다!</strong><p>${quizData.explanation}</p>`;
      } else {
        fb.className = 'p-4 rounded-2xl bg-rose-900/60 border border-rose-500/80 text-white space-y-1';
        fb.innerHTML = `<strong>💡 오답이에요!</strong><p>${quizData.explanation}</p>`;
      }

      if (onAnswerCallback) onAnswerCallback(opt.is_correct);
    });
  });
}
