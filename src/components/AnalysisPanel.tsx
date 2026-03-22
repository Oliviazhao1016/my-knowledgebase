import React, { useState } from 'react';

type TabType = 'doc' | 'data' | 'logic';

interface AnalysisPanelProps {
  showExpiredNotice?: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  showExpiredNotice = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('doc');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'doc', label: '产出的分析 Doc' },
    { id: 'data', label: '数据来源' },
    { id: 'logic', label: '采用的分析思路' },
  ];

  return (
    <div className="flex flex-col h-full bg-white z-10 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-blue-700 bg-white shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {showExpiredNotice && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
            当前结果已过期，请重新提交分析以获取最新内容。
          </div>
        )}
        {activeTab === 'doc' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">实验分析报告</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p><strong>实验名称：</strong> 结账流程优化（V1 vs 对照组）</p>
              <p><strong>实验目的：</strong> 通过简化结账步骤，提高转化率和整体 GMV。</p>
              
              <h3 className="text-lg font-medium text-gray-800 mt-4">关键发现</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>最优组：</strong> V1（简化结账流程）</li>
                <li><strong>GMV 影响：</strong> <span className="text-green-600 font-semibold">+0.72%</span> 整体增长</li>
                <li><strong>转化率：</strong> 从 4.2% 提升至 4.8%</li>
                <li><strong>流失率：</strong> 支付环节流失率降低 15%</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-4">建议</h3>
              <div className="p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 mt-2">
                将 V1 推广至 100% 用户。简化的结账流程显著降低了摩擦，实现了转化率和 GMV 的可观增长，且未对客单价产生负面影响。
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'data' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">数据来源与指标</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">核心指标</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li><strong>商品交易总额 (GMV)：</strong> 120万美元 (对照组) vs 121万美元 (V1)</li>
                  <li><strong>结账转化率：</strong> 4.2% (对照组) vs 4.8% (V1)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">次要指标</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li><strong>客单价 (AOV)：</strong> 85.50美元 (对照组) vs 85.20美元 (V1) - 无统计学显著差异</li>
                  <li><strong>结账耗时：</strong> 120秒 (对照组) vs 85秒 (V1)</li>
                </ul>
              </div>
              <p className="text-sm text-gray-500 italic mt-4">
                * 数据收集期为14天，流量按50/50分配。达到95%置信水平的统计显著性。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'logic' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">分析思路</h2>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <strong className="text-blue-600 block mb-1">步骤 1: 数据校验</strong>
                <p className="text-sm text-gray-600">验证样本比例偏差 (SRM)。流量分配比例为 50.01% / 49.99%，表明流量分配无偏差。</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <strong className="text-blue-600 block mb-1">步骤 2: 指标计算</strong>
                <p className="text-sm text-gray-600">使用标准归因窗口 (1天点击，7天浏览) 计算两组的 GMV 和转化率。</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <strong className="text-blue-600 block mb-1">步骤 3: 统计检验</strong>
                <p className="text-sm text-gray-600">对连续指标 (GMV, AOV) 应用双样本 T 检验，对分类指标 (转化率) 应用卡方检验。GMV 提升 (+0.72%) p值 &lt; 0.05。</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <strong className="text-blue-600 block mb-1">步骤 4: 结论生成</strong>
                <p className="text-sm text-gray-600">将数据综合为最终建议，基于积极且统计显著的核心指标，推广 V1 版本。</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
