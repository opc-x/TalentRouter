import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Globe, Send, RotateCcw, ChevronRight, CheckCircle2, 
  X, AlertCircle, Sparkle, Pencil, RefreshCw, Terminal, 
  FileText, Sliders, Check, HelpCircle
} from 'lucide-react';
import { ChannelItem } from '../types.js';

interface TalentIntakeWorkshopProps {
  selectedTemplate: 'programmer' | 'ai_researcher' | 'solution_architect';
  setSelectedTemplate: (t: 'programmer' | 'ai_researcher' | 'solution_architect') => void;
  intakeForm: any;
  setIntakeForm: (f: any) => void;
  selectedNationality: string;
  setSelectedNationality: (n: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (l: string) => void;
  resumeTemplates: any;
  handleAIBeautifyResume: () => void;
  isBeautifying: boolean;
  beautifiedCandidate: any;
  channelsList: ChannelItem[];
  selectedChannelsForDispatch: string[];
  setSelectedChannelsForDispatch: React.Dispatch<React.SetStateAction<string[]>>;
  handleDispatchBeautifiedResume: () => void;
  isSaving: boolean;
  loginRole: 'employer' | 'seeker';
  setBeautifiedCandidate?: (c: any) => void;
}

export default function TalentIntakeWorkshop({
  selectedTemplate,
  setSelectedTemplate,
  intakeForm,
  setIntakeForm,
  selectedNationality,
  setSelectedNationality,
  selectedLanguage,
  setSelectedLanguage,
  resumeTemplates,
  handleAIBeautifyResume,
  isBeautifying,
  beautifiedCandidate,
  channelsList,
  selectedChannelsForDispatch,
  setSelectedChannelsForDispatch,
  handleDispatchBeautifiedResume,
  isSaving,
  loginRole,
  setBeautifiedCandidate,
}: TalentIntakeWorkshopProps) {
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [localBeautifyError, setLocalBeautifyError] = useState<string | null>(null);

  // Auto-advance to edit step when AI yields results
  useEffect(() => {
    if (beautifiedCandidate && currentStep === 2 && !isBeautifying) {
      setCurrentStep(3);
    }
  }, [beautifiedCandidate, isBeautifying]);

  const isEmployer = loginRole === 'employer';

  const handleStartWizard = () => {
    setIsWizardOpen(true);
    setCurrentStep(1);
    setFeedbackText('');
    setLocalBeautifyError(null);
  };

  const handleTriggerBeautify = async () => {
    setLocalBeautifyError(null);
    setCurrentStep(2);
    try {
      await handleAIBeautifyResume();
    } catch (err) {
      setLocalBeautifyError('AIGC 智能转换发生异常，请调整您的描述输入后再试');
      setCurrentStep(1);
    }
  };

  const handleIterateResumeWithAI = async () => {
    if (!feedbackText.trim()) return;
    setLocalBeautifyError(null);
    setCurrentStep(2);
    try {
      const res = await fetch('/api/resumes/beautify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: selectedTemplate,
          name: intakeForm.name,
          experienceYears: intakeForm.experienceYears,
          skills: intakeForm.skills,
          projects: intakeForm.bio,
          bio: intakeForm.bio,
          nationality: selectedNationality,
          language: selectedLanguage,
          feedback: feedbackText
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && setBeautifiedCandidate) {
          setBeautifiedCandidate({
            refinedName: data.refinedName,
            refinedTitle: data.refinedTitle,
            refinedSkills: data.refinedSkills,
            refinedExperience: data.refinedExperience,
            refinedBio: data.refinedBio,
            beautifiedMarkdown: data.beautifiedMarkdown,
            nationality: selectedNationality,
            language: selectedLanguage
          });
          setFeedbackText('');
          setCurrentStep(3);
        } else {
          setLocalBeautifyError('AI 迭代引擎返回错误，请更换您的补充词再试');
          setCurrentStep(3);
        }
      } else {
        setLocalBeautifyError('网络请求失败，AI 简历工坊暂时无法取得连接');
        setCurrentStep(3);
      }
    } catch (err) {
      setLocalBeautifyError('AIGC 重塑算力异常');
      setCurrentStep(3);
    }
  };

  const handleManualMarkdownChange = (newMarkdown: string) => {
    if (setBeautifiedCandidate && beautifiedCandidate) {
      setBeautifiedCandidate({
        ...beautifiedCandidate,
        beautifiedMarkdown: newMarkdown
      });
    }
  };

  const handleManualBioChange = (newBio: string) => {
    if (setBeautifiedCandidate && beautifiedCandidate) {
      setBeautifiedCandidate({
        ...beautifiedCandidate,
        refinedBio: newBio
      });
    }
  };

  const handleManualTitleChange = (newTitle: string) => {
    if (setBeautifiedCandidate && beautifiedCandidate) {
      setBeautifiedCandidate({
        ...beautifiedCandidate,
        refinedTitle: newTitle
      });
    }
  };

  const handleManualNameChange = (newName: string) => {
    if (setBeautifiedCandidate && beautifiedCandidate) {
      setBeautifiedCandidate({
        ...beautifiedCandidate,
        refinedName: newName
      });
    }
  };

  const handleFinalSubmit = async () => {
    try {
      await handleDispatchBeautifiedResume();
      setIsWizardOpen(false);
    } catch (err) {
      // handled
    }
  };

  return (
    <div id="talent_intake_section" className="bg-gradient-to-br from-white to-orange-50/15 text-slate-800 p-6 rounded-3xl border-2 border-orange-100 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      
      {/* Background radial glow with cheerful colors */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-250/10 rounded-full blur-3xl pointer-events-none" />

      {/* Futuristic clean status layout */}
      <div className="space-y-4 z-10">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎈</span>
          <span className="text-[10.5px] tracking-widest text-orange-600 uppercase font-black">
            AI 简历美化 & 福吉匹配中心 • 极速狂飙
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
            ✨ 原创神级简历一键包装 & 在招高薪秒连
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-lg font-medium">
            全自动帮您重新提炼、精美重构简历中的硬核成就，自动契合国内外技术大厂与优秀出海企业的考核标准。点击立即开始，10秒改出惊艳简历、抢占直通名额！
          </p>
        </div>

        {/* Dynamic Telemetries - zero understanding cost */}
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div className="p-3.5 bg-white rounded-2xl border-2 border-orange-100/60 text-[11px] font-bold shadow-xs">
            <span className="text-orange-600 font-black block text-sm">🧧 开门见喜</span>
            <span className="text-slate-500 block mt-1 font-medium">免除任何烦琐注册，一键即享</span>
          </div>
          <div className="p-3.5 bg-white rounded-2xl border-2 border-orange-100/60 text-[11px] font-bold shadow-xs">
            <span className="text-emerald-600 font-black block text-sm">🍀 锦鲤护体</span>
            <span className="text-slate-500 block mt-1 font-medium">深度契合职位标准，反馈概率飙升</span>
          </div>
        </div>
      </div>

      {/* Prominent CTA button */}
      <div className="pt-6 border-t-2 border-orange-100 mt-4 z-10">
        <button
          onClick={handleStartWizard}
          className="w-full py-4.5 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:scale-[1.01] hover:shadow-xl text-white text-xs font-black uppercase rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-orange-500/20 active:scale-95"
        >
          <span className="text-base animate-bounce">🧧</span>
          <span>立即免费升级：10秒智能升华简历 & 配对优质岗位</span>
          <ChevronRight className="w-4 h-4 animate-ping" />
        </button>
      </div>

      {/* DIALOG WIZARD OVERLAY */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWizardOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 15 }}
              className="bg-[#FDFBF7] text-slate-800 w-full max-w-5xl rounded-3xl overflow-hidden border-2 border-orange-100 shadow-2xl z-10 flex flex-col h-[85vh] max-h-[820px]"
            >
              
              {/* Wizard header banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 flex justify-between items-center shrink-0 border-b-2 border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl text-white shadow-md shadow-orange-500/10">
                    <span className="text-xl">🧧</span>
                  </div>
                  <div>
                    <h2 className="text-base tracking-tight font-black text-slate-900 flex items-center gap-1.5">
                      <span>祝君好运大开 • AI 专属简历精改重塑引擎</span>
                      <span className="text-orange-500">✨</span>
                    </h2>
                    <p className="text-[11px] text-orange-600 font-extrabold mt-1">
                      只需点击几下，AI 帮您提炼最能亮瞎HR双眼的职业事迹，并一键推送到多渠道求职群！
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWizardOpen(false)}
                  className="p-2 hover:bg-orange-100 rounded-full text-slate-400 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 font-black" />
                </button>
              </div>

              {/* Monospace Steps controller */}
              <div className="bg-white/80 px-6 py-3 border-b-2 border-orange-50 shrink-0 flex justify-between items-center gap-2 overflow-x-auto text-[11px] text-slate-500 font-bold">
                {[
                  { step: 1, title: '1. 快速载入/改写个人成就' },
                  { step: 2, title: '2. AIGC 独门绝活重构中' },
                  { step: 3, title: '3. 手工微调亮点与金句' },
                  { step: 4, title: '4. 选择直达渠道一键齐发' }
                ].map((s) => {
                  const isActive = currentStep === s.step;
                  const isCompleted = currentStep > s.step;
                  return (
                    <div 
                      key={s.step} 
                      className={`flex items-center gap-2 pr-2 ${
                        isActive ? 'text-orange-600 font-black scale-105 transition-transform' : isCompleted ? 'text-emerald-600' : ''
                      }`}
                    >
                      <span className={`w-5 h-5 flex items-center justify-center rounded-lg text-[10px] font-black ${
                        isActive 
                          ? 'bg-orange-500 text-white' 
                          : isCompleted 
                          ? 'bg-emerald-500 text-white shadow-xs' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {s.step}
                      </span>
                      <span className="truncate">{s.title}</span>
                      {s.step < 4 && <span className="text-slate-300">/</span>}
                    </div>
                  );
                })}
              </div>

              {/* Error HUD */}
              {localBeautifyError && (
                <div className="bg-rose-50 border-b border-rose-100 text-rose-800 px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shrink-0 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{localBeautifyError}</span>
                  <button 
                    onClick={() => setLocalBeautifyError(null)} 
                    className="ml-auto hover:underline font-bold text-[#C45524]"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {/* Interactive Workspace Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: LOAD TEMPLATE AND INPUT RESUME PROFILE */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 max-w-3xl mx-auto font-mono text-xs"
                    >
                      {/* One click template loader */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                          <FileText className="w-4 h-4 text-[#C45524]" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">一键套用优秀案例经历（也可以在下方直接手工录入并修改）</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTemplate('programmer');
                              setIntakeForm({
                                name: resumeTemplates.programmer.name,
                                role: resumeTemplates.programmer.role,
                                skills: resumeTemplates.programmer.skills,
                                experienceYears: resumeTemplates.programmer.experienceYears,
                                bio: resumeTemplates.programmer.bio,
                                channel: 'Telegram Bot'
                              });
                            }}
                            className={`p-3 rounded-xl border text-left space-y-1 block transition-all cursor-pointer ${
                              selectedTemplate === 'programmer'
                                ? 'bg-[#C45524]/10 border-[#C45524] text-slate-800 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="block font-black text-slate-800">{resumeTemplates.programmer.name}</span>
                            <span className="block text-[9.5px] text-slate-400 truncate">资深全栈开发专家</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTemplate('ai_researcher');
                              setIntakeForm({
                                name: resumeTemplates.ai_researcher.name,
                                role: resumeTemplates.ai_researcher.role,
                                skills: resumeTemplates.ai_researcher.skills,
                                experienceYears: resumeTemplates.ai_researcher.experienceYears,
                                bio: resumeTemplates.ai_researcher.bio,
                                channel: 'Telegram Bot'
                              });
                            }}
                            className={`p-3 rounded-xl border text-left space-y-1 block transition-all cursor-pointer ${
                              selectedTemplate === 'ai_researcher'
                                ? 'bg-[#C45524]/10 border-[#C45524] text-slate-800 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="block font-black text-slate-800">{resumeTemplates.ai_researcher.name}</span>
                            <span className="block text-[9.5px] text-slate-400 truncate">智能代理科学家</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTemplate('solution_architect');
                              setIntakeForm({
                                name: resumeTemplates.solution_architect.name,
                                role: resumeTemplates.solution_architect.role,
                                skills: resumeTemplates.solution_architect.skills,
                                experienceYears: resumeTemplates.solution_architect.experienceYears,
                                bio: resumeTemplates.solution_architect.bio,
                                channel: 'Telegram Bot'
                              });
                            }}
                            className={`p-3 rounded-xl border text-left space-y-1 block transition-all cursor-pointer ${
                              selectedTemplate === 'solution_architect'
                                ? 'bg-[#C45524]/10 border-[#C45524] text-slate-800 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="block font-black text-slate-800">{resumeTemplates.solution_architect.name}</span>
                            <span className="block text-[9.5px] text-slate-400 truncate">云解决方案专家</span>
                          </button>
                        </div>
                      </div>

                      {/* Manual Profile Fields */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10.5px] text-slate-600 mb-1.5 font-bold">您的名字/怎么称呼您</label>
                            <input
                              type="text"
                              value={intakeForm.name}
                              onChange={(e) => setIntakeForm({ ...intakeForm, name: e.target.value })}
                              className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#C45524] focus:ring-1 focus:ring-[#C45524]/30"
                            />
                          </div>
                          <div>
                            <label className="block text-[10.5px] text-slate-600 mb-1.5 font-bold">核心工作经历年限 (年)</label>
                            <input
                              type="number"
                              value={intakeForm.experienceYears}
                              onChange={(e) => setIntakeForm({ ...intakeForm, experienceYears: Number(e.target.value) })}
                              className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#C45524] focus:ring-1 focus:ring-[#C45524]/30"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10.5px] text-slate-600 mb-1.5 font-bold">期望岗位（如：资深全栈开发人员）</label>
                          <input
                            type="text"
                            value={intakeForm.role}
                            onChange={(e) => setIntakeForm({ ...intakeForm, role: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#C45524] focus:ring-1 focus:ring-[#C45524]/30"
                          />
                        </div>

                        <div>
                          <label className="block text-[10.5px] text-slate-600 mb-1.5 font-bold">掌握的核心语言/框架（如：Go, React, Docker）</label>
                          <input
                            type="text"
                            value={intakeForm.skills}
                            onChange={(e) => setIntakeForm({ ...intakeForm, skills: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#C45524] focus:ring-1 focus:ring-[#C45524]/30"
                          />
                        </div>

                        <div>
                          <label className="block text-[10.5px] text-slate-600 mb-1.5 font-bold">核心工作事迹/项目成就描述（AI 润色的数据基础）</label>
                          <textarea
                            rows={4}
                            value={intakeForm.bio}
                            onChange={(e) => setIntakeForm({ ...intakeForm, bio: e.target.value })}
                            className="w-full bg-white border border-slate-250 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-[#C45524] focus:ring-1 focus:ring-[#C45524]/30 leading-relaxed"
                            placeholder="简单写写您做过最强的系统设计、解决的业务成果或提升的核心指标..."
                          />
                        </div>

                        {/* Country / language parameters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">期望哪类企业的偏好风格</label>
                            <select
                              value={selectedNationality}
                              onChange={(e) => setSelectedNationality(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-850 cursor-pointer outline-none focus:border-[#C45524]"
                            >
                              <option value="Singapore 🇸🇬">新加坡/外资高成长企业偏好风格 (Singapore 🇸🇬)</option>
                              <option value="China 🇨🇳">国内高技术底座企业风格 (China 🇨🇳)</option>
                              <option value="Japan 🇯🇵">出海日本品质感企业风格 (Japan 🇯🇵)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">生成简历语言偏好</label>
                            <select
                              value={selectedLanguage}
                              onChange={(e) => setSelectedLanguage(e.target.value)}
                              className="w-full bg-white border border-slate-250 rounded-xl p-2.5 text-xs text-slate-850 cursor-pointer outline-none focus:border-[#C45524]"
                            >
                              <option value="zh">标准科技中文优化版</option>
                              <option value="en">大厂常用标准纯英文 (ATS Compliant)</option>
                              <option value="ja">日本商务日语敬语版</option>
                            </select>
                          </div>
                        </div>

                      </div>

                      {/* Action trigger */}
                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleTriggerBeautify}
                          className="px-7 py-3.5 bg-[#C45524] hover:bg-slate-900 text-white text-xs font-black uppercase rounded-xl transition-all cursor-pointer shadow flex items-center gap-2"
                        >
                          <span>🎨 开始 AI 智能重写与精密润色</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: AI REWRITE GENERATING HUD */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto font-mono text-center text-slate-700"
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-[#C45524] animate-spin w-20 h-20" />
                        <Sparkles className="w-8 h-8 text-[#C45524] animate-pulse" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-slate-800">AI 智能专家为您升级重写简历中</h4>
                        <p className="text-[10px] text-slate-500">
                          正在智能调整句式，翻译成目标行业或国家更青睐的标准表达...
                        </p>
                      </div>

                      <div className="w-full bg-white rounded-xl p-4 border border-slate-200 text-[11px] text-left text-slate-600 space-y-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>经历材料要素拆解分析完成 ✓</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>正在按目标要求深度定制偏好风格: {selectedNationality}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-3 h-3 text-[#C45524] animate-spin" />
                          <span>正在借助 Google AI 解析技术进行高级词汇重排...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: MANUAL ADJUSTMENT AND AI FEEDBACK LOOP ITERATOR */}
                  {currentStep === 3 && beautifiedCandidate && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch text-xs"
                    >
                      {/* Left: Tuning Panel & AI Chat Iteration */}
                      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Pencil className="w-4 h-4 text-[#C45524]" />
                            <h4 className="text-xs text-slate-800 uppercase tracking-wider font-extrabold">人工微调基本信息 (可直接修改)</h4>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1 font-bold">您的名字/姓名</label>
                              <input
                                type="text"
                                value={beautifiedCandidate.refinedName}
                                onChange={(e) => handleManualNameChange(e.target.value)}
                                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 outline-none focus:border-[#C45524]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1 font-bold">推荐的职业方向头衔</label>
                              <input
                                type="text"
                                value={beautifiedCandidate.refinedTitle}
                                onChange={(e) => handleManualTitleChange(e.target.value)}
                                className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-850 outline-none focus:border-[#C45524]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] text-slate-500 mb-1 font-bold">AI 提炼的个人亮点摘要 (可输入您的改动)</label>
                              <textarea
                                rows={4}
                                value={beautifiedCandidate.refinedBio}
                                onChange={(e) => handleManualBioChange(e.target.value)}
                                className="w-full bg-white border border-slate-250 rounded-lg p-2.5 text-xs text-slate-850 outline-none focus:border-[#C45524] leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Interactive Chat Prompts (补充提示词迭代) */}
                        <div className="pt-4 border-t border-slate-100 space-y-3">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Sparkle className="w-4 h-4 text-[#C45524] animate-pulse" />
                            <span className="text-[11px] font-bold">对结果不满意？让 AI 重新润色：</span>
                          </div>

                          <input
                            type="text"
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="w-full bg-white border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-850 outline-none focus:border-[#C45524] placeholder-slate-400"
                            placeholder="如：突出我的英文沟通能力或高并发项目细节..."
                          />

                          <button
                            type="button"
                            onClick={handleIterateResumeWithAI}
                            disabled={!feedbackText.trim() || isBeautifying}
                            className="w-full py-2 bg-[#C45524] hover:bg-slate-900 hover:text-white text-white text-[11px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-[#C45524] animate-spin-slow text-white" />
                            <span>发送补充要求，一键重新生成词</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Markdown Live Edit Block */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <span className="text-xs text-[#C45524] flex items-center gap-1 font-bold">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>📝 生建的完整 Markdown 履历（可在下方随意自编辑）</span>
                          </span>
                        </div>

                        <textarea
                          rows={15}
                          value={beautifiedCandidate.beautifiedMarkdown}
                          onChange={(e) => handleManualMarkdownChange(e.target.value)}
                          className="w-full bg-slate-55 p-4 border border-slate-200 rounded-xl text-[11px] font-mono whitespace-pre-wrap leading-relaxed outline-none focus:border-[#C45524] h-[340px] text-slate-800"
                        />

                        <div className="flex justify-between items-center pt-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="border border-slate-250 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>返回第1步修改</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentStep(4)}
                            className="px-6 py-2.5 bg-[#C45524] text-white hover:bg-slate-900 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>进入第4步一键配对岗位</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: CHANNELS TARGET AND ACTION BROADCAST MATCH */}
                  {currentStep === 4 && beautifiedCandidate && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 max-w-2xl mx-auto text-xs"
                    >
                      {/* Summary recap */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ 新一代高能简历已经提炼就绪！
                        </span>

                        <div className="flex gap-4 items-start pt-1">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center shrink-0">
                            <span className="text-[#C45524] font-black text-lg block">{beautifiedCandidate.refinedExperience}年</span>
                            <span className="text-[8.5px] text-slate-500 block mt-0.5">经验履历</span>
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-800">{beautifiedCandidate.refinedName}</h5>
                            <p className="text-[11px] text-[#C45524] mt-0.5 font-bold">{beautifiedCandidate.refinedTitle}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{beautifiedCandidate.refinedBio}</p>
                          </div>
                        </div>
                      </div>

                      {/* Select routing channels */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                        <div>
                          <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">选择投递同步到的接收内推通道</h4>
                          <p className="text-[11px] text-slate-500 mt-1">
                            勾选下方您期望一并覆盖的招聘渠道与活跃人才池。一键配对后，您的自荐信息将自动对齐热招岗位并实现直投。
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          {channelsList.map((ch) => {
                            const isChecked = selectedChannelsForDispatch.includes(ch.id);
                            return (
                              <label
                                key={ch.id}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                                  isChecked 
                                    ? 'bg-[#C45524]/10 border-[#C45524] text-slate-800' 
                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100/70'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedChannelsForDispatch(prev => [...prev, ch.id]);
                                    } else {
                                      setSelectedChannelsForDispatch(prev => prev.filter(id => id !== ch.id));
                                    }
                                  }}
                                  className="w-4 h-4 rounded text-[#C45524] border-slate-350 cursor-pointer"
                                />
                                <div>
                                  <span className="block text-xs font-bold text-slate-800">{ch.name}</span>
                                  <span className="block text-[10px] text-slate-400 mt-0.5">{ch.type} 分发信道 • 信誉通畅</span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* One Click MATCH */}
                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="border border-slate-250 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>回到预览微调</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleFinalSubmit}
                          disabled={isSaving}
                          className="px-8 py-4 bg-[#C45524] hover:bg-slate-900 text-white text-xs font-black uppercase rounded-2xl transition-all cursor-pointer shadow-lg shadow-[#C45524]/20"
                        >
                          {isSaving ? (
                            <span className="flex items-center gap-1.5">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>正在智能挑选契合岗位并投递...</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 animate-pulse">
                              <Send className="w-4 h-4" />
                              <span>🚀 一键智能配对并快捷投递自荐</span>
                            </span>
                          )}
                        </button>
                      </div>

                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
