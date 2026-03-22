import React, { useState } from 'react';
import TopConfigBar from '../components/TopConfigBar';
import TemplateSelector from '../components/TemplateSelector';
import type { TemplateItem, SceneId } from '../components/TemplateSelector';
import ChatArea from '../components/ChatArea';
import AnalysisPanel from '../components/AnalysisPanel';
import type { Message } from '../components/ChatArea';

type AnalysisRecord = {
  id: string;
  name: string;
  date: string;
  docLink: string;
  status: 'Completed';
  sceneLabel: string;
  templateLabel: string;
  analysisApproach: string;
  experimentId: string;
  dataTime: string;
  extraConcern?: string;
};

const HISTORY_STORAGE_KEY = 'marketing-analysis-history';

const readAnalysisHistory = (): AnalysisRecord[] => {
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

const writeAnalysisHistory = (records: AnalysisRecord[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(records));
};

const formatDateTime = (date: Date) =>
  date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const MarketingAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeScene, setActiveScene] = useState<SceneId>('review');
  const [experimentId, setExperimentId] = useState('');
  const [experimentBackground] = useState('');
  const [dataTime, setDataTime] = useState('');
  const [extraConcern, setExtraConcern] = useState('');
  const [hasAnalysisResult, setHasAnalysisResult] = useState(false);
  const [isResultExpired, setIsResultExpired] = useState(false);
  const [analysisApproach, setAnalysisApproach] = useState('待生成');
  const [latestAnalysis, setLatestAnalysis] = useState<AnalysisRecord | null>(null);
  const [currentTask, setCurrentTask] = useState<{
    sceneId: SceneId;
    sceneLabel: string;
    templateLabel: string;
  } | null>(null);

  // New state to manage layout transitions
  const [isChatStarted, setIsChatStarted] = useState(false);

  const analysisApproachMap: Record<SceneId, string> = {
    review: '实验复盘框架（指标-归因-建议）',
    spot: '点位对比拆解（曝光-转化-价值）',
    touchpoint: '场域触点路径分析（触达-互动-转化）',
  };

  const sceneTabs: Array<{ id: SceneId; label: string; shortLabel: string }> = [
    { id: 'review', label: '实验复盘分析（可用）', shortLabel: '实验复盘分析' },
    { id: 'spot', label: '点位对比分析（预留）', shortLabel: '点位对比分析' },
    { id: 'touchpoint', label: '场域触点分析（预留）', shortLabel: '场域触点分析' },
  ];

  const markResultExpired = () => {
    if (hasAnalysisResult) {
      setIsResultExpired(true);
    }
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    setInputText(template.text);
    setCurrentTask({
      sceneId: template.sceneId,
      sceneLabel: template.sceneLabel,
      templateLabel: template.label,
    });
    markResultExpired();
    // Do not auto-start chat on template select, just fill the input
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    markResultExpired();
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate assistant response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `好的，我已经收到了您的需求。请在左侧补充必要的实验配置参数，然后点击“提交分析”按钮，我将为您生成详细的分析报告。`,
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleSubmitAnalysis = () => {
    const approach = analysisApproachMap[activeScene];
    const sceneLabel =
      sceneTabs.find((tab) => tab.id === activeScene)?.shortLabel ?? '实验复盘分析';
    const templateLabel = currentTask?.templateLabel ?? '自定义分析';
    const now = new Date();
    const record: AnalysisRecord = {
      id: experimentId.trim(),
      name: `${sceneLabel} - ${templateLabel}`,
      date: formatDateTime(now),
      docLink: `https://feishu.cn/docs/${experimentId.trim() || 'analysis'}`,
      status: 'Completed',
      sceneLabel,
      templateLabel,
      analysisApproach: approach,
      experimentId: experimentId.trim(),
      dataTime: dataTime.trim(),
      extraConcern: extraConcern.trim(),
    };

    setHasAnalysisResult(true);
    setIsResultExpired(false);
    setAnalysisApproach(approach);
    setLatestAnalysis(record);
    const history = readAnalysisHistory();
    writeAnalysisHistory([record, ...history]);

    // Add a message indicating the analysis is ready
    const responseMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `我已完成分析。数据表明，最优组为 V1，GMV 提升了 +0.72%。您可以在右侧的面板中查看完整的分析文档和数据来源。`,
    };
    setMessages((prev) => [...prev, responseMessage]);
  };

  const handleAnalyze = () => {
    // In the new flow, the user clicks "生成分析文档" from the chat or the submit button.
    // The chat input "Analyze" button is removed in favor of the form submit.
  };

  const activeSceneLabel =
    sceneTabs.find((tab) => tab.id === activeScene)?.shortLabel ?? '实验复盘分析';
  const isSubmitDisabled =
    !experimentId.trim() || !experimentBackground.trim() || !dataTime.trim();
  const showExpiredNotice = hasAnalysisResult && isResultExpired;
  const displayedSceneLabel = hasAnalysisResult
    ? latestAnalysis?.sceneLabel ?? '暂无'
    : currentTask?.sceneLabel ?? '暂无';
  const displayedTemplateLabel = hasAnalysisResult
    ? latestAnalysis?.templateLabel ?? '自定义分析'
    : currentTask?.templateLabel ?? '请选择小模板';
  const displayedApproach = hasAnalysisResult
    ? latestAnalysis?.analysisApproach ?? analysisApproach
    : analysisApproach;
  const displayedExperimentId = hasAnalysisResult ? latestAnalysis?.experimentId ?? '暂无' : '暂无';
  const displayedDataTime = hasAnalysisResult ? latestAnalysis?.dataTime ?? '暂无' : '暂无';

  // Render Initial "Home" State
  if (!isChatStarted) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-8">
        <div className="max-w-4xl w-full flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">欢迎来到营销触点分析助手</h1>
            <p className="text-slate-500">请输入你想分析的问题，或从下方选择一个模板快速开始。</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-[300px]">
               {/* Just a spacer for the big input box feel */}
            </div>
            <ChatArea
              messages={[]}
              inputText={inputText}
              onInputChange={handleInputChange}
              onSend={handleSend}
              onAnalyze={handleAnalyze}
              hideMessages={true} // We'll add this prop
              hideAnalyzeButton={true}
            />
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-4 border-b border-slate-200 pb-2">
                {sceneTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScene(tab.id)}
                    className={`pb-2 text-sm font-medium transition-all ${
                      activeScene === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
             </div>
             <TemplateSelector onSelect={handleSelectTemplate} />
          </div>
        </div>
      </div>
    );
  }

  // Render "Chat Started" State
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="flex-1 overflow-hidden p-6 max-w-[1800px] mx-auto w-full">
        <div className="flex h-full gap-6">
          
          {/* Left Column: Chat and Context */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            
            {/* Top Config Bar appears here when chat starts */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm shrink-0">
               <TopConfigBar />
            </div>

            <div className="flex-1 min-h-0 overflow-hidden rounded-2xl shadow-sm border border-slate-200 bg-white">
              <ChatArea
                messages={messages}
                inputText={inputText}
                onInputChange={handleInputChange}
                onSend={handleSend}
                onAnalyze={handleAnalyze}
                hideAnalyzeButton={true}
              />
            </div>
            
            {/* Parameter Completion Area (Contextual) */}
            {!hasAnalysisResult && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shrink-0">
                <div className="text-sm font-semibold text-slate-700">参数补全 ({activeSceneLabel})</div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-sm font-medium text-slate-700">实验 ID</span>
                      <span className="text-red-500">必填</span>
                    </div>
                    <input
                      value={experimentId}
                      onChange={(event) => {
                        setExperimentId(event.target.value);
                        markResultExpired();
                      }}
                      placeholder="请输入实验 ID"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-sm font-medium text-slate-700">数据时间</span>
                      <span className="text-red-500">必填</span>
                    </div>
                    <input
                      value={dataTime}
                      onChange={(event) => {
                        setDataTime(event.target.value);
                        markResultExpired();
                      }}
                      placeholder="例如 2025-01-01 至 2025-01-14"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="text-sm font-medium text-slate-700">补充关注问题</span>
                      <span className="text-slate-400">可选</span>
                    </div>
                    <textarea
                      value={extraConcern}
                      onChange={(event) => {
                        setExtraConcern(event.target.value);
                        markResultExpired();
                      }}
                      placeholder="例如关注转化率/流失率"
                      rows={1}
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <button
                    disabled={isSubmitDisabled}
                    onClick={handleSubmitAnalysis}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    生成分析文档
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Analysis Results (Only visible after generation) */}
          {hasAnalysisResult && (
            <div className="w-[420px] shrink-0 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-700">任务信息</div>
                  {showExpiredNotice && (
                    <div className="rounded-lg border border-amber-200 bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                      结果已过期
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-500">当前识别场景 / 任务 / 思路</div>
                <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs text-slate-500">当前识别场景</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {displayedSceneLabel}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">当前识别任务</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {displayedTemplateLabel}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">当前采用思路</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {displayedApproach}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">实验 ID</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {displayedExperimentId}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">数据时间</div>
                  <div className="mt-1 text-sm font-semibold text-slate-700">
                    {displayedDataTime}
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <AnalysisPanel showExpiredNotice={showExpiredNotice} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingAssistant;
