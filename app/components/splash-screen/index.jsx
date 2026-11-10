import { useEffect, useState } from 'react';
import styles from './splash-screen.module.css';

const greetings = [
  { text: 'Hello', lang: 'en' },
  { text: 'नमस्कार', lang: 'mr' },
  { text: 'নমস্কার', lang: 'bn' },
  { text: 'வணக்கம்', lang: 'ta' },
  { text: 'నమస్కారం', lang: 'te' },
  { text: 'ನಮಸ್ಕಾರ', lang: 'kn' },
  { text: 'નમસ્તે', lang: 'gu' },
  { text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', lang: 'pa' },
  { text: 'नमस्ते', lang: 'hi' },
];

const INTERVAL = 280;

export function SplashScreen({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [isExit, setIsExit] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let i = 0;

    const interval = setInterval(() => {
      if (cancelled) return;
      i++;
      if (i >= greetings.length) {
        clearInterval(interval);
        // Hold the final greeting ("नमस्ते") briefly before opening
        setTimeout(() => {
          if (cancelled) return;
          setIsExit(true);
          // Wait for wipeUp & bladeShoot opening animation to complete
          setTimeout(() => {
            if (!cancelled) {
              onComplete?.();
            }
          }, 520);
        }, 360);
      } else {
        setIndex(i);
      }
    }, INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [onComplete]);

  const current = greetings[index];

  return (
    <>
      {/* Progress line lives outside the overlay so clip-path on wipeUp doesn't clip it */}
      <div className={styles.progressLine} data-exit={isExit} />

      <div className={styles.overlay} data-exit={isExit} suppressHydrationWarning>
        {/* Center greeting */}
        <div className={styles.center} data-leaving={isExit}>
          <div className={styles.clip} key={index}>
            <span className={styles.word} lang={current.lang}>
              {current.text}
            </span>
          </div>
        </div>

        {/* Corner labels */}
        <span className={styles.labelBL} data-hide={isExit}>
          portfolio
        </span>
        <span className={styles.labelBR} data-hide={isExit}>
          welcome
        </span>
      </div>
    </>
  );
}
