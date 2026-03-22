import { motion } from 'framer-motion';

export const NetworkGraph = () => {
  const nodes = [
    { id: 0, x: 150, y: 120, title: '当前文档', isCenter: true },
    { id: 1, x: 60, y: 60, title: '用户访谈录音' },
    { id: 2, x: 240, y: 60, title: '转化率分析报告' },
    { id: 3, x: 250, y: 180, title: '竞品动态' },
    { id: 4, x: 50, y: 180, title: 'Q1 OKR 设定' },
    { id: 5, x: 150, y: 40, title: '技术架构图' },
    { id: 6, x: 150, y: 220, title: 'AB测试方案' },
  ];

  const edges = [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 0, target: 5 },
    { source: 0, target: 6 },
    { source: 1, target: 4 },
    { source: 2, target: 6 },
  ];

  return (
    <div className="w-full h-[260px] relative bg-surface/50 rounded-xl border border-border overflow-hidden">
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        {edges.map((edge, i) => {
          const source = nodes[edge.source];
          const target = nodes[edge.target];
          return (
            <motion.line
              key={i}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="var(--color-primary)"
              strokeWidth="1.5"
            />
          );
        })}
      </svg>
      
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1, type: "spring" }}
          whileHover={{ scale: 1.1, zIndex: 10 }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: node.x, top: node.y }}
        >
          <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
            node.isCenter 
              ? 'bg-primary shadow-[0_0_15px_rgba(50,205,50,0.8)]' 
              : 'bg-primary/50 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(50,205,50,0.5)] transition-all'
          }`} />
          <div className="text-[10px] text-text-muted group-hover:text-text whitespace-nowrap text-center bg-background/80 px-1 rounded backdrop-blur-sm">
            {node.title}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
