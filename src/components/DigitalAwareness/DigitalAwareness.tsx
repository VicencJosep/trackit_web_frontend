import styles from './DigitalAwareness.module.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DigitalAwareness: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [readableText, setReadableText] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const { t, i18n } = useTranslation();

  // Cargar preferencias desde localStorage al montar
  useEffect(() => {
    setHighContrast(localStorage.getItem('highContrast') === 'true');
    setFontSize(parseFloat(localStorage.getItem('fontSize') || '1'));
    setReadableText(localStorage.getItem('readableText') === 'true');
    setIsReady(true);
  }, []);

  // Aplicar estilos y guardar preferencias
  useEffect(() => {
    if (!isReady) return;

    document.body.style.filter = highContrast ? 'contrast(1.5)' : 'none';
    document.body.style.fontSize = `${fontSize}em`;

    if (readableText) {
      document.body.classList.add(styles.readable);
    } else {
      document.body.classList.remove(styles.readable);
    }

    // Guardar preferencias en localStorage
    localStorage.setItem('highContrast', String(highContrast));
    localStorage.setItem('fontSize', String(fontSize));
    localStorage.setItem('readableText', String(readableText));
  }, [highContrast, fontSize, readableText, isReady]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{String(t('title'))}</h1>

      <div className={styles.section}>
        <h2>{String(t('highContrast.title'))}</h2>
        <p>{String(t('highContrast.desc'))}</p>
        <button
          className={`${styles.button} ${highContrast ? styles.active : ''}`}
          onClick={() => setHighContrast(!highContrast)}
        >
          {highContrast ? String(t('highContrast.off')) : String(t('highContrast.on'))}
        </button>
      </div>

      <div className={styles.section}>
        <h2>{String(t('fontSize.title'))}</h2>
        <p>{String(t('fontSize.desc'))}</p>
        <div className={styles.fontControls}>
          <button onClick={() => setFontSize((s) => Math.max(0.8, s - 0.1))}>A-</button>
          <span>{Math.round(fontSize * 100)}%</span>
          <button onClick={() => setFontSize((s) => Math.min(2, s + 0.1))}>A+</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>{String(t('readableText.title'))}</h2>
        <p>{String(t('readableText.desc'))}</p>
        <button
          className={`${styles.button} ${readableText ? styles.active : ''}`}
          onClick={() => setReadableText(!readableText)}
        >
          {readableText ? String(t('readableText.off')) : String(t('readableText.on'))}
        </button>
      </div>

      <div className={styles.section}>
        <h2>{String(t('language.label'))}</h2>
        <p>{String(t('language.desc'))}</p>
        <select
          className={styles.languageSelector}
          onChange={handleLanguageChange}
          value={i18n.language}
        >
          <option value="es">{String(t('language.spanish'))}</option>
          <option value="en">{String(t('language.english'))}</option>
        </select>
      </div>
    </div>
  );
};

export default DigitalAwareness;
