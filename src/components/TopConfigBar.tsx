import React from 'react';
import { Upload, Calendar, CheckCircle2 } from 'lucide-react';

const TopConfigBar: React.FC = () => {
  const [isUploaded, setIsUploaded] = React.useState(false);

  const handleUpload = () => {
    setIsUploaded(true);
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border-b border-slate-200 shadow-sm relative z-0">
      <h2 className="text-base font-bold text-slate-800">实验配置</h2>
      
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {/* 实验和实验组挨在一起 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="experiment-id" className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              实验 ID:
            </label>
            <input
              id="experiment-id"
              type="text"
              placeholder="输入实验 ID"
              className="w-32 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="group-id" className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              实验组 ID:
            </label>
            <select
              id="group-id"
              className="w-32 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm bg-white text-slate-700"
            >
              <option value="">全选</option>
              <option value="control">对照组</option>
              <option value="treatment">实验组</option>
            </select>
          </div>
        </div>

        {/* 实验背景和上传文档挨在一起 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            实验背景:
          </label>
          {isUploaded ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>PRD_v1.2.docx (解析成功)</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md transition-all"
            >
              <Upload className="w-4 h-4" />
              点击上传文档
            </button>
          )}
        </div>

        {/* 数据时间 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            数据时间:
          </label>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-all"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            请选择时间范围
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopConfigBar;
