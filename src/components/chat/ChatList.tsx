import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
import { chatService } from '../../services/chatService';
import { MessageCircle, Calendar, ChevronRight } from 'lucide-react';
import NavBar from '../NavBar';
import Footer from '../Footer';
import axios from 'axios'; // Import axios

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ChatList: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Use useCallback to memoize fetchChats
  const fetchChats = useCallback(async () => {
    if (!user || !user.id) {
      console.warn('[ChatList] fetchChats skipped: User object or user.id is missing.', { user });
      setIsLoading(false);
      if (!user) setChats([]);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      console.log(`[ChatList] Attempting to call chatService.getChatUsers() for user ID: ${user.id}`);
      const response = await chatService.getChatUsers();
      console.log('[ChatList] Received response from getChatUsers:', response);

      const formattedChats: Chat[] = response.map(chatUser => {
        if (!chatUser || typeof chatUser !== 'object' || !chatUser.id || !chatUser.name) {
          console.warn('[ChatList] Invalid chat user data received:', chatUser);
          return null;
        }
        return {
          id: chatUser.id,
          name: chatUser.name,
          lastMessage: chatUser.lastMessage || 'No messages yet',
          lastMessageTime: chatUser.timestamp ? new Date(chatUser.timestamp).toISOString() : new Date().toISOString(),
          unreadCount: chatUser.unreadCount || 0
        };
      }).filter((chat): chat is Chat => chat !== null);

      console.log('[ChatList] Formatted chats:', formattedChats);
      setChats(formattedChats);

    } catch (err) {
      console.error('[ChatList] Error fetching chats:', err);
      if (axios.isAxiosError(err)) {
        console.error('[ChatList] Axios error details:', err.response?.data, err.response?.status);
        setError(`فشل في تحميل المحادثات (خطأ ${err.response?.status || 'غير معروف'}). يرجى المحاولة مرة أخرى.`);
      } else {
        setError('فشل في تحميل المحادثات، يرجى المحاولة مرة أخرى لاحقًا');
      }
    } finally {
      setIsLoading(false);
      console.log('[ChatList] fetchChats async function finished.');
    }
  }, [user]); // Depend on user

  useEffect(() => {
    console.log('[ChatList] useEffect triggered.');
    fetchChats(); // Initial fetch

    // Connect socket and set up listener for updates
    chatService.onConversationUpdate(() => {
      console.log('[ChatList] Received conversation update. Refetching chats...');
      fetchChats(); // Refetch chats when an update is received
    });

    // Cleanup on unmount
    return () => {
      console.log('[ChatList] useEffect cleanup. Disconnecting socket.');
      // Optional: Disconnect socket if ChatList is the only place using it,
      // or manage connection globally if needed elsewhere.
      // chatService.disconnectSocket();
    };
  }, [fetchChats]); // Depend on the memoized fetchChats function

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'الأمس';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('ar-SA', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <NavBar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">المحادثات</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
            {error}
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">لا توجد محادثات</h2>
            <p className="text-gray-600 mb-4">لم تبدأ أي محادثات بعد</p>
            <Link to="/advisor" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              تحدث مع مستشار
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <Link 
                    to={`/chat/${chat.id}`}
                    className="block hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center p-4 sm:px-6">
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 px-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {chat.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{formatDate(chat.lastMessageTime)}</span>
                        </div>
                        {chat.unreadCount > 0 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatList;