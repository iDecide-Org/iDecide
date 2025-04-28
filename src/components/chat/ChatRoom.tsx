import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { chatService, Message } from "../../services/chatService";
import { Send, ArrowLeft, User, Bot } from "lucide-react";
import NavBar from "../NavBar";
import Footer from "../Footer";

// Function to create a consistent room name
const getRoomName = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join("-");
};

const ChatRoom: React.FC = () => {
  const { userId: otherUserId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactName, setContactName] = useState("المستخدم");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentRoom = useRef<string | null>(null);

  // Fetch initial messages and contact info
  const fetchInitialData = useCallback(async () => {
    if (!otherUserId || !currentUser) return;
    setIsLoading(true);
    setError("");
    try {
      console.log(
        `[ChatRoom] Fetching initial messages for user ${otherUserId}`
      );
      // Fetch messages - ensure senderId and receiverId are populated

      const fetchedMessages = await chatService.getMessages(otherUserId);

      console.log("[ChatRoom] Fetched messages:", fetchedMessages); // Log fetched messages
      setMessages(fetchedMessages);

      // Attempt to find contact name
      try {
        const contacts = await chatService.getChatUsers();
        const contact = contacts.find((c) => c.id === otherUserId);
        if (contact) {
          setContactName(contact.name);
        }
      } catch (contactError) {
        console.warn(
          "[ChatRoom] Could not fetch contact list to get name:",
          contactError
        );
      }

      // Mark messages as read
      await chatService.markMessagesAsRead(otherUserId);
    } catch (err) {
      console.error("[ChatRoom] Error fetching initial data:", err);
      setError("فشل في تحميل الرسائل. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  }, [otherUserId, currentUser]);

  // Effect for initial data load, socket connection, room joining/leaving
  useEffect(() => {
    if (!otherUserId || !currentUser) return;

    console.log(
      "[ChatRoom] useEffect triggered for load, socket, and room management."
    );
    fetchInitialData();

    // Define the room name
    const roomName = getRoomName(currentUser.id, otherUserId);

    currentRoom.current = roomName;
    console.log(`[ChatRoom] Joining room: ${roomName}`);
    chatService.joinRoom(roomName);

    // Set up listener for new messages
    const cleanupListener = chatService.onReceiveMessage(
      (newMessage: Message) => {
        console.log("[ChatRoom] Received new message via socket:", newMessage); // Log 1: Is message received?

        // Ensure newMessage has valid senderId and receiverId before proceeding
        if (!newMessage || !newMessage.senderId || !newMessage.receiverId) {
          console.error(
            "[ChatRoom] Received invalid message object:",
            newMessage
          );
          return;
        }

        // Check if the message belongs to the current conversation room
        const messageRoom = getRoomName(
          newMessage.senderId,
          newMessage.receiverId
        );
        console.log(
          "[ChatRoom] Calculated messageRoom from received message:",
          messageRoom
        ); // Log 2: What is the room from message?
        console.log("[ChatRoom] Current component room:", currentRoom.current); // Log 3: What is the expected room?

        if (messageRoom === currentRoom.current) {
          console.log(
            "[ChatRoom] Message belongs to current room. Updating state."
          ); // Log 4: Room matches
          setMessages((prevMessages) => {
            // Avoid adding duplicate temporary messages if backend confirms quickly
            if (prevMessages.some((msg) => msg.id === newMessage.id)) {
              console.log(
                "[ChatRoom] Duplicate message ID detected, skipping state update."
              );
              return prevMessages;
            }
            return [...prevMessages, newMessage];
          });
          // If the current user received the message, mark it as read
          if (
            newMessage.receiverId === currentUser?.id &&
            newMessage.senderId === otherUserId
          ) {
            console.log(
              "[ChatRoom] Message received by current user. Marking as read."
            );
            // Debounce or delay this slightly if needed
            chatService.markMessagesAsRead(otherUserId);
          }
        } else {
          console.warn(
            // Log 5: Why was it ignored?
            `[ChatRoom] Received message for different room (${messageRoom}), expecting (${currentRoom.current}). Ignoring.`
          );
        }
      }
    );

    // Cleanup on unmount or when users change
    return () => {
      if (currentRoom.current) {
        console.log(`[ChatRoom] Leaving room: ${currentRoom.current}`);
        chatService.leaveRoom(currentRoom.current);
        currentRoom.current = null;
      }
      // Cleanup the specific listener instance
      if (cleanupListener) {
        cleanupListener();
        console.log("[ChatRoom] Cleaned up receiveMessage listener.");
      }
      console.log("[ChatRoom] useEffect cleanup finished.");
    };
  }, [fetchInitialData, otherUserId, currentUser]); // Rerun if users change

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    // Make async
    e.preventDefault();
    if (!input.trim() || !otherUserId || !currentUser) return;

    console.log(
      `[ChatRoom] Attempting to send message to ${otherUserId}: ${input}`
    );

    // Optimistic UI update (remains the same)
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: otherUserId,
      content: input,
      timestamp: new Date().toISOString(),
      read: false,
      senderName: currentUser.name,
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    const messageContent = input; // Store input before clearing
    setInput(""); // Clear input field immediately

    try {
      // Use the HTTP postMessage function from the service
      await chatService.postMessage(otherUserId, messageContent);
      console.log("[ChatRoom] Message posted successfully via HTTP.");
      // No need to manually add the message again here, the WebSocket listener will handle it
      // when the backend broadcasts the saved message.
    } catch (error) {
      console.error("[ChatRoom] Error sending message via HTTP:", error);
      setError("فشل في إرسال الرسالة.");
      // Optional: Remove the optimistic message if sending failed
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      // Optional: Restore the input field
      // setInput(messageContent);
    }
  };

  // --- Rendering Logic --- (Mostly unchanged, verify senderId check)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto bg-white shadow-lg rounded-b-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold">{contactName}</h1>
          </div>
          <Link
            to="/chat"
            className="text-white hover:bg-blue-700 p-2 rounded-full"
          >
            <ArrowLeft size={24} />
          </Link>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 pt-10">
              ابدأ المحادثة...
            </div>
          ) : (
            messages.map((message) => {
              // CRITICAL FIX: Ensure currentUser.id is compared correctly
              const isCurrentUserSender = message.senderId === currentUser?.id;
              console.log("this current sender ", isCurrentUserSender);

              // console.log(`Message ID: ${message.id}, Sender ID: ${message.senderId}, Current User ID: ${currentUser?.id}, Is Sender: ${isCurrentUserSender}`); // Debug log
              return (
                <div
                  key={message.id} // Use message.id which should be unique
                  className={`flex gap-3 ${
                    isCurrentUserSender ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      isCurrentUserSender ? "bg-purple-100" : "bg-blue-100"
                    }`}
                  >
                    {isCurrentUserSender ? (
                      <User size={18} className="text-purple-600" />
                    ) : (
                      <Bot size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div
                    className={`flex flex-col max-w-[75%] ${
                      isCurrentUserSender ? "items-end" : ""
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        isCurrentUserSender
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line break-words">
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 mt-1 px-1">
                      {new Date(message.timestamp).toLocaleTimeString("ar-SA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="flex gap-2 p-4 border-t bg-white"
        >
          <button
            type="submit"
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send size={20} className="rotate-180" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
          />
        </form>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default ChatRoom;
