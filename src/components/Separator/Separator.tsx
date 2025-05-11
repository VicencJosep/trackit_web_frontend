import React from "react";
import styles from "./Separator.module.css";

const Separator: React.FC = () => {
  return (
    <div className={styles.separator}>
      <div className={styles.titleContainer}>
        <h1 className={styles.titleFoto}>TRACK-IT:</h1>
        <h2 className={styles.subtitleFoto}>Mensajería que no pierde el rumbo</h2>
      </div>
    </div>
  );
};

export default Separator;