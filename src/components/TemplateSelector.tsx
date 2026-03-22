import React from 'react';
import { BarChart2, TrendingUp, GitMerge } from 'lucide-react';

export type SceneId = 'review' | 'spot' | 'touchpoint';

export interface TemplateItem {
  id: string;
  label: string;
  text: string;
  icon: typeof BarChart2;
  sceneId: SceneId;
  sceneLabel: string;
}

interface TemplateSelectorProps {
  onSelect: (template: TemplateItem) => void;
}

const templates: TemplateItem[] = [
  {
    id: 'overall',
    label: '整体实验结果评估',
    text: '请评估实验的整体结果表现。',
    icon: BarChart2,
    sceneId: 'review',
    sceneLabel: '实验复盘分析',
  },
  {
    id: 'incremental',
    label: '增量收益来源分析',
    text: '请分析实验的增量收益来源。',
    icon: TrendingUp,
    sceneId: 'review',
    sceneLabel: '实验复盘分析',
  },
  {
    id: 'style-comparison',
    label: '不同 C 端样式表达对比',
    text: '请对比不同 C 端样式表达的效果差异。',
    icon: BarChart2,
    sceneId: 'touchpoint',
    sceneLabel: '场域触点分析',
  },
  {
    id: 'comparison',
    label: '点位对比分析',
    text: '请提供对照组和实验组之间的点位对比分析。',
    icon: GitMerge,
    sceneId: 'spot',
    sceneLabel: '点位对比分析',
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col gap-2 mb-2">
      <span className="text-sm font-semibold text-slate-700">小模板卡片</span>
      <span className="text-xs text-slate-500">点击后自动填充输入，并同步识别场景与任务</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className="group flex items-start gap-3 px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm transition-all duration-200 text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-700">{template.label}</span>
                <span className="text-xs text-slate-500">{template.sceneLabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
