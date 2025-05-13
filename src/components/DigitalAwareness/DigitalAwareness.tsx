import styles from "./DigitalAwareness.module.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DigitalAwareness = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [readableText, setReadableText] = useState(false);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.body.style.filter = highContrast ? "contrast(1.5)" : "none";
    document.body.style.fontSize = `${fontSize}em`;

    document.body.classList.remove("dark", styles.readable);

    if (darkMode) document.body.classList.add("dark");
    if (readableText) document.body.classList.add(styles.readable);
  }, [highContrast, fontSize, darkMode, readableText]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{String(t("title"))}</h1>

      <div className={styles.section}>
        <h2>{String(t("highContrast.title"))}</h2>
        <p>{String(t("highContrast.desc"))}</p>
        <button
          className={`${styles.button} ${highContrast ? styles.active : ""}`}
          onClick={() => setHighContrast(!highContrast)}
        >
          {highContrast ? String(t("highContrast.off")) : String(t("highContrast.on"))}
        </button>
      </div>

      <div className={styles.section}>
        <h2>{String(t("fontSize.title"))}</h2>
        <p>{String(t("fontSize.desc"))}</p>
        <div className={styles.fontControls}>
          <button onClick={() => setFontSize((s) => Math.max(0.8, s - 0.1))}>A-</button>
          <span>{Math.round(fontSize * 100)}%</span>
          <button onClick={() => setFontSize((s) => Math.min(2, s + 0.1))}>A+</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>{String(t("darkMode.title"))}</h2>
        <p>{String(t("darkMode.desc"))}</p>
        <button
          className={`${styles.button} ${darkMode ? styles.active : ""}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? String(t("darkMode.off")) : String(t("darkMode.on"))}
        </button>
      </div>

      <div className={styles.section}>
        <h2>{String(t("readableText.title"))}</h2>
        <p>{String(t("readableText.desc"))}</p>
        <button
          className={`${styles.button} ${readableText ? styles.active : ""}`}
          onClick={() => setReadableText(!readableText)}
        >
          {readableText ? String(t("readableText.off")) : String(t("readableText.on"))}
        </button>
      </div>

      <div className={styles.section}>
        <h2>{String(t("language.label"))}</h2>
        <p>{String(t("language.desc"))}</p>
        <select
          className={styles.languageSelector}
          onChange={handleLanguageChange}
          value={i18n.language}
        >
          <option value="es">{String(t("language.spanish"))}</option>
          <option value="en">{String(t("language.english"))}</option>
        </select>
      </div>

      <div className={styles.section}>
        <h2>{String(t("tips.title"))}</h2>
        <ul className={styles.tipsList}>
          <li>{String(t("tip1"))}</li>
          <li>{String(t("tip2"))}</li>
          <li>{String(t("tip3"))}</li>
          <li>{String(t("tip4"))}</li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalAwareness;