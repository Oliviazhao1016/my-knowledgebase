import React from 'react';
import { Send, Activity } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAreaProps {
  messages: Message[];
  inputText: string;
  onInputChange: (text: string) => void;
  onSend: () => void;
  onAnalyze?: () => void;
  hideMessages?: boolean;
  hideAnalyzeButton?: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputText,
  onInputChange,
  onSend,
  onAnalyze,
  hideMessages = false,
  hideAnalyzeButton = false,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {!hideMessages && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                <Activity className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-medium">暂无消息，请开始对话！</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="p-4 bg-white border-t border-slate-200 z-10 mt-auto">
        <div className="flex items-end gap-3 max-w-4xl mx-auto w-full">
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="输入您的问题或选择下方模版..."
            className="flex-1 max-h-32 min-h-[52px] p-3.5 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 focus:bg-white shadow-sm placeholder:text-slate-400"
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={!inputText.trim()}
            className="p-3.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-md active:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex-shrink-0"
            title="发送"
          >
            <Send className="w-5 h-5" />
          </button>
          {!hideAnalyzeButton && onAnalyze && (
            <button
              onClick={onAnalyze}
              className="flex items-center gap-2 px-5 py-3.5 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:shadow-md active:from-purple-800 active:to-indigo-800 transition-all flex-shrink-0 shadow-sm"
              title="分析"
            >
              <Activity className="w-5 h-5" />
              <span className="font-semibold text-sm tracking-wide">分析</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
