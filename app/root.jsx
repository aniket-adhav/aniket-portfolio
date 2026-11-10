import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { createCookieSessionStorage, json } from '@remix-run/node';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import GothamBook from '~/assets/fonts/gotham-book.woff2';
import GothamMedium from '~/assets/fonts/gotham-medium.woff2';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Error } from '~/layouts/error';
import { SplashScreen } from '~/components/splash-screen';
import { SplashContext } from '~/components/splash-screen/context';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import { PageTransition } from '~/components/page-transition/page-transition';
import config from '~/config.json';
import styles from './root.module.css';
import './reset.module.css';
import './global.module.css';

export const links = () => [
  {
    rel: 'preload',
    href: GothamMedium,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: GothamBook,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Six+Caps&display=block',
  },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'shortcut_icon', href: '/shortcut.png', type: 'image/png', sizes: '64x64' },
  { rel: 'apple-touch-icon', href: '/icon-256.png', sizes: '256x256' },
  { rel: 'author', href: '/humans.txt', type: 'text/plain' },
];

export const loader = async ({ request, context }) => {
  const { url } = request;
  const { pathname } = new URL(url);
  const pathnameSliced = pathname.endsWith('/') ? pathname.slice(0, -1) : url;
  const canonicalUrl = `${config.url}${pathnameSliced}`;

  const { getSession, commitSession } = createCookieSessionStorage({
    cookie: {
      name: '__session',
      httpOnly: true,
      maxAge: 604_800,
      path: '/',
      sameSite: 'lax',
      secrets: [process.env.SESSION_SECRET || ' '],
      secure: true,
    },
  });

  const session = await getSession(request.headers.get('Cookie'));
  const theme = session.get('theme') || 'dark';

  return json(
    { canonicalUrl, theme },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export default function App() {
  let { canonicalUrl, theme } = useLoaderData();
  const fetcher = useFetcher();
  const { state } = useNavigation();

  // SSR-safe initial state — both false so server HTML matches client hydration
  const [showSplash, setShowSplash] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  // Track whether we actually showed the splash this session (for fade-in)
  const splashWasShown = useRef(false);

  if (fetcher.formData?.has('theme')) {
    theme = fetcher.formData.get('theme');
  }

  function toggleTheme(newTheme) {
    fetcher.submit(
      { theme: newTheme ? newTheme : theme === 'dark' ? 'light' : 'dark' },
      { action: '/api/set-theme', method: 'post' }
    );
  }

  useEffect(() => {
    console.info(
      `${config.ascii}\n`,
      `Taking a peek huh? Check out the source code: ${config.repo}\n\n`
    );
    const navType = performance.getEntriesByType?.('navigation')[0]?.type;
    const isReload = navType === 'reload';
    if (isReload) {
      try {
        sessionStorage.removeItem('splashSeen');
      } catch {
        // ignore
      }
    }
    const seen = !isReload && sessionStorage.getItem('splashSeen');
    if (!seen) {
      splashWasShown.current = true;
      setShowSplash(true);
      // data-splash-pending is removed by the effect below, which only fires
      // after showSplash=true has been committed to the DOM — no flash possible.
    } else {
      document.documentElement.removeAttribute('data-splash-pending');
      setSplashDone(true);
    }
  }, []);

  // Remove the pre-hydration CSS lock only after the splash is actually
  // painted in the DOM. Using a separate effect keyed on showSplash guarantees
  // React has already committed the splash component before we lift the lock.
  useEffect(() => {
    if (showSplash) {
      document.documentElement.removeAttribute('data-splash-pending');
    }
  }, [showSplash]);

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('splashSeen', '1');
    setShowSplash(false);
    setSplashDone(true);
  }, []);

  // Three states:
  //  "hidden"   — splash active, main content invisible
  //  "entering" — splash just finished, fade main content in
  //  "visible"  — return visit, no splash, show immediately
  let appState = 'visible';
  if (showSplash) appState = 'hidden';
  else if (splashDone && splashWasShown.current) appState = 'entering';

  return (
    <html lang="en" suppressHydrationWarning data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={theme === 'dark' ? '#111' : '#F2F2F2'} />
        <meta
          name="color-scheme"
          content={theme === 'dark' ? 'dark light' : 'light dark'}
        />
        {/* Prevent flash before CSS loads — matches active theme background */}
        <style
          dangerouslySetInnerHTML={{
            __html: `html{background:${theme === 'dark' ? 'oklch(17.76% 0 0)' : 'oklch(96.12% 0 0)'}}`,
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        {/* Hide app content immediately on first visit — prevents flash before splash */}
        <style dangerouslySetInnerHTML={{
          __html: `html[data-splash-pending] #app-root-content{visibility:hidden!important;pointer-events:none!important}`
        }} />
        <script dangerouslySetInnerHTML={{
          __html: `try{const isReload=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0]?.type==='reload';if(isReload||!sessionStorage.getItem('splashSeen')){document.documentElement.setAttribute('data-splash-pending','')}}catch(e){}`
        }} />
        <Meta />
        <Links />
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body data-theme={theme}>
        <SplashContext.Provider value={splashDone}>
          <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
            {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
            <div id="app-root-content" className={styles.appContent} data-app-state={appState}>
              <PageTransition />
              <Progress />
              <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
                Skip to main content
              </VisuallyHidden>
              <Navbar />
              <main
                id="main-content"
                className={styles.container}
                tabIndex={-1}
                data-loading={state === 'loading'}
              >
                <Outlet />
              </main>
            </div>
          </ThemeProvider>
        </SplashContext.Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111" />
        <meta name="color-scheme" content="dark light" />
        <style dangerouslySetInnerHTML={{ __html: `html{background:oklch(17.76% 0 0)}` }} />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
      </head>
      <body data-theme="dark">
        <Error error={error} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
