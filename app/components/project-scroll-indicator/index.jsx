import { useEffect, useState } from 'react';
import styles from './project-scroll-indicator.module.css';

export function ProjectScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setHidden(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.wrapper} data-hidden={hidden}>
      <a
        href="#content"
        className={styles.indicator}
        aria-hidden="true"
        tabIndex={-1}
      >
        <svg aria-hidden stroke="currentColor" width="36" height="12" viewBox="0 0 43 15">
          <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
        </svg>
      </a>
    </div>
  );
}
