import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Globe, Send, Activity, Terminal, ShieldAlert, Cpu } from 'lucide-react';
import { Candidate, ChannelItem } from '../types.js';

interface SmartRouteModalProps {
  selectedCandidate: Candidate;
  setSelectedId: (id: string | null) => void;
  getRadarPath: (metrics: any) => string;
  channelsList: ChannelItem[];
  selectedChannelsForDispatch: string[];
  setSelectedChannelsForDispatch: React.Dispatch<React.SetStateAction<string[]>>;
  handleDispatchCandidate: (id: string) => void;
  isDispatching: boolean;
}

export default function SmartRouteModal({
  selectedCandidate,
  setSelectedId,
  getRadarPath,
  channelsList,
  selectedChannelsForDispatch,
  setSelectedChannelsForDispatch,
  handleDispatchCandidate,
  isDispatching,
}: SmartRouteModalProps) {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedId(null)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.96, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 15, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="bg-[#16161a] text-white w-full max-w-4xl rounded-3xl p-6 border border-white/10 z-10 shadow-2xl relative overflow-y-auto max-h-[90vh] grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedId(null)}
          className="absolute top-4.5 right-4.5 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title Header */}
        <div className="md:col-span-12 border-b border-white/[0.06] pb-3 flex justify-between items-center pr-10 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[#C45524] animate-pulse" />
            <span className="font-extrabold text-[#C45524]">
              🔍 AI 智能多维度契合分析报告
            </span>
          </div>
          <span className="text-white/40 hidden sm:inline">状态：推荐对齐完毕，可随时下发投递</span>
        </div>

        {/* LH Column: Talent summary, metrics chart and contact (Span 5) */}
        <div className="md:col-span-5 space-y-4">
          
          {/* 1. Brief Card */}
          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex gap-3.5 items-start text-xs">
            <img
              alt={selectedCandidate.name}
              src={selectedCandidate.avatar}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover object-top border border-white/10 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-white leading-tight">{selectedCandidate.name}</h3>
                <span className="text-[10px] font-bold bg-[#C45524]/15 text-[#C45524] px-1.5 py-0.5 rounded border border-[#C45524]/20">
                  {selectedCandidate.channel}
                </span>
              </div>
              <p className="text-xs text-white/65 mt-1">{selectedCandidate.role}</p>
              <p className="text-[10.5px] text-[#C45524] truncate mt-1">{selectedCandidate.email || 'alex.rivers@telegram.dev'}</p>
            </div>
          </div>

          {/* 2. Concentric Radar analysis */}
          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-4 text-xs">
            <h4 className="text-[11px] font-bold text-white/50">
              📊 个人综合能力模型评估
            </h4>
            
            <div className="flex items-center justify-between gap-4">
              {/* SVG spiderweb coordinates */}
              <div className="w-24 h-24 shrink-0 relative bg-black/40 rounded-full border border-white/5 flex items-center justify-center select-none">
                <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />
                  
                  <line x1="50" y1="10" x2="50" y2="90" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />
                  <line x1="10" y1="50" x2="90" y2="50" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />
                  
                  <polygon 
                    points={getRadarPath(selectedCandidate.metrics)} 
                    fill="rgba(196, 85, 36, 0.15)"
                    stroke="#C45524" 
                    strokeWidth="1.5"
                  />
                </svg>

                <span className="absolute -top-1 text-[8px] text-white/50">技术</span>
                <span className="absolute -bottom-1 text-[8px] text-white/50">业务</span>
                <span className="absolute -left-1.5 text-[8px] text-white/50">效率</span>
                <span className="absolute -right-1.5 text-[8px] text-white/50">沟通</span>
              </div>

              {/* Breakdown sliders indicators */}
              <div className="flex-1 space-y-2 text-[10px]">
                <div>
                  <div className="flex justify-between text-[9px] mb-0.5 text-white/50">
                    <span>💻 专业技术契合度</span>
                    <span className="font-bold text-white">{selectedCandidate.metrics?.tech || 85}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-sm overflow-hidden">
                    <div className="bg-[#C45524] h-full" style={{ width: `${selectedCandidate.metrics?.tech || 85}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5 text-white/50">
                    <span>🤝 业务理解深度</span>
                    <span className="font-bold text-white">{selectedCandidate.metrics?.culture || 80}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-sm overflow-hidden">
                    <div className="bg-[#C45524] h-full" style={{ width: `${selectedCandidate.metrics?.culture || 80}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] mb-0.5 text-white/50">
                    <span>⚡ 交付与协作效率</span>
                    <span className="font-bold text-white">{selectedCandidate.metrics?.speed || 90}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-sm overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${selectedCandidate.metrics?.speed || 90}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Status indication */}
          <div className="bg-[#C45524]/10 border border-[#C45524]/20 p-3.5 rounded-xl space-y-1 text-xs">
            <h4 className="font-bold text-[#C45524] uppercase tracking-wider flex items-center gap-1 select-none">
              <Globe className="w-3.5 h-3.5" />
              <span>🎯 智能匹配分析建议</span>
            </h4>
            <p className="text-white/80 leading-relaxed mt-1">
              {selectedCandidate.status}
            </p>
          </div>

        </div>

        {/* RH Column: Deep Resume Details, Markdown text translation and connection targets (Span 7) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* 1. Deep Bio details */}
          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-1.5 text-xs">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              📄 个人优质亮点摘要 (Refined Summary)
            </h4>
            <p className="text-white/80 leading-relaxed font-sans mt-1">{selectedCandidate.bio || '暂无进一步披露信息'}</p>
          </div>

          {/* 2. Standard skills check list tag */}
          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-1.5 text-xs">
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              👀 掌握的绝活特长 (Key Capabilities)
            </h4>
            <p className="text-xs text-[#C45524] font-medium leading-relaxed bg-[#C45524]/10 p-2.5 rounded-lg border border-[#C45524]/20 break-all">
              {selectedCandidate.jobProfile || 'Go, Kubernetes, GRPC'}
            </p>
          </div>

          {/* 3. Direct Route output checkboxes config */}
          <div className="bg-[#121214] p-4 rounded-xl border border-white/10 space-y-3 text-xs">
            <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-wider">
              选择推送投递的好去处 (Referral Target Channels)
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              {channelsList.map(ch => (
                <label
                  key={ch.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                    selectedChannelsForDispatch.includes(ch.id)
                      ? 'bg-[#C45524]/15 border-[#C45524] text-white font-bold'
                      : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={selectedChannelsForDispatch.includes(ch.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedChannelsForDispatch(prev => [...prev, ch.id]);
                        } else {
                          setSelectedChannelsForDispatch(prev => prev.filter(id => id !== ch.id));
                        }
                      }}
                      className="w-3.5 h-3.5 rounded text-[#C45524] border-white/10 focus:ring-0 cursor-pointer shrink-0"
                    />
                    <span className="truncate">{ch.name}</span>
                  </div>
                  <span className="text-[8px] bg-white/5 px-1 rounded text-white/30 scale-90 uppercase shrink-0">
                    {ch.type}
                  </span>
                </label>
              ))}
            </div>

            {/* Real dispatch broadcast executor trigger */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-4">
              <div>
                <p className="text-white/40 text-[9px] uppercase leading-none font-bold">综合预估契合分</p>
                <p className="text-[#C45524] text-2xl font-black mt-2 leading-none">{selectedCandidate.matchScore}%</p>
              </div>

              <button
                onClick={() => handleDispatchCandidate(selectedCandidate.id)}
                disabled={isDispatching}
                className="flex-1 py-3.5 bg-[#C45524] hover:bg-white hover:text-[#121214] text-white text-xs font-black rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#C45524]/10 disabled:opacity-50 select-none uppercase tracking-wider"
              >
                {isDispatching ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>投递推送中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>🚀 一键极速直达推介</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}
