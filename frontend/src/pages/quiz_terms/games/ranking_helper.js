/**
 * DART 아케이드 로컬 랭킹 & 명예의 전당 매니저 (ranking_helper.js)
 * 로그인 없이도 localStorage를 통해 개인 최고점수, 등급, 닉네임, 명예의 전당을 영구 보존합니다.
 */

const DEFAULT_HALL_OF_FAME = [
  { rank: 1, nickname: "여의도황소", game: "공시 레이더", score: 2450, date: "09.17" },
  { rank: 2, nickname: "성수동주린이", game: "투자 심사관", score: 1920, date: "09.17" },
  { rank: 3, nickname: "슈퍼불개미", game: "급행 러너", score: 1650, date: "09.16" },
  { rank: 4, nickname: "테슬라풀매수", game: "공시 레이더", score: 1300, date: "09.16" },
  { rank: 5, nickname: "새싹주린이", game: "투자 심사관", score: 980, date: "09.15" }
];

export function getUserStats() {
  const defaultStats = {
    highScore: 0,
    defeatedBombs: 0,
    gamesPlayed: 0,
    nickname: "익명의 주린이"
  };
  try {
    const saved = localStorage.getItem('easy_dart_user_stats');
    return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
  } catch (e) {
    return defaultStats;
  }
}

export function saveUserNickname(newNickname) {
  const stats = getUserStats();
  stats.nickname = newNickname.trim() || "익명의 주린이";
  localStorage.setItem('easy_dart_user_stats', JSON.stringify(stats));
  return stats;
}

export function saveGameResult({ score, defeatedBombs = 0, nickname = '', gameTitle = '공시 레이더' }) {
  const stats = getUserStats();
  if (nickname && nickname.trim()) {
    stats.nickname = nickname.trim();
  }
  stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
  stats.defeatedBombs = (stats.defeatedBombs || 0) + defeatedBombs;
  
  const isNewRecord = score > (stats.highScore || 0);
  if (isNewRecord) {
    stats.highScore = score;
  }
  localStorage.setItem('easy_dart_user_stats', JSON.stringify(stats));

  // Hall of Fame Update
  let fame = getHallOfFame();
  let myRank = null;

  if (score > 0) {
    const today = new Date();
    const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    fame.push({
      nickname: stats.nickname,
      game: gameTitle,
      score: score,
      date: dateStr,
      isMe: true
    });

    // Sort descending by score
    fame.sort((a, b) => b.score - a.score);

    // Find user's new rank in sorted list
    const foundIdx = fame.findIndex(item => item.isMe && item.score === score);
    if (foundIdx !== -1 && foundIdx < 5) {
      myRank = foundIdx + 1;
    }

    // Keep top 5
    fame = fame.slice(0, 5).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    localStorage.setItem('easy_dart_hall_of_fame', JSON.stringify(fame));
  }

  return { stats, isNewRecord, myRank, hallOfFame: fame };
}

export function getHallOfFame() {
  try {
    const saved = localStorage.getItem('easy_dart_hall_of_fame');
    return saved ? JSON.parse(saved) : DEFAULT_HALL_OF_FAME;
  } catch (e) {
    return DEFAULT_HALL_OF_FAME;
  }
}

export function calculateGrade(score, defeatedBombs) {
  const totalExp = (score || 0) + (defeatedBombs || 0) * 50;
  if (totalExp >= 3000) return { icon: '👑', name: '스마트 머니 (LV.MAX)', textClass: 'text-amber-300' };
  if (totalExp >= 1500) return { icon: '🐜🔥', name: '날렵한 여의도 불개미 (LV.3)', textClass: 'text-rose-400' };
  if (totalExp >= 600) return { icon: '🔍', name: '노련한 지뢰 감별사 (LV.2)', textClass: 'text-cyan-300' };
  return { icon: '🐣', name: '새싹 주린이 (LV.1)', textClass: 'text-emerald-300' };
}
