import civicAssistTextureLarge from '~/assets/civic-assist-screenshot-large.png';
import civicAssistTexturePlaceholder from '~/assets/civic-assist-screenshot-placeholder.png';
import civicAssistTexture from '~/assets/civic-assist-screenshot.png';
import parakramTextureLarge from '~/assets/parakram-screenshot-large.png';
import parakramTexturePlaceholder from '~/assets/parakram-screenshot-placeholder.png';
import parakramTexture from '~/assets/parakram-screenshot.png';
import moviesHouseTexture2Large from '~/assets/movieshouse-screenshot2-large.png';
import moviesHouseTexture2Placeholder from '~/assets/movieshouse-screenshot2-placeholder.jpg';
import moviesHouseTexture2 from '~/assets/movieshouse-screenshot2.png';
import moviesHouseTextureLarge from '~/assets/movieshouse-screenshot-large.png';
import moviesHouseTexturePlaceholder from '~/assets/movieshouse-screenshot-placeholder.jpg';
import moviesHouseTexture from '~/assets/movieshouse-screenshot.png';
import macbookProModel from '~/assets/macbook-pro.glb';
import iphoneModel from '~/assets/iphone-11.glb';
import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { TechStack } from './tech-stack';
import { DevStats } from './dev-stats';
import { ContactSection } from './contact-section';
import { useEffect, useRef, useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import config from '~/config.json';
import styles from './home.module.css';

export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: macbookProModel,
      as: 'fetch',
      type: 'model/gltf-binary',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: iphoneModel,
      as: 'fetch',
      type: 'model/gltf-binary',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Full Stack Developer',
    description: `Portfolio of ${config.name} — a full stack web and Android developer building modern web apps and mobile experiences with React, Node.js, and more.`,
  });
};

export const Home = () => {
  const { github, leetcode } = useLoaderData();
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const devStats = useRef();
  const skills = useRef();
  const details = useRef();
  const contact = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, devStats, skills, details, contact];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Civic Issue Reporting Platform"
        description="A full-stack platform for citizens to report local civic issues with geolocation, image uploads, and community upvoting — built with React, Node.js, and MongoDB."
        buttonText="View project"
        buttonLink="/projects/civic-assist"
        model={{
          type: 'laptop',
          alt: 'Civic Assist platform community feed',
          svgText: ['CIVIC ASSIST'],
          textures: [
            {
              srcSet: `${civicAssistTexture} 1280w, ${civicAssistTextureLarge} 2560w`,
              placeholder: civicAssistTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="Movies House — Android App"
        description="A movie discovery Android app built with Jetpack Compose and MVVM, integrating the TMDB API with Retrofit & Paging 3 and offline-first caching using Room DB."
        buttonText="View project"
        buttonLink="/projects/movies-house"
        model={{
          type: 'phone',
          alt: 'Movies House app home screen',
          svgText: ['MOVIES HOUSE'],
          textures: [
            {
              srcSet: `${moviesHouseTexture} 375w, ${moviesHouseTextureLarge} 750w`,
              placeholder: moviesHouseTexturePlaceholder,
            },
            {
              srcSet: `${moviesHouseTexture2} 375w, ${moviesHouseTexture2Large} 750w`,
              placeholder: moviesHouseTexture2Placeholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Parakram — Sports Event Platform"
        description="A full-stack sports event management platform serving 1500+ users with Google OAuth, QR-based payments, jersey validation, and real-time admin workflows."
        buttonText="View project"
        buttonLink="/projects/parakram"
        model={{
          type: 'laptop',
          alt: 'Parakram sports event platform homepage',
          svgText: ['PARAKRAM'],
          textures: [
            {
              srcSet: `${parakramTexture} 1280w, ${parakramTextureLarge} 2560w`,
              placeholder: parakramTexturePlaceholder,
            },
          ],
        }}
      />
      <div className={styles.githubRow}>
        <Button
          href="https://github.com/aniket-adhav"
          target="_blank"
          rel="noopener noreferrer"
          iconEnd="arrow-right"
          secondary
        >
          <span className={styles.githubBtnFull}>See all projects on GitHub</span>
          <span className={styles.githubBtnShort}>GitHub Projects</span>
        </Button>
      </div>
      <DevStats
        id="dev-stats"
        sectionRef={devStats}
        visible={visibleSections.includes(devStats.current)}
        github={github}
        leetcode={leetcode}
      />
      <TechStack
        id="skills"
        sectionRef={skills}
        visible={visibleSections.includes(skills.current)}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <ContactSection
        id="contact"
        sectionRef={contact}
        visible={visibleSections.includes(contact.current)}
      />
      <Footer />

    </div>
  );
};
