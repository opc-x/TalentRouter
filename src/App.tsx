import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Globe, GitMerge, LayoutDashboard, Settings, Plus, X, 
  SlidersHorizontal, Check, Search, Filter, Briefcase, Radio, 
  Activity, Cpu, Send, CheckCircle2, AlertCircle, Trash2, ArrowUpRight, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchDashboard from './components/SearchDashboard';
import TalentIntakeWorkshop from './components/TalentIntakeWorkshop';
import JobProfilesList from './components/JobProfilesList';
import SmartRouteModal from './components/SmartRouteModal';
import AdminSettingsPanel from './components/AdminSettingsPanel';
import LuckyLotteryDraw from './components/LuckyLotteryDraw';
import { Candidate, JobProfile, ChannelItem, CompanyProfile, ChannelConfig } from './types';

export default function App() {
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [loginRole, setLoginRole] = useState<'employer' | 'seeker'>('seeker');
  const [activeTab, setActiveTab] = useState<'match' | 'profile' | 'channel' | 'intake'>('match');
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [channelConfig, setChannelConfig] = useState<ChannelConfig | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // Upgraded channel list from server
  const [channelsList, setChannelsList] = useState<ChannelItem[]>([]);
  const [isAddingChannel, setIsAddingChannel] = useState<boolean>(false);
  const [newChannelForm, setNewChannelForm] = useState({
    name: '',
    type: 'Slack' as ChannelItem['type'],
    webhookUrl: '',
    botToken: '',
    chatId: '',
    endpointUrl: '',
    secretHeader: ''
  });

  // Beautified AI resume state
  const [beautifiedCandidate, setBeautifiedCandidate] = useState<{
    refinedName: string;
    refinedTitle: string;
    refinedSkills: string;
    refinedExperience: number;
    refinedBio: string;
    beautifiedMarkdown: string;
    nationality: string;
    language: string;
  } | null>(null);

  // Resume Templates presets structure (先搞一个程序员简历模板吧)
  const resumeTemplates = {
    programmer: {
      name: '卢卡斯 (Lucas Chow)',
      role: '资深全栈研发专家 (Senior Full-Stack Developer)',
      skills: 'Go, TypeScript, Kubernetes, React, Docker, PostgreSQL, GRPC, Redis',
      experienceYears: 6,
      bio: '架构设计了一套弹性高并发的数据路由分流系统，应用高并发协程池与缓存策略支撑了日增 4000 万请求的分发和信道打通工作。使整机处理时延降低了 42%，单点物理机崩溃频率降至 0.01% 的极度稳定状态。通过编写定制的 Kubernetes Operator 实现应用容器在 AWS 上的水平秒级弹性自愈扩容。'
    },
    ai_researcher: {
      name: '张智能 (Dr. Sophia Chang)',
      role: '主动式 AI 代理与深度学习科学家 (Lead AI Researcher)',
      skills: 'Python, PyTorch, Gemini API, PEFT, LangChain, LLM Tuning, PEFT, Prompt Engineering',
      experienceYears: 4,
      bio: '专注于将主动式多智能体协作与提示词编译器在多租户沙盒中进行高安全效率接地，擅长基于 Gemini API 开发智能审查和画像分析系统。架构设计了上下文审查网关决策闭盘，LoRA 调优准确度 96.5%。'
    },
    solution_architect: {
      name: '王云涛 (Mason Wang)',
      role: '云解决方案与微服务架构师 (Senior Cloud Solutions Architect)',
      skills: 'AWS, AWS Lambda, ALB, Route 53, Terraform, VPC, Docker, CI/CD Pipeline',
      experienceYears: 8,
      bio: '持有 AWS 主任解决方案架构师(Professional)认证。追求高吞吐量、低延滞的无状态微服务骨干架构编排，擅长编写可扩展 of IAC 部署脚本。'
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<'programmer' | 'ai_researcher' | 'solution_architect'>('programmer');
  const [selectedNationality, setSelectedNationality] = useState<string>('Singapore 🇸🇬');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('zh');
  const [isBeautifying, setIsBeautifying] = useState<boolean>(false);
  const [selectedChannelsForDispatch, setSelectedChannelsForDispatch] = useState<string[]>([]);

  // Candidates data
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedCandidate = candidates.find(c => c.id === selectedId) || null;

  // Filter tools
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('All');
  const [scoreFilter, setScoreFilter] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // Form input controllers
  const [showAddJobModal, setShowAddJobModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  
  // Custom HUD and system notification toasts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [dispatchActivityLog, setDispatchActivityLog] = useState<Array<{
    id: string;
    candidateName: string;
    role: string;
    timestamp: string;
    channel: string;
    score: number;
    realSent: boolean;
  }>>([
    {
      id: 'act_1',
      candidateName: 'Lucas Chow',
      role: '高级后端与分布式专家',
      timestamp: '11:42',
      channel: 'Telegram Bot',
      score: 92,
      realSent: false
    },
    {
      id: 'act_2',
      candidateName: 'Sophia Chang',
      role: 'Lead AI Agent Researcher',
      timestamp: '11:05',
      channel: 'Slack Bot',
      score: 85,
      realSent: false
    }
  ]);

  // Modifiable configurations forms
  const [companyForm, setCompanyForm] = useState({
    name: '',
    techFocus: '',
    description: '',
    cultureRating: 85,
    speedRating: 75,
    leadershipRating: 80
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    skills: '',
    experienceYearsRequired: 3,
    techWeight: 80,
    cultureWeight: 80,
    speedWeight: 80,
    leadershipWeight: 80
  });

  const [intakeForm, setIntakeForm] = useState({
    name: '周晓明',
    role: '高级 Go/k8s 后端工程师',
    skills: 'Go, Kubernetes, Operator, GRPC, Cloud-Native',
    experienceYears: 6,
    bio: '精通云原生架构与 Operator 控制器开发。擅长设计高可靠的自动化资源调度层与多租户隔离。',
    channel: 'Telegram Bot' as 'Telegram Bot' | 'Slack Bot' | 'Web Intake' | 'External API'
  });

  const [channelForm, setChannelForm] = useState({
    telegramBotToken: '',
    telegramChatId: '',
    minScoreThreshold: 80,
    pushNotificationsEnabled: true
  });

  // Load initial data
  useEffect(() => {
    fetchCandidates();
    fetchCompanyProfile();
    fetchJobProfiles();
    fetchChannelConfig();
    fetchChannelsList();
  }, []);

  const fetchChannelsList = async () => {
    try {
      const res = await fetch('/api/channels');
      if (res.ok) {
        const data = await res.json();
        setChannelsList(data);
        const actives = data.filter((c: any) => c.status === 'active').map((c: any) => c.id);
        setSelectedChannelsForDispatch(actives);
      }
    } catch (err) {
      console.error('Failed to load channels list:', err);
    }
  };

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch('/api/candidates');
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      const res = await fetch('/api/company-profile');
      if (res.ok) {
        const data = await res.json();
        setCompanyProfile(data);
        setCompanyForm({
          name: data.name || '',
          techFocus: data.techFocus || '',
          description: data.description || '',
          cultureRating: data.cultureRating || 85,
          speedRating: data.speedRating || 75,
          leadershipRating: data.leadershipRating || 80
        });
      }
    } catch (err) {
      console.error('Failed to load company config:', err);
    }
  };

  const fetchJobProfiles = async () => {
    try {
      const res = await fetch('/api/job-profiles');
      if (res.ok) {
        const data = await res.json();
        setJobProfiles(data);
        if (data.length > 0 && !selectedJobId) {
          setSelectedJobId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load job profile configs:', err);
    }
  };

  const fetchChannelConfig = async () => {
    try {
      const res = await fetch('/api/channel-config');
      if (res.ok) {
        const data = await res.json();
        setChannelConfig(data);
        setChannelForm({
          telegramBotToken: data.telegramBotToken || '',
          telegramChatId: data.telegramChatId || '',
          minScoreThreshold: data.minScoreThreshold || 80,
          pushNotificationsEnabled: data.pushNotificationsEnabled !== false
        });
      }
    } catch (err) {
      console.error('Failed to load channels parameters:', err);
    }
  };

  // Submit Company Image Profiles (一阶能力及特质)
  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/company-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm)
      });
      if (res.ok) {
        const data = await res.json();
        setCompanyProfile(data);
        triggerToast('一阶企业画像与文化常数保存并生效！', 'success');
      }
    } catch (err) {
      triggerToast('保存企业画像异常失败', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Create Job Description Profiles (二阶能力与指标参数)
  const handleAddJobProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.skills) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/job-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobForm)
      });
      if (res.ok) {
        const data = await res.json();
        setJobProfiles(data);
        setShowAddJobModal(false);
        // Clear form
        setJobForm({
          title: '',
          skills: '',
          experienceYearsRequired: 3,
          techWeight: 80,
          cultureWeight: 80,
          speedWeight: 80,
          leadershipWeight: 80
        });
        triggerToast('二阶职位硬需求画像录入成功！', 'success');
      }
    } catch (err) {
      triggerToast('录入职位画像异常', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJobProfile = async (id: string, name: string) => {
    if (!window.confirm(`确定要下架并删除 [${name}] 的硬聘画像吗？`)) return;
    try {
      const res = await fetch(`/api/job-profiles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setJobProfiles(data);
        triggerToast(`画像 [${name}] 已成功下架！`, 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Execute smart algorithmic fusion and recalculate match ratings for candidates in database (三阶动态匹配)
  const handleExecuteEngineMatch = async (jobId: string) => {
    if (!jobId) return;
    setIsSaving(true);
    triggerToast('⚡ 核心三阶匹配算力已启动，全库执行动态契合度重调！', 'info');
    try {
      const res = await fetch('/api/matching/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        const updated = await res.json();
        setCandidates(updated);
        triggerToast(`三阶融合评分重构成功！共匹配 ${updated.length} 名高热人才。`, 'success');
      }
    } catch (err) {
      triggerToast('匹配评分引擎运算失败', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddChannel = async (name: string, type: any, config: any) => {
    try {
      const res = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, config, status: 'active', minScoreThreshold: 80, pushNotificationsEnabled: true })
      });
      if (res.ok) {
        const data = await res.json();
        setChannelsList(data);
        triggerToast('🎉 成功规划部署新物理通信道并使其连线就绪！', 'success');
      }
    } catch (err) {
      triggerToast('接入新通道发生网络冲突', 'error');
    }
  };

  const handleToggleChannelStatus = async (id: string, status: any) => {
    const existing = channelsList.find(c => c.id === id);
    if (!existing) return;
    try {
      const res = await fetch(`/api/channels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, status })
      });
      if (res.ok) {
        const data = await res.json();
        setChannelsList(data);
        triggerToast(`✔️ 信道健康状态已动态调整为: ${status}`, 'success');
      }
    } catch (err) {
      triggerToast('信道物理调度失败', 'error');
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (id === 'ch_tg') {
      triggerToast('⚠️ 核心电报 Telegram 为骨干通路，禁止卸载！', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/channels/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        setChannelsList(data);
        triggerToast('🗑️ 分发路由已经安全移除拆分！', 'success');
        setSelectedChannelsForDispatch(prev => prev.filter(cId => cId !== id));
      }
    } catch (err) {
      triggerToast('系统下卸通道返回矛盾', 'error');
    }
  };

  // Submit and persistent Channel Connection parameters
  const handleUpdateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/channel-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channelForm)
      });
      if (res.ok) {
        const data = await res.json();
        setChannelConfig(data);
        triggerToast('💡 Telegram 物理路由信道机制已同步更新！', 'success');
      }
    } catch (err) {
      triggerToast('更新通道网络参数失败', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Trigger test socket push to physical Telegram channel
  const handleTelegramTestPush = async () => {
    setIsSaving(true);
    triggerToast('📡 正在向电讯主干网发送测试握手电波包...', 'info');
    try {
      const res = await fetch('/api/telegram/test-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: channelForm.telegramBotToken,
          chatId: channelForm.telegramChatId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.realSent) {
          triggerToast('🎯 实物连接打通成功！群组已顺利抵达测试推送电报。', 'success');
        } else {
          triggerToast('💡 本地测试包递达通过！(使用默认模拟通路环境)', 'success');
        }
      }
    } catch (err) {
      triggerToast('物理握手连结异常，信道未就绪。', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Perform physical or simulation dispatch packet output (一键下发渠道)
  const handleDispatchCandidate = async (candId: string) => {
    if (isDispatching) return;
    setIsDispatching(true);
    triggerToast('📡 安全加密封装中，准备将该人才画像打包下发...', 'info');
    
    try {
      const res = await fetch(`/api/candidates/${candId}/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update candidates array to reflect status Change
        setCandidates(prev => prev.map(c => c.id === candId ? {
          ...c,
          status: data.candidate.status,
          statusType: data.candidate.statusType
        } : c));

        // Append to local activity log on successful dispatch
        const logItem = {
          id: `act_${Date.now()}`,
          candidateName: data.candidate.name,
          role: data.candidate.role,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          channel: data.candidate.channel,
          score: data.candidate.matchScore,
          realSent: data.realSent
        };
        setDispatchActivityLog(prev => [logItem, ...prev]);

        if (data.realSent) {
          triggerToast(`✔️ 物理分发成功！该人才画像已直接推送至：${channelConfig?.telegramChatId || 'TG群'}`, 'success');
        } else {
          triggerToast('✔️ 下发路由完成！已模拟通过 Bot 通道向对应渠道分发情报包。', 'success');
        }
      }
    } catch (err) {
      triggerToast('执行路由下发异常错误', 'error');
    } finally {
      setIsDispatching(false);
    }
  };

  // Beautify candidate resume draft using Gemini API
  const handleAIBeautifyResume = async () => {
    setIsBeautifying(true);
    triggerToast('✨ AI 智能自研工坊启动：深度重写及国籍语境翻译中...', 'info');

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
          language: selectedLanguage
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
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
          triggerToast('🎉 简历一键美化与国籍语境自适应构建完毕！', 'success');
        } else {
          triggerToast('AI 简历工坊由于未知矛盾中断', 'error');
        }
      } else {
        triggerToast('AI 简历工坊对接中断，请稍后重试', 'error');
      }
    } catch (err) {
      triggerToast('AI 简历工坊发生计算冲突', 'error');
    } finally {
      setIsBeautifying(false);
    }
  };

  // Dispatch the beautified output with matching and alerts
  const handleDispatchBeautifiedResume = async () => {
    if (!beautifiedCandidate) return;
    setIsSaving(true);
    triggerToast('🚀 正在执行一键对齐匹配与多信道广播下发...', 'info');

    try {
      // Step 1: Create candidate database entry reflecting beautified outcomes
      const createRes = await fetch('/api/candidates/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: beautifiedCandidate.refinedTitle,
          jobProfile: beautifiedCandidate.refinedSkills,
          channel: selectedChannelsForDispatch.length > 0
            ? channelsList.filter(c => selectedChannelsForDispatch.includes(c.id)).map(c => c.name).join(' & ')
            : 'Web Intake Router',
          skillsRequired: beautifiedCandidate.refinedBio
        })
      });

      if (createRes.ok) {
        const candidateData = await createRes.json();
        
        // Override properties with refined values from beautification
        candidateData.name = beautifiedCandidate.refinedName;
        candidateData.role = beautifiedCandidate.refinedTitle;
        candidateData.bio = beautifiedCandidate.refinedBio;
        candidateData.experienceYears = beautifiedCandidate.refinedExperience;
        candidateData.jobProfile = beautifiedCandidate.refinedSkills;
        candidateData.beautifiedMarkdown = beautifiedCandidate.beautifiedMarkdown;
        
        // Step 2: Push dispatch signal with selected channels checklist
        const dispatchRes = await fetch(`/api/candidates/${candidateData.id}/dispatch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            channels: selectedChannelsForDispatch
          })
        });

        if (dispatchRes.ok) {
          const dispatchData = await dispatchRes.json();
          const updatedCand = dispatchData.candidate;
          
          const finalCand = {
            ...candidateData,
            ...updatedCand,
            beautifiedMarkdown: beautifiedCandidate.beautifiedMarkdown
          };

          // Append updated entry to lists
          setCandidates(prev => [finalCand, ...prev]);
          setSelectedId(finalCand.id);

          if (dispatchData.results && dispatchData.results.length > 0) {
            dispatchData.results.forEach((r: any) => {
              const logItem = {
                id: `act_${Date.now()}_${r.channelId}`,
                candidateName: beautifiedCandidate.refinedName,
                role: beautifiedCandidate.refinedTitle,
                timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                channel: r.name,
                score: finalCand.matchScore,
                realSent: r.realSent
              };
              setDispatchActivityLog(prev => [logItem, ...prev]);
            });
          }

          triggerToast(`🎉 成功分发匹配！自动测算匹配分：${finalCand.matchScore}%；情报已送抵 ${selectedChannelsForDispatch.length} 路由节点`, 'success');
          
          // Clear and redirect to match tab
          setBeautifiedCandidate(null);
          // Set inputs to initial placeholder
          setIntakeForm({
            name: '周晓明',
            role: '高级 Go/k8s 后端工程师',
            skills: 'Go, Kubernetes, Operator, GRPC, Cloud-Native',
            experienceYears: 6,
            bio: '精通云原生架构与 Operator 控制器开发。擅长设计高可靠的自动化资源调度层与多租户隔离。',
            channel: 'Telegram Bot'
          });
          setActiveTab('match');
        } else {
          triggerToast('执行多信道广播电波失败', 'error');
        }
      } else {
        triggerToast('人才结构入库解析超时', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('自适应对齐与下发事务发生 network 冲突', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Candidate Self Registration & Intake parser (自荐录入接口) - Backward compatible fallback wrapper
  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAIBeautifyResume();
  };

  // Coordinate math vector logic for SVG radar indicators
  const getRadarPath = (metrics: Candidate['metrics']) => {
    if (!metrics) return '50,15 85,50 50,85 15,50';
    const yTop = 50 - (metrics.tech / 100) * 40;
    const xRight = 50 + (metrics.leadership / 100) * 40;
    const yBottom = 50 + (metrics.culture / 100) * 40;
    const xLeft = 50 - (metrics.speed / 100) * 40;
    return `${50},${yTop} ${xRight},50 ${50},${yBottom} ${xLeft},50`;
  };

  // Client filtering filters
  const filteredCandidates = candidates.filter(cand => {
    if (selectedChannelFilter !== 'All' && cand.channel !== selectedChannelFilter) return false;
    if (cand.matchScore < scoreFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return cand.name.toLowerCase().includes(q) || 
             cand.role.toLowerCase().includes(q) || 
             (cand.bio && cand.bio.toLowerCase().includes(q)) ||
             cand.jobProfile.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D3748] antialiased flex flex-col relative select-none pb-12 overflow-x-hidden">
      
      {/* Playful and celebratory warm background elements with high-energy gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-orange-100/50 via-rose-50/30 to-transparent pointer-events-none z-0" />
      <div className="absolute top-12 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-orange-200/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="absolute top-[20%] left-[-5%] text-[14rem] font-serif italic text-orange-200/5 select-none pointer-events-none rotate-[-6deg] tracking-tight font-bold">
        Joyful
      </div>
      <div className="absolute top-1/2 right-10 text-[18rem] font-serif italic text-rose-200/5 pointer-events-none select-none tracking-tighter z-0 uppercase rotate-[4deg]">
        Router
      </div>

      {/* Global Toast Controller with high cheerfulness */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-3xl shadow-xl border flex items-center gap-3 backdrop-blur-md max-w-sm text-xs font-bold font-sans transition-all ${
              toastMessage.type === 'success' 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-emerald-100/40' 
                : toastMessage.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-rose-100/40'
                : 'bg-amber-50 border-amber-300 text-amber-900 shadow-amber-100/40'
            }`}
          >
            <span className="text-lg">🎈</span>
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-energy, warm, and highly expressive Logo & Navigation Header */}
      <header className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-lg z-40 border-b-2 border-orange-100 shadow-md select-none px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Animated bouncing circular visual badge */}
            <div className="p-3 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-3xl text-white shadow-lg shadow-orange-500/30 flex items-center justify-center shrink-0 animate-bounce cursor-pointer hover:rotate-12 transition-transform">
              <span className="text-2xl font-black">🧧</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-xs animate-pulse">
                  开门见喜 • 极速直通
                </span>
              </div>
              <h1 className="text-3xl font-serif tracking-tight text-slate-900 flex items-center gap-2 leading-none mt-1">
                <span className="font-extrabold hover:text-orange-600 transition-colors">Talent</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 font-black italic scale-105 inline-block origin-left hover:scale-110 transition-transform cursor-grab">
                  Router
                </span>
                <span className="text-xl">✨</span>
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-1">
                🎉 回绝枯燥古板！智能算法为您一键重塑“发光简历”，高契合度岗位极速秒连，财源福运滚滚来！
              </p>
            </div>
          </div>

          {/* Cheerfully Styled Portal Stats */}
          <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 font-semibold bg-white/70 p-3.5 rounded-2xl border border-orange-100/80 shadow-xs">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-slate-900 font-extrabold text-base">{candidates.length}</span>
                <span className="text-amber-500">🔥</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">已开启好运求职士</span>
            </div>
            <div className="w-px h-8 bg-orange-100" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-slate-900 font-extrabold text-base">{jobProfiles.length}</span>
                <span className="text-rose-500">💼</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold">精选暴富在招机会</span>
            </div>
            <div className="w-px h-8 bg-orange-100" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-orange-600 font-extrabold text-base">{channelsList.filter(c => c.status === 'active').length}</span>
                <span className="text-emerald-500">⚡</span>
              </div>
              <span className="text-[10px] text-orange-600 font-bold">极速直发活跃信道</span>
            </div>
          </div>

          {/* Playful Interactive Switches */}
          <div className="flex items-center bg-orange-50/80 p-1.5 rounded-2xl border border-orange-200/60 self-stretch md:self-auto shadow-inner">
            <button
              onClick={() => setIsAdminView(false)}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                !isAdminView 
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600 bg-orange-500 text-white shadow-md font-bold' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-white/40'
              }`}
            >
              <span className="text-sm">🎈</span>
              <span>意向求职大厅</span>
            </button>
            <button
              onClick={() => setIsAdminView(true)}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAdminView 
                  ? 'bg-gradient-to-r from-orange-400 to-orange-600 bg-orange-500 text-white shadow-md font-bold' 
                  : 'text-slate-600 hover:text-orange-600 hover:bg-white/40'
              }`}
            >
              <span className="text-sm">⚙️</span>
              <span>极速后台配置</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 z-10 relative">
        <AnimatePresence mode="wait">
          
          {/* PORTAL A: Frontend Workspace */}
          {!isAdminView ? (
            <motion.div
              key="frontend_portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              
              {/* JOYFUL WELCOMING HUB ADAPTER */}
              <div id="identity_login_manager" className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-rose-500/10 border-2 border-orange-100 p-5 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-[-10px] right-[-10px] text-5xl opacity-10 pointer-events-none">🧧</div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#C45524] to-rose-500 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-xl">🌟</span>
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 text-[10.5px] font-black border border-orange-500/20 shadow-xs">
                      AI 赋能 • 大放异彩
                    </span>
                    <p className="text-[12px] text-slate-700 mt-2 font-bold leading-relaxed">
                      {loginRole === 'seeker' 
                        ? '✨ 喜报开门红！点击下方按钮，输入您的经历，我们将为您生成一份脱颖而出、闪闪发光的专属神级简历，直接内卷大厂！' 
                        : '★ 雇主服务信誉保障中！可自主添加匹配信道与职位画像进行分发审查配置。'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-white/80 p-1.5 rounded-2xl border-2 border-orange-100 shrink-0 select-none shadow-xs">
                  <button
                    id="switch_to_seeker_btn"
                    onClick={() => {
                      setLoginRole('seeker');
                      triggerToast('🎉 祝您事业腾飞！求职大厅已帮您载入全量在招黄金职位！', 'success');
                    }}
                    className={`px-5 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                      loginRole === 'seeker' 
                        ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md' 
                        : 'text-slate-600 hover:text-orange-600 hover:bg-orange-100/50'
                    }`}
                  >
                    <span>🎯 我要找工作 (一键重塑包装简历)</span>
                  </button>
                  <button
                    id="switch_to_employer_btn"
                    onClick={() => {
                      triggerToast('🔒 企业雇主管理终端正在拼命打磨中，首诊大厅已解锁了全部求职流配置！您可以随时使用下方全套功能～', 'info');
                    }}
                    className="px-5 py-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-not-allowed bg-orange-50/50 border border-dashed border-orange-200 text-slate-400"
                    title="企业雇主端 - 后期正式开放"
                  >
                    <span>💼 企业雇主端 (惊喜打磨中)</span>
                  </button>
                </div>
              </div>

              {/* SECTION I: All-in-One Global Query Engine */}
              <SearchDashboard
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedJobId={selectedJobId}
                setSelectedJobId={setSelectedJobId}
                jobProfiles={jobProfiles}
                candidates={candidates}
                channelsList={channelsList}
                filteredCandidates={filteredCandidates}
                setSelectedId={setSelectedId}
                handleExecuteEngineMatch={handleExecuteEngineMatch}
                loginRole={loginRole}
              />

              {/* 🎰 NEW: High-energy Lucky Lottery Draw Portal */}
              {loginRole === 'seeker' && (
                <LuckyLotteryDraw
                  jobProfiles={jobProfiles}
                  handleExecuteEngineMatch={handleExecuteEngineMatch}
                  triggerToast={triggerToast}
                  setSelectedId={setSelectedId}
                />
              )}

              {/* SECTION II: Balanced Dual Intake Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* LEFT: Talent registration & AI beautification */}
                <TalentIntakeWorkshop
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  intakeForm={intakeForm}
                  setIntakeForm={setIntakeForm}
                  selectedNationality={selectedNationality}
                  setSelectedNationality={setSelectedNationality}
                  selectedLanguage={selectedLanguage}
                  setSelectedLanguage={setSelectedLanguage}
                  resumeTemplates={resumeTemplates}
                  handleAIBeautifyResume={handleAIBeautifyResume}
                  isBeautifying={isBeautifying}
                  beautifiedCandidate={beautifiedCandidate}
                  channelsList={channelsList}
                  selectedChannelsForDispatch={selectedChannelsForDispatch}
                  setSelectedChannelsForDispatch={setSelectedChannelsForDispatch}
                  handleDispatchBeautifiedResume={handleDispatchBeautifiedResume}
                  isSaving={isSaving}
                  loginRole={loginRole}
                  setBeautifiedCandidate={setBeautifiedCandidate}
                />

                {/* RIGHT: Jobs list & weighting matching descriptors with telemetries logs */}
                <JobProfilesList
                  jobProfiles={jobProfiles}
                  setJobProfiles={setJobProfiles}
                  setSelectedJobId={setSelectedJobId}
                  handleExecuteEngineMatch={handleExecuteEngineMatch}
                  setShowAddJobModal={setShowAddJobModal}
                  triggerToast={triggerToast}
                  dispatchActivityLog={dispatchActivityLog}
                  loginRole={loginRole}
                />

              </div>

            </motion.div>
          ) : (
            
            /* PORTAL B: Backend Console System Admin (系统后台底层配置) */
            <motion.div
              key="backend_portal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <AdminSettingsPanel
                channelsList={channelsList}
                handleToggleChannelStatus={handleToggleChannelStatus}
                handleDeleteChannel={handleDeleteChannel}
                channelForm={channelForm}
                setChannelForm={setChannelForm}
                handleUpdateChannel={handleUpdateChannel}
                handleTelegramTestPush={handleTelegramTestPush}
                newChannelForm={newChannelForm}
                setNewChannelForm={setNewChannelForm}
                isAddingChannel={isAddingChannel}
                setIsAddingChannel={setIsAddingChannel}
                handleAddChannel={handleAddChannel}
                companyForm={companyForm || { name: '', techFocus: '', description: '', speedRating: 80, cultureRating: 80 }}
                setCompanyForm={setCompanyForm}
                handleUpdateCompany={handleUpdateCompany}
                isSaving={isSaving}
                triggerToast={triggerToast}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.04] py-8 text-center text-xs text-white/30 select-none z-10 relative">
        <p>© 2026 TalentRouter • 智能机会路由分发服务</p>
      </footer>

      {/* PORTAL C: Smart Routing Matching Review Overlay Modal (智能匹配雷达与即时多渠道下发物理终端) */}
      <AnimatePresence>
        {selectedCandidate && (
          <SmartRouteModal
            selectedCandidate={selectedCandidate}
            setSelectedId={setSelectedId}
            getRadarPath={getRadarPath}
            channelsList={channelsList}
            selectedChannelsForDispatch={selectedChannelsForDispatch}
            setSelectedChannelsForDispatch={setSelectedChannelsForDispatch}
            handleDispatchCandidate={handleDispatchCandidate}
            isDispatching={isDispatching}
          />
        )}
      </AnimatePresence>

      {/* MODAL 2 OVERLAY: Add Job vacancy descriptions */}
      <AnimatePresence>
        {showAddJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddJobModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[#FAF9F6] w-full max-w-md rounded-3xl p-6 border border-black/10 z-10 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-black/5 pb-2">
                <h3 className="text-sm font-serif italic font-black flex items-center gap-1.5 text-[#C45524]">
                  <Plus className="w-5 h-5 text-[#C45524]" />
                  <span>新增在招岗位比对描述 (Add Job Description)</span>
                </h3>
                <button onClick={() => setShowAddJobModal(false)} className="p-1 hover:bg-black/5 rounded-full text-black/50">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddJobProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-black/60 mb-1.5">职位角色名称 (e.g. Senior Frontend Lead)</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs text-black"
                    placeholder="如: 架构安全实验室算法研究员"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black/60 mb-1.5">所需最低研发年限底线 (Minimum years requirement)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={jobForm.experienceYearsRequired}
                    onChange={(e) => setJobForm({ ...jobForm, experienceYearsRequired: Number(e.target.value) })}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-black/60 mb-1.5 font-mono">所需核心技术必检技能栈 (Comma-separated tools)</label>
                  <input
                    type="text"
                    required
                    value={jobForm.skills}
                    onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                    className="w-full bg-white border border-black/10 rounded-xl p-2.5 text-xs text-black font-mono"
                    placeholder="Python, PyTorch, LangChain, PEFT"
                  />
                </div>

                <div className="space-y-3 py-2 border-t border-black/5">
                  <label className="block text-xs font-bold text-black/60">该职位在雷达评估层中的偏好设置</label>
                  
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>技术力判定比重:</span>
                        <span>{jobForm.techWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={jobForm.techWeight}
                        onChange={(e) => setJobForm({ ...jobForm, techWeight: Number(e.target.value) })}
                        className="w-full shrink h-1 accent-[#C45524]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>文化度判定比重:</span>
                        <span>{jobForm.cultureWeight}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={jobForm.cultureWeight}
                        onChange={(e) => setJobForm({ ...jobForm, cultureWeight: Number(e.target.value) })}
                        className="w-full shrink h-1 accent-[#C45524]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-black hover:bg-[#C45524] text-white text-xs font-black uppercase rounded-2xl transition-all cursor-pointer text-center"
                >
                  ➕ 保存并部署此职位靶向画像
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
