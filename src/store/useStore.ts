import { create } from 'zustand';

export type AppState = 'home' | 'chat' | 'detail';

export interface Document {
  id: string;
  title: string;
  type: 'file' | 'link' | 'text';
  summary: string;
  tags: string[];
  updatedAt: string;
  relationCount: number;
  content?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: { id: string; text: string; docId: string }[];
}

interface KnowledgeStore {
  viewState: AppState;
  setViewState: (state: AppState) => void;
  
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  
  selectedDocId: string | null;
  setSelectedDocId: (id: string | null) => void;
  
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  
  isAssistantLoading: boolean;
  setAssistantLoading: (loading: boolean) => void;
  
  isAssistantOpen: boolean;
  setAssistantOpen: (open: boolean) => void;
}

export const useStore = create<KnowledgeStore>((set) => ({
  viewState: 'home',
  setViewState: (state) => set({ viewState: state }),
  
  documents: [
    {
      id: '1',
      title: '2026 Q1 产品规划',
      type: 'file',
      summary: '包含用户增长与留存的核心策略。',
      tags: ['PRD', '规划'],
      updatedAt: '2026-03-22',
      relationCount: 3,
      content: '这里是关于 2026 Q1 产品规划的详细内容。核心在于提升转化率，并引入基于大模型的智能助手...'
    },
    {
      id: '2',
      title: '关于 RAG 架构优化的灵感',
      type: 'text',
      summary: '可以通过重排和知识图谱增强检索。',
      tags: ['技术', '灵感'],
      updatedAt: '2026-03-21',
      relationCount: 1,
      content: '昨天看到一篇文章，提到利用 Graph RAG 可以有效解决复杂多跳推理问题。我们需要在后续版本中引入知识图谱。'
    },
    {
      id: '3',
      title: '竞品分析：Notion AI',
      type: 'link',
      summary: '深入分析 Notion AI 在文档写作中的交互设计。',
      tags: ['竞品', '调研'],
      updatedAt: '2026-03-20',
      relationCount: 5,
      content: '来源：https://example.com\n\nNotion AI 的核心优势在于极简的触发方式，空格键即可唤出...'
    }
  ],
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  
  selectedDocId: null,
  setSelectedDocId: (id) => set({ selectedDocId: id, viewState: id ? 'detail' : 'home' }),
  
  chatMessages: [
    {
      id: 'init',
      role: 'assistant',
      content: '你好！我是你的知识库助手。有什么我可以帮你的？'
    }
  ],
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  
  isAssistantLoading: false,
  setAssistantLoading: (loading) => set({ isAssistantLoading: loading }),
  
  isAssistantOpen: true,
  setAssistantOpen: (open) => set({ isAssistantOpen: open }),
}));
