import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { KnowledgeList } from '../components/KnowledgeList';
import type { KnowledgeItem } from '../components/KnowledgeList';
import { AddKnowledgeModal } from '../components/AddKnowledgeModal';
import type { AddKnowledgeData } from '../components/AddKnowledgeModal';

const INITIAL_DATA: KnowledgeItem[] = [
  {
    id: '1',
    name: '全局券复盘模板 - 领券门槛评估',
    type: '业务知识库',
    description: '沉淀全局券实验复盘的标准口径，包括触达门槛、转化链路与预算影响的评估要点。',
    larkLink: 'https://feishu.cn/docs/sample1',
    lastUpdated: '2025-02-18'
  },
  {
    id: '2',
    name: '全局券复盘知识 - 弹窗时机优化',
    type: '分析思路',
    description: '整理弹窗时机实验的节奏与指标口径，覆盖曝光、领取、核销与订单提升的拆解逻辑。',
    larkLink: 'https://feishu.cn/docs/sample2',
    lastUpdated: '2025-02-12'
  }
];

const KnowledgeBase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'业务知识库' | '分析思路'>('业务知识库');
  const [items, setItems] = useState<KnowledgeItem[]>(INITIAL_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddKnowledge = (data: AddKnowledgeData) => {
    setItems((prev) => [data, ...prev]);
  };

  const filteredItems = items.filter((item) => item.type === activeTab);

  return (
    <div className="h-full flex flex-col p-6 bg-gray-50/50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">知识与模板管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          新增知识与模板
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('业务知识库')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === '业务知识库'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          业务知识库
        </button>
        <button
          onClick={() => setActiveTab('分析思路')}
          className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === '分析思路'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          分析思路
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <KnowledgeList items={filteredItems} />
      </div>

      {/* Modal */}
      <AddKnowledgeModal
        isOpen={isModalOpen}
        defaultType={activeTab}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddKnowledge}
      />
    </div>
  );
};

export default KnowledgeBase;
