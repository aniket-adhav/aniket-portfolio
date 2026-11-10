export { Home as default, meta, links } from './home';

const GITHUB_USER = 'aniket-adhav';
const LEETCODE_USER = 'aniket_adhav';
const WEEKS = 26;

function buildWeekGrid(dayMap) {
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
      const entry = !isFuture ? (dayMap[dateStr] || { count: 0, level: 0 }) : { count: 0, level: -1 };
      week.push({ date: dateStr, count: entry.count, level: entry.level });
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

async function fetchGitHub() {
  try {
    const [userRes, contribRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site' },
      }),
      fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, {
        headers: { 'User-Agent': 'portfolio-site' },
      }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
        headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-site' },
      }),
    ]);

    const user = await userRes.json();
    const contrib = contribRes.ok ? await contribRes.json() : { total: {}, contributions: [] };
    const repos = reposRes.ok ? await reposRes.json() : [];

    const dayMap = {};
    (contrib.contributions || []).forEach(c => { dayMap[c.date] = c; });

    const langMap = {};
    if (Array.isArray(repos)) {
      repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
    }
    const topLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([l]) => l);
    const languageCount = Object.keys(langMap).length;

    return {
      username: GITHUB_USER,
      repos: user.public_repos || 0,
      languageCount,
      totalContribs: contrib.total?.lastYear || 0,
      streak: computeStreak(dayMap),
      weekGrid: buildWeekGrid(dayMap),
      topLangs,
    };
  } catch {
    return { username: GITHUB_USER, repos: 0, stars: 0, totalContribs: 0, streak: 0, weekGrid: [], topLangs: [] };
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
    });
    const json = await res.json();
    const mu = json?.data?.matchedUser;
    if (!mu) throw new Error('No LeetCode data');

    const nums = mu.submitStats?.acSubmissionNum || [];
    const get = d => nums.find(n => n.difficulty === d)?.count || 0;

    const calStr = mu.userCalendar?.submissionCalendar || '{}';
    const calRaw = JSON.parse(calStr);

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

    return {
      username: LEETCODE_USER,
      easy: get('Easy'),
      medium: get('Medium'),
      hard: get('Hard'),
      ranking: mu.profile?.ranking || null,
      streak: mu.userCalendar?.streak || 0,
      badgeCount: mu.badges?.length || 0,
      weekGrid: buildWeekGrid(dayMap),
    };
  } catch {
    return { username: LEETCODE_USER, easy: 0, medium: 0, hard: 0, ranking: null, streak: 0, badgeCount: 0, weekGrid: [] };
  }
}

export async function loader() {
  const [github, leetcode] = await Promise.all([fetchGitHub(), fetchLeetCode()]);
  return Response.json({ github, leetcode });
}
