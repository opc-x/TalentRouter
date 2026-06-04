import React from 'react';
import { Briefcase, Plus, Trash2, Sparkles, Activity } from 'lucide-react';
import { JobProfile } from '../types.js';
import { getJobTags } from '../utils.js';

interface JobProfilesListProps {
  jobProfiles: JobProfile[];
  setJobProfiles: React.Dispatch<React.SetStateAction<JobProfile[]>>;
  setSelectedJobId: (id: string) => void;
  handleExecuteEngineMatch: (id: string) => void;
  setShowAddJobModal: (show: boolean) => void;
  triggerToast: (text: string, type: 'success' | 'error' | 'info') => void;
  dispatchActivityLog: any[];
  loginRole: 'employer' | 'seeker';
}

export default function JobProfilesList({
  jobProfiles,
  setJobProfiles,
  setSelectedJobId,
  handleExecuteEngineMatch,
  setShowAddJobModal,
  triggerToast,
  dispatchActivityLog,
  loginRole,
}: JobProfilesListProps) {
  
  const isEmployer = loginRole === 'employer';

  return (
    <div id="job_profiles_list_container" className="bg-gradient-to-br from-white to-orange-50/10 text-slate-800 p-6 rounded-3xl border-2 border-orange-100 shadow-md space-y-6 relative overflow-hidden flex-1 self-stretch">
      <div className="absolute top-0 left-0 w-40 h-40 bg-orange-300/5 rounded-full blur-2xl pointer-events-none" />

      <div className="border-b-2 border-orange-100 pb-4 flex justify-between items-center z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <span className="text-[10.5px] tracking-wider text-orange-600 uppercase font-black">
              🔥 智能能力匹配矩阵轴
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {isEmployer ? "在招职位管理中心" : "智能核心技术栈机会匹配大厅"}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {isEmployer 
              ? "自适应设置各象限权重，精细化计算技术人才并产生分发日志" 
              : "基于核心技术栈多维能力对齐建模：无需繁琐申请，一键自动对齐您的能力细节与岗位核心指标"}
          </p>
        </div>

        {isEmployer && (
          <button
            id="add_job_profile_btn"
            onClick={() => setShowAddJobModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 hover:scale-105 hover:shadow-md text-white rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition-all shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增在招岗位</span>
          </button>
        )}
      </div>

      {/* Active jobs listing */}
      <div className="space-y-4 z-10 relative">
        {jobProfiles.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border-2 border-dashed border-orange-100">
            {isEmployer 
              ? "暂无在招岗位发布，点击上方按钮新增！" 
              : "暂无发布中的内推机会职位。"}
          </div>
        ) : (
          jobProfiles.map(job => (
            <div 
              id={`job_profile_item_${job.id}`}
              key={job.id}
              className="bg-white p-5 rounded-2xl border-2 border-orange-100/60 space-y-4 relative group hover:border-orange-400 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start text-xs">
                <div>
                  <h4 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block animate-pulse shrink-0"></span>
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    要求资历: <span className="text-orange-600 font-bold">{job.experienceYearsRequired} 年以上核心经验</span>
                  </p>
                </div>
                
                {isEmployer && (
                  <button
                    id={`delete_job_btn_${job.id}`}
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/job-profiles/${job.id}`, { method: 'DELETE' });
                        if (res.ok) {
                          setJobProfiles(prev => prev.filter(j => j.id !== job.id));
                          triggerToast('在招岗位描述已安全下架！', 'success');
                        }
                      } catch (err) {
                        triggerToast('岗位移除失败', 'error');
                      }
                    }}
                    className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100"
                    title="移除岗位"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-3 bg-orange-50/40 rounded-xl border border-orange-100/60 text-xs text-slate-700 break-all leading-relaxed font-mono">
                <span className="text-orange-600 font-bold">🎯 核心技能必检: </span> {job.skills}
              </div>

              {/* Dynamic Portrait Tags or Sliders depending on perspective */}
              {!isEmployer ? (
                <div className="space-y-2 pt-2.5 border-t border-orange-100">
                  <div className="text-[11px] text-slate-500 font-black flex items-center gap-1 select-none">
                    <span>🏷️ 智能职位画像标签:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {getJobTags(job).map((tag, idx) => {
                      const colors = [
                        'bg-orange-500/10 text-orange-700 border-orange-500/20',
                        'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
                        'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
                        'bg-indigo-500/10 text-indigo-700 border-indigo-500/20'
                      ];
                      const colorClass = colors[idx % colors.length];
                      return (
                        <span 
                          key={tag} 
                          className={`text-[10.5px] px-2.5 py-1 rounded-lg border font-bold ${colorClass}`}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Sliders for Match weights inside Employer/Admin Portal view */
                <div className="grid grid-cols-2 gap-4 text-xs pt-2.5 border-t border-orange-100">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1.5 font-bold">
                      <span>技术能力权重:</span>
                      <span className="font-extrabold text-orange-600">{job.techWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={job.techWeight}
                      onChange={async (e) => {
                        const val = Number(e.target.value);
                        setJobProfiles(prev => prev.map(j => j.id === job.id ? { ...j, techWeight: val } : j));
                      }}
                      className="w-full shrink h-1 accent-orange-500 cursor-pointer bg-slate-200 rounded-sm"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1.5 font-bold">
                      <span>综合素质权重:</span>
                      <span className="font-extrabold text-orange-600">{job.cultureWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={job.cultureWeight}
                      onChange={async (e) => {
                        const val = Number(e.target.value);
                        setJobProfiles(prev => prev.map(j => j.id === job.id ? { ...j, cultureWeight: val } : j));
                      }}
                      className="w-full shrink h-1 accent-orange-500 cursor-pointer bg-slate-200 rounded-sm"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-orange-50/60 mt-1">
                <span className="text-slate-400">
                  {isEmployer ? "⚙️ 自定义推荐偏好比重" : "✨ AI 契合度极速评估引擎已就绪"}
                </span>
                <button
                  onClick={() => {
                    setSelectedJobId(job.id);
                    handleExecuteEngineMatch(job.id);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 via-rose-400 to-amber-500 text-white hover:shadow-md text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                >
                  <span className="text-xs">⚡</span>
                  <span>{isEmployer ? "全库极速重匹配" : "🔥 测算我的契合度"}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Operational Logs Telemetries Feed */}
      {isEmployer && (
        <div className="bg-white p-4 rounded-2xl border-2 border-orange-100/80 space-y-3 z-10 relative">
          <h4 className="text-xs font-black flex items-center gap-1.5 border-b border-orange-100 pb-2 text-slate-700">
            <span>📊</span>
            <span>内推分流实时状态日志 (Referral Pipeline Logs)</span>
          </h4>
          
          <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar">
            {dispatchActivityLog.length === 0 ? (
              <p className="text-[10px] text-slate-400 text-center py-4">暂无数据推荐通知日志。</p>
            ) : (
              dispatchActivityLog.map(act => (
                <div key={act.id} className="p-3 border border-orange-100 bg-orange-50/10 rounded-xl text-xs flex justify-between items-center gap-2 font-mono">
                  <div className="min-w-0">
                    <p className="font-extrabold text-slate-800">{act.candidateName}</p>
                    <p className="text-slate-500 text-[10.5px] truncate mt-0.5 font-sans">
                      分发至信道: <span className="font-bold text-orange-600">{act.channel}</span> • 契合度系数: <span className="font-bold text-emerald-600">{act.score}%</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold font-sans">SENT</span>
                    <span className="text-[9.5px] text-slate-400 block mt-1">{act.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
