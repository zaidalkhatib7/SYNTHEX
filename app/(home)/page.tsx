import Link from "next/link";
import styles from "./page.module.css";

export default function LocaleGatewayPage() {
  return (
    <main className={styles.page}>
      <div className={styles.frame}>
        <p className={styles.eyebrow}>SYNTHEX Holding</p>
        <h1>Select your language</h1>
        <p>
          Choose the English or Arabic corporate experience. Company deep links
          remain available within each language.
        </p>
        <div className={styles.actions}>
          <Link href="/en/">English</Link>
          <Link href="/ar/" lang="ar">
            العربية
          </Link>
        </div>
      </div>
    </main>
  );
}
