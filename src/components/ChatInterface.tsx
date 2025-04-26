import React, { useState, useEffect, useRef, useCallback } from 'react';
// Use default import for io and alias the type import for Socket
import io from 'socket.io-client';
import type { Socket as SocketIOType } from 'socket.io-client';
import { useAuth } from '../contexts/useAuth';
import {
  Send,
  UserCircle,
  Search,
} from 'lucide-react';
import Cookies from 'js-cookie';

// Define interfaces for better type safety
interface UserData {
    id: string;
    name: string;
    email: string;
    type: 'student' | 'advisor';
    // Add other relevant user fields if needed
}

interface Message {
    id: string;
    sender: UserData;
    receiver: UserData;
    content: string;
    timestamp: string; // Assuming timestamp is string from backend
    read: boolean;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { userName, email, userType } = useAuth(); // Get current logged-in user info
    // Use the aliased Socket type
    const [socket, setSocket] = useState<SocketIOType | null>(null);
    const [conversations, setConversations] = useState<UserData[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<UserData | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- WebSocket Connection ---
    useEffect(() => {
        // Ensure user is loaded before connecting
        if (!userName || !email || !userType) return;

        // Retrieve JWT token from cookies
        const token = Cookies.get('jwt');
        if (!token) {
            setError("Authentication token not found. Please log in again.");
            return;
        }

        // Use the directly imported io function
        const newSocket = io('http://localhost:3000', { // Your NestJS backend URL
            // @ts-ignore - withCredentials is a valid option but might not be in older/conflicting types
            withCredentials: true, // Important to send cookies
            // Optionally pass the token if needed by backend setup, though cookies should work
            // auth: { token }
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('WebSocket connected:', newSocket.id);
            setIsConnected(true);
            setError(null); // Clear previous errors on successful connection

            // Request initial data once connected
            if (userType === 'advisor') {
                newSocket.emit('getConversations');
            } else if (userType === 'student') {
                newSocket.emit('getConversations'); // Advisors might be the only conversation for students
            }
        });

        newSocket.on('disconnect', (reason: any) => {
            console.log('WebSocket disconnected:', reason);
            setIsConnected(false);
            setError(`Disconnected: ${reason}. Attempting to reconnect...`);
            // Socket.IO client handles reconnection attempts automatically by default
        });

        newSocket.on('connect_error', (err: { message: any; }) => {
            console.error('WebSocket connection error:', err);
            setIsConnected(false);
            setError(`Connection failed: ${err.message}. Please check your connection or try logging in again.`);
            // Prevent multiple sockets if connection fails repeatedly
            newSocket.disconnect();
            setSocket(null);
        });

        // --- WebSocket Event Listeners ---
        newSocket.on('receiveMessage', (message: Message) => {
            console.log('Message received:', message);
            // Add message only if it belongs to the currently selected conversation
            if (selectedConversation && (message.sender.id === selectedConversation.id || message.receiver.id === selectedConversation.id)) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
            // TODO: Add notification logic for messages in other conversations
        });

        newSocket.on('messageSent', (message: Message) => {
             console.log('Message sent confirmation:', message);
             // Update messages list with the confirmed message from the server
             // This ensures we have the correct ID and timestamp
             setMessages((prevMessages) => {
                // Replace potential optimistic update or just add if not already there
                const existingIndex = prevMessages.findIndex(m => m.id === message.id); // Use ID if available
                if (existingIndex > -1) {
                    // Update existing message if needed (e.g., timestamp)
                    const updatedMessages = [...prevMessages];
                    updatedMessages[existingIndex] = message;
                    return updatedMessages;
                } else {
                    // Add new message
                    return [...prevMessages, message];
                }
            });
        });

        newSocket.on('messageHistory', (data: { otherUserId: string; messages: Message[] }) => {
            console.log(`History received for ${data.otherUserId}:`, data.messages);
            // Only update messages if the history matches the selected conversation
            if (selectedConversation && data.otherUserId === selectedConversation.id) {
                setMessages(data.messages);
            }
        });

        newSocket.on('conversationList', (users: UserData[]) => {
            console.log('Conversation list received:', users);
            setConversations(users);
             // If student, automatically select the first (and likely only) conversation
            if (userType === 'student' && users.length > 0) {
                handleSelectConversation(users[0]);
            }
        });

         newSocket.on('messageError', (errorData: { error: string }) => {
            console.error('Message Error from server:', errorData.error);
            setError(`Failed to send message: ${errorData.error}`);
            // Optionally remove the optimistic message update if implemented
        });

         newSocket.on('historyError', (errorData: { otherUserId: string, error: string }) => {
            console.error(`History Error for ${errorData.otherUserId}:`, errorData.error);
            setError(`Failed to load message history: ${errorData.error}`);
        });

         newSocket.on('conversationError', (errorData: { error: string }) => {
            console.error('Conversation Error:', errorData.error);
            setError(`Failed to load conversations: ${errorData.error}`);
        });


        // Cleanup on component unmount
        return () => {
            console.log('Disconnecting WebSocket...');
            newSocket.disconnect();
            setSocket(null);
            setIsConnected(false);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userName, email, userType]); // Re-run effect if user changes (login/logout)

    // --- Message Handling ---
    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!socket || !selectedConversation || !newMessage.trim() || !userName) return;

        console.log(`Sending message to ${selectedConversation.id}: ${newMessage}`);

        socket.emit('sendMessage', {
            receiverId: selectedConversation.id,
            content: newMessage.trim(),
        });

        setNewMessage('');
    };

    // --- Conversation Selection ---
    const handleSelectConversation = useCallback((partner: UserData) => {
        if (!socket || !userName) return;
        console.log('Selecting conversation with:', partner.name);
        setSelectedConversation(partner);
        setMessages([]); // Clear previous messages
        setError(null); // Clear errors when switching conversations
        // Request message history for the selected conversation
        socket.emit('getHistory', { otherUserId: partner.id });
    }, [socket, userName]);


    // --- Auto-scroll ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Render Logic ---
    if (!userName || !email || !userType) {
        return <div className="p-4 text-center text-gray-500">Loading user data...</div>;
    }

    return (
        <div className="flex h-[calc(100vh-200px)] max-h-[700px] bg-white rounded-lg shadow-lg overflow-hidden" dir="rtl">
            {/* Sidebar (Conversations List - mainly for Advisors) */}
            {userType === 'advisor' && (
                <aside className="w-1/3 border-l border-gray-200 bg-gray-50 flex flex-col">
                    <div className="p-4 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="البحث عن محادثة..."
                                className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>
                    <ul className="overflow-y-auto flex-1">
                        {conversations.length > 0 ? conversations.map((convoUser) => (
                            <li
                                key={convoUser.id}
                                className={`p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex items-center gap-3 ${selectedConversation?.id === convoUser.id ? 'bg-blue-50' : ''}`}
                                onClick={() => handleSelectConversation(convoUser)}
                            >
                                <UserCircle className="w-10 h-10 text-gray-400" />
                                <div className="flex-1">
                                    <span className="font-semibold text-gray-800">{convoUser.name}</span>
                                    {/* Optional: Show last message preview */}
                                    {/* <p className="text-sm text-gray-500 truncate">آخر رسالة هنا...</p> */}
                                </div>
                                {/* Optional: Show unread count */}
                                {/* <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5">3</span> */}
                            </li>
                        )) : (
                             <li className="p-4 text-center text-gray-500">لا توجد محادثات</li>
                        )}
                    </ul>
                </aside>
            )}

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <header className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                            <UserCircle className="w-10 h-10 text-gray-400" />
                            <div>
                                <h2 className="font-semibold text-gray-800">{selectedConversation.name}</h2>
                                <span className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                                    {isConnected ? 'متصل' : 'غير متصل'}
                                </span>
                            </div>
                        </header>

                        {/* Messages Display */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.sender.id === userName ? 'flex-row-reverse' : ''}`}
                                >
                                    <UserCircle className={`w-8 h-8 ${message.sender.id === userName ? 'text-purple-600' : 'text-blue-600'}`} />
                                    <div className={`flex flex-col max-w-[70%] ${message.sender.id === userName ? 'items-end' : ''}`}>
                                        <div
                                            className={`px-4 py-2 rounded-2xl ${message.sender.id === userName
                                                ? 'bg-blue-500 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1">
                                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                        </div>

                         {/* Error Display */}
                        {error && (
                            <div className="p-2 bg-red-100 text-red-700 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t bg-white">
                             <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="اكتب رسالتك هنا..."
                                className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
                                disabled={!isConnected || !selectedConversation} // Disable input if not connected or no conversation selected
                            />
                            <button
                                type="submit"
                                className={`p-2 rounded-full text-white transition-colors ${(!isConnected || !selectedConversation || !newMessage.trim()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                                disabled={!isConnected || !selectedConversation || !newMessage.trim()}
                            >
                                <Send size={20} className="rotate-180" />
                            </button>
                        </form>
                    </>
                ) : (
                    // Placeholder when no conversation is selected (mainly for advisors)
                    <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-500">
                        {userType === 'advisor' ? 'اختر محادثة للبدء' : 'جاري تحميل المحادثة...'}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChatInterface;