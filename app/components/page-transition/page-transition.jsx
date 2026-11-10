import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import styles from './page-transition.module.css';

const DURATION = 0.55;
const DURATION_MS = DURATION * 1000;
const MIN_VISIBLE_MS = DURATION_MS * 2;
const EASE = [0.76, 0, 0.24, 1];

export function PageTransition() {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const prevPathname = useRef(null);
  const showTimeRef = useRef(null);
  const hideTimer = useRef(null);
  const navTimer = useRef(null);

  function showCurtain() {
    clearTimeout(hideTimer.current);
    showTimeRef.current = Date.now();
    flushSync(() => setShow(true));
  }

  function scheduleCurtainHide() {
    const elapsed = Date.now() - (showTimeRef.current ?? 0);
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShow(false), wait);
  }

  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      const isExternal =
        href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto');
      if (isExternal) return;

      const currentPath = window.location.pathname;
      const isEnteringProject = href.startsWith('/projects/');
      const isLeavingProject =
        currentPath.startsWith('/projects/') && !href.startsWith('/projects/');

      if (!isEnteringProject && !isLeavingProject) return;

      e.preventDefault();
      e.stopPropagation();

      showCurtain();

      clearTimeout(navTimer.current);
      navTimer.current = setTimeout(() => navigate(href), DURATION_MS);
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [navigate]);

  useEffect(() => {
    if (prevPathname.current === null) {
      prevPathname.current = location.pathname;
      return;
    }
    if (prevPathname.current === location.pathname) return;

    prevPathname.current = location.pathname;

    scheduleCurtainHide();
  }, [location.pathname]);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(navTimer.current);
    },
    []
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.curtain}
          initial={{ y: '100%' }}
          animate={{
            y: '0%',
            transition: { duration: DURATION, ease: EASE },
          }}
          exit={{ y: '-100%', transition: { duration: DURATION, ease: EASE } }}
          aria-hidden="true"
        >
          <motion.div
            className={styles.stripe}
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: 1,
              transition: { duration: DURATION * 0.6, ease: EASE, delay: DURATION * 0.2 },
            }}
            exit={{ scaleX: 0, transition: { duration: DURATION * 0.35, ease: EASE } }}
          />
          <motion.div
            className={styles.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: DURATION * 0.5, ease: 'easeOut', delay: DURATION * 0.4 },
            }}
            exit={{ opacity: 0, y: -10, transition: { duration: DURATION * 0.3, ease: 'easeIn' } }}
          >
            <span className={styles.dot} />
            <span className={styles.labelText}>Loading</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
