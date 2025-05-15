// src/components/Chat/Chat.tsx
import React, { useEffect, useRef, useState } from 'react';
import './Chat.css';
import { io, Socket } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { Message, User } from "../../types/index"; // Importamos el tipo User
import ContactList from '../ContactList/ContactList';


const Chat: React.FC = () => {
  const location = useLocation();
  const user = location.state?.user as User; // Accede al usuario pasado por navigate
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [contact, setContact] = useState<User|null>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleMessages = (newMessages: Message[], contact: User) => {
    console.log('Mensajes recibidos:', newMessages);
    setMessageList(newMessages);
    setContact(contact);
    setShowChat(true);

    if (newMessages.length > 0) {
      setRoomId(newMessages[0].roomId); // Usa `newMessages` directamente
      socketRef.current?.emit('join_room', newMessages[0].roomId);
    } else {
      console.error('No se encontraron mensajes para establecer el roomId');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:3001';
    socketRef.current = io(SOCKET_SERVER_URL, {
      auth: {
        token,
      },
    });
    socketRef.current.on('receive_message', (data: Message) => {
      console.log('Mensaje recibido:', data);
      setMessageList(prev => [...prev, data]);
    });

    socketRef.current.on('status', (data) => {
      console.debug('Estado recibido:', data);
      if (data.status === 'unauthorized') {
        window.location.href = '/';
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
    
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messageList]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData: Message = {
         senderId: user.id || '',
         rxId: contact?.id || '',
         content: currentMessage,
         created: new Date(),
         acknowledged: false,
         roomId: roomId || '',
     };
      console.log('Enviando mensaje:', messageData);
      await socketRef.current?.emit('send_message', messageData);
      setMessageList(prev => [...prev, messageData]);
      setCurrentMessage('');
    }
  };

  return (
    <div className="chat-layout">
      {user.id && 
        <ContactList currentUserId={user.id} onMessagesFetched={handleMessages}/>
      }
      <div className="chat-container">
        {!showChat ? (
          <div className="chat-placeholder">Selecciona un contacto</div>
        ) : (
          <div className="chat-box">
            <div className="chat-header">💬 {contact?.name}</div>
            <div className="chat-body" ref={chatBodyRef}>
              {messageList.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.senderId === user.id ? 'own' : 'other'}`}
                >
                  <div className="bubble">
                    <p>{msg.content}</p>
                    <div className="meta">
                      <span>
                          {msg.senderId === user.id ? user.name : contact?.name || 'Unknown'}
                      </span>
                      <span>{new Date(msg.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <input
                type="text"
                placeholder="Escribe tu mensaje..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage}>Enviar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default Chat;
