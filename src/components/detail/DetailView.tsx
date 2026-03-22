import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Tag, Link2, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { NetworkGraph } from './NetworkGraph';

export const DetailView = () => {
  const { selectedDocId, documents, setViewState } = useStore();
  const doc = documents.find(d => d.id === selectedDocId);

  if (!doc) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full w-full"
    >
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-8 py-6">
        <button 
          onClick={() => setViewState('home')}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          返回列表
        </button>

        <h1 className="text-3xl font-bold text-text mb-6 leading-tight">
          {doc.title}
        </h1>
        
        <div className="prose prose-invert prose-p:text-text-muted prose-headings:text-text max-w-none">
          {doc.content?.split('\n').map((para, i) => (
            <p key={i} className="mb-4 leading-relaxed text-[15px]">{para}</p>
          ))}
          
          {/* Mock longer content for scroll demonstration */}
          <p className="mt-8 text-text-muted leading-relaxed">
            （以下为示例内容）通过数据分析发现，用户在核心转化路径上的流失率高达 45%。为了解决这一问题，我们需要引入更加智能的触点干预机制。特别是在用户犹豫期，通过大模型实时分析用户意图，并推送个性化的干预卡片，有望将转化率提升 15% 以上。
          </p>
          <div className="my-8 p-6 rounded-xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-primary flex items-center gap-2 mt-0 mb-3">
              <Sparkles className="w-5 h-5" />
              核心结论
            </h3>
            <p className="mb-0 text-text">
              1. 转化率提升的关键在于缩短用户的决策链路。<br/>
              2. 知识库与问答系统的结合能够有效减少信息差。
            </p>
          </div>
        </div>
      </div>

      {/* Right Info Area */}
      <div className="w-[320px] shrink-0 border-l border-border pl-6 py-6 overflow-y-auto space-y-8">
        
        {/* Network Graph */}
        <section>
          <h3 className="text-sm font-medium text-text mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            局部关系图谱
          </h3>
          <NetworkGraph />
        </section>

        {/* Metadata */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-text mb-3">元信息</h3>
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Calendar className="w-4 h-4" />
            更新于 {doc.updatedAt}
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            {doc.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface border border-border text-xs text-text-muted hover:text-primary hover:border-primary/50 cursor-pointer transition-colors">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Suggested Relations */}
        <section>
          <h3 className="text-sm font-medium text-text mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            候选关联推荐
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-surface border border-border hover:border-primary/50 transition-all cursor-pointer group">
              <div className="text-sm text-text mb-1 group-hover:text-primary transition-colors">2026 Q1 OKR 制定过程</div>
              <div className="text-xs text-text-muted flex justify-between items-center">
                <span>基于语义相似度推荐</span>
                <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">确认连接</button>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Suggested Questions */}
        <section>
          <h3 className="text-sm font-medium text-text mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            AI 推荐问题
          </h3>
          <div className="space-y-2">
            {['这篇文档的核心风险点是什么？', '与上一季度的规划有何区别？'].map((q, i) => (
              <button key={i} className="w-full text-left p-3 rounded-lg bg-surface-hover text-sm text-text-muted hover:text-text hover:bg-primary/10 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};
