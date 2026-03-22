import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Plus, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';

export const InputArea = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setViewState, addChatMessage, setAssistantLoading } = useStore();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      // 添加到全局文档列表中
      if (data.file_id) {
        useStore.getState().addDocument({
          id: data.file_id,
          title: data.title || file.name,
          type: 'file',
          summary: '新上传的知识文件',
          tags: ['上传'],
          updatedAt: new Date().toISOString().split('T')[0],
          relationCount: 0,
          content: ''
        });
      }
      
      // Navigate to chat view to show result
      setViewState('chat');
      
      addChatMessage({
        id: Date.now().toString(),
        role: 'user',
        content: `上传了文件: ${file.name}`
      });

      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || `文件 ${file.name} 已成功解析并存入知识库！提取到的标题为：【${data.title}】`
      });
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setViewState('chat');
      addChatMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: `文件 ${file.name} 上传失败，请检查后端服务是否正常。`
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    });
    setInputValue('');
    setViewState('chat');
    
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
    <div className="w-full max-w-3xl mx-auto mb-16 flex flex-col gap-6">
      {/* 独立的建立新知识组件 */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-end relative w-40 ml-auto h-12"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".txt,.md,.pdf,.doc,.docx"
        />
        {/* 背景炫彩光晕 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none" />
        
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 flex items-center justify-center gap-2 bg-surface border border-primary/30 rounded-xl font-medium text-text hover:bg-surface-hover hover:border-primary hover:shadow-[0_0_20px_rgba(50,205,50,0.3)] transition-all duration-300 group disabled:opacity-50 overflow-hidden w-full h-full"
        >
          {/* 按钮内部扫光效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          
          <div className="p-1 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(50,205,50,0.2)]">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </div>
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 group-hover:from-white group-hover:to-primary transition-all duration-300">
            {isUploading ? '上传解析中...' : '建立新知识'}
          </span>
        </button>
      </motion.div>

      {/* 对话输入框 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative"
      >
        {/* Background glow effect */}
        <div 
          className={cn(
            "absolute -inset-1 rounded-2xl blur-xl opacity-30 transition-all duration-700 pointer-events-none",
            isFocused ? "bg-gradient-to-r from-primary via-blue-500 to-purple-500 opacity-50" : "bg-primary/20"
          )}
        />
        
        <div className="relative bg-surface border border-border rounded-2xl p-2 shadow-2xl backdrop-blur-xl flex items-end">
          <form onSubmit={handleSubmit} className="flex-1 flex items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="今天，你想知道什么？或者发送内容让 AI 帮你判断..."
              className="w-full bg-transparent text-lg text-text placeholder-text-muted px-4 py-4 max-h-48 min-h-[60px] focus:outline-none resize-none"
              rows={1}
            />
            
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="m-2 p-3 bg-primary text-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:pointer-events-none hover:shadow-[0_0_20px_rgba(50,205,50,0.4)] shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
