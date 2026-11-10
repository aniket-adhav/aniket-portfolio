import { useEffect, useRef } from 'react';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './cursor.module.css';

export function CustomCursor() {
  const isHydrated = useHydrated();
  const dotRef = useRef(null);
  const ringPosRef = useRef(null);
  const ringVisRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ringPos = ringPosRef.current;
    const ringVis = ringVisRef.current;
    if (!dot || !ringPos || !ringVis) return;

    let mouseX = -200;
    let mouseY = -200;
    let ringX = -200;
    let ringY = -200;
    let rafId;
    let hoveredEl = null;
    let isVisible = false;

    document.documentElement.classList.add('custom-cursor-active');

    const lerp = (a, b, t) => a + (b - a) * t;

    const onMouseMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        dot.setAttribute('data-visible', 'true');
        ringVis.setAttribute('data-visible', 'true');
      }

      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = () => {
      let targetX = mouseX;
      let targetY = mouseY;

      if (hoveredEl) {
        const rect = hoveredEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        targetX = mouseX + (cx - mouseX) * 0.28;
        targetY = mouseY + (cy - mouseY) * 0.28;
      }

      ringX = lerp(ringX, targetX, 0.1);
      ringY = lerp(ringY, targetY, 0.1);

      ringPos.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const onEnter = e => {
      hoveredEl = e.currentTarget;
      ringVis.setAttribute('data-hover', 'true');
      dot.setAttribute('data-hover', 'true');
    };

    const onLeave = () => {
      hoveredEl = null;
      ringVis.removeAttribute('data-hover');
      dot.removeAttribute('data-hover');
    };

    const onMouseDown = () => {
      ringVis.setAttribute('data-press', 'true');
      dot.setAttribute('data-press', 'true');
    };

    const onMouseUp = () => {
      ringVis.removeAttribute('data-press');
      dot.removeAttribute('data-press');
    };

    const onMouseLeaveDoc = () => {
      dot.removeAttribute('data-visible');
      ringVis.removeAttribute('data-visible');
      isVisible = false;
    };

    const onMouseEnterDoc = () => {
      dot.setAttribute('data-visible', 'true');
      ringVis.setAttribute('data-visible', 'true');
      isVisible = true;
    };

    const attachMagnetic = () => {
      const els = document.querySelectorAll('a, button');
      els.forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
      return els;
    };

    let attached = attachMagnetic();

    const observer = new MutationObserver(() => {
      attached.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      attached = attachMagnetic();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeaveDoc);
    document.documentElement.addEventListener('mouseenter', onMouseEnterDoc);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeaveDoc);
      document.documentElement.removeEventListener('mouseenter', onMouseEnterDoc);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      attached.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  if (!isHydrated) return null;

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringPosRef} className={styles.ringPos} aria-hidden="true">
        <div ref={ringVisRef} className={styles.ring} />
      </div>
    </>
  );
}
