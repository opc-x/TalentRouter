import React from 'react';
import { Compass } from 'lucide-react';
import { Candidate, JobProfile, ChannelItem } from '../types.js';
import { getJobTags } from '../utils.js';

interface SearchDashboardProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  jobProfiles: JobProfile[];
  candidates: Candidate[];
  channelsList: ChannelItem[];
  filteredCandidates: Candidate[];
  setSelectedId: (id: string) => void;
  handleExecuteEngineMatch: (jobId: string) => void;
  loginRole: 'employer' | 'seeker';
}

export default function SearchDashboard({
  searchQuery,
  setSearchQuery,
  selectedJobId,
  setSelectedJobId,
  jobProfiles,
  candidates,
  channelsList,
  filteredCandidates,
  setSelectedId,
  handleExecuteEngineMatch,
  loginRole,
}: SearchDashboardProps) {
  const isEmployer = loginRole === 'employer';

  // Instant tags helper for searching
  const quickSearchTags = ['All', 'Go', 'Rust', 'Kubernetes', 'AI', 'TypeScript', 'Singapore', 'Slack'];

  // Under unified search: filter jobs & channels
  const filteredJobs = jobProfiles.filter(j => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.skills.toLowerCase().includes(q);
  });

  return (
    <div id="search_dashboard_wrapper" className="bg-gradient-to-br from-white to-orange-50/20 text-slate-800 p-6 rounded-3xl border-2 border-orange-100 shadow-md relative overflow-hidden">
      {/* Background Grid Style Overlay with Warm Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] pointer-events-none" />
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-yellow-300/10 rounded-full blur-xl pointer-events-none" />
      
      {/* Search Header Block */}
      <div className="flex justify-between items-center text-xs text-slate-500 mb-5 border-b-2 border-orange-100 pb-4">
        <div className="flex items-center gap-2 font-black text-slate-800">
          <span className="text-sm">🧭</span>
          <span>全域最顶尖技术栈索引 & 黄金内推直达通道</span>
        </div>
        <div className="text-[11px] text-orange-600 font-extrabold flex items-center gap-1">
          <span className="animate-pulse">●</span>
          <span>大吉大利: 462 个热门职位精细匹配通道就绪！</span>
        </div>
      </div>

      {/* Main Vector / Neural looking search frame */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-4.5 top-4.5 text-orange-500">
            <span className="text-xl inline-block animate-spin-slow">✨</span>
          </div>
          
          <input
            id="neural_search_input"
            type="text"
            placeholder={
              isEmployer
                ? "输入技术栈或意向 (例如: Go / AI / 深圳)，一键锁定人才和推送节点..."
                : "输入您擅长的绝活或硬核技能 (例如: Go / Kubernetes / PyTorch)，即刻为您物色神级岗位！"
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white hover:bg-orange-50/30 focus:bg-white border-2 border-orange-100/80 rounded-2xl pl-13 pr-12 py-4.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all font-mono shadow-sm tracking-wide"
          />
          
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4.5 top-4 text-xl text-slate-400 hover:text-orange-500 font-black transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Dynamic Micro tag selectors for extreme low understanding cost */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-500 font-bold mr-1">🔥 热门绝活过滤:</span>
          {quickSearchTags.map(tag => {
            const isTagActive = tag === 'All' ? !searchQuery : searchQuery.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag === 'All' ? '' : tag)}
                className={`px-3 py-1.5 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                  isTagActive 
                    ? 'border-orange-500 bg-orange-500 text-white shadow-xs' 
                    : 'border-orange-100/60 bg-white text-slate-600 hover:bg-orange-50 hover:border-orange-200'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid view of matched opportunities, routes, and channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 mt-4 border-t-2 border-orange-100">
        
        {/* FULL WIDTH COLUMN: Human / Talent matched list */}
        <div className="lg:col-span-12 space-y-4">
          <div className="text-xs font-black text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 flex-wrap text-sm">
              {isEmployer ? "📌 AI智能推荐的闪客工程专家" : "💼 迎祥纳福 • 极速直通在招黄金岗位一览"}
              <span className="text-[10px] bg-red-500 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">
                {isEmployer ? filteredCandidates.length : filteredJobs.length} 项爆火在招
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
            {isEmployer ? (
              filteredCandidates.length === 0 ? (
                <div className="col-span-3 py-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  暂无符合当前搜索词的求职人才，请尝试更换其他关键词输入。
                </div>
              ) : (
                filteredCandidates.map(cand => {
                  const isHigh = cand.matchScore >= 85;
                  return (
                    <div
                      id={`cand_card_neural_${cand.id}`}
                      key={cand.id}
                      onClick={() => setSelectedId(cand.id)}
                      className="bg-white hover:bg-orange-50/10 p-4 rounded-2xl border-2 border-orange-100/65 hover:border-orange-400 hover:scale-[1.01] hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3 group animate-fadeIn"
                    >
                      <div className="flex gap-2.5 items-center min-w-0">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-top object-cover border-2 border-orange-100 shrink-0 shadow-xs"
                        />
                        <div className="min-w-0 text-xs">
                          <h4 className="text-slate-800 group-hover:text-orange-600 font-extrabold truncate transition-colors text-sm">
                            {cand.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{cand.role}</p>
                          <span className="text-[9.5px] bg-orange-100/50 text-orange-700 px-2 py-0.5 rounded-md block w-fit font-bold mt-1">经历 {cand.experienceYears} 年</span>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isHigh ? 'bg-emerald-500 text-white border border-emerald-600' : 'bg-orange-500 text-white border border-orange-600'
                        }`}>
                          契合度 {cand.matchScore}%
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1.5 max-w-[80px] truncate">📍 {cand.channel}</span>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              // Seeker Job search direct results
              filteredJobs.length === 0 ? (
                <div className="col-span-3 py-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  未匹配到相关岗位，您可以输入 Go, Rust, AWS 等检索词试试～
                </div>
              ) : (
              filteredJobs.map(job => (
                  <div
                    id={`job_card_neural_${job.id}`}
                    key={job.id}
                    className="bg-gradient-to-br from-red-50 to-amber-50/50 hover:from-amber-100/40 hover:to-red-100/40 p-4.5 rounded-2xl border-2 border-red-250 hover:border-amber-500 hover:shadow-xl transition-all flex flex-col justify-between gap-3 border-l-8 border-l-red-650 group cursor-pointer relative overflow-hidden"
                  >
                    {/* Golden ticket notch */}
                    <div className="absolute top-0 right-0 w-10 h-10 bg-amber-400 text-stone-900 rounded-bl-full flex items-center justify-center font-black text-[10px] pointer-events-none shadow-xs select-none">
                      🧧
                    </div>
                    <div>
                      <div className="flex justify-between items-start gap-2 pr-6">
                        <h4 className="text-sm text-stone-900 font-black group-hover:text-red-700 transition-colors line-clamp-1">
                          {job.title}
                        </h4>
                        <span className="text-[9px] text-red-600 bg-red-100/60 px-2 py-0.5 rounded-md border border-red-200/80 font-black shrink-0">
                          {job.experienceYearsRequired}年+ 黄金直聘
                        </span>
                      </div>

                      {/* Lucky Levels rating - Lottery Feeling */}
                      <div className="flex items-center gap-1.5 mt-1.5 select-none">
                        <span className="text-[10px] font-bold text-amber-600">匹配星运:</span>
                        <div className="text-[10px] tracking-widest text-amber-500 font-bold">
                          ⭐⭐⭐⭐⭐
                        </div>
                        <span className="text-[9px] bg-amber-400/20 text-amber-700 px-1 rounded font-black scale-90 uppercase">
                          吉
                        </span>
                      </div>
                      
                      {/* Dynamic portrait tags inside Search Dashboard cards */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {getJobTags(job).slice(0, 3).map((tag, idx) => {
                          const colors = [
                            'bg-red-500/10 text-red-700 border-red-500/20',
                            'bg-amber-500/10 text-amber-800 border-amber-500/20',
                            'bg-yellow-500/25 text-stone-900 border-yellow-500/30 font-black',
                          ];
                          return (
                            <span key={tag} className={`text-[9.5px] px-2 py-0.5 rounded-md border font-bold ${colors[idx % colors.length]}`}>
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
 
                    <div className="flex justify-between items-center pt-2.5 text-[10px] border-t border-red-100/60 mt-1">
                      <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                        <span>🍀</span>
                        <span>特等好运对齐中</span>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedJobId(job.id);
                          // Trigger matchmaking with celebratory vibe
                          handleExecuteEngineMatch(job.id);
                        }}
                        className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:scale-[1.03] text-white px-3 py-1.5 rounded-xl font-black cursor-pointer shadow-md hover:shadow-lg transition-transform active:scale-95 text-xs flex items-center gap-1"
                      >
                        <span>🎰</span>
                        <span>立即爆金测算</span>
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
 
      </div>
    </div>
  );
}
