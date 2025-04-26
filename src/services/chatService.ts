import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { authHeader } from './authHeader';

const API_URL = 'http://localhost:3000/api/chat';
const SOCKET_URL = 'http://localhost:3000';

export interface ChatUser {
  id: string;
  name: string;
  role: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  senderName?: string;
  receiverName?: string;
}

// --- Socket Instance ---
let socket: Socket | null = null;

const connectSocket = () => {
  if (!socket || !socket.connected) {
    console.log('[ChatService] Attempting to connect socket...');
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('[ChatService] Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[ChatService] Socket disconnected:', reason);
      socket = null;
    });

    socket.on('connect_error', (error) => {
      console.error('[ChatService] Socket connection error:', error);
      socket = null;
    });

    socket.on('joinedRoom', (room) => {
      console.log(`[ChatService] Successfully joined room: ${room}`);
    });
  }
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    console.log('[ChatService] Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

// --- Real-time Event Emitters ---

const joinRoom = (room: string) => {
  const currentSocket = connectSocket();
  if (currentSocket && currentSocket.connected) {
    console.log(`[ChatService] Emitting joinRoom for room: ${room}`);
    currentSocket.emit('joinRoom', room);
  } else {
    console.warn(`[ChatService] Cannot join room ${room}: Socket not connected.`);
  }
};

const leaveRoom = (room: string) => {
  const currentSocket = connectSocket();
  if (currentSocket && currentSocket.connected) {
    console.log(`[ChatService] Emitting leaveRoom for room: ${room}`);
    currentSocket.emit('leaveRoom', room);
  } else {
    console.warn(`[ChatService] Cannot leave room ${room}: Socket not connected.`);
  }
};

// --- Real-time Event Listeners ---
const onReceiveMessage = (callback: (message: Message) => void) => {
  const currentSocket = connectSocket();
  if (currentSocket) {
    currentSocket.off('receiveMessage');
    currentSocket.on('receiveMessage', (message: Message) => {
      console.log('[ChatService] Received message via socket:', message);
      callback(message);
    });
  } else {
    console.warn('[ChatService] Cannot set up receiveMessage listener: Socket not available.');
  }
};

const onConversationUpdate = (callback: () => void) => {
  const currentSocket = connectSocket();
  if (currentSocket) {
    currentSocket.off('conversationUpdate');
    currentSocket.on('conversationUpdate', () => {
      console.log('[ChatService] Received conversation update notification.');
      callback();
    });
  }
};

// --- HTTP Methods ---

const postMessage = async (receiverId: string, content: string): Promise<Message> => {
  console.log(`[ChatService] Posting message to ${receiverId} via HTTP...`);
  const headers = await authHeader();
  const response = await axios.post(
    `${API_URL}/messages`,
    { receiverId, content },
    { headers, withCredentials: true }
  );
  console.log('[ChatService] Received response after posting message:', response.data);
  return response.data;
};

const getChatUsers = async (): Promise<ChatUser[]> => {
  console.log('[ChatService] Fetching chat users via HTTP...');
  const headers = await authHeader();
  const response = await axios.get(`${API_URL}/contacts`, { headers, withCredentials: true });
  console.log('[ChatService] Received chat users:', response.data);
  return response.data;
};

const getMessages = async (userId: string): Promise<Message[]> => {
  console.log(`[ChatService] Fetching messages for user ${userId} via HTTP...`);
  const headers = await authHeader();
  const response = await axios.get(`${API_URL}/messages/${userId}`, { headers, withCredentials: true });
  console.log(`[ChatService] Received messages for user ${userId}:`, response.data);
  return response.data;
};

const markMessagesAsRead = async (senderId: string): Promise<void> => {
  console.log(`[ChatService] Marking messages from ${senderId} as read via HTTP...`);
  const headers = await authHeader();
  await axios.post(`${API_URL}/messages/read`, { senderId }, { headers, withCredentials: true });
  console.log(`[ChatService] Marked messages from ${senderId} as read.`);
};

export const chatService = {
  getChatUsers,
  getMessages,
  markMessagesAsRead,
  postMessage,
  connectSocket,
  disconnectSocket,
  joinRoom,
  leaveRoom,
  onReceiveMessage,
  onConversationUpdate,
};