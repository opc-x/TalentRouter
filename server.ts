import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { Candidate, Message, CompanyProfile, JobProfile, ChannelConfig, ChannelItem } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Company, Job and Channel Profiles
let companyProfile: CompanyProfile = {
  name: "安托智能安全实验室 (Antigravity AI Lab)",
  techFocus: "React 19 / TypeScript / Python / PyTorch / Go / Kubernetes",
  cultureRating: 85,
  speedRating: 75,
  leadershipRating: 80,
  description: "全球领先的智能流计算与主动式 AI 路由调度实验室。我们重度依托云原生生态与大语言模型算力，为多端、多场景提供一站式、可扩展的智能匹配路由。"
};

let jobProfiles: JobProfile[] = [
  {
    id: 'jp_1',
    title: "高级后端开发工程师 (Go/K8s)",
    skills: "Go, Kubernetes, Operator, Docker, Cloud-Native",
    experienceYearsRequired: 6,
    techWeight: 90,
    cultureWeight: 80,
    speedWeight: 75,
    leadershipWeight: 70
  },
  {
    id: 'jp_2',
    title: "云解决方案架构师",
    skills: "AWS, ECS Fargate, ALB, Route 53, Terraform",
    experienceYearsRequired: 5,
    techWeight: 85,
    cultureWeight: 75,
    speedWeight: 80,
    leadershipWeight: 85
  },
  {
    id: 'jp_3',
    title: "AI 算法研究员",
    skills: "Python, PyTorch, LLM Tuning, PEFT, Prompt Strategy",
    experienceYearsRequired: 3,
    techWeight: 95,
    cultureWeight: 85,
    speedWeight: 80,
    leadershipWeight: 60
  }
];

let channelConfig: ChannelConfig = {
  telegramBotToken: "7194058293:AAEi6-FdkjsH8YskS-Fldkfjse8ruisj8d",
  telegramChatId: "@TalentRouterIntelPush",
  minScoreThreshold: 80,
  pushNotificationsEnabled: true,
  channelStatus: 'active'
};

let channelsList: ChannelItem[] = [
  {
    id: "ch_tg",
    name: "Telegram 智能分发推送 Bot",
    type: "Telegram",
    config: {
      botToken: "7194058293:AAEi6-FdkjsH8YskS-Fldkfjse8ruisj8d",
      chatId: "@TalentRouterIntelPush"
    },
    minScoreThreshold: 80,
    pushNotificationsEnabled: true,
    status: "active"
  },
  {
    id: "ch_slack",
    name: "Slack 全球开发团队工作区 (推送专线)",
    type: "Slack",
    config: {
      webhookUrl: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    },
    minScoreThreshold: 85,
    pushNotificationsEnabled: true,
    status: "active"
  },
  {
    id: "ch_webhook",
    name: "REST API 自定义 Webhook 对接端点",
    type: "Webhook",
    config: {
      endpointUrl: "https://api.talentrouter.io/v1/dispatch",
      secretHeader: "X-TalentRouter-Signature-Key"
    },
    minScoreThreshold: 75,
    pushNotificationsEnabled: true,
    status: "active"
  },
  {
    id: "ch_discord",
    name: "Discord 高端社区监控 Hook",
    type: "Discord",
    config: {
      webhookUrl: "https://discord.com/api/webhooks/00000000000000/XXXXXXXXXXXXXXXXXXXX"
    },
    minScoreThreshold: 90,
    pushNotificationsEnabled: false,
    status: "standby"
  }
];


// In-memory Candidates database
let candidates: Candidate[] = [
  {
    id: '1',
    name: 'Alex Rivers',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPAjFv8TA0wzbX11O8udL2nmGsyTk5C-VwRwecA_KWtmdz0uIjkUocXPIR_5T69PCtVQmN8OfhMbv12dszeoEDbWtiXSp3GxryVf9uw1HdlmIXVrXR3VScK9Dth2GVinny6orH3Xp8BMCmmeV2CTjt7x4pD5A4mGpIYNq2paaYsvPdPsTacif43oAqGilh1qRuLMeMZFgFkoRBlcZcRtgrh9CRIGiZj5MpxQwLUOXgyRnQU0WNg0YqxmY78N4smqiemAY59nbc',
    role: '高级后端工程师',
    matchScore: 92,
    channel: 'Telegram Bot',
    jobProfile: 'Go/K8s',
    status: 'Profile Match Router: 智能匹配成功',
    statusType: 'success',
    email: 'alex.rivers@telegram.dev',
    phone: '+1 (555) 0192-384',
    experienceYears: 8,
    bio: '8年+高并发分布式后端研发经验，精通 Go 语言、Kubernetes Operator 机制。擅长云原生架构升级、微服务效能调优，热爱开源技术。',
    metrics: {
      tech: 92,
      culture: 82,
      speed: 70,
      leadership: 85
    },
    messages: [
      {
        id: 'msg_1_1',
        sender: 'AI 助手',
        senderType: 'ai',
        content: '你好，Alex！我是来自「人才路由与智能域」的 AI Screening Agent。你能聊聊你在 Kubernetes 算子模式方面的经验吗？',
        time: '上午 10:42'
      },
      {
        id: 'msg_1_2',
        sender: 'Alex Rivers',
        senderType: 'candidate',
        content: '没问题。我曾使用 Kubebuilder 开发过多个自定义控制器。其中一个是专门用于管理临时数据库实例生命周期的，完成了状态自动协调和多租户资源清理，极大地解放了运维。',
        time: '上午 10:43'
      },
      {
        id: 'msg_1_3',
        sender: 'AI 助手',
        senderType: 'ai',
        content: '听起来很专业。在这种场景下，你通常是如何处理状态一致性的？',
        time: '上午 10:44'
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQD_ilS5erXX6n9SSQg4mktcppHsd58yOEAK53qyW-i-suiegj0VPT3C5qJw9phgwGXzyLkMU_9sfRa1IaaNp3g1y0-QYNb6Hl5dc7dRLl-FxXTgDWUbSgxSTACH1YsUUwVQdUT9GikjIoljtgkb_scCXIdJLOp8P10vnFbLhonfk6y6DPGnv5KXvJMPlRqtvsvLCd4oki0sE4UeGiZO54MzqR3Hyz73LkOBM9qjfIY6ofoormAGWWxgvIyI-HY-SgBCPKVrWz',
    role: '云解决方案架构师',
    matchScore: 85,
    channel: 'Slack Bot',
    jobProfile: 'AWS/Cloud',
    status: 'Profile Match Router: 技能验证通过',
    statusType: 'success',
    email: 'sarah.chen@slack.corp',
    phone: '+86 138-0099-2311',
    experienceYears: 6,
    bio: '极具技术前瞻性的 AWS 双重认证架构师。主攻大规模多云应用编排、安全合规体系落地。乐于提供跨国混合部署的全球最优解。',
    metrics: {
      tech: 85,
      culture: 78,
      speed: 72,
      leadership: 80
    },
    messages: [
      {
        id: 'msg_2_1',
        sender: 'AI 助手',
        senderType: 'ai',
        content: '嗨，Sarah！欢迎连接我们的 AWS 专属虚拟初筛通道。针对大型高可用架构，你最常用的负载均衡与多可用区热备方案是什么？',
        time: '上午 11:02'
      },
      {
        id: 'msg_2_2',
        sender: 'Sarah Chen',
        senderType: 'candidate',
        content: '你好！我通常偏好使用 Application Load Balancer (ALB) 配合 Route 53 的延迟路由或地理路由策略。后端通过 ECS Fargate 实现跨 3 个 Availability Zone 的多活容灾，结合 Multi-AZ RDS，确保整体弹性。',
        time: '上午 11:03'
      },
      {
        id: 'msg_2_3',
        sender: 'AI 助手',
        senderType: 'ai',
        content: '非常系统。那当涉及海外部署时，你们如何针对 GDPR 等数据安全合规准则在云端做架构合规裁剪？',
        time: '上午 11:05'
      }
    ]
  },
  {
    id: '3',
    name: 'Marcus Vane',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDygjePS1tksSLUrFk_JibscIRTIq8INrhR277Hp8glHA0m-Rf5ZPRM_4LJW0p_PA1oT9L84Su7N1vU-eeqqgKCPrPl1DhBPgr42MWt2oZhxtSeVmV-gO1AlAwHFcdLK8KXmMt8vZhdZLvUioM2sd2AxfHZSaUA2fFdNqjTvAyCfuFKxqhppLyrc5eqnVjiZBtlPHgNOaoe-L-dW_M1z20gKe3gnF856vK4rkSucB-yuVx6Ttiw3XxCRLctYRTYuyvCRc-v9Xmt',
    role: '全栈负责人',
    matchScore: 78,
    channel: 'External API',
    jobProfile: 'Fullstack',
    status: 'Profile Match Router: 等待路由评审',
    statusType: 'warning',
    email: 'marcus.vane@api-link.io',
    phone: '+44 20 7946 0958',
    experienceYears: 10,
    bio: '资深全栈研发经理，完美平衡极客精神与工程商业化思维。重度现代 JavaScript/TypeScript 技术栈用户，极度注重首屏性能与渲染微调。',
    metrics: {
      tech: 78,
      culture: 85,
      speed: 65,
      leadership: 88
    },
    messages: [
      {
        id: 'msg_3_1',
        sender: 'AI 助手',
        senderType: 'ai',
        content: 'Marcus 您好，看到您在 Next.js 与 React Server Components 上有丰富的实战成果。能简要分享一下您在大规模数据流控和并发渲染下的渲染极致优化心得吗？',
        time: '昨天 上午 10:15'
      },
      {
        id: 'msg_3_2',
        sender: 'Marcus Vane',
        senderType: 'candidate',
        content: '非常高兴收到邀请。目前我们在大中型中台架构中，依靠 React 19 的 Suspense Streaming HTML 极大压缩了白屏时间。同时对 Server Action 做了全面的接口鉴权与分级幂等，避免多实例竞态。',
        time: '昨天 上午 10:18'
      }
    ]
  },
  {
    id: '4',
    name: 'Jessica Wu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    role: 'AI 算法研究员',
    matchScore: 95,
    channel: 'Web Intake',
    jobProfile: 'PyTorch/LLM',
    status: 'Profile Match Router: 提示词工程评估中',
    statusType: 'info',
    email: 'jessica.wu@web-recruits.net',
    phone: '+86 159-0102-4455',
    experienceYears: 4,
    bio: '主攻大规模预训练模型微调（PEFT）、高效提示词框架和智能体协同部署。在顶级会议发表过多篇前沿科技论文。',
    metrics: {
      tech: 95,
      culture: 88,
      speed: 85,
      leadership: 70
    },
    messages: [
      {
        id: 'msg_4_1',
        sender: 'AI 助手',
        senderType: 'ai',
        content: '您好 Jessica，您的论文发表在 CVPR/NeurIPS 着实令人瞩目。请问您如何看待端侧小模型与云端超大参数量模型在边缘智能时代的平衡点？',
        time: '下午 02:20'
      },
      {
        id: 'msg_4_2',
        sender: 'Jessica Wu',
        senderType: 'candidate',
        content: '我认为在边缘计算兴起的今天，端侧通过 4-bit 量化的 3B-7B 级模型能够满足 80% 的本地实时交互，而剩余的高阶、多轮逻辑推理则通过轻量、安全的网关异步转接给云端大模型，构成云端与端侧的完美协同。',
        time: '下午 02:24'
      }
    ]
  }
];

// Lazy instantiator for Google GenAI
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not set. AI simulation will use dynamic responses.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API endpoints for Company Profile
app.get('/api/company-profile', (req, res) => {
  res.json(companyProfile);
});

app.post('/api/company-profile', (req, res) => {
  companyProfile = { ...companyProfile, ...req.body };
  res.json(companyProfile);
});

// API endpoints for Job Profiles
app.get('/api/job-profiles', (req, res) => {
  res.json(jobProfiles);
});

app.post('/api/job-profiles', (req, res) => {
  const newJob: JobProfile = {
    id: `jp_${Date.now()}`,
    title: req.body.title || '新增职位',
    skills: req.body.skills || '',
    experienceYearsRequired: Number(req.body.experienceYearsRequired) || 0,
    techWeight: Number(req.body.techWeight) || 80,
    cultureWeight: Number(req.body.cultureWeight) || 80,
    speedWeight: Number(req.body.speedWeight) || 80,
    leadershipWeight: Number(req.body.leadershipWeight) || 80,
  };
  jobProfiles.push(newJob);
  res.json(jobProfiles);
});

app.delete('/api/job-profiles/:id', (req, res) => {
  const { id } = req.params;
  jobProfiles = jobProfiles.filter(j => j.id !== id);
  res.json(jobProfiles);
});

// API endpoints for Channel Config
app.get('/api/channel-config', (req, res) => {
  res.json(channelConfig);
});

app.post('/api/channel-config', (req, res) => {
  channelConfig = { ...channelConfig, ...req.body };
  // Keep tg channel in channelsList in sync
  const tgChannel = channelsList.find(c => c.id === 'ch_tg');
  if (tgChannel) {
    tgChannel.config.botToken = channelConfig.telegramBotToken;
    tgChannel.config.chatId = channelConfig.telegramChatId;
    tgChannel.minScoreThreshold = channelConfig.minScoreThreshold;
    tgChannel.pushNotificationsEnabled = channelConfig.pushNotificationsEnabled;
    tgChannel.status = channelConfig.channelStatus === 'active' ? 'active' : 'inactive';
  }
  res.json(channelConfig);
});

// Upgraded Multi-Channel Custom CRUD APIs
app.get('/api/channels', (req, res) => {
  res.json(channelsList);
});

app.post('/api/channels', (req, res) => {
  const newChannel: ChannelItem = {
    id: `ch_${Date.now()}`,
    name: req.body.name || '新增分发渠道',
    type: req.body.type || 'Other',
    config: req.body.config || {},
    minScoreThreshold: Number(req.body.minScoreThreshold) || 80,
    pushNotificationsEnabled: req.body.pushNotificationsEnabled !== false,
    status: req.body.status || 'active'
  };
  channelsList.push(newChannel);
  res.json(channelsList);
});

app.put('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  const index = channelsList.findIndex(c => c.id === id);
  if (index !== -1) {
    channelsList[index] = {
      ...channelsList[index],
      ...req.body,
      id // preserve ID
    };
    // Also sync back to channelConfig if this is ch_tg
    if (id === 'ch_tg') {
      channelConfig.telegramBotToken = req.body.config?.botToken || channelConfig.telegramBotToken;
      channelConfig.telegramChatId = req.body.config?.chatId || channelConfig.telegramChatId;
      channelConfig.minScoreThreshold = req.body.minScoreThreshold || channelConfig.minScoreThreshold;
      channelConfig.pushNotificationsEnabled = req.body.pushNotificationsEnabled !== false;
      channelConfig.channelStatus = req.body.status === 'active' ? 'active' : 'inactive';
    }
  }
  res.json(channelsList);
});

app.delete('/api/channels/:id', (req, res) => {
  const { id } = req.params;
  channelsList = channelsList.filter(c => c.id !== id);
  res.json(channelsList);
});


// AI Score Matching & Auto-Scoring algorithm execution
app.post('/api/matching/execute', (req, res) => {
  const { jobId } = req.body;
  const job = jobProfiles.find(j => j.id === jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job profile not found' });
  }

  // Calculate scores for all candidates dynamically
  candidates = candidates.map(cand => {
    const techMultiplier = cand.jobProfile.toLowerCase().includes(job.skills.split(',')[0].trim().toLowerCase()) ? 1.05 : 0.95;
    
    // Weighted match score:
    const totalWeights = job.techWeight + job.cultureWeight + job.speedWeight + job.leadershipWeight;
    const weightedSum = 
      (cand.metrics.tech * techMultiplier * job.techWeight) + 
      (cand.metrics.culture * (companyProfile.cultureRating / 100) * job.cultureWeight) + 
      (cand.metrics.speed * (companyProfile.speedRating / 100) * job.speedWeight) + 
      (cand.metrics.leadership * (companyProfile.leadershipRating / 100) * job.leadershipWeight);
    
    let score = Math.round(weightedSum / totalWeights);
    if (score > 100) score = 100;
    if (score < 30) score = Math.floor(Math.random() * 20) + 40; // baseline

    return {
      ...cand,
      matchScore: score,
      role: job.title,
      jobProfile: job.skills.split(',')[0].trim(),
      status: `Profile Match Router: 针对 [${job.title}] 自动算力评分完成`,
      statusType: score >= 85 ? 'success' : score >= 70 ? 'info' : 'warning' as 'success' | 'warning' | 'info'
    };
  });

  res.json(candidates);
});

// API endpoints for Candidates
app.get('/api/candidates', (req, res) => {
  res.json(candidates);
});

// Post a message in the chat (recruiter to candidate)
app.post('/api/candidates/:id/message', async (req, res) => {
  const { id } = req.params;
  const { sender, senderType, content } = req.body;

  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const timeNow = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  // Add the recruiter's message or newly routed message
  const recruiterMsg: Message = {
    id: `msg_${candidate.id}_${Date.now()}_recruiter`,
    sender,
    senderType,
    content,
    time: timeNow,
  };
  candidate.messages.push(recruiterMsg);

  // Trigger candidate response simulation if the message is from recruiter or AI
  if (senderType === 'recruiter' || senderType === 'ai') {
    const aiInstance = getGenAI();

    if (aiInstance) {
      try {
        const chatHistory = candidate.messages
          .map((m) => `${m.senderType === 'recruiter' ? 'Recruiter' : m.senderType === 'ai' ? 'AI Assessment Bot' : candidate.name}: ${m.content}`)
          .join('\n');

        const prompt = `You are simulating a candidate named "${candidate.name}" who is responding to a recruiter or interview bot message in a simulated recruiting portal.
Their profile:
- Role: ${candidate.role}
- Current Assessment Phase: ${candidate.status}
- Skills: ${candidate.jobProfile}
- Match score: ${candidate.matchScore}%
- Metrics: Tech level is ${candidate.metrics.tech}/100, Culture match is ${candidate.metrics.culture}/100, Delivery Speed is ${candidate.metrics.speed}/100, Leadership potential is ${candidate.metrics.leadership}/100.
- Bio: ${candidate.bio}

Here is the current conversation history:
${chatHistory}

Please generate the candidate's next response as a highly realistic, professional, polite, and technically accurate answer, written in Chinese. The response should sound completely natural for their seniority level and correspond exactly to their skills (${candidate.jobProfile}) and match score. Do not prefix the message with their name; just output the direct message content. Keep it within 3-4 sentences.`;

        const response = await aiInstance.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
        });

        const replyContent = response.text || '谢谢您的提问，我会尽快回复您的详细信息。';

        const cReply: Message = {
          id: `msg_${candidate.id}_${Date.now()}_cand`,
          sender: candidate.name,
          senderType: 'candidate',
          content: replyContent.trim(),
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };

        candidate.messages.push(cReply);
      } catch (err: any) {
        console.error('Gemini Candidate simulation failed:', err);
        // Fallback response:
        const fallbackReply: Message = {
          id: `msg_${candidate.id}_${Date.now()}_cand`,
          sender: candidate.name,
          senderType: 'candidate',
          content: `非常好的技术思考。针对您提到的问题，我个人认为可以通过更细粒度的配置并结合监控日志来进行快速迭代，希望在面试中和您进一步展开交流。`,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        candidate.messages.push(fallbackReply);
      }
    } else {
      // Offline fallback:
      setTimeout(() => {
        const offlineReply: Message = {
          id: `msg_${candidate.id}_${Date.now()}_cand`,
          sender: candidate.name,
          senderType: 'candidate',
          content: `好的，我认为关于这一点，实践中的架构应该结合高可靠部署保障和严格的性能红线来优化。期待与您的技术团队更深层的会谈！`,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        candidate.messages.push(offlineReply);
      }, 500);
    }
  }

  res.json(candidate);
});

// AI Screening bot asks a dynamic screening question
app.post('/api/candidates/:id/ask-ai', async (req, res) => {
  const { id } = req.params;
  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const aiInstance = getGenAI();
  const timeNow = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  if (aiInstance) {
    try {
      const historySummary = candidate.messages
        .map((m) => `${m.senderType === 'ai' ? 'AI' : m.senderType === 'candidate' ? 'Candidate' : 'Recruiter'}: ${m.content}`)
        .join('\n');

      const prompt = `You are the AI Screening Bot inside "TalentRouter". Based on the candidate's profile, generate the *next* logical, professional technical interview screening question in Chinese.
Candidate details:
- Name: ${candidate.name}
- Speciality Profile: ${candidate.jobProfile}
- Role description: ${candidate.role}
- Metrics: Tech is ${candidate.metrics.tech}, Culture is ${candidate.metrics.culture}

Past conversation history:
${historySummary}

Output ONLY the question message, in a friendly, conversational tone representing the "AI Screening Bot". Do not add introductions or brackets. Keep it under 2 lines.`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const aiQuestion = response.text || '请简要介绍一下您在生产环境遇到过的最具挑战性的难题。';
      
      const newAiMsg: Message = {
        id: `msg_${candidate.id}_${Date.now()}_ai`,
        sender: 'AI 助手',
        senderType: 'ai',
        content: aiQuestion.trim(),
        time: timeNow,
      };
      candidate.messages.push(newAiMsg);

      // Now auto-generate the candidate's wise reply to that AI question as well
      const responseCandidate = await aiInstance.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `You are simulating the candidate "${candidate.name}" replying to the AI Screening Bot.
They were just asked: "${aiQuestion}"
Their profile:
- Role: ${candidate.role}
- Skills/Profile: ${candidate.jobProfile}
- Match score: ${candidate.matchScore}%
- Bio: ${candidate.bio}

Provide a realistic, professional, Chinese response that showcases their deep experience dynamically. Limit response to 3 short sentences. Do not add metadata prefixes.`,
      });

      const replyCandidate = responseCandidate.text || '我们针对该瓶颈引入了本地缓存和异步消息推送体系，降低了数据库直连压力。';
      
      const newCandMsg: Message = {
        id: `msg_${candidate.id}_${Date.now()}_cand`,
        sender: candidate.name,
        senderType: 'candidate',
        content: replyCandidate.trim(),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      candidate.messages.push(newCandMsg);

    } catch (err: any) {
      console.error('Ask AI generation failed:', err);
      // fallback
      candidate.messages.push({
        id: `msg_${candidate.id}_${Date.now()}_ai`,
        sender: 'AI 助手',
        senderType: 'ai',
        content: '对于您过去的云架构重构，您在应对高并发扩容时最核心的设计原则是什么？',
        time: timeNow,
      });
      candidate.messages.push({
        id: `msg_${candidate.id}_${Date.now()}_cand`,
        sender: candidate.name,
        senderType: 'candidate',
        content: '我们最关注无状态设计与水平自动扩容，同时对各个微服务边界做了强隔离与断路防护，这样可以承受偶发流量冲击。',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      });
    }
  } else {
    // Local fallback
    candidate.messages.push({
      id: `msg_${candidate.id}_${Date.now()}_ai`,
      sender: 'AI 助手',
      senderType: 'ai',
      content: '针对您简历中提及的复杂业务逻辑，您通常用什么监控机制去及时探测内存分配泄漏？',
      time: timeNow,
    });
    candidate.messages.push({
      id: `msg_${candidate.id}_${Date.now()}_cand`,
      sender: candidate.name,
      senderType: 'candidate',
      content: '我们会在测试沙盒环境中，挂载 pprof 并对内存段做连续抓包对比，结合 Grafana 监控宿主机物理内存的长期爬升趋势，非常容易定位到未释放的 goroutine 块。',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    });
  }

  res.json(candidate);
});

// AI-powered resume beautiful optimization & formatting (一键美化成品简历)
app.post('/api/resumes/beautify', async (req, res) => {
  const { templateType, name, experienceYears, skills, projects, bio, nationality, language, feedback } = req.body;
  const aiInstance = getGenAI();

  const formattedNationality = nationality || 'Singapore 🇸🇬';
  const targetLanguageText = language === 'en' ? 'English' : language === 'ja' ? 'Japanese' : 'Simplified Chinese';

  if (aiInstance) {
    try {
      let prompt = `You are a world-class Resume Optimization Expert at TalentRouter. Your task is to critique and rewrite a candidate's raw profile into an outstanding, professional, elite-format resume.

INPUT DATA:
- Candidate Name: ${name || '周至能'}
- Template Discipline: ${templateType || 'programmer'} (e.g. software engineer, AI researcher, cloud architect)
- Years of Experience: ${experienceYears || 3} years
- Skill tags: ${skills || 'Go, React'}
- Project Details: ${projects || 'Developed high traffic service'}
- Self Introduction/Bio: ${bio || 'Motivated tech lead'}

CRITICAL STRATEGY FOR REGIONAL MATCHING:
- TARGET COUNTRY: ${formattedNationality}. Optimize the style, cultural idioms, scaling metrics, and formatting parameters to suit elite standards in this country. (e.g., for Singapore/US, emphasize measurable impact in USD/SGD, team collaboration, and cloud-native scaling. For Japan, stress extreme system reliability, testing completeness, and respectful Keigo Japanese phrasing).
- WORKPLACE WRITING: Rewrite the project descriptions using the STAR method (quantify output, throughput, dollars, or speed increments). Convert passive phrasing into high-impact action verbs.
- LANGUAGE REQUIREMENT: You MUST generate the ENTIRE resume content in "${targetLanguageText}". `;

      if (feedback && feedback.trim()) {
        prompt += `\n\n- IMPORTANT ITERATIVE REVISION REQUEST: The user has reviewed their candidate profile and requested the following custom refinements: "${feedback}". Please fully modify/adjust the resume and details to accurately reflect and highlight this feedback. Preserve the overall solid ATS format and target language.`;
      }

      prompt += `\n\nResponse MUST be a clean, valid JSON object fitting exactly this schema:
{
  "refinedName": "refined clean candidate name in target language",
  "refinedTitle": "an elegant professional title aligned with experience",
  "refinedSkills": "selected key skills, comma separated",
  "refinedExperience": ${experienceYears || 3},
  "refinedBio": "a highly professional, 2-line executive summary summarizing key achievements",
  "beautifiedMarkdown": "the full-length beautified resume formatted in clean, professional markdown with headings (Profile Summary, Technical Stacks, Key Projects, etc.). Use lists, bullet points, and elegant typography labels. Do NOT wrap this output in backticks, return raw markdown with newlines"
}`;

      const response = await aiInstance.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              refinedName: { type: Type.STRING },
              refinedTitle: { type: Type.STRING },
              refinedSkills: { type: Type.STRING },
              refinedExperience: { type: Type.INTEGER },
              refinedBio: { type: Type.STRING },
              beautifiedMarkdown: { type: Type.STRING }
            },
            required: ['refinedName', 'refinedTitle', 'refinedSkills', 'refinedExperience', 'refinedBio', 'beautifiedMarkdown']
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({
        success: true,
        ...parsed
      });

    } catch (err: any) {
      console.error('Failed to beautify resume with Gemini:', err);
    }
  }

  // Fallback Beautifier generator if Gemini is missing or fails
  const pName = name || '周晓明 (Lucas Chow)';
  const pTitle = templateType === 'ai_researcher' ? 'AI 算法与提示词系统架构专家' : '高级后端与多活云原生研发专家';
  const targetLang = language || 'zh';

  let localMarkdown = '';
  let refinedBio = '';

  if (targetLang === 'en') {
    refinedBio = `Accomplished Full-Stack Engineer with ${experienceYears} years of technical excellence in distributed routing systems and hybrid cloud workloads. Expert in performance bottleneck elimination and automated workflow design.`;
    localMarkdown = `# ${pName}\n**${pTitle}** | Target: ${formattedNationality} (ATS-Compliant Formats)\n\n---\n\n### ■ Professional Summary\n${refinedBio}\n\n### ■ Core Technical Expertise\n* **Languages**: ${skills || 'TypeScript, Go, Python, SQL'}\n* **Cloud Systems**: Docker, Kubernetes, AWS, Terraform, CI/CD Pipeline\n* **Core Focus**: High Throughput Routing, State Synchronization, Multi-Tenant Security, Active Fault Isolation\n\n### ■ Outstanding Projects\n#### 1. Cloud-Native Elastic Multi-Channel Dispatch Router\n* Architected an auto-scaling data dispatch routing hub handling over 40M daily active requests.\n* Improved processing latency by **42%** and reduced backend container crash ratings down to 0.01%.\n* Implemented dynamic health handshake endpoints and automated failovers.\n\n#### 2. Advanced Enterprise Microservices Redesign\n* Conducted seamless migration from a monolithic code structure into isolated micro-APIs.\n* Decreased server overhead costs by **28%** through container orchestration optimization.\n\n### ■ Education & Accreditations\n* BSc in Computer Science, Top University (Graduated with honors)`;
  } else if (targetLang === 'ja') {
    refinedBio = `分散ルーティングおよびハイブリッドクラウド開発において ${experienceYears} 年の実績を持つ卓越したシニアエンジニア。システムのボトルネック解消や高負荷処理の自動化において、数多くの実証事例を有しています。`;
    localMarkdown = `# ${pName}（履歴書）\n**${pTitle}** | 希望勤務地: ${formattedNationality}\n\n---\n\n### ■ 職務要約\n${refinedBio}\n\n### ■ 主要技術スタック\n* **言語**: ${skills || 'TypeScript, Go, Python, SQL'}\n* **プラットフォーム**: Docker, Kubernetes, AWS, Linux, Webhook\n* **ドメイン**: 高可用プロトコル、マルチチャネル通知配信、セキュリティ暗号化\n\n### ■ 主要開発プロジェクト履歴\n#### 1. 高スループットマルチチャネル自動配信ルーターの設計・開発\n* 日々4,000万件超のリクエストを分散処理する自動ルーター基盤を設計。\n* サーバレイテンシを **42% 削減** し、クラッシュ率を 0.01% 未満に維持する設計理論を導入。\n* アクティブ障害検知機構の組み込みによる自動復旧をサポート。\n\n#### 2. マイクロサービス移行およびクラウドコストの最適化\n* モノリスからGo/Nodeベースの独立コンテナサービス群への安全なリプレイスをリード。\n* AWS インフラのリソース再構築により、月间運用コストを **28% 削減**。\n\n### ■ 学歴・資格\n* 情報理工学部学術士（成績優秀賞）/ AWS 認定ソリューションアーキテクト`;
  } else {
    refinedBio = `具有 ${experienceYears} 载核心研发生涯的资深工程专家，主攻多高并发高吞吐微服务架构及分布式网络下发信道设计。崇尚指标驱动开发，擅长极速故障定位、多国籍多语境适配及自动化流控。`;
    localMarkdown = `# ${pName} 的美化简历\n**${pTitle}** | 目标国家: ${formattedNationality} (国籍自适应优化体)\n\n---\n\n### ■ 个人专业概述\n${refinedBio}\n\n### ■ 核心技术栈分布\n* **技术硬核**: ${skills || 'Go, TypeScript, Python, REST Api, Kubernetes, Docker'}\n* **领域专长**: 全物理信道自动适配、智能高契合度重构、异构网络推流、多语言自适应\n\n### ■ 重大项目演练\n#### 1. 全球自适应弹性多渠道人才生命周期分发路由器\n* 牵头研发了支持日均千万级分发流的高可用路由器底座，实现了多点 Telegram / Slack 的即时广播路由。\n* 通过缓存层预置及高频协程池优化，使整机计算时延下降 **42%**，故障率控制在万分之一极优指标。\n* 主动故障隔离与重试机制保障了异构信道的极端状况稳定性。\n\n#### 2. 云原生异构体系微架构迁移及能效重整\n* 主导并平滑完成了单体服务向轻量容器集落的改造工作，实现一键式 CI/CD 验证。\n* 通过自动化资源编排，帮助企业服务器日常运算账单下调了 **28%** 的多余开销。\n\n### ■ 教育背景与专业资质\n* 知名理工大学 计算机科学与技术学士 (优秀毕业生荣誉) / 资深 DevOps 认证专家`;
  }

  res.json({
    success: true,
    refinedName: pName,
    refinedTitle: pTitle,
    refinedSkills: skills || 'Go, TypeScript, Kubernetes',
    refinedExperience: Number(experienceYears) || 3,
    refinedBio: refinedBio,
    beautifiedMarkdown: localMarkdown
  });
});

// New Search criteria submission: Creates a matching candidate from Gemini
app.post('/api/candidates/create', async (req, res) => {
  const { role, jobProfile, channel, skillsRequired } = req.body;

  const aiInstance = getGenAI();
  const candidateId = String(candidates.length + 1);

  if (aiInstance) {
    try {
      const response = await aiInstance.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Please generate a highly realistic cyber-professional mock candidate profile in Chinese matching this criteria:
- Targeted Role: ${role}
- Job Tag: ${jobProfile}
- Channel Source: ${channel}
- Additional Target Skills: ${skillsRequired}

Produce a valid JSON object matching the requested schema exactly. Avoid any markdown code boundaries other than valid JSON.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              avatar: { type: Type.STRING },
              role: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              jobProfile: { type: Type.STRING },
              status: { type: Type.STRING },
              statusType: { type: Type.STRING },
              bio: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              experienceYears: { type: Type.INTEGER },
              metrics: {
                type: Type.OBJECT,
                properties: {
                  tech: { type: Type.INTEGER },
                  culture: { type: Type.INTEGER },
                  speed: { type: Type.INTEGER },
                  leadership: { type: Type.INTEGER }
                },
                required: ['tech', 'culture', 'speed', 'leadership']
              },
              initialConversation: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sender: { type: Type.STRING },
                    senderType: { type: Type.STRING },
                    content: { type: Type.STRING },
                    time: { type: Type.STRING }
                  },
                  required: ['sender', 'senderType', 'content', 'time']
                }
              }
            },
            required: ['name', 'avatar', 'role', 'matchScore', 'jobProfile', 'status', 'statusType', 'bio', 'metrics', 'initialConversation']
          }
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');

      // Use a premium portrait from Unsplash if avatar is generic/broken
      const defaultAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120';
      const actualAvatar = parsed.avatar && parsed.avatar.startsWith('http') ? parsed.avatar : defaultAvatar;

      const newCand: Candidate = {
        id: candidateId,
        name: parsed.name || '王小明',
        avatar: actualAvatar,
        role: parsed.role || role,
        matchScore: parsed.matchScore || 82,
        channel: channel || 'Web Intake',
        jobProfile: parsed.jobProfile || jobProfile,
        status: parsed.status || 'Profile Match Router: 待执行多维度验证',
        statusType: (parsed.statusType as any) || 'info',
        bio: parsed.bio || '自主开发多套系统，具备良好的面向对象思维和系统架构能力。',
        email: parsed.email || `${parsed.name?.toLowerCase().replace(/\s+/g, '') || 'candidate'}@talent.net`,
        phone: parsed.phone || '+86 170-0000-1111',
        experienceYears: parsed.experienceYears || 5,
        metrics: parsed.metrics || { tech: 80, culture: 80, speed: 80, leadership: 60 },
        messages: parsed.initialConversation || [
          {
            id: `msg_${candidateId}_init_1`,
            sender: 'AI 助手',
            senderType: 'ai',
            content: `你好！很高兴收到您的申请。能简述一下您在 ${skillsRequired} 方面的实际开发心得吗？`,
            time: '下午 03:00'
          },
          {
            id: `msg_${candidateId}_init_2`,
            sender: parsed.name || '王小明',
            senderType: 'candidate',
            content: `没问题。在过去的研发中，我们采用该选型承载了大量的并发工作，通过自动化调控和池化机制获得了非常好的运行性能。`,
            time: '下午 03:02'
          }
        ]
      };

      candidates.unshift(newCand);
      return res.json(newCand);
    } catch (err: any) {
      console.error('Failed to parse Gemini generated candidate profile:', err);
    }
  }

  // Fallback candidate if Gemini API key not set or failed
  const names = ['李晓婷', '周建国', '陈明华', '林晓莹'];
  const nameChosen = names[Math.floor(Math.random() * names.length)];
  const randomScore = Math.floor(Math.random() * 20) + 75;

  const freshCandidate: Candidate = {
    id: candidateId,
    name: nameChosen,
    avatar: nameChosen.endsWith('莹') || nameChosen.endsWith('婷') 
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120'
      : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    role: role || '资深工程师',
    matchScore: randomScore,
    channel: channel || 'Web Intake',
    jobProfile: jobProfile || 'Specialist',
    status: 'Profile Match Router: 待执行多维度验证',
    statusType: 'info',
    email: 'new.candidate@talent.net',
    phone: '+86 188-1234-5678',
    experienceYears: 5,
    bio: `精通 ${skillsRequired || '各种开发技术'} 的实战派极客。对高能效工程及团队协作有深刻理解。`,
    metrics: {
      tech: Math.floor(Math.random() * 20) + 75,
      culture: Math.floor(Math.random() * 20) + 70,
      speed: Math.floor(Math.random() * 20) + 65,
      leadership: Math.floor(Math.random() * 20) + 60,
    },
    messages: [
      {
        id: `msg_${candidateId}_fallback_1`,
        sender: 'AI 助手',
        senderType: 'ai',
        content: `恭喜您匹配成功！请问您可以谈一谈您对 ${skillsRequired || '本岗位核心能力'} 的具体感悟吗？`,
        time: '下午 04:12'
      },
      {
        id: `msg_${candidateId}_fallback_2`,
        sender: nameChosen,
        senderType: 'candidate',
        content: `你好！我认为最重要点是在生产实践中坚守代码的健壮性、可测试程度。我在 ${jobProfile} 架构上有多年完整的从零构建经验，期望进一步验证。`,
        time: '下午 04:15'
      }
    ]
  };

  candidates.unshift(freshCandidate);
  res.json(freshCandidate);
});

// Status modifiers (action buttons) - Real or Simulated Multi-Channel Dispatch Router
app.post('/api/candidates/:id/dispatch', async (req, res) => {
  const { id } = req.params;
  const { channels } = req.body; // Array of channel IDs to dispatch to, e.g. ["ch_tg", "ch_slack"]

  const candidate = candidates.find((c) => c.id === id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const timeNow = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  // Determine channels to target
  let targetChannels = channelsList.filter(c => c.status === 'active');
  if (Array.isArray(channels) && channels.length > 0) {
    targetChannels = channelsList.filter(c => channels.includes(c.id));
  }

  const summaryMarkdown = `🎯 *TalentRouter 智能分发 - 高契合人才下发指令* \n\n` +
    `👤 *姓名*: ${candidate.name} \n` +
    `💼 *意向岗位*: ${candidate.role} \n` +
    `📊 *配合评分*: *${candidate.matchScore}%* \n` +
    `🔌 *物理对接渠道*: ${candidate.channel} \n\n` +
    `应用目标: (${candidate.email || 'talent@router.io'}) | ${candidate.experienceYears} 年研发资历\n` +
    `🛠️ *核心技术*: \`${candidate.jobProfile}\` \n` +
    `📝 *简历简介*: ${candidate.bio || '无'} \n\n` +
    `⚙️ *三阶契合评估*: \n` +
    `├─ 技术契合度: ${candidate.metrics.tech}/100 \n` +
    `├─ 文化相契率: ${candidate.metrics.culture}/100 \n` +
    `├─ 迭代推进率: ${candidate.metrics.speed}/100 \n` +
    `└─ 敏捷协作分: ${candidate.metrics.leadership}/100 \n\n` +
    `📢 [TalentRouter 多语境自适应大区推送中心]`;

  const results: Array<{ channelId: string; name: string; type: string; success: boolean; realSent: boolean; message: string }> = [];

  for (const chan of targetChannels) {
    let chanRealSent = false;
    let chanDetail = '模拟下发成功';

    if (chan.type === 'Telegram' && chan.config.botToken && chan.config.botToken.trim().length > 10 && !chan.config.botToken.includes('AAEi6-FdkjsH')) {
      try {
        const token = chan.config.botToken.trim();
        const chatId = chan.config.chatId?.trim();
        if (chatId) {
          const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: summaryMarkdown,
              parse_mode: 'Markdown'
            })
          });
          const resData = await response.json();
          if (resData.ok) {
            chanRealSent = true;
            chanDetail = '物理 Telegram Bot 已成功向下发群送出消息';
          } else {
            chanDetail = `物理 TG 失败: ${JSON.stringify(resData)}`;
          }
        }
      } catch (err: any) {
        console.error(`Telegram dispatch error to channel ${chan.id}:`, err);
        chanDetail = `通信失效: ${err.toString()}`;
      }
    } else if (chan.type === 'Slack' && chan.config.webhookUrl && chan.config.webhookUrl.trim().length > 15 && !chan.config.webhookUrl.includes('XXXXXXXX')) {
      try {
        const response = await fetch(chan.config.webhookUrl.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: summaryMarkdown })
        });
        if (response.ok) {
          chanRealSent = true;
          chanDetail = '物理 Slack Webhook 实锤下架完毕';
        } else {
          chanDetail = `Slack Webhook 拒绝接入: ${response.status} ${response.statusText}`;
        }
      } catch (err: any) {
        chanDetail = `Slack 连结断开: ${err.toString()}`;
      }
    } else if (chan.type === 'Webhook' && chan.config.endpointUrl && chan.config.endpointUrl.trim().length > 5 && !chan.config.endpointUrl.includes('talentrouter.io')) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (chan.config.secretHeader) {
          headers[chan.config.secretHeader] = 'TalentRouter-Trigger-Secure';
        }
        const response = await fetch(chan.config.endpointUrl.trim(), {
          method: 'POST',
          headers,
          body: JSON.stringify({ event: 'talent_dispatched', candidate })
        });
        if (response.ok) {
          chanRealSent = true;
          chanDetail = '第三方 Webhook API 接收入库成功';
        }
      } catch (err: any) {
        chanDetail = `Webhook 断联: ${err.toString()}`;
      }
    }

    results.push({
      channelId: chan.id,
      name: chan.name,
      type: chan.type,
      success: true, // Mark true for simulation/real
      realSent: chanRealSent,
      message: chanDetail
    });
  }

  // Choose display text status
  const totalSent = results.length;
  const realSents = results.filter(r => r.realSent).length;
  candidate.status = realSents > 0
    ? `Profile Match Router: 配对成功，已通过 ${realSents} 组真实物理信道分发`
    : `Profile Match Router: 多端渠道模拟下发成功 (${totalSent} 各节点仿真完成)`;
  candidate.statusType = 'success';

  res.json({
    success: true,
    results,
    candidate,
    message: realSents > 0
      ? `对齐完毕，情报包成功下发并渗透至互联网物理安全区！`
      : `多端模拟分流同步调度。已对齐 ${totalSent} 个活跃信道。`
  });
});


app.post('/api/telegram/test-push', async (req, res) => {
  const { token, chatId } = req.body;
  const testMsg = `🔋 *TalentRouter 物理通道状态联通测试* \n\n` +
    `📡 联通测试触发源: lijianya866 (主干控制端) \n` +
    `⏳ 握手握合时戳: ${new Date().toLocaleString('zh-CN')} \n` +
    `✅ 物理信道打通: Awaiting Dispatch Requests! \n` +
    `🔌 当前已连结活跃通道: Telegram Bot, Slack Sync Service, REST Web Ingress.`;

  let realSent = false;
  let statusDetail = '';

  if (token && token.trim().length > 10 && !token.includes('AAEi6-FdkjsH')) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMsg,
          parse_mode: 'Markdown'
        })
      });
      const resData = await response.json();
      if (resData.ok) {
        realSent = true;
      }
      statusDetail = JSON.stringify(resData);
    } catch (err: any) {
      statusDetail = err.toString();
    }
  }

  res.json({
    success: true,
    realSent,
    statusDetail,
    message: realSent 
      ? `🎯 极客握手电波已发送，物理 Telegram Bot 成功向下发群送出测试消息！` 
      : `🔄 本地模拟：握手成功，调试渠道显示为 STANDBY 握包通过。`
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Vite client server bridge
const startServer = async () => {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TalentRouter] Backend running on port ${PORT}`);
  });
};

startServer();
