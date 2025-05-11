import styles from "./Messages.module.css";

const Messages = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tus Mensajes</h2>
      <div className={styles.messageBox}>
        <p className={styles.message}>
          📬 No tienes mensajes nuevos por el momento.
        </p>
      </div>
    </div>
  );
};

export default Messages;
