/**
 * [팀원 C 담당] 기업 상세 페이지 하단에 임베딩되는 복습 퀴즈 웹 컴포넌트
 */
export function renderCompanyQuizSection(containerId, quizData, onAnswerCallback) {
  const container = document.getElementById(containerId);
  if (!container || !quizData) return;

  container.innerHTML = `
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-base shadow-sm">🎯</span>
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900">실전 공시 팩트체크 복습 퀴즈</h3>
            <p class="text-xs text-slate-500 mt-0.5">방금 살펴본 DART 핵심 내용을 제대로 이해했는지 확인해보세요!</p>
          </div>
        </div>
        <span class="px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-xl border border-amber-200">
          실전 복습
        </span>
      </div>

      <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <p class="text-xs font-bold text-slate-400 mb-1">Q. 문제</p>
        <p class="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">${quizData.question}</p>
      </div>

      <div id="quizOptionsList" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${quizData.options.map((opt, idx) => `
          <button data-index="${idx}" class="quiz-opt-item p-4 rounded-2xl bg-white border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 font-bold text-xs sm:text-sm text-left text-slate-800 transition-all flex items-center justify-between cursor-pointer group">
            <span class="group-hover:text-indigo-900">${opt.text}</span>
            <span class="text-slate-400 group-hover:text-indigo-600 text-xs shrink-0 ml-2">선택 →</span>
          </button>
        `).join('')}
      </div>

      <div id="quizFeedbackBox" class="hidden p-4 rounded-2xl border transition-all space-y-1 text-xs sm:text-sm"></div>
    </div>
  `;

  // 옵션 클릭 이벤트 바인딩
  container.querySelectorAll('.quiz-opt-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      const opt = quizData.options[idx];
      const fb = container.querySelector('#quizFeedbackBox');
      
      // 모든 버튼 비활성화 및 정답/오답/미선택 상태 스타일링
      container.querySelectorAll('.quiz-opt-item').forEach((b, i) => {
        b.disabled = true;
        b.classList.remove('cursor-pointer', 'hover:border-indigo-500', 'hover:bg-indigo-50/30', 'group');
        
        if (quizData.options[i].is_correct) {
          b.className = 'quiz-opt-item p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 font-bold text-xs sm:text-sm text-left text-emerald-900 flex items-center justify-between pointer-events-none cursor-default shadow-sm';
          b.innerHTML = `<span>${quizData.options[i].text}</span><span class="text-emerald-700 font-black text-xs shrink-0 ml-2">✓ 정답</span>`;
        } else if (i === idx && !opt.is_correct) {
          b.className = 'quiz-opt-item p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 font-bold text-xs sm:text-sm text-left text-rose-900 flex items-center justify-between pointer-events-none cursor-default shadow-sm';
          b.innerHTML = `<span>${quizData.options[i].text}</span><span class="text-rose-700 font-black text-xs shrink-0 ml-2">✕ 선택한 오답</span>`;
        } else {
          b.className = 'quiz-opt-item p-4 rounded-2xl bg-slate-50/70 border-2 border-slate-200/70 font-bold text-xs sm:text-sm text-left text-slate-400 flex items-center justify-between pointer-events-none cursor-default opacity-40';
          b.innerHTML = `<span>${quizData.options[i].text}</span><span class="text-slate-300 text-xs shrink-0 ml-2">-</span>`;
        }
      });
      
      if (fb) {
        fb.classList.remove('hidden');
        if (opt.is_correct) {
          fb.className = 'p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1';
          fb.innerHTML = `<div class="flex items-center gap-2 font-black text-emerald-800"><span class="text-base">🎉</span><span>정답입니다!</span></div><p class="text-xs text-emerald-800 leading-relaxed font-medium">${quizData.explanation}</p>`;
        } else {
          fb.className = 'p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 space-y-1';
          fb.innerHTML = `<div class="flex items-center gap-2 font-black text-rose-800"><span class="text-base">💡</span><span>아쉽네요, 다시 확인해보세요!</span></div><p class="text-xs text-rose-800 leading-relaxed font-medium">${quizData.explanation}</p>`;
        }
      }

      if (onAnswerCallback) onAnswerCallback(opt.is_correct);
    });
  });
}
