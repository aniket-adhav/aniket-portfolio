import { useEffect, useRef, useState, useMemo } from 'react';
import styles from './dev-stats.module.css';

const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const start = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    if (!value) return;
    start.current = null;
    const animate = ts => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return display.toLocaleString();
}

function Bar({ label, count, total, color, delay }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPct(total ? Math.round((count / total) * 100) : 0), delay);
    return () => clearTimeout(t);
  }, [count, total, delay]);
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel} style={{ color }}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color, transitionDelay: `${delay}ms` }} />
      </div>
      <span className={styles.barCount}>{count}</span>
    </div>
  );
}

function Heatmap({ weekGrid, accentColor, visible }) {
  const monthLabels = useMemo(() => {
    if (!weekGrid || !weekGrid.length) return [];
    return weekGrid.map(week => {
      const firstReal = week.find(d => d.level !== -1);
      if (!firstReal) return null;
      const d = new Date(firstReal.date);
      if (d.getDate() <= 7) return MONTH_ABBR[d.getMonth()];
      return null;
    });
  }, [weekGrid]);

  if (!weekGrid || weekGrid.length === 0) return null;

  return (
    <div className={styles.heatmapWrap} style={{ '--hcolor': accentColor }}>
      <div className={styles.monthRow}>
        {monthLabels.map((label, wi) => (
          <div key={wi} className={styles.monthCell}>{label || ''}</div>
        ))}
      </div>
      <div className={styles.heatGrid} data-visible={visible}>
        {weekGrid.map((week, wi) => (
          <div key={wi} className={styles.heatWeek} style={{ '--wi': wi }}>
            {week.map((day, di) => (
              <div
                key={di}
                className={styles.heatDay}
                data-level={day.level}
                title={day.level >= 0 && day.count > 0 ? `${day.date}: ${day.count}` : day.level === -1 ? '' : day.date}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DevStats({ id, sectionRef, visible, github, leetcode }) {
  const gh = github || {};
  const lc = leetcode || {};
  const easy   = lc.easy   || 0;
  const medium = lc.medium || 0;
  const hard   = lc.hard   || 0;
  const total  = easy + medium + hard;

  return (
    <section className={styles.section} id={id} ref={sectionRef} tabIndex={-1}>
      <div className={styles.content}>
        <div className={styles.heading} data-visible={visible}>
          <p className={styles.label}>Live Progress</p>
          <h2 className={styles.title}>GitHub &amp; LeetCode</h2>
          <p className={styles.subtitle}>Real-time stats pulled fresh from the APIs</p>
        </div>

        <div className={styles.cards} data-visible={visible}>

          {/* ── GitHub Card ── */}
          <a
            className={styles.card}
            href={`https://github.com/${gh.username || 'aniket-adhav'}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--accent': '#2dba4e' }}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardHeader}>
              <svg className={styles.platformIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className={styles.platformName}>GitHub</span>
              <span className={styles.liveChip}>
                <span className={styles.liveDot} style={{ '--dot': '#2dba4e' }} />
                Live
              </span>
            </div>

            <div className={styles.statGrid2x2}>
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: '#2dba4e' }}>
                  {visible ? <AnimatedNumber value={gh.totalContribs} /> : 0}
                </span>
                <span className={styles.statKey}>Contributions</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: '#2dba4e' }}>
                  {visible ? <AnimatedNumber value={gh.repos} /> : 0}
                </span>
                <span className={styles.statKey}>Repositories</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: '#2dba4e' }}>
                  {visible ? <AnimatedNumber value={gh.languageCount} /> : 0}
                </span>
                <span className={styles.statKey}>Languages used</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: '#2dba4e' }}>
                  {visible ? <AnimatedNumber value={gh.streak} /> : 0}
                </span>
                <span className={styles.statKey}>Day streak 🔥</span>
              </div>
            </div>

            <Heatmap weekGrid={gh.weekGrid} accentColor="#2dba4e" visible={visible} />

            {gh.topLangs && gh.topLangs.length > 0 && (
              <div className={styles.langs}>
                <p className={styles.langsLabel}>Top languages</p>
                <div className={styles.langChips}>
                  {gh.topLangs.map(l => (
                    <span key={l} className={styles.langChip}>{l}</span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.cardFooter}>
              <span>@{gh.username || 'aniket-adhav'}</span>
              <svg className={styles.arrowIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </a>

          {/* ── LeetCode Card ── */}
          <a
            className={styles.card}
            href={`https://leetcode.com/u/${lc.username || 'aniket_adhav'}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--accent': '#FFA116' }}
          >
            <div className={styles.cardGlow} />

            <div className={styles.cardHeader}>
              <img
                src="https://cdn.simpleicons.org/leetcode/FFA116"
                alt="LeetCode"
                className={styles.platformIcon}
                loading="lazy"
              />
              <span className={styles.platformName}>LeetCode</span>
              <span className={styles.liveChip}>
                <span className={styles.liveDot} style={{ '--dot': '#FFA116' }} />
                Live
              </span>
            </div>

            <div className={styles.lcTop}>
              <div className={styles.solvedRing}>
                <svg viewBox="0 0 100 100" className={styles.ringsvg}>
                  <circle cx="50" cy="50" r="40" fill="none" className={styles.ringTrack} strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none" stroke="#FFA116" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={visible ? `${2 * Math.PI * 40 * (1 - Math.min(total / 3000, 1))}` : `${2 * Math.PI * 40}`}
                    className={styles.ringProgress}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className={styles.ringInner}>
                  <span className={styles.ringValue} style={{ color: '#FFA116' }}>
                    {visible ? <AnimatedNumber value={total} /> : 0}
                  </span>
                  <span className={styles.ringKey}>Solved</span>
                </div>
              </div>

              <div className={styles.lcSide}>
                <div className={styles.bars}>
                  {visible && (
                    <>
                      <Bar label="Easy"   count={easy}   total={total} color="#00b8a3" delay={200} />
                      <Bar label="Medium" count={medium} total={total} color="#FFA116" delay={350} />
                      <Bar label="Hard"   count={hard}   total={total} color="#ef4743" delay={500} />
                    </>
                  )}
                </div>
                <div className={styles.statRow}>
                  <div className={styles.stat}>
                    <span className={styles.statValue} style={{ color: '#FFA116' }}>
                      {visible ? <AnimatedNumber value={lc.streak} /> : 0}
                    </span>
                    <span className={styles.statKey}>Day streak 🔥</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue} style={{ color: '#FFA116' }}>
                      {visible ? <AnimatedNumber value={lc.badgeCount} /> : 0}
                    </span>
                    <span className={styles.statKey}>Badges 🏅</span>
                  </div>
                </div>
              </div>
            </div>

            <Heatmap weekGrid={lc.weekGrid} accentColor="#FFA116" visible={visible} />

            {lc.ranking && (
              <div className={styles.ranking}>
                <span className={styles.rankingLabel}>Global ranking</span>
                <span className={styles.rankingValue} style={{ color: '#FFA116' }}>
                  #{visible ? <AnimatedNumber value={lc.ranking} duration={1800} /> : 0}
                </span>
              </div>
            )}

            <div className={styles.cardFooter}>
              <span>@{lc.username || 'aniket_adhav'}</span>
              <svg className={styles.arrowIcon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
