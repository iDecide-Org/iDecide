import React, { useState } from "react";
import { MessageSquare, Send, User, Bot } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      isBot: true,
      timestamp: "12:00 PM",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = (text: string) => {
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

    setTimeout(() => {
      const botResponse: Message = {
        id: newMessage.id + 1,
        text: "Thanks for your message! I'm a demo chatbot, so I can only respond with this preset message.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Chat Bot</h1>
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
                      ? "bg-gray-100 rounded-tl-none"
                      : "bg-blue-500 text-white rounded-tr-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 p-4 border-t bg-white"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
