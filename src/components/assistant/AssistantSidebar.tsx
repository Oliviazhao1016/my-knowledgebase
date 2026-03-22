import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const AssistantSidebar = () => {
  const { chatMessages, addChatMessage, viewState, setAssistantOpen, isAssistantLoading, setAssistantLoading } = useStore();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAssistantLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    });
    
    setInput('');

    // Call actual backend API
    setAssistantLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response_text,
        citations: data.citations
      });
    } catch (error) {
      console.error('Error fetching chat response:', error);
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，无法连接到后端服务，请检查网络或后端是否已启动。'
      });
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface/50 backdrop-blur-sm">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Bot className="w-5 h-5" />
          <span>知识助手</span>
        </div>
        <button 
          onClick={() => setAssistantOpen(false)}
          className="p-2 hover:bg-surface-hover rounded-lg text-text-muted hover:text-text transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={cn(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-primary/20 text-primary" : "bg-surface-hover border border-border"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-primary/10 border border-primary/20 text-text rounded-tr-none" 
                : "bg-surface-hover border border-border text-text rounded-tl-none"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        
        {isAssistantLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-[90%] mr-auto"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-surface-hover border border-border">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl text-sm bg-surface-hover border border-border text-text rounded-tl-none flex items-center gap-1">
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1 h-1 bg-primary rounded-full" />
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-primary rounded-full" />
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-primary rounded-full" />
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-surface">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="向助手提问..."
            className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
