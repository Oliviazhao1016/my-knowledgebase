import { motion } from 'framer-motion';
import { FileText, Link as LinkIcon, MessageSquare, Clock, Network } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';

const TypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'file': return <FileText className="w-5 h-5 text-blue-400" />;
    case 'link': return <LinkIcon className="w-5 h-5 text-purple-400" />;
    case 'text': return <MessageSquare className="w-5 h-5 text-primary" />;
    default: return <FileText className="w-5 h-5 text-gray-400" />;
  }
};

export const KnowledgeList = () => {
  const { documents, setSelectedDocId } = useStore();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gradient">最近知识</h2>
        <span className="text-sm text-text-muted">{documents.length} 条记录</span>
      </div>

      <div className="grid gap-4">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedDocId(doc.id)}
            className="cursor-pointer"
          >
            <Card className="flex items-start gap-4 p-4 hover:border-primary/50 transition-colors">
              <div className="p-3 rounded-xl bg-surface border border-border">
                <TypeIcon type={doc.type} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-text truncate mb-1">{doc.title}</h3>
                <p className="text-sm text-text-muted line-clamp-1 mb-3">{doc.summary}</p>
                
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {doc.updatedAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <Network className="w-3.5 h-3.5" />
                    {doc.relationCount} 个关联
                  </div>
                  <div className="flex gap-2 ml-auto">
                    {doc.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-surface-hover border border-border/50 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
