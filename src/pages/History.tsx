import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  date: string;
  docLink: string;
  status: 'Completed' | 'Running' | 'Failed';
}

const mockExperiments: Experiment[] = [
  {
    id: 'COUPON-2024-012',
    name: '全局券实验复盘 - A/B 领券门槛对比',
    date: '2024-12-03 10:30',
    docLink: 'https://feishu.cn/docs/global-coupon-review-01',
    status: 'Completed',
  },
  {
    id: 'COUPON-2024-015',
    name: '全局券实验复盘 - 弹窗时机优化',
    date: '2024-12-10 16:05',
    docLink: 'https://feishu.cn/docs/global-coupon-review-02',
    status: 'Completed',
  },
  {
    id: 'COUPON-2025-003',
    name: '全局券实验复盘 - 新客与老客分层策略',
    date: '2025-01-08 09:40',
    docLink: 'https://feishu.cn/docs/global-coupon-review-03',
    status: 'Running',
  },
  {
    id: 'COUPON-2025-006',
    name: '全局券实验复盘 - 低频客券包组合',
    date: '2025-01-21 14:20',
    docLink: 'https://feishu.cn/docs/global-coupon-review-04',
    status: 'Failed',
  },
];

const HISTORY_STORAGE_KEY = 'marketing-analysis-history';

const readHistory = (): Experiment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const History: React.FC = () => {
  const [experiments] = useState<Experiment[]>(() => readHistory());
  const displayedExperiments = experiments.length > 0 ? experiments : mockExperiments;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">历史分析记录</h1>
        <p className="text-gray-500 mt-2">查看和管理您过去的营销实验及分析记录。</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                实验名称
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                分析时间
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                分析报告链接
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedExperiments.map((exp) => (
              <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{exp.name}</span>
                    <span className="text-xs text-gray-500">{exp.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{exp.date}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exp.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : exp.status === 'Running'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {exp.status === 'Completed' ? '已完成' : exp.status === 'Running' ? '运行中' : '失败'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={exp.docLink}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    分析报告 <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
