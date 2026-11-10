import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { deviceModels } from '~/components/model/device-models';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { useTheme } from '~/components/theme-provider';
import { Transition } from '~/components/transition';
import { Loader } from '~/components/loader';
import { useWindowSize } from '~/hooks';
import { Suspense, lazy, useState } from 'react';
import { cssProps, media } from '~/utils/style';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './project-summary.module.css';

const Model = lazy(() =>
  import('~/components/model').then(module => ({ default: module.Model }))
);

export function ProjectSummary({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  model,
  buttonText,
  buttonLink,
  alternate,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const isHydrated = useHydrated();
  const titleId = `${id}-title`;
  const isMobile = width <= media.tablet;
  const indexText = index < 10 ? `0${index}` : index;
  const phoneSizes = `(max-width: ${media.tablet}px) 80vw, 20vw`;
  const laptopSizes = `(max-width: ${media.tablet}px) 80vw, 40vw`;

  function handleModelLoad() {
    setModelLoaded(true);
  }

  function renderDetails(visible) {
    return (
      <div className={styles.details}>
        <div aria-hidden className={styles.index}>
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={!visible}
            collapseDelay={1000}
          />
          <span className={styles.indexNumber} data-visible={visible}>
            {indexText}
          </span>
        </div>
        <Heading
          level={3}
          as="h2"
          className={styles.title}
          data-visible={visible}
          id={titleId}
        >
          {title}
        </Heading>
        <Text className={styles.description} data-visible={visible} as="p">
          {description}
        </Text>
        <div className={styles.button} data-visible={visible}>
          <Button iconHoverShift href={buttonLink} iconEnd="arrow-right">
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }

  function renderSvgText(visible, device) {
    const lines = model.svgText;
    if (!lines) return null;

    return (
      <svg
        aria-hidden
        className={styles.svg}
        data-device={device}
        data-visible={visible}
        style={cssProps({ opacity: 0.065 })}
        viewBox="0 0 500 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fontFamily="Gotham, 'Helvetica Neue', Arial, sans-serif"
          letterSpacing="14"
        >
          {lines[0]}
        </text>
      </svg>
    );
  }

  function renderPreview(visible) {
    return (
      <div className={styles.preview}>
        {model.type === 'laptop' && (
          <div className={styles.model} data-device="laptop">
            {!modelLoaded && (
              <Loader center className={styles.loader} data-visible={visible} />
            )}
            <Suspense>
              {isHydrated && visible && (
                <Model
                  alt={model.alt}
                  cameraPosition={{ x: 0, y: 0, z: 8 }}
                  showDelay={200}
                  onLoad={handleModelLoad}
                  show={visible}
                  models={[
                    {
                      ...deviceModels.laptop,
                      texture: {
                        ...model.textures[0],
                        sizes: laptopSizes,
                      },
                    },
                  ]}
                />
              )}
            </Suspense>
            {renderSvgText(visible, 'laptop')}
          </div>
        )}
        {model.type === 'phone' && (
          <div className={styles.model} data-device="phone">
            {!modelLoaded && (
              <Loader center className={styles.loader} data-visible={visible} />
            )}
            <Suspense>
              {isHydrated && visible && (
                <Model
                  alt={model.alt}
                  cameraPosition={{ x: 0, y: 0, z: 11.5 }}
                  showDelay={100}
                  onLoad={handleModelLoad}
                  show={visible}
                  models={[
                    {
                      ...deviceModels.phone,
                      position: { x: -0.6, y: 1.1, z: 0 },
                      texture: {
                        ...model.textures[0],
                        sizes: phoneSizes,
                      },
                    },
                    {
                      ...deviceModels.phone,
                      position: { x: 0.6, y: -0.5, z: 0.3 },
                      texture: {
                        ...model.textures[1],
                        sizes: phoneSizes,
                      },
                    },
                  ]}
                />
              )}
            </Suspense>
            {renderSvgText(visible, 'phone')}
          </div>
        )}
      </div>
    );
  }

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div className={styles.content}>
        <Transition in={sectionVisible || focused}>
          {({ visible }) => (
            <>
              {!alternate && !isMobile && (
                <>
                  {renderDetails(visible)}
                  {renderPreview(visible)}
                </>
              )}
              {(alternate && !isMobile) && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
              {isMobile && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
}
