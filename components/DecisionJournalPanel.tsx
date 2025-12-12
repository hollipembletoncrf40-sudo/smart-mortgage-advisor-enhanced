import React, { useState } from 'react';
import { 
  History, 
  Edit3, 
  Trash2, 
  BrainCircuit, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { DecisionSnapshot, InvestmentParams } from '../types';
import { marked } from 'marked';

interface Props {
  snapshots: DecisionSnapshot[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DecisionSnapshot>) => void;
  onanalyze: (snapshot: DecisionSnapshot) => void;
  onRestore: (params: InvestmentParams) => void;
  isAnalyzing: boolean;
  t: any;
}

const DecisionJournalPanel: React.FC<Props> = ({ 
  snapshots, 
  onDelete, 
  onUpdate, 
  onanalyze, 
  onRestore, 
  isAnalyzing,
  t 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(snapshots.length > 0 ? snapshots[0].id : null);
  const [editMode, setEditMode] = useState(false);
  
  const selectedSnapshot = snapshots.find(s => s.id === selectedId);

  if (snapshots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <History className="h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-lg font-bold mb-2">暂无决策记录</h3>
        <p className="text-sm text-center max-w-md">
          在上方点击 "保存当前决策" (Save Decision) 按钮，记录下您此刻的思考、放弃的选项以及市场判断。
          <br/>这将帮助您在未来复盘时，避免“事后诸葛亮”，真正提高决策质量。
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[600px] animate-fade-in">
      
      {/* Sidebar List */}
      <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 overflow-y-auto border border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2">
          <History className="h-4 w-4" /> 决策时间轴
        </h3>
        <div className="space-y-3">
          {snapshots.map(s => (
            <div 
              key={s.id}
              onClick={() => { setSelectedId(s.id); setEditMode(false); }}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedId === s.id ? 'bg-white dark:bg-slate-700 border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-slate-400">{new Date(s.timestamp).toLocaleDateString()}</span>
                {s.tags?.includes('High Risk') && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full">高风险</span>}
              </div>
              <div className="font-bold text-slate-800 dark:text-white text-sm mb-1 line-clamp-1">
                {s.userNotes || '未填写决策理由...'}
              </div>
              <div className="text-xs text-slate-500 flex gap-2">
                <span>总价: {s.params.totalPrice}万</span>
                <span>利率: {s.params.interestRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden shadow-sm">
        {selectedSnapshot ? (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
               <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     <Calendar className="h-5 w-5 text-indigo-500"/>
                     {new Date(selectedSnapshot.timestamp).toLocaleString()}
                  </h2>
                  <div className="text-xs text-slate-500 mt-1">Snapshot ID: {selectedSnapshot.id.slice(-6)}</div>
               </div>
               <div className="flex gap-2">
                  <button 
                    onClick={() => onRestore(selectedSnapshot.params)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors"
                  >
                    Load Params
                  </button>
                  <button 
                    onClick={() => onDelete(selectedSnapshot.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Snapshot Metrics */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                 <div>
                    <div className="text-xs text-slate-500 mb-1">房产总价</div>
                    <div className="font-mono font-bold">{selectedSnapshot.params.totalPrice}万</div>
                 </div>
                 <div>
                    <div className="text-xs text-slate-500 mb-1">首付比例</div>
                    <div className="font-mono font-bold">{selectedSnapshot.params.downPaymentRatio}%</div>
                 </div>
                 <div>
                    <div className="text-xs text-slate-500 mb-1">贷款利率</div>
                    <div className="font-mono font-bold">{selectedSnapshot.params.interestRate}%</div>
                 </div>
                 <div>
                    <div className="text-xs text-slate-500 mb-1">市场情绪</div>
                    <div className="font-mono font-bold">{selectedSnapshot.marketSentiment}%</div>
                 </div>
              </div>

              {/* User Reasoning */}
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 为什么做这个决定？
                    </h3>
                    {!editMode ? (
                      <button onClick={() => setEditMode(true)} className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
                        <Edit3 className="h-3 w-3" /> 编辑
                      </button>
                    ) : (
                      <button onClick={() => setEditMode(false)} className="text-xs text-emerald-500 hover:underline">
                        完成
                      </button>
                    )}
                 </div>
                 
                 {editMode ? (
                   <textarea
                     className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800 border border-indigo-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                     value={selectedSnapshot.userNotes}
                     onChange={(e) => onUpdate(selectedSnapshot.id, { userNotes: e.target.value })}
                     placeholder="记录你的核心理由，比如：学区房保值、急着结婚、担心踏空..."
                   />
                 ) : (
                   <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                     {selectedSnapshot.userNotes || <span className="text-slate-400 italic">暂无记录...</span>}
                   </div>
                 )}
              </div>

              {/* Rejected Options */}
              <div className="space-y-4">
                 <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-500" /> 我放弃了什么？（机会成本）
                 </h3>
                 {editMode ? (
                   <textarea
                     className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800 border border-indigo-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                     value={selectedSnapshot.rejectedOptions}
                     onChange={(e) => onUpdate(selectedSnapshot.id, { rejectedOptions: e.target.value })}
                     placeholder="比如：更远但更大的新房、继续租房买理财、老破小..."
                   />
                 ) : (
                   <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                     {selectedSnapshot.rejectedOptions || <span className="text-slate-400 italic">暂无记录...</span>}
                   </div>
                 )}
              </div>

              {/* AI Review Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                       <BrainCircuit className="h-5 w-5 text-indigo-600" /> AI 决策复盘
                    </h3>
                    <button 
                      onClick={() => onanalyze(selectedSnapshot)}
                      disabled={isAnalyzing}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isAnalyzing ? '分析中...' : '开始复盘分析'}
                    </button>
                 </div>
                 
                 {selectedSnapshot.aiFeedback ? (
                   <div className="bg-indigo-50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                         <div dangerouslySetInnerHTML={{ __html: marked.parse(selectedSnapshot.aiFeedback) }} />
                      </div>
                   </div>
                 ) : (
                   <div className="text-center py-8 text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      点击右上角按钮，让 AI 帮你检查决策盲点。<br/>
                      <span className="text-xs opacity-70">AI会分析你的理由是否感性、是否忽略了隐形成本、以及风险是否匹配。</span>
                   </div>
                 )}
              </div>

            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">Select a snapshot to view details</div>
        )}
      </div>
    </div>
  );
};

export default DecisionJournalPanel;
