import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, History, BookOpen } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/assistant', label: '场景分析工作台', icon: Bot },
    { path: '/history', label: '分析记录', icon: History },
    { path: '/knowledge-base', label: '知识与模板管理', icon: BookOpen },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-slate-200 shadow-sm flex flex-col z-10">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Touchpoint AI</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1.5 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                    : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
