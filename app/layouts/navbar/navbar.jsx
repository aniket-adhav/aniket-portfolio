import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import { Monogram } from '~/components/monogram';
import { useTheme } from '~/components/theme-provider';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useScrollToHash, useWindowSize } from '~/hooks';
import { Link as RouterLink, useLocation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { cssProps, media, msToNum, numToMs } from '~/utils/style';
import { NavToggle } from './nav-toggle';
import { ThemeToggle } from './theme-toggle';
import { navLinks, socialLinks } from './nav-data';
import config from '~/config.json';
import styles from './navbar.module.css';

const NAV_SECTION_IDS = ['project-1', 'dev-stats', 'skills', 'details', 'contact'];

export const Navbar = () => {
  const [current, setCurrent] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [target, setTarget] = useState();
  const [resumeOpen, setResumeOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  const windowSize = useWindowSize();
  const headerRef = useRef();
  const isMobile = windowSize.width <= media.mobile || windowSize.height <= 696;
  const scrollToHash = useScrollToHash();

  useEffect(() => {
    if (location.pathname !== '/') {
      setCurrent(`${location.pathname}${location.hash}`);
    }
  }, [location]);

  useEffect(() => {
    if (!target || location.pathname !== '/') return;
    setCurrent(`${location.pathname}${target}`);
    scrollToHash(target, () => setTarget(null));
  }, [location.pathname, scrollToHash, target]);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const trigger = window.scrollY + window.innerHeight * 0.35;

      let active = null;
      for (const id of NAV_SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= trigger) {
          active = `/#${id}`;
        }
      }
      setCurrent(active ?? undefined);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    const navItems = document.querySelectorAll('[data-navbar-item]');
    const inverseTheme = theme === 'dark' ? 'light' : 'dark';
    const { innerHeight } = window;

    let inverseMeasurements = [];
    let navItemMeasurements = [];

    const isOverlap = (rect1, rect2, scrollY) => {
      return !(rect1.bottom - scrollY < rect2.top || rect1.top - scrollY > rect2.bottom);
    };

    const resetNavTheme = () => {
      for (const measurement of navItemMeasurements) {
        measurement.element.dataset.theme = '';
      }
    };

    const handleInversion = () => {
      const invertedElements = document.querySelectorAll(
        `[data-theme='${inverseTheme}'][data-invert]`
      );

      if (!invertedElements) return;

      inverseMeasurements = Array.from(invertedElements).map(item => ({
        element: item,
        top: item.offsetTop,
        bottom: item.offsetTop + item.offsetHeight,
      }));

      const { scrollY } = window;

      resetNavTheme();

      for (const inverseMeasurement of inverseMeasurements) {
        if (
          inverseMeasurement.top - scrollY > innerHeight ||
          inverseMeasurement.bottom - scrollY < 0
        ) {
          continue;
        }

        for (const measurement of navItemMeasurements) {
          if (isOverlap(inverseMeasurement, measurement, scrollY)) {
            measurement.element.dataset.theme = inverseTheme;
          } else {
            measurement.element.dataset.theme = '';
          }
        }
      }
    };

    if (theme === 'light') {
      navItemMeasurements = Array.from(navItems).map(item => {
        const rect = item.getBoundingClientRect();
        return {
          element: item,
          top: rect.top,
          bottom: rect.bottom,
        };
      });

      document.addEventListener('scroll', handleInversion);
      handleInversion();
    }

    return () => {
      document.removeEventListener('scroll', handleInversion);
      resetNavTheme();
    };
  }, [theme, windowSize, location.key]);

  const getCurrent = (url = '') => {
    const nonTrailing = current?.endsWith('/') ? current?.slice(0, -1) : current;
    if (url === nonTrailing) return 'page';
    return '';
  };

  const handleNavItemClick = event => {
    const hash = event.currentTarget.href.split('#')[1];
    setTarget(null);
    if (hash && location.pathname === '/') {
      setTarget(`#${hash}`);
      event.preventDefault();
    }
  };

  const handleMobileNavClick = event => {
    handleNavItemClick(event);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <>
      <header className={styles.navbar} ref={headerRef}>
        <RouterLink
          unstable_viewTransition
          prefetch="intent"
          to={location.pathname === '/' ? '/#intro' : '/'}
          data-navbar-item
          className={styles.logo}
          aria-label={`${config.name}, ${config.role}`}
          onClick={handleMobileNavClick}
        >
          <Monogram highlight />
        </RouterLink>
        <NavToggle onClick={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
        <nav className={styles.nav}>
          <div className={styles.navList}>
            {navLinks.map(({ label, pathname }) => (
              <RouterLink
                unstable_viewTransition
                prefetch="intent"
                to={pathname}
                key={label}
                data-navbar-item
                className={styles.navLink}
                aria-current={getCurrent(pathname)}
                onClick={handleNavItemClick}
              >
                {label}
              </RouterLink>
            ))}
          </div>
          <NavbarIcons desktop />
        </nav>
        <Transition unmount in={menuOpen} timeout={msToNum(tokens.base.durationL)}>
          {({ visible, nodeRef }) => (
            <nav className={styles.mobileNav} data-visible={visible} ref={nodeRef}>
              {navLinks.map(({ label, pathname }, index) => (
                <RouterLink
                  unstable_viewTransition
                  prefetch="intent"
                  to={pathname}
                  key={label}
                  className={styles.mobileNavLink}
                  data-visible={visible}
                  aria-current={getCurrent(pathname)}
                  onClick={handleMobileNavClick}
                  style={cssProps({
                    transitionDelay: numToMs(
                      Number(msToNum(tokens.base.durationS)) + index * 50
                    ),
                  })}
                >
                  {label}
                </RouterLink>
              ))}
              <NavbarIcons />
              <ThemeToggle isMobile />
            </nav>
          )}
        </Transition>
        {!isMobile && <ThemeToggle data-navbar-item />}
      </header>

      {!menuOpen && (
        <Button
          className={styles.resumeButton}
          onClick={() => setResumeOpen(true)}
          icon="resume"
          secondary
        >
          Resume
        </Button>
      )}

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
    </>
  );
};

const NavbarIcons = ({ desktop }) => (
  <div className={styles.navIcons}>
    {socialLinks.map(({ label, url, icon }) => (
      <a
        key={label}
        data-navbar-item={desktop || undefined}
        className={styles.navIconLink}
        aria-label={label}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon className={styles.navIcon} icon={icon} />
      </a>
    ))}
  </div>
);
