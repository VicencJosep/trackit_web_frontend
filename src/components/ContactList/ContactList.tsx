import React, { useEffect, useState } from 'react';
import { fetchContacts, fetchMessages } from '../../services/message.service'; // Asegúrate de que el path sea correcto
import { Message, User } from '../../types';
import styles from './ContactList.module.css'; // Adjust the path if necessary


interface ContactListProps {
  currentUserId: string;
  onMessagesFetched: (messages: Message[], contact: User) => void; // Cambia `any` por el tipo adecuado para los mensajes
}

const ContactList: React.FC<ContactListProps> = ({ currentUserId, onMessagesFetched }) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('currentUserId:', currentUserId);
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
  const handleOpenChat = async (contact: User) => {
    if (contact.id) {
      const data = await fetchMessages(currentUserId, contact.id);
      console.log('Mensajes obtenidos:', data);
      onMessagesFetched(data, contact);
    } else {
      console.error('Contact ID is undefined');
    }
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
          <li key={contact.id} className={styles.contactItem} onClick={() => contact.id && handleOpenChat(contact)}>
            <div className={styles.avatar}>{contact.name[0]}</div>
            <span className={styles.name}>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;

