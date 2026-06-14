import styles from "./experience.module.css";

interface ScenePlaceholderProps {
  label: string;
  variant:
    | "holding"
    | "jollaq"
    | "al-maria"
    | "industrial"
    | "shamco"
    | "network";
}

export function ScenePlaceholder({
  label,
  variant,
}: ScenePlaceholderProps) {
  return (
    <div
      className={`${styles.scene} ${styles[`scene_${variant}`]}`}
      aria-label={label}
      role="img"
    >
      <div className={styles.sceneCore} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{label}</p>
    </div>
  );
}
