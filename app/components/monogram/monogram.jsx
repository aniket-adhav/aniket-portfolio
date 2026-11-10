import { forwardRef, useId } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="30"
      height="29"
      viewBox="0 0 30 29"
      ref={ref}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <path clipRule="evenodd" d="M0 29L15 0L30 29ZM4 29L15 8L26 29ZM7 18L23 18L23 22L7 22Z" />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});
