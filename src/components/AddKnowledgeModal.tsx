import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface AddKnowledgeData {
  id: string;
  name: string;
  larkLink: string;
  type: string;
  description: string;
  lastUpdated: string;
}

interface AddKnowledgeModalProps {
  isOpen: boolean;
  defaultType: string;
  onClose: () => void;
  onSave: (data: AddKnowledgeData) => void;
}

export const AddKnowledgeModal: React.FC<AddKnowledgeModalProps> = ({
  isOpen,
  defaultType,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [larkLink, setLarkLink] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      name,
      larkLink,
      type: defaultType,
      description,
      lastUpdated: new Date().toLocaleDateString()
    });
    setName('');
    setLarkLink('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden m-4 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">新增知识与模板</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">知识名称</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="例如：Q1 营销策略"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">飞书文档链接</label>
            <input 
              type="url" 
              value={larkLink}
              onChange={(e) => setLarkLink(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="https://your-domain.feishu.cn/docs/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">适用场景描述</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="简要描述知识内容..."
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors shadow-sm"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={!name.trim() || !larkLink.trim()}
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};
