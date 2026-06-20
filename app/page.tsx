import Hero from "@/components/Hero/Hero";
import Navigation from "@/components/Navigation/Navigation";
import Threshold from "@/components/Sections/Threshold";
import ThePath from "@/components/Sections/ThePath";
import TheCraft from "@/components/Sections/TheCraft";
import SelectedWorks from "@/components/Sections/SelectedWorks";
import Principles from "@/components/Sections/Principles";
import Conversation from "@/components/Sections/Conversation";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.mainGrid}>
      {/* Background texture & navigation panel */}
      <div className={styles.persistentBg} id="persistent-page-bg" aria-hidden="true" />
      <Navigation />

      {/* Portfolio sections layout flow */}
      <div className={styles.fullBleedSection}>
        <Hero />
      </div>
      <Threshold />
      <ThePath />
      <TheCraft />
      <SelectedWorks />
      <Principles />
      <Conversation />
    </main>
  );
}
