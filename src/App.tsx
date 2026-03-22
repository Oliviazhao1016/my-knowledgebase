import { InputArea } from './components/home/InputArea';
import { KnowledgeList } from './components/home/KnowledgeList';
import { AssistantSidebar } from './components/assistant/AssistantSidebar';
import { useStore } from './store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

import { ChatView } from './components/chat/ChatView';
import { DetailView } from './components/detail/DetailView';
import { Menu } from 'lucide-react';

function App() {
  const { viewState, isAssistantOpen, setAssistantOpen } = useStore();

  return (
    <div className="min-h-screen bg-background text-text flex overflow-hidden">
      {/* Dynamic Left Sidebar for Chat/Detail State */}
      <AnimatePresence>
        {viewState !== 'home' && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen border-r border-border bg-surface shrink-0 flex flex-col"
          >
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-gradient">知识库</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 scale-90 origin-top">
               <KnowledgeList />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative">
        <main className="flex-1 overflow-y-auto">
          {viewState === 'home' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto w-full p-8 pt-20"
            >
              <InputArea />
              <KnowledgeList />
            </motion.div>
          )}
          
          {viewState === 'chat' && <ChatView />}
          {viewState === 'detail' && <DetailView />}
        </main>
      </div>

      {/* 侧边栏折叠后的 Icon (仅在 detail 页面，且侧边栏收起时显示) */}
      <AnimatePresence>
        {viewState === 'detail' && !isAssistantOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-4 top-4 z-50"
          >
            <button
              onClick={() => setAssistantOpen(true)}
              className="p-3 bg-surface/80 backdrop-blur-md border border-border rounded-xl text-text hover:text-primary hover:border-primary/50 transition-all shadow-lg group"
            >
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Assistant/Info Sidebar (仅在 detail 页面，且 isAssistantOpen 为 true 时展示) */}
      <AnimatePresence>
        {viewState === 'detail' && isAssistantOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen border-l border-border bg-surface shrink-0"
          >
            <AssistantSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
