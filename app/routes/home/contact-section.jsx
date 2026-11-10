import { Section } from '~/components/section';
import { Transition } from '~/components/transition';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import { useState } from 'react';
import styles from './contact-section.module.css';

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconLeetCode() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: 'GitHub',    handle: '@aniket-adhav',      href: 'https://github.com/aniket-adhav',                       color: '#6e40c9', Icon: IconGitHub    },
  { label: 'LinkedIn',  handle: 'Aniket Adhav',        href: 'https://www.linkedin.com/in/aniket-adhav-a70182312/',  color: '#0a66c2', Icon: IconLinkedIn  },
  { label: 'LeetCode',  handle: '@aniket_adhav',       href: 'https://leetcode.com/u/aniket_adhav/',                 color: '#ffa116', Icon: IconLeetCode  },
  { label: 'Instagram', handle: '@aniket_adhav_07',    href: 'https://www.instagram.com/aniket_adhav_07',            color: '#e1306c', Icon: IconInstagram },
];

const DIRECT_CONTACTS = [
  { label: 'Email', value: 'aniketadhav2006@gmail.com', href: 'mailto:aniketadhav2006@gmail.com', color: '#ea4335', Icon: IconEmail },
];

export const ContactSection = ({ id, visible, sectionRef }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [focused, setFocused]     = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <Section
      className={styles.contactSection}
      id={id}
      ref={sectionRef}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible: vis, nodeRef }) => (
          <div className={styles.wrapper} ref={nodeRef}>

            <div className={styles.leftCol}>

              <div className={styles.header} data-visible={vis}>
                <div className={styles.tag} aria-hidden>
                  <Divider notchWidth="64px" notchHeight="8px" collapsed={!vis} collapseDelay={1000} />
                  <span className={styles.tagText} data-visible={vis}>Contact</span>
                </div>
                <h2 className={styles.heading}>
                  <DecoderText text="Let's Connect" start={vis} delay={400} />
                </h2>
                <p className={styles.subText} data-visible={vis}>
                  Whether you want to collaborate, have a question, or just want to say hi —
                  I&apos;m always happy to hear from you.
                </p>
              </div>

              <div className={styles.directGroup} data-visible={vis}>
                {DIRECT_CONTACTS.map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    className={styles.directCard}
                    style={{ '--cc': c.color }}
                  >
                    <span className={styles.directIcon}><c.Icon /></span>
                    <div className={styles.directBody}>
                      <span className={styles.directLabel}>{c.label}</span>
                      <span className={styles.directValue}>{c.value}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={e => { e.preventDefault(); handleCopy(c.value, i); }}
                      aria-label={`Copy ${c.label}`}
                    >
                      {copiedIdx === i ? <IconCheck /> : <IconCopy />}
                    </button>
                  </a>
                ))}
              </div>

              <div className={styles.socialDivider} data-visible={vis}>
                <span className={styles.socialDividerLine} />
                <span className={styles.socialDividerText}>Find me on</span>
                <span className={styles.socialDividerLine} />
              </div>

              <div className={styles.socialGrid} data-visible={vis}>
                {SOCIAL_LINKS.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialCard}
                    style={{ '--cc': s.color }}
                  >
                    <span className={styles.socialGlow} />
                    <span className={styles.socialIcon}><s.Icon /></span>
                    <div className={styles.socialBody}>
                      <span className={styles.socialLabel}>{s.label}</span>
                      <span className={styles.socialHandle}>{s.handle}</span>
                    </div>
                    <span className={styles.socialArrow}><IconArrow /></span>
                  </a>
                ))}
              </div>

              <div className={styles.resumeRow} data-visible={vis}>
                <Button
                  onClick={() => setResumeOpen(true)}
                  icon="resume"
                  iconEnd="arrow-right"
                >
                  View Resume
                </Button>
              </div>

              {resumeOpen && (
                <div
                  role="presentation"
                  className={styles.resumeOverlay}
                  onClick={e => {
                    if (e.target === e.currentTarget) setResumeOpen(false);
                  }}
                  onKeyDown={e => e.key === 'Escape' && setResumeOpen(false)}
                >
                  <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Aniket Adhav Resume"
                    className={styles.resumeModal}
                  >
                    <div className={styles.resumeModalHeader}>
                      <span className={styles.resumeModalTitle}>Aniket Adhav — Resume</span>
                      <div className={styles.resumeModalActions}>
                        <a
                          href="https://drive.google.com/uc?export=download&id=11xSwPbfG32edBOkfDIa79jsvLGcOFO3Q"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.resumeDownloadBtn}
                          aria-label="Download Resume"
                        >
                          <Icon icon="download" size={18} />
                          <span>Download</span>
                        </a>
                        <button
                          className={styles.resumeCloseBtn}
                          onClick={() => setResumeOpen(false)}
                          aria-label="Close"
                        >
                          <Icon icon="close" size={20} />
                        </button>
                      </div>
                    </div>
                    <iframe
                      src="https://drive.google.com/file/d/11xSwPbfG32edBOkfDIa79jsvLGcOFO3Q/preview"
                      className={styles.resumeFrame}
                      title="Aniket Adhav Resume"
                    />
                  </div>
                </div>
              )}

            </div>

          </div>
        )}
      </Transition>
    </Section>
  );
};
