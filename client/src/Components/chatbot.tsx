import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios'; 

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Internshala assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const message = inputMessage.trim();
    if (!message) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {

      const response = await axios.post('https://internshala-b8sn.onrender.com/chat', {
        message: message
      });

      const botReply: Message = {
        id: messages.length + 2,
        text: response.data.reply || "Sorry, I couldn't process that.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botReply]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Something went wrong while fetching the response.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col w-full h-full max-w-sm rounded-xl overflow-hidden shadow-lg border bg-white">

      <div className="bg-blue-600 text-white text-center p-4">
        <div className="mx-auto w-12 h-12 bg-white text-blue-600 flex items-center justify-center rounded-full font-bold text-lg mb-2">
          I
        </div>
        <h5 className="font-semibold">Internshala Assistant</h5>
      </div>

      {/* Chat Area */}
      <div
        ref={chatAreaRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-50"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="mb-3 flex justify-start">
            <div className="p-3 rounded-2xl text-sm bg-white border text-gray-800 max-w-[75%] italic">
              Typing...
            </div>
          </div>
        )}
      </div>


      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-full text-sm outline-none"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-3 rounded-2xl text-sm ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-white border text-gray-800'
        }`}
        style={{ maxWidth: '75%' }}
      >
        {message.text}
      </div>
    </div>
  );
}
