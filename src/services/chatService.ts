import axios from "axios";
import { io, Socket } from "socket.io-client";
import { authHeader } from "./authHeader";

const API_URL = "http://localhost:3000/api/chat";
const SOCKET_URL = "http://localhost:3000";

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
let isConnecting = false; // Prevent multiple connection attempts simultaneously
const connectionPromise: Promise<Socket | null> | null = null; // To await connection

const connectSocket = (): Socket | null => {
  // If already connected, return the existing socket
  if (socket?.connected) {
    return socket;
  }

  // If currently connecting, return null or the promise (advanced)
  if (isConnecting) {
    console.log("[ChatService] Socket connection already in progress...");
    return null; // Or return connectionPromise for awaiting
  }

  // If socket exists but is disconnected, try to reconnect
  if (socket && !socket.connected) {
    console.log(
      "[ChatService] Socket exists but disconnected, attempting reconnect..."
    );
    isConnecting = true;
    socket.connect(); // Attempt to reconnect the existing instance
    return socket; // Return the existing instance, connection happens async
  }

  // If no socket or couldn't reconnect existing, create a new one
  if (!socket) {
    console.log("[ChatService] No existing socket, creating new connection...");
    isConnecting = true;

    socket = io(SOCKET_URL, {
      withCredentials: true,
      reconnectionAttempts: 5, // Optional: Limit reconnection attempts
      reconnectionDelay: 1000, // Optional: Delay between attempts
    });

    socket.on("connect", () => {
      isConnecting = false;
      console.log("[ChatService] Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      isConnecting = false; // Allow new connection attempts
      console.log("[ChatService] Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        socket?.connect();
      }
    });

    socket.on("connect_error", (error) => {
      isConnecting = false; // Allow new connection attempts
      console.error("[ChatService] Socket connection error:", error);
    });
  }

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    console.log("[ChatService] Disconnecting socket...");
    socket.disconnect();
    socket = null;
  }
};

// --- Real-time Event Emitters ---

const joinRoom = (room: string) => {
  const currentSocket = connectSocket(); // Ensure connection attempt is made
  if (currentSocket && currentSocket.connected) {
    console.log(`[ChatService] Emitting joinRoom for room: ${room}`);
    currentSocket.emit("joinRoom", room);
  } else {
    console.warn(
      `[ChatService] Cannot join room ${room}: Socket not connected yet. Will try after connect.`
    );
    currentSocket?.once("connect", () => {
      console.log(`[ChatService] Socket connected, now joining room: ${room}`);
      currentSocket.emit("joinRoom", room);
    });
  }
};

const leaveRoom = (room: string) => {
  const currentSocket = connectSocket(); // Ensure socket exists
  if (currentSocket && currentSocket.connected) {
    console.log(`[ChatService] Emitting leaveRoom for room: ${room}`);
    currentSocket.emit("leaveRoom", room);
  } else {
    console.warn(
      `[ChatService] Cannot leave room ${room}: Socket not connected.`
    );
  }
};

// --- Real-time Event Listeners ---
const messageCallbacks = new Set<(message: Message) => void>();

const onReceiveMessage = (callback: (message: Message) => void) => {
  messageCallbacks.add(callback); // Add the callback
  const currentSocket = connectSocket(); // Ensure connection attempt

  const listener = (message: Message) => {
    console.log("[ChatService] Received message via socket:", message);
    messageCallbacks.forEach((cb) => cb(message));
  };

  if (currentSocket) {
    currentSocket.off("receiveMessage", listener);
    currentSocket.on("receiveMessage", listener);
    console.log("[ChatService] receiveMessage listener attached.");

    if (!currentSocket.connected) {
      currentSocket.once("connect", () => {
        console.log(
          "[ChatService] Socket connected, ensuring receiveMessage listener is active."
        );
        currentSocket.off("receiveMessage", listener);
        currentSocket.on("receiveMessage", listener);
      });
    }
  } else {
    console.warn(
      "[ChatService] Cannot set up receiveMessage listener: Socket not available yet."
    );
  }

  return () => {
    messageCallbacks.delete(callback);
  };
};

const onConversationUpdate = (callback: () => void) => {
  const currentSocket = connectSocket();
  if (currentSocket) {
    currentSocket.off("conversationUpdate");
    currentSocket.on("conversationUpdate", () => {
      console.log("[ChatService] Received conversation update notification.");
      callback();
    });
  }
};

// --- HTTP Methods ---

const postMessage = async (
  receiverId: string,
  content: string
): Promise<Message> => {
  console.log(`[ChatService] Posting message to ${receiverId} via HTTP...`);
  const headers = await authHeader();
  const response = await axios.post(
    `${API_URL}/messages`,
    { receiverId, content },
    { headers, withCredentials: true }
  );
  console.log(
    "[ChatService] Received response after posting message:",
    response.data
  );
  return response.data;
};

const getChatUsers = async (): Promise<ChatUser[]> => {
  console.log("[ChatService] Fetching chat users via HTTP...");
  const headers = await authHeader();
  const response = await axios.get(`${API_URL}/contacts`, {
    headers,
    withCredentials: true,
  });
  console.log("[ChatService] Received chat users:", response.data);
  return response.data;
};

const getMessages = async (userId: string): Promise<Message[]> => {
  console.log(`[ChatService] Fetching messages for user ${userId} via HTTP...`);
  const headers = await authHeader();
  const response = await axios.get(`${API_URL}/messages/${userId}`, {
    headers,
    withCredentials: true,
  });
  console.log(
    `[ChatService] Received messages for user ${userId}:`,
    response.data
  );
  return response.data;
};

const markMessagesAsRead = async (senderId: string): Promise<void> => {
  console.log(
    `[ChatService] Marking messages from ${senderId} as read via HTTP...`
  );
  const headers = await authHeader();
  await axios.post(
    `${API_URL}/messages/read`,
    { senderId },
    { headers, withCredentials: true }
  );
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
