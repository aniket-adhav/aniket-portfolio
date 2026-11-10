import { useState, useEffect, useRef } from 'react';
import styles from './skill-radar.module.css';

const CX = 210;
const CY = 205;
const R = 150;
const LABEL_R = 198;
const NUM = 5;

const CATEGORIES = [
  {
    key: 'frontend',
    label: 'Frontend',
    score: 88,
    color: '#22d3ee',
    icon: '⚛',
    desc: 'React, Remix, Next.js, JavaScript, HTML/CSS, Tailwind',
    skills: [
      { name: 'HTML & CSS', level: 95 },
      { name: 'JavaScript', level: 90 },
      { name: 'React / Remix', level: 92 },
      { name: 'Next.js', level: 85 },
      { name: 'Tailwind / Bootstrap', level: 82 },
    ],
  },
  {
    key: 'android',
    label: 'Android',
    score: 85,
    color: '#4ade80',
    icon: '◉',
    desc: 'Kotlin, Jetpack Compose, Room DB, Retrofit, Hilt',
    skills: [
      { name: 'Kotlin', level: 90 },
      { name: 'Jetpack Compose', level: 85 },
      { name: 'Room DB', level: 82 },
      { name: 'Retrofit / Ktor', level: 80 },
      { name: 'Hilt / Paging 3', level: 78 },
    ],
  },
  {
    key: 'backend',
    label: 'Backend',
    score: 80,
    color: '#f87171',
    icon: '⚙',
    desc: 'Node.js, Spring Boot, FastAPI, REST APIs, JWT',
    skills: [
      { name: 'REST APIs / JWT', level: 88 },
      { name: 'Node.js / Express', level: 84 },
      { name: 'MongoDB / PostgreSQL', level: 82 },
      { name: 'Spring Boot', level: 78 },
      { name: 'FastAPI', level: 75 },
    ],
  },
  {
    key: 'dsa',
    label: 'DSA / CP',
    score: 90,
    color: '#fbbf24',
    icon: '◈',
    desc: 'C++, LeetCode Knight 1866, 900+ problems solved',
    skills: [
      { name: 'C++ (primary)', level: 92 },
      { name: 'Data Structures', level: 90 },
      { name: 'Algorithms', level: 88 },
      { name: 'Problem Solving', level: 90 },
      { name: 'Competitive Programming', level: 86 },
    ],
  },
  {
    key: 'tools',
    label: 'Tools & DB',
    score: 78,
    color: '#a78bfa',
    icon: '◧',
    desc: 'Git, Firebase, MySQL, Postman, Linux, Vercel',
    skills: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Postman / VS Code', level: 85 },
      { name: 'Firebase', level: 82 },
      { name: 'MySQL / SQLite', level: 80 },
      { name: 'Linux / Vercel', level: 75 },
    ],
  },
];

function getAngle(i) {
  return -Math.PI / 2 + (2 * Math.PI * i) / NUM;
}

function getPoint(i, ratio) {
  const a = getAngle(i);
  return { x: CX + ratio * R * Math.cos(a), y: CY + ratio * R * Math.sin(a) };
}

function makePolygon(scores) {
  return scores
    .map((s, i) => {
      const p = getPoint(i, s / 100);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(' ');
}

function getLabelPos(i) {
  const a = getAngle(i);
  const cosA = Math.cos(a);
  const sinA = Math.sin(a);
  return {
    x: CX + LABEL_R * cosA,
    y: CY + LABEL_R * sinA,
    anchor: cosA > 0.25 ? 'start' : cosA < -0.25 ? 'end' : 'middle',
    baseline: sinA > 0.25 ? 'hanging' : sinA < -0.25 ? 'auto' : 'middle',
  };
}

const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];

export function SkillRadar({ id, sectionRef, visible }) {
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!visible || progress >= 1) return;
    const DURATION = 1500;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setProgress(eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const animatedScores = CATEGORIES.map(c => c.score * progress);
  const dataPolygon = makePolygon(animatedScores);
  const activeCategory = active !== null ? CATEGORIES[active] : null;

  return (
    <section className={styles.section} id={id} ref={sectionRef} tabIndex={-1}>
      <div className={styles.content}>
        <div className={styles.heading} data-visible={visible}>
          <p className={styles.label}>Skill Proficiency</p>
          <h2 className={styles.title}>What I bring to the table</h2>
        </div>

        <div className={styles.body} data-visible={visible}>
          <div className={styles.chartWrap}>
            <svg
              className={styles.svg}
              viewBox="0 0 430 420"
              aria-label="Skill radar chart"
              onMouseLeave={() => setActive(null)}
            >
              <defs>
                <filter id="sr-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="sr-glow-strong" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {CATEGORIES.map(cat => (
                  <radialGradient key={cat.key} id={`sr-grad-${cat.key}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={cat.color} stopOpacity="0.38" />
                    <stop offset="100%" stopColor={cat.color} stopOpacity="0.06" />
                  </radialGradient>
                ))}
                <radialGradient id="sr-grad-default" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.03" />
                </radialGradient>
              </defs>

              {/* Grid rings */}
              {GRID_LEVELS.map((lvl, li) => {
                const pts = CATEGORIES.map((_, i) => {
                  const p = getPoint(i, lvl);
                  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
                }).join(' ');
                return (
                  <polygon
                    key={li}
                    points={pts}
                    fill="none"
                    stroke={lvl === 1.0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={lvl === 1.0 ? 1.5 : 1}
                  />
                );
              })}

              {/* % labels on top axis */}
              {[0.5, 1.0].map(lvl => {
                const p = getPoint(0, lvl);
                return (
                  <text key={lvl} x={p.x + 7} y={p.y} fontSize="9" fill="rgba(255,255,255,0.22)" dominantBaseline="middle">
                    {lvl * 100}%
                  </text>
                );
              })}

              {/* Axis lines */}
              {CATEGORIES.map((cat, i) => {
                const outer = getPoint(i, 1);
                const isActive = active === i;
                return (
                  <line
                    key={cat.key}
                    x1={CX} y1={CY}
                    x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
                    stroke={isActive ? cat.color : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                  />
                );
              })}

              {/* Data polygon fill */}
              <polygon
                points={dataPolygon}
                fill={activeCategory ? `url(#sr-grad-${activeCategory.key})` : 'url(#sr-grad-default)'}
                stroke={activeCategory ? activeCategory.color : '#22d3ee'}
                strokeWidth={activeCategory ? 2.5 : 1.8}
                filter={activeCategory ? 'url(#sr-glow)' : undefined}
                strokeLinejoin="round"
                style={{ transition: 'fill 0.4s ease, stroke 0.4s ease, stroke-width 0.3s ease' }}
              />

              {/* Vertex dots */}
              {CATEGORIES.map((cat, i) => {
                const p = getPoint(i, animatedScores[i] / 100);
                const isActive = active === i;
                return (
                  <circle
                    key={cat.key}
                    cx={p.x.toFixed(2)}
                    cy={p.y.toFixed(2)}
                    r={isActive ? 8 : 5}
                    fill={cat.color}
                    filter={isActive ? 'url(#sr-glow-strong)' : 'url(#sr-glow)'}
                    style={{ transition: 'r 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
                  />
                );
              })}

              {/* Axis labels + invisible wide hit areas */}
              {CATEGORIES.map((cat, i) => {
                const lp = getLabelPos(i);
                const outer = getPoint(i, 1);
                const isActive = active === i;
                return (
                  <g
                    key={cat.key}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setActive(i)}
                  >
                    <line
                      x1={CX} y1={CY}
                      x2={lp.x.toFixed(2)} y2={lp.y.toFixed(2)}
                      stroke="transparent"
                      strokeWidth="32"
                    />
                    <text
                      x={lp.x.toFixed(2)}
                      y={lp.y.toFixed(2)}
                      textAnchor={lp.anchor}
                      dominantBaseline={lp.baseline}
                      fontSize="13.5"
                      fontWeight={isActive ? '700' : '500'}
                      letterSpacing="0.3"
                      fill={isActive ? cat.color : 'rgba(255,255,255,0.7)'}
                      filter={isActive ? 'url(#sr-glow)' : undefined}
                      style={{ transition: 'fill 0.3s ease', fontFamily: 'inherit' }}
                    >
                      {cat.label}
                    </text>
                  </g>
                );
              })}

              {/* Center dot */}
              <circle cx={CX} cy={CY} r={3.5} fill="rgba(255,255,255,0.35)" />
            </svg>
          </div>

          {/* Skill breakdown panel */}
          <div className={styles.panel}>
            <div className={styles.panelHint} data-hidden={activeCategory !== null}>
              <p className={styles.hintText}>Hover a category<br />on the chart</p>
              <div className={styles.hintDots}>
                {CATEGORIES.map(cat => (
                  <span key={cat.key} className={styles.hintDot} style={{ background: cat.color }} />
                ))}
              </div>
            </div>

            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.key}
                className={styles.panelCard}
                data-active={active === i}
                style={{ '--cat-color': cat.color }}
              >
                <div className={styles.panelHeader}>
                  <span className={styles.panelIcon}>{cat.icon}</span>
                  <span className={styles.panelName}>{cat.label}</span>
                  <span className={styles.panelScore}>{cat.score}%</span>
                </div>
                <p className={styles.panelDesc}>{cat.desc}</p>
                <div className={styles.barList}>
                  {cat.skills.map((skill, si) => (
                    <div
                      key={skill.name}
                      className={styles.barRow}
                      style={{ transitionDelay: active === i ? `${si * 55}ms` : '0ms' }}
                    >
                      <span className={styles.barName}>{skill.name}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: active === i ? `${skill.level * progress}%` : '0%',
                            background: cat.color,
                          }}
                        />
                      </div>
                      <span className={styles.barVal}>
                        {active === i ? `${Math.round(skill.level * progress)}%` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
