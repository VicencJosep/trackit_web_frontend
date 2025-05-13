import React, { useEffect, useState } from 'react';
import { fetchContacts } from '../../services/message.service'; // Asegúrate de que el path sea correcto
import { User } from '../../types';
import styles from './ContactList.module.css'; // Adjust the path if necessary

interface ContactListProps {
  currentUserId: string;
}

const ContactList: React.FC<ContactListProps> = ({ currentUserId }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await fetchContacts(currentUserId);
        setContacts(data);
      } catch (error) {
        console.error('Error al cargar contactos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [currentUserId]);
  const handleOpenChat = (contactId: string) => {
    // Aquí puedes manejar la apertura del chat con el contacto seleccionado
    console.log(`Abriendo chat con el contacto: ${contactId}`);
  };
  if (loading) {
    return <div className={styles.loading}>Cargando contactos...</div>;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Contactos</h2>
      </div>
      <ul className={styles.contactList}>
        {contacts.map((contact) => (
          <li key={contact._id} className={styles.contactItem} onClick={() => contact._id && handleOpenChat(contact._id)}>
            <div className={styles.avatar}>{contact.name[0]}</div>
            <span className={styles.name}>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;