import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, User, Bot } from "lucide-react";
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from "../contexts/useAuth"; // Import useAuth
import Cookies from 'js-cookie'; // Import js-cookie

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatResponse {
  response: string;
  recommended_college_majors?: string[];
  chatbot_completed: boolean; // Add the new field
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const { setIsStudentPendingChatbot, fetchUser } = useAuth(); // Get fetchUser

  useEffect(() => {
    // Initialize chat with first bot message
    setMessages([
      {
        id: 1,
        text: "أهلاً بك! ما هو اسمك الكامل؟",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatbotCompletion = async () => {
    try {
      // Call NestJS backend to update chatbot status
      const response = await axios.post(
        "http://localhost:3000/auth/chatbot-status",
        { status: true },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsStudentPendingChatbot(false); // Update context
        // Clear the chat_session cookie *AFTER* successful status update.
        Cookies.remove('chat_session'); // Remove the cookie
        await fetchUser(); // Refresh user data, setting isLoggedIn
        // Redirect immediately
        navigate("/");
      } else {
        console.error("Failed to update chatbot status:", response);
      }
    } catch (error) {
      console.error("Error updating chatbot status:", error);
    }
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);

    try {
      // Use axios for the request, and include withCredentials
      const response = await axios.post("http://localhost:8000/chat/", {
        message: text,
      }, {
        withCredentials: true, // Important for cookies!
      });

      const data: ChatResponse = response.data;  // Access data directly from response

      // Add bot response
      const botResponse: Message = {
        id: newMessage.id + 1,
        text: data.response,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botResponse]);

      // Handle recommended majors if present
      if (data.recommended_college_majors?.length) {
        const majorsMessage: Message = {
          id: botResponse.id + 1,
          text:
            "التخصصات الموصى بها:\n" +
            data.recommended_college_majors
              .map((major, index) => `${index + 1}. ${major}`)
              .join("\n"),
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, majorsMessage]);
      }
      // Check for chatbot completion and redirect
      if (data.chatbot_completed) {
        await handleChatbotCompletion(); // Call the completion handler
      }
    } catch (error) {
      console.error("Error:", error);
      // More specific error handling with axios
      let errorMessageText = "عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.";
      if (axios.isAxiosError(error)) { // Check if it's an Axios error
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              errorMessageText = `Error: ${error.response.status} - ${error.response.data.detail || "Server Error"}`; // Use server's detail if available
          } else if (error.request) {
              // The request was made but no response was received
              errorMessageText = "No response received from the server.";
          } else {
              // Something happened in setting up the request that triggered an Error
              errorMessageText = `Request setup error: ${error.message}`;
          }
      }

      const errorMessage: Message = {
        id: newMessage.id + 1,
        text: errorMessageText,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {" "}
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            <h1 className="text-xl font-semibold">المستشار التعليمي</h1>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.isBot ? "" : "flex-row-reverse"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? "bg-blue-100" : "bg-purple-100"
                  }`}
                >
                  {message.isBot ? (
                    <Bot size={18} className="text-blue-600" />
                  ) : (
                    <User size={18} className="text-purple-600" />
                  )}
                </div>
                <div
                  className={`flex flex-col max-w-[80%] ${
                    message.isBot ? "" : "items-end"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isBot
                        ? "bg-gray-400 rounded-tr-none"
                        : "bg-blue-500 text-white rounded-tl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 p-4 border-t bg-white"
          >
            <button
              type="submit"
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Send size={20} className="rotate-180" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-black focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;