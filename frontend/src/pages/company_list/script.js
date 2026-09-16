/**
 * [팀원 B 담당] 기업 목록 및 소비 환산기 인터랙션 스크립트
 */
import { calculateMetaphor, BRAND_METAPHOR_MAP } from '../../utils/metaphor_calculator.js';
import { apiClient } from '../../api/client.js';

let allCompanies = [];

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  setupEvents();
  await loadCompanies();
});

function setupEvents() {
  const brandSelect = document.getElementById('brandSelect');
  const spendInput = document.getElementById('spendInput');
  const searchInput = document.getElementById('companySearchInput');

  if (brandSelect && spendInput) {
    brandSelect.addEventListener('change', updateMetaphor);
    spendInput.addEventListener('input', updateMetaphor);
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => filterCompanies(e.target.value));
  }

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.category-btn').forEach(b => {
        b.className = 'category-btn px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0';
      });
      e.target.className = 'category-btn active px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm shrink-0';
      const cat = e.target.getAttribute('data-category');
      filterByCategory(cat);
    });
  });
}

function updateMetaphor() {
  const brandKey = document.getElementById('brandSelect').value;
  const spendVal = Number(document.getElementById('spendInput').value) || 0;
  const result = calculateMetaphor(brandKey, spendVal);

  if (!result) return;

  document.getElementById('resultIcon').innerText = result.icon;
  document.getElementById('resultTitle').innerText = `${result.brandName} 체감 분석`;
  document.getElementById('resultSub').innerText = `최근 공시 영업이익률 약 ${result.marginRatePct}% 적용`;
  document.getElementById('dispSpend').innerText = `${result.spendAmount.toLocaleString()}원`;
  document.getElementById('dispMetaphor').innerText = result.summaryText;
  document.getElementById('dispMargin').innerHTML = `순수 기업 이익금 환산액 : <span class="font-bold text-slate-800">약 ${result.marginEarned.toLocaleString()}원</span>`;
}

async function loadCompanies() {
  try {
    const res = await apiClient.getCompanies();
    allCompanies = res.companies || [];
    renderCompanyList(allCompanies);
  } catch (err) {
    console.warn('API 연동 실패, mock 데이터 표시:', err);
  }
}

function renderCompanyList(list) {
  const grid = document.getElementById('companyGrid');
  if (!grid) return;

  grid.innerHTML = list.map(c => `
    <div class="company-card bg-white rounded-3xl p-6 border border-slate-200 shadow-subtle hover:shadow-hover card-transition cursor-pointer group" onclick="location.href='../company_detail/index.html?id=${c.id}'">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ${c.icon}
          </div>
          <div>
            <h3 class="font-extrabold text-base text-slate-900">${c.name}</h3>
            <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">${c.category_name}</span>
          </div>
        </div>
        <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">공시 분석 📈</span>
      </div>

      <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 mb-4">
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">체감 환산 💡</p>
        <p class="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">
          "영업이익으로 ${c.item_name}을 대량 판매한 마진 규모!"
        </p>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>DART 2023 사업보고서</span>
        <span class="font-bold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">상세 파헤치기 ➡️</span>
      </div>
    </div>
  `).join('');
  lucide.createIcons();
}

function filterCompanies(query) {
  const filtered = allCompanies.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  renderCompanyList(filtered);
}

function filterByCategory(cat) {
  const filtered = cat === 'all' ? allCompanies : allCompanies.filter(c => c.category === cat);
  renderCompanyList(filtered);
}
