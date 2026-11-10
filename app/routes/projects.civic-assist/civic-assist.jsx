import civicCommunityFeed from '~/assets/civic-community-feed.png';
import civicAdminDashboard from '~/assets/civic-admin-dashboard.png';
import civicAdminLogin from '~/assets/civic-admin-login.png';
import civicLeaderboard from '~/assets/civic-leaderboard.png';
import { Footer } from '~/components/footer';
import { Button } from '~/components/button';
import { Image } from '~/components/image';
import { ProjectScrollIndicator } from '~/components/project-scroll-indicator';
import {
  ProjectContainer,
  ProjectSection,
  ProjectSectionColumns,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
  ProjectTextRow,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import { Fragment } from 'react';
import { Link } from '@remix-run/react';
import styles from './civic-assist.module.css';

const title = 'Civic Assist Platform';
const description =
  'A full-stack civic issue reporting platform that empowers citizens to report local problems with image upload, geolocation tagging, and community-driven prioritization through upvotes.';

export const meta = () => {
  return baseMeta({ title, description, prefix: 'Project' });
};

export function CivicAssist() {
  return (
    <Fragment>
      <ProjectScrollIndicator />
      <ProjectContainer className={styles.civicAssist}>

        <div className={styles.backRow}>
          <Link to="/#project-1" className={styles.backLink}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to projects
          </Link>
        </div>

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.tag}>Full Stack · Web App</div>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.description}>{description}</p>
              <div className={styles.headerButtons}>
                <Button
                  iconHoverShift
                  iconEnd="arrow-right"
                  href="https://civicassist-beta.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </Button>
                <Button
                  iconHoverShift
                  iconEnd="arrow-right"
                  href="https://github.com/aniket-adhav/Civic_Assist_Platform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repo
                </Button>
              </div>
            </div>
            <ul className={styles.techList}>
              <li className={styles.techLabel}>Tech Stack</li>
              {[
                'React.js',
                'Node.js / Express',
                'Next.js',
                'MongoDB',
                'Firebase',
                'Cloudinary',
                'Leaflet Maps',
                'Machine Learning',
              ].map(tech => (
                <li key={tech} className={styles.techItem}>{tech}</li>
              ))}
            </ul>
          </div>
        </header>

        <ProjectSection padding="top" className={styles.heroSection}>
          <ProjectSectionContent data-width="xl">
            <div className={styles.heroImageWrap}>
              <Image
                src={civicCommunityFeed}
                width={1280}
                height={800}
                alt="Civic Assist community feed showing trending civic issues reported by citizens"
                sizes="(max-width: 768px) 100vw, 90vw"
                className={styles.heroImage}
              />
              <div className={styles.imageCaption}>
                Community Feed — Browse and upvote civic issues in your neighbourhood
              </div>
            </div>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionColumns centered className={styles.overviewColumns}>
            <div className={styles.overviewText}>
              <ProjectSectionHeading>The Problem</ProjectSectionHeading>
              <ProjectSectionText>
                Citizens often struggle to report local civic issues — potholes, garbage
                overflow, broken streetlights — to the right authorities. Reports get
                lost in WhatsApp groups or lengthy bureaucratic channels with no
                accountability or follow-up.
              </ProjectSectionText>
              <ProjectSectionText>
                Civic Assist bridges this gap by providing a unified platform where
                citizens can report issues with photo evidence and GPS coordinates,
                while the community upvotes the most critical problems to ensure they
                get resolved first.
              </ProjectSectionText>
            </div>
            <div className={styles.overviewImageWrap}>
              <Image
                src={civicAdminDashboard}
                width={960}
                height={600}
                alt="Admin dashboard showing complaint statistics, AI classification, and resolution trends"
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.overviewImage}
              />
              <div className={styles.imageCaption}>
                Admin Dashboard — Real-time complaint tracking with AI-powered spam detection
              </div>
            </div>
          </ProjectSectionColumns>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow>
              <ProjectSectionHeading>Key Features</ProjectSectionHeading>
              <ProjectSectionText>
                Civic Assist is designed around three core user groups — citizens,
                government officers, and administrators — each with a tailored experience
                that makes issue resolution faster and more transparent.
              </ProjectSectionText>
            </ProjectTextRow>

            <div className={styles.featureGrid}>
              {[
                {
                  icon: '📍',
                  title: 'Geotagged Reports',
                  desc: 'Citizens pin issues on an interactive Leaflet map. Heatmaps show high-density problem zones at a glance.',
                },
                {
                  icon: '🗳️',
                  title: 'Community Upvoting',
                  desc: 'The most-upvoted issues rise to the top, ensuring the worst problems are tackled first by authorities.',
                },
                {
                  icon: '🤖',
                  title: 'AI Spam Detection',
                  desc: 'A machine learning model filters fake or duplicate reports, keeping the complaint data clean and reliable.',
                },
                {
                  icon: '📊',
                  title: 'Live Analytics',
                  desc: 'Admin dashboard shows complaint trends by category, resolution rates, and officer performance in real time.',
                },
                {
                  icon: '🔔',
                  title: 'Real-time Notifications',
                  desc: 'Firebase-powered push notifications keep reporters informed as their issue status changes.',
                },
                {
                  icon: '🏆',
                  title: 'Citizen Leaderboard',
                  desc: 'Gamified leaderboard rewards the most active reporters to drive community engagement and civic participation.',
                },
              ].map(f => (
                <div key={f.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              ))}
            </div>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection>
          <ProjectSectionContent data-width="xl">
            <ProjectTextRow>
              <ProjectSectionHeading>Citizen Champions</ProjectSectionHeading>
              <ProjectSectionText>
                A public leaderboard celebrates the citizens making the biggest civic
                impact. Rankings are based on reports submitted and issues resolved,
                creating a sense of community accountability and healthy competition.
              </ProjectSectionText>
            </ProjectTextRow>
            <div className={styles.screenshotRow}>
              <div className={styles.screenshotWrap}>
                <Image
                  src={civicLeaderboard}
                  width={960}
                  height={600}
                  alt="Top Contributors Leaderboard showing citizen rankings by reports and resolutions"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className={styles.screenshot}
                />
                <div className={styles.imageCaption}>
                  Leaderboard — Top citizens ranked by reports submitted and resolved
                </div>
              </div>
              <div className={styles.screenshotWrap}>
                <Image
                  src={civicAdminLogin}
                  width={960}
                  height={600}
                  alt="Government portal admin login screen with secure authentication"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className={styles.screenshot}
                />
                <div className={styles.imageCaption}>
                  Government Portal — Secure login for admin officers and municipal staff
                </div>
              </div>
            </div>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection light>
          <ProjectSectionContent>
            <ProjectTextRow center>
              <ProjectSectionHeading>Built for Scale</ProjectSectionHeading>
              <ProjectSectionText>
                The entire stack is cloud-native. Cloudinary handles all media storage
                and transformation, Firebase manages real-time data sync and push
                notifications, and MongoDB powers flexible document storage for
                reports and user data.
              </ProjectSectionText>
            </ProjectTextRow>
            <div className={styles.statsRow}>
              {[
                { value: '8+', label: 'Issue Categories' },
                { value: 'ML', label: 'Spam Detection' },
                { value: '3', label: 'User Portals' },
                { value: 'Live', label: 'Real-time Sync' },
              ].map(stat => (
                <div key={stat.label} className={styles.statCard}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </ProjectSectionContent>
        </ProjectSection>

        <ProjectSection className={styles.ctaSection}>
          <ProjectSectionContent>
            <ProjectTextRow center>
              <ProjectSectionHeading>See it in action</ProjectSectionHeading>
              <ProjectSectionText>
                Civic Assist is live and publicly accessible. You can explore the
                citizen portal, browse reported issues on the map, and see the
                AI-powered admin dashboard in action.
              </ProjectSectionText>
              <div className={styles.ctaButtons}>
                <Button
                  iconHoverShift
                  iconEnd="arrow-right"
                  href="https://civicassist-beta.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Live Demo
                </Button>
                <Button
                  iconHoverShift
                  iconEnd="arrow-right"
                  href="https://github.com/aniket-adhav/Civic_Assist_Platform"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Source Code
                </Button>
              </div>
            </ProjectTextRow>
          </ProjectSectionContent>
        </ProjectSection>

      </ProjectContainer>
      <Footer />
    </Fragment>
  );
}
