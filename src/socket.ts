import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const token = localStorage.getItem('accessToken');
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:3001';

export const socket: Socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: {
    token,
  },
});
