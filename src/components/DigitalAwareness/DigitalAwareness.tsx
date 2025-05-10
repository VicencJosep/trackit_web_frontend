import styles from "./DigitalAwareness.module.css";
import { useEffect, useState } from "react";

const DigitalAwareness = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [readableText, setReadableText] = useState(false);

  useEffect(() => {
    document.body.style.filter = highContrast ? "contrast(1.5)" : "none";
    document.body.style.fontSize = `${fontSize}em`;

    document.body.classList.remove("dark", styles.dyslexic, styles.underlineLinks, styles.readable);

    if (darkMode) document.body.classList.add("dark");
    if (dyslexicFont) document.body.classList.add(styles.dyslexic);
    if (underlineLinks) document.body.classList.add(styles.underlineLinks);
    if (readableText) document.body.classList.add(styles.readable);
  }, [highContrast, fontSize, darkMode, dyslexicFont, underlineLinks, readableText]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Centro de Accesibilidad</h1>

      <div className={styles.section}>
        <h2>🌈 Contraste Alto</h2>
        <p>Activa un modo con mayor contraste para facilitar la lectura.</p>
        <button
          className={`${styles.button} ${highContrast ? styles.active : ""}`}
          onClick={() => setHighContrast(!highContrast)}
        >
          {highContrast ? "Desactivar Contraste Alto" : "Activar Contraste Alto"}
        </button>
      </div>

      <div className={styles.section}>
        <h2>🔠 Tamaño de Fuente</h2>
        <p>Ajusta el tamaño del texto para mejorar la visibilidad.</p>
        <div className={styles.fontControls}>
          <button onClick={() => setFontSize((s) => Math.max(0.8, s - 0.1))}>A-</button>
          <span>{Math.round(fontSize * 100)}%</span>
          <button onClick={() => setFontSize((s) => Math.min(2, s + 0.1))}>A+</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🌙 Tema Oscuro</h2>
        <p>Reduce la fatiga ocular en ambientes oscuros.</p>
        <button
          className={`${styles.button} ${darkMode ? styles.active : ""}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Desactivar Tema Oscuro" : "Activar Tema Oscuro"}
        </button>
      </div>

      <div className={styles.section}>
        <h2>🔡 Fuente Disléxica</h2>
        <p>Mejora la lectura para personas con dislexia.</p>
        <button
          className={`${styles.button} ${dyslexicFont ? styles.active : ""}`}
          onClick={() => setDyslexicFont(!dyslexicFont)}
        >
          {dyslexicFont ? "Desactivar Fuente Disléxica" : "Activar Fuente Disléxica"}
        </button>
      </div>

      <div className={styles.section}>
        <h2>🔗 Subrayar Enlaces</h2>
        <p>Mejora la visibilidad de los enlaces.</p>
        <button
          className={`${styles.button} ${underlineLinks ? styles.active : ""}`}
          onClick={() => setUnderlineLinks(!underlineLinks)}
        >
          {underlineLinks ? "Ocultar Subrayado" : "Subrayar Enlaces"}
        </button>
      </div>

      <div className={styles.section}>
        <h2>📖 Texto Legible</h2>
        <p>Activa mayor interlineado y espaciado entre palabras.</p>
        <button
          className={`${styles.button} ${readableText ? styles.active : ""}`}
          onClick={() => setReadableText(!readableText)}
        >
          {readableText ? "Desactivar Texto Legible" : "Activar Texto Legible"}
        </button>
      </div>

      <div className={styles.section}>
        <h2>🧠 Tips de Bienestar Digital</h2>
        <ul className={styles.tipsList}>
          <li>🌤️ Haz pausas cada 20 minutos para descansar la vista.</li>
          <li>📵 Establece horarios sin pantalla antes de dormir.</li>
          <li>⏳ Limita el tiempo en apps que te generen ansiedad.</li>
          <li>🌿 Usa el modo oscuro en entornos con poca luz.</li>
        </ul>
      </div>
    </div>
  );
};

export default DigitalAwareness;
