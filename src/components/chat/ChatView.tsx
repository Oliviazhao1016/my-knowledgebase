import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, FileText, ChevronLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

export const ChatView = () => {
  const { chatMessages, addChatMessage, setViewState, setSelectedDocId, isAssistantLoading, setAssistantLoading } = useStore();
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

  const handleCitationClick = (docId: string) => {
    setSelectedDocId(docId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full w-full max-w-4xl mx-auto py-6 px-4"
    >
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setViewState('home')}
          className="p-2 hover:bg-surface rounded-xl text-text-muted transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-medium text-gradient">与知识库对话</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-2 pb-20">
        {chatMessages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' 
                ? "bg-gradient-to-br from-primary/30 to-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(50,205,50,0.2)]" 
                : "bg-surface-hover border border-border"
            )}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className={cn(
                "p-4 rounded-2xl text-[15px] leading-relaxed",
                msg.role === 'user' 
                  ? "bg-primary/10 border border-primary/20 text-text rounded-tr-none" 
                  : "bg-surface/80 backdrop-blur-md border border-border text-text rounded-tl-none shadow-lg"
              )}>
                {msg.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < msg.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.citations.map((cite) => (
                    <button
                      key={cite.id}
                      onClick={() => handleCitationClick(cite.docId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border/50 text-xs text-text-muted hover:text-primary hover:border-primary/50 transition-all hover:shadow-[0_0_10px_rgba(50,205,50,0.2)] group"
                    >
                      <FileText className="w-3 h-3 group-hover:text-primary transition-colors" />
                      <span className="truncate max-w-[150px]">{cite.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isAssistantLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%] mr-auto"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-surface-hover border border-border">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-4 rounded-2xl text-[15px] bg-surface/80 backdrop-blur-md border border-border text-text rounded-tl-none shadow-lg flex items-center gap-2">
              <div className="flex gap-1">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
              <span className="text-text-muted text-sm ml-2">正在检索并思考中...</span>
            </div>
          </motion.div>
        )}
        
        <div ref={endRef} />
      </div>

      <div className="absolute bottom-6 left-4 right-4 max-w-4xl mx-auto">
        <form onSubmit={handleSend} className="relative">
          {/* Background glow effect for chat input */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-50 pointer-events-none" />
          
          <div className="relative bg-surface/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="继续追问..."
              className="w-full bg-transparent text-text placeholder-text-muted px-4 py-4 max-h-32 min-h-[56px] focus:outline-none resize-none"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="m-2 p-2.5 bg-primary text-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_0_20px_rgba(50,205,50,0.4)]"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
