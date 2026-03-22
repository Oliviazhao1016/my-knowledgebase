import React from 'react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { viewState, isAssistantOpen } = useStore();

  return (
    <div className="min-h-screen bg-background text-text flex overflow-hidden">
      {/* Dynamic Left Sidebar for Chat/Detail State */}
      <AnimatePresence>
        {viewState !== 'home' && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen border-r border-border bg-surface shrink-0"
          >
            {/* Sidebar content to be implemented */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto w-full p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Right Assistant/Info Sidebar */}
      <AnimatePresence>
        {isAssistantOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-screen border-l border-border bg-surface shrink-0"
          >
            {/* Assistant content to be implemented */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
