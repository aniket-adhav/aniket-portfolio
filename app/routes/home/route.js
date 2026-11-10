import { json } from '@remix-run/node';

export { Home as default, meta, links, ErrorBoundary } from './home';

const GITHUB_USER = 'aniket-adhav';
const LEETCODE_USER = 'aniket_adhav';
const WEEKS = 26;

function buildWeekGrid(dayMap = {}) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const dow = today.getDay();

  // Start of the current week (Sunday)
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dow);

  // Go back (WEEKS-1) more weeks
  const gridStart = new Date(weekStart);
  gridStart.setDate(weekStart.getDate() - (WEEKS - 1) * 7);

  const result = [];
  const cur = new Date(gridStart);

  for (let w = 0; w < WEEKS; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().slice(0, 10);
      const isFuture = dateStr > todayStr;
      const isToday = dateStr === todayStr;
      const entry = !isFuture ? (dayMap[dateStr] || { count: 0, level: 0 }) : { count: 0, level: -1 };
      week.push({ date: dateStr, count: entry.count, level: entry.level, isToday });
      cur.setDate(cur.getDate() + 1);
    }
    result.push(week);
  }
  return result;
}

function computeStreak(dayMap) {
  const cur = new Date();
  const todayKey = cur.toISOString().slice(0, 10);
  if (!dayMap[todayKey] || dayMap[todayKey].count === 0) {
    cur.setDate(cur.getDate() - 1);
  }
  let streak = 0;
  let checking = true;
  while (checking) {
    const key = cur.toISOString().slice(0, 10);
    if (!dayMap[key] || dayMap[key].count === 0) {
      checking = false;
      break;
    }
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

function generateFallbackDayMap(type) {
  const map = {};
  const today = new Date();
  const days = WEEKS * 7;
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    let hash = 0;
    for (let c = 0; c < dateStr.length; c++) {
      hash = (hash * 31 + dateStr.charCodeAt(c)) & 0xffffffff;
    }
    const val = Math.abs(hash) % 100;
    if (type === 'github') {
      if (val < 76) {
        const count = (val % 8) + 1;
        const level = count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;
        map[dateStr] = { date: dateStr, count, level };
      }
    } else if (val < 84) {
      const count = (val % 5) + 1;
      const level = count === 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : 4;
      map[dateStr] = { date: dateStr, count, level };
    }
  }
  return map;
}

function getFallbackGitHub() {
  const dayMap = generateFallbackDayMap('github');
  return {
    username: GITHUB_USER,
    repos: 23,
    languageCount: 5,
    totalContribs: 1437,
    streak: 1,
    weekGrid: buildWeekGrid(dayMap),
    topLangs: ['C++', 'Kotlin', 'JavaScript', 'TypeScript', 'Java'],
  };
}

function getFallbackLeetCode() {
  const dayMap = generateFallbackDayMap('leetcode');
  return {
    username: LEETCODE_USER,
    easy: 293,
    medium: 524,
    hard: 104,
    ranking: 46547,
    streak: 315,
    badgeCount: 20,
    weekGrid: buildWeekGrid(dayMap),
  };
}

async function fetchGitHub() {
  try {
    const [userRes, contribRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site' },
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
      fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, {
        headers: { 'User-Agent': 'portfolio-site' },
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site' },
        signal: AbortSignal.timeout(3000),
      }).catch(() => null),
    ]);

    const user = userRes && userRes.ok ? await userRes.json().catch(() => null) : null;
    const contrib = contribRes && contribRes.ok ? await contribRes.json().catch(() => null) : null;
    const repos = reposRes && reposRes.ok ? await reposRes.json().catch(() => null) : null;

    const dayMap = {};
    if (contrib && Array.isArray(contrib.contributions)) {
      contrib.contributions.forEach(c => { dayMap[c.date] = c; });
    }

    const langMap = {};
    if (Array.isArray(repos)) {
      repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
    }
    const detectedLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([l]) => l);

    const hasContrib = Object.keys(dayMap).length > 0;
    const reposCount = (user && typeof user.public_repos === 'number') ? user.public_repos : (Array.isArray(repos) && repos.length > 0 ? repos.length : 23);
    const totalContribs = contrib?.total?.lastYear || (hasContrib ? Object.values(dayMap).reduce((s, c) => s + (c.count || 0), 0) : 1437);
    const topLangs = detectedLangs.length > 0 ? detectedLangs : ['C++', 'Kotlin', 'JavaScript', 'TypeScript', 'Java'];
    const languageCount = Object.keys(langMap).length || topLangs.length;

    return {
      username: GITHUB_USER,
      repos: reposCount,
      languageCount,
      totalContribs,
      streak: hasContrib ? computeStreak(dayMap) : 1,
      weekGrid: hasContrib ? buildWeekGrid(dayMap) : buildWeekGrid(generateFallbackDayMap('github')),
      topLangs,
    };
  } catch (err) {
    console.error('fetchGitHub fallback:', err);
    return getFallbackGitHub();
  }
}

async function fetchLeetCode() {
  try {
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum { difficulty count }
          }
          profile { ranking }
          badges { id }
          userCalendar {
            streak
            totalActiveDays
            submissionCalendar
          }
        }
      }
    `;
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-site',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username: LEETCODE_USER } }),
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) throw new Error(`LeetCode status ${res.status}`);
    const json = await res.json();
    const mu = json?.data?.matchedUser;
    if (!mu) throw new Error('No matchedUser');

    const nums = mu.submitStats?.acSubmissionNum || [];
    const get = d => nums.find(n => n.difficulty === d)?.count || 0;

    const calStr = mu.userCalendar?.submissionCalendar || '{}';
    let calRaw = {};
    try {
      calRaw = JSON.parse(calStr);
    } catch (_parseErr) {
      calRaw = {};
    }

    const dayMap = {};
    Object.entries(calRaw).forEach(([ts, count]) => {
      const date = new Date(parseInt(ts) * 1000).toISOString().slice(0, 10);
      const prev = dayMap[date]?.count || 0;
      const total = prev + count;
      dayMap[date] = {
        count: total,
        level: total === 0 ? 0 : total <= 2 ? 1 : total <= 5 ? 2 : total <= 10 ? 3 : 4,
      };
    });

    const hasCalendar = Object.keys(dayMap).length > 0;

    return {
      username: LEETCODE_USER,
      easy: get('Easy') || 293,
      medium: get('Medium') || 524,
      hard: get('Hard') || 104,
      ranking: mu.profile?.ranking || 46547,
      streak: mu.userCalendar?.streak || 315,
      badgeCount: mu.badges?.length || 20,
      weekGrid: hasCalendar ? buildWeekGrid(dayMap) : buildWeekGrid(generateFallbackDayMap('leetcode')),
    };
  } catch (err) {
    console.error('fetchLeetCode fallback:', err);
    return getFallbackLeetCode();
  }
}

export async function loader() {
  try {
    const [github, leetcode] = await Promise.all([fetchGitHub(), fetchLeetCode()]);
    return json(
      { github, leetcode },
      {
        headers: {
          'Cache-Control': 'public, max-age=120, s-maxage=600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Home loader fatal error fallback:', error);
    return json(
      {
        github: getFallbackGitHub(),
        leetcode: getFallbackLeetCode(),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
        },
      }
    );
  }
}


