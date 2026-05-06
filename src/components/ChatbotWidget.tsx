import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { chatWithGemini } from '../lib/gemini';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Chào bạn! Tôi là trợ lý AI của EduGate. Tôi có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history if logged in
  useEffect(() => {
    if (!auth.currentUser) return;

    const chatPath = `users/${auth.currentUser.uid}/chats`;
    const q = query(
      collection(db, chatPath),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => ({
        role: doc.data().role,
        text: doc.data().text
      })) as Message[];
      
      if (history.length > 0) {
        setMessages(history);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, chatPath);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Save user message to Firestore if authenticated
    if (auth.currentUser) {
      const chatPath = `users/${auth.currentUser.uid}/chats`;
      try {
        await addDoc(collection(db, chatPath), {
          text: userMessage.text,
          role: userMessage.role,
          timestamp: serverTimestamp(),
          userId: auth.currentUser.uid
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, chatPath);
      }
    }

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithGemini(input, history);
    const modelMessage: Message = { role: 'model', text: response || '' };
    
    setMessages(prev => [...prev, modelMessage]);
    setIsTyping(false);

    // Save model response to Firestore if authenticated
    if (auth.currentUser) {
      const chatPath = `users/${auth.currentUser.uid}/chats`;
      try {
        await addDoc(collection(db, chatPath), {
          text: modelMessage.text,
          role: modelMessage.role,
          timestamp: serverTimestamp(),
          userId: auth.currentUser.uid
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, chatPath);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-ai-900 p-5 text-white flex items-center justify-between border-b border-indigo-800">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md animate-pulse">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase tracking-widest">Trợ lý EduGate</h4>
                  <p className="text-[9px] text-blue-300 font-black uppercase tracking-tighter">Hệ thống AI thông minh</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-xl text-[12px] leading-relaxed font-medium shadow-sm border ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none' 
                      : 'bg-white text-slate-700 border-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-xl rounded-tl-none border border-slate-200 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi AI về bài giảng, lịch học..."
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder-slate-400"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-ai-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all group border border-white/10"
      >
        <MessageSquare className={`h-6 w-6 transition-all ${isOpen ? 'rotate-90 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'}`} />
        <X className={`absolute h-6 w-6 transition-all ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}`} />
      </button>
    </div>
  );
}
