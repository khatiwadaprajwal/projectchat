import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Users, Circle, User as UserIcon } from 'lucide-react';

const Chat = () => {
  const { socket, onlineCount } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/chat/messages');
        setMessages(res.data.data);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('send_message', { content: input });
    setInput('');
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-5xl mx-auto md:p-4 transition-all">
      {/* Chat Container */}
      <div className="flex flex-col flex-1 bg-white md:rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <Users size={20} />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-bold text-slate-800">Global Community</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Circle size={8} className="fill-green-500 text-green-500" />
                {onlineCount} Members Online
              </div>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <p className="text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMe = msg.senderId === user._id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold 
                    ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {msg.senderName.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Bubble */}
                  <div className="flex flex-col">
                    {!isMe && (
                      <span className="text-[11px] font-semibold text-slate-500 ml-1 mb-1">
                        {msg.senderName}
                      </span>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl shadow-sm relative 
                      ${isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                      <span className={`text-[10px] block mt-1 opacity-70 text-right`}>
                        {formatTime(msg.createdAt || new Date())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <form onSubmit={sendMessage} className="flex gap-2 max-w-4xl mx-auto">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-100 border-none px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm transition-all"
              placeholder="Type a message..."
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;