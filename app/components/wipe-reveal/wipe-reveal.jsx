import styles from './wipe-reveal.module.css';

export function WipeReveal({ visible, children, delay = 0, className, as: Tag = 'span' }) {
  return (
    <Tag
      className={`${styles.wipe} ${className || ''}`}
      data-visible={visible}
      style={delay ? { '--wipe-delay': `${delay}ms` } : undefined}
    >
      <span className={styles.bar} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </Tag>
  );
}
