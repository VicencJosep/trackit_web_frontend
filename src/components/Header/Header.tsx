import { useState } from "react";
import styles from "./Header.module.css";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
      <img src="/logoTrackIt.jpg" alt="Logo Track It" className={styles.logo} />

        <span className={styles.title}>TRACK IT</span>
      </div>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
        {/* <a href="#dashboard" className={styles.navLink}>
          Dashboard
        </a>
        <a href="#profile" className={styles.navLink}>
          Perfil
        </a>
        <a href="#settings" className={styles.navLink}>
          Configuración
        </a> */}
      </nav>

      <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};

export default Header;
