import React, { useState } from 'react';
import { RefreshCw, CheckCircle, ExternalLink, FileText } from 'lucide-react';

export interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  description: string;
  larkLink?: string;
  lastUpdated?: string;
}

interface KnowledgeListProps {
  items: KnowledgeItem[];
}

export const KnowledgeList: React.FC<KnowledgeListProps> = ({ items }) => {
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSync = (id: string, name: string) => {
    setSyncingIds((prev) => new Set(prev).add(id));
    
    // Mock sync process
    setTimeout(() => {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast(`同步成功 "${name}"`);
    }, 1500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p>暂无知识库内容。</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Mock Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50 transition-opacity">
          <CheckCircle size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isSyncing = syncingIds.has(item.id);
          
          return (
            <div 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 
                  className="font-semibold text-lg text-gray-900 line-clamp-1 flex-1 pr-2" 
                  title={item.name}
                >
                  {item.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 shrink-0">
                  {item.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                {item.description}
              </p>
              
              <div className="flex flex-col space-y-3 mt-auto border-t border-gray-100 pt-4">
                {item.larkLink && (
                  <a 
                    href={item.larkLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center w-fit"
                  >
                    <ExternalLink size={14} className="mr-1.5" />
                    查看飞书文档
                  </a>
                )}
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {item.lastUpdated ? `最近更新时间: ${item.lastUpdated}` : '最近更新时间: 暂无'}
                  </span>
                  
                  <button
                    onClick={() => handleSync(item.id, item.name)}
                    disabled={isSyncing}
                    className={`flex items-center text-sm px-3 py-1.5 rounded-md transition-colors font-medium ${
                      isSyncing 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    <RefreshCw 
                      size={14} 
                      className={`mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} 
                    />
                    {isSyncing ? '同步中...' : '一键同步'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
