import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5020';
const socket = io(SOCKET_URL);

export function useSocket() {
      return socket;
}

export { socket };
