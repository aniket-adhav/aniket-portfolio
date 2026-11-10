import { Divider } from '~/components/divider';
import { Section } from '~/components/section';
import { Transition } from '~/components/transition';
import { useState, useEffect, useRef } from 'react';
import profileEn from './profile-en.svg';
import styles from './profile.module.css';

const TYPING_LINES = [
  'Building Civic Assist v2 ...',
  'Solving DSA problems ...',
  'Open to collaborations ...',
  'Crafting Android apps ...',
  'Contributing to open source ...',
  'Always learning something new ...',
];

function LiveTypingCard({ visible }) {
  const [displayed, setDisplayed] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const target = TYPING_LINES[lineIdx];
    if (typing) {
      if (displayed.length < target.length) {
        timeoutRef.current = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)), 52
        );
      } else {
        timeoutRef.current = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timeoutRef.current = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)), 30
        );
      } else {
        setLineIdx(i => (i + 1) % TYPING_LINES.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timeoutRef.current);
  }, [visible, displayed, typing, lineIdx]);

  return (
    <div className={styles.typingCard} data-visible={visible}>
      <span className={styles.typingPrompt}>~$</span>
      <span className={styles.typingText}>{displayed}</span>
      <span className={styles.typingCursor} aria-hidden="true" />
    </div>
  );
}

const education = [
  {
    degree: 'B.E. Computer Engineering',
    institute: 'Dr. D. Y. Patil Institute of Technology, Pune',
    period: 'Aug 2023 – June 2027',
    score: '9.71 / 10',
    scoreLabel: 'CGPA',
    icon: '🎓',
  },
  {
    degree: 'HSC — Science (Class XII)',
    institute: 'SGJC Korhale, Shirdi',
    period: '2023',
    score: '84.17%',
    scoreLabel: 'Percentage',
    icon: '📘',
  },
  {
    degree: 'SSC (Class X)',
    institute: 'CSV Kolpewadi',
    period: '2021',
    score: '84.20%',
    scoreLabel: 'Percentage',
    icon: '📗',
  },
];

const achievements = [
  { value: '1866', label: 'Max LeetCode Rating', icon: '⚡' },
  { value: '900+',  label: 'DSA Problems',    icon: '🧠' },
  { value: '300+',  label: 'Day Streak',       icon: '🔥' },
  { value: '10/10', label: 'SGPA — Rank 1',    icon: '🏅' },
];

const honours = [
  {
    emoji: '🥉',
    title: '2nd Runner-up',
    desc: 'National 48-Hour Hackathon · Amity University Mumbai',
  },
  {
    emoji: '🥇',
    title: '1st Place',
    desc: 'Civic Assist Platform · 1st among 550+ teams, College Competition',
  },
];

const certificates = [
  {
    title: 'The Complete Android 14 & Kotlin Development Masterclass',
    issuer: 'Udemy',
    date: 'Oct 2025',
    duration: '66.5 hours',
    badge: '📱',
    accentColor: '#a435f0',
    image: '/cert-udemy-android.jpg',
  },
  {
    title: 'DSA with C++',
    issuer: 'Apna College',
    date: 'Dec 2024',
    duration: 'Alpha DSA with C++',
    badge: '🌐',
    accentColor: '#f0a500',
    image: '/cert-apna-college.png',
  },
  {
    title: 'Decode C++ with DSA Course',
    issuer: 'Physics Wallah',
    date: 'Apr 2025',
    duration: "June '24 Program",
    badge: '🧩',
    accentColor: '#ff6b00',
    image: '/cert-pw-dsa.jpg',
  },
];

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible: vis, nodeRef }) => (
          <div className={styles.profileWrapper} ref={nodeRef}>

            {/* ══ BLOCK 1 — Intro 2-col ══ */}
            <div className={styles.introGrid}>
              <div className={styles.introLeft}>
                <div className={styles.tag}>
                  <Divider notchWidth="64px" notchHeight="8px" collapsed={!vis} collapseDelay={1000} />
                  <span className={styles.tagText} data-visible={vis}>About me</span>
                </div>
                <h2 className={styles.title} id={titleId} data-visible={vis}>
                  Full Stack Web &amp; Android Developer.
                </h2>
                <p className={styles.bio} data-visible={vis}>
                  I build fast, scalable web apps and polished Android experiences.
                  I enjoy solving hard problems through competitive programming and turning ideas into real products.
                </p>
                <ul className={styles.summaryList} data-visible={vis}>
                  <li>💡 Technical Head, DIT Sport Club — led development of the Parakram platform</li>
                  <li>🏆 Hackathon winner &amp; LeetCode Knight with <strong>1866 max rating</strong></li>
                </ul>
              </div>

              {/* Right: photo */}
              <div className={styles.introRight}>
                <div className={styles.imageWrap} data-visible={vis}>
                  <span className={styles.glowOrb} aria-hidden="true" />
                  <span className={styles.borderRing} aria-hidden="true" />
                  <span className={styles.p1} aria-hidden="true" />
                  <span className={styles.p2} aria-hidden="true" />
                  <span className={styles.p3} aria-hidden="true" />
                  <span className={styles.p4} aria-hidden="true" />
                  <span className={styles.p5} aria-hidden="true" />
                  <div className={styles.photoClip}>
                    <img
                      src="/profile.jpg"
                      alt="Aniket Adhav — Full Stack Web and Android Developer"
                      className={styles.photo}
                    />
                  </div>
                  <span className={styles.shimmer} aria-hidden="true" />
                  <span className={styles.cornerTL} aria-hidden="true" />
                  <span className={styles.cornerTR} aria-hidden="true" />
                  <span className={styles.cornerBL} aria-hidden="true" />
                  <span className={styles.cornerBR} aria-hidden="true" />
                  <svg className={styles.svg} data-visible={vis} viewBox="0 0 80 760">
                    <use href={`${profileEn}#profile-en`} />
                  </svg>
                </div>

                <div className={styles.badge} data-visible={vis}>
                  <span className={styles.badgeName}>Aniket Adhav</span>
                  <span className={styles.badgeDivider} aria-hidden="true" />
                  <span className={styles.badgeRole}>
                    <span className={styles.badgeDot} />
                    Full Stack Web &amp; Android Dev
                  </span>
                </div>

                <LiveTypingCard visible={vis} />
              </div>
            </div>

            {/* ══ BLOCK 2 — Education ══ */}
            <div className={styles.fullSection} data-visible={vis}>
              <div className={styles.fullSectionHeader}>
                <span className={styles.fullSectionLine} />
                <span className={styles.fullSectionTitle}>🎓 Education</span>
                <span className={styles.fullSectionLine} />
              </div>
              <div className={styles.eduCardsRow}>
                {education.map((e, i) => (
                  <div key={i} className={styles.eduCardFull} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>
                    <div className={styles.eduCardTop}>
                      <span className={styles.eduCardIcon}>{e.icon}</span>
                      <div className={styles.eduScoreBadge}>
                        <span className={styles.eduScoreValFull}>{e.score}</span>
                        <span className={styles.eduScoreLabelFull}>{e.scoreLabel}</span>
                      </div>
                    </div>
                    <div className={styles.eduCardDegree}>{e.degree}</div>
                    <div className={styles.eduCardInstitute}>{e.institute}</div>
                    <div className={styles.eduCardPeriod}>{e.period}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ BLOCK 3 — Achievements ══ */}
            <div className={styles.fullSection} data-visible={vis}>
              <div className={styles.fullSectionHeader}>
                <span className={styles.fullSectionLine} />
                <span className={styles.fullSectionTitle}>🏆 Achievements</span>
                <span className={styles.fullSectionLine} />
              </div>
              <div className={styles.statsRowFull}>
                {achievements.map((a, i) => (
                  <div key={i} className={styles.statCardFull} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                    <span className={styles.statIconFull}>{a.icon}</span>
                    <span className={styles.statValueFull}>{a.value}</span>
                    <span className={styles.statLabelFull}>{a.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.honourCardsRow}>
                {honours.map((h, i) => (
                  <div key={i} className={styles.honourCardFull}>
                    <span className={styles.honourEmoji}>{h.emoji}</span>
                    <div className={styles.honourCardBody}>
                      <p className={styles.honourCardTitle}>{h.title}</p>
                      <p className={styles.honourCardDesc}>{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ BLOCK 4 — Certificates ══ */}
            <div className={styles.fullSection} data-visible={vis}>
              <div className={styles.fullSectionHeader}>
                <span className={styles.fullSectionLine} />
                <span className={styles.fullSectionTitle}>🎖️ Certificates</span>
                <span className={styles.fullSectionLine} />
              </div>
              <div className={styles.certGrid}>
                {certificates.map((c, i) => (
                  <div
                    key={i}
                    className={styles.certCard}
                    style={{ '--cert-accent': c.accentColor, animationDelay: `${0.1 + i * 0.1}s` }}
                  >
                    <div className={styles.certImageWrap}>
                      <img src={c.image} alt={c.title} className={styles.certImage} loading="lazy" />
                    </div>
                    <div className={styles.certBody}>
                      <div className={styles.certMeta}>
                        <span className={styles.certBadge}>{c.badge}</span>
                        <span className={styles.certIssuer}>{c.issuer}</span>
                        <span className={styles.certDate}>{c.date}</span>
                      </div>
                      <p className={styles.certTitle}>{c.title}</p>
                      <p className={styles.certDuration}>{c.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </Transition>
    </Section>
  );
};
