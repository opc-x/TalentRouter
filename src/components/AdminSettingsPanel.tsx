import React from 'react';
import { Network, X, Send, Cpu } from 'lucide-react';
import { ChannelItem, CompanyProfile } from '../types.js';

interface AdminSettingsPanelProps {
  channelsList: ChannelItem[];
  handleToggleChannelStatus: (id: string, s: any) => void;
  handleDeleteChannel: (id: string) => void;
  channelForm: any;
  setChannelForm: (f: any) => void;
  handleUpdateChannel: (e: React.FormEvent) => void;
  handleTelegramTestPush: () => void;
  newChannelForm: any;
  setNewChannelForm: (f: any) => void;
  isAddingChannel: boolean;
  setIsAddingChannel: (adding: boolean) => void;
  handleAddChannel: (name: string, type: any, config: any) => void;
  companyForm: CompanyProfile;
  setCompanyForm: (c: any) => void;
  handleUpdateCompany: (e: React.FormEvent) => void;
  isSaving: boolean;
  triggerToast: (text: string, type: any) => void;
}

export default function AdminSettingsPanel({
  channelsList,
  handleToggleChannelStatus,
  handleDeleteChannel,
  channelForm,
  setChannelForm,
  handleUpdateChannel,
  handleTelegramTestPush,
  newChannelForm,
  setNewChannelForm,
  isAddingChannel,
  setIsAddingChannel,
  handleAddChannel,
  companyForm,
  setCompanyForm,
  handleUpdateCompany,
  isSaving,
  triggerToast,
}: AdminSettingsPanelProps) {
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* ADMIN CONFIG 1: Channels Nodes Matrix Configuration (配置全球分发信道矩阵) */}
      <div className="bg-white p-6 rounded-3xl border border-black/[0.04] shadow-sm space-y-6">
        
        <div className="border-b border-black/5 pb-3">
          <h3 className="text-lg font-serif font-black flex items-center gap-2 text-black">
            <Network className="w-5 h-5 text-[#C45524]" />
            <span>全球分布式分发信道矩阵 (Output Node Matrix)</span>
          </h3>
          <p className="text-xs text-black/40 mt-1">负责打通实体 Telegram bot, Slack Webhooks, Custom REST API 本地路由或外置管道</p>
        </div>

        {/* Active multi channels list */}
        <div className="space-y-3">
          <p className="text-[10.5px] font-extrabold text-[#C45524] uppercase tracking-wide">目前网络层已通联节点 (Connected Network Outlets)</p>
          
          <div className="grid grid-cols-1 gap-3">
            {channelsList.map(ch => (
              <div 
                key={ch.id}
                className="p-4 bg-[#FAF9F6] border border-black/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-black font-sans">{ch.name}</h4>
                    <span className="text-[9px] font-mono text-black/40 bg-black/5 px-2 py-0.5 rounded-full uppercase shrink-0">{ch.type}</span>
                  </div>
                  <p className="text-[10px] text-black/50 font-mono truncate max-w-sm">
                    {ch.type === 'Telegram' && `Bot Token: ${ch.config.botToken?.slice(0,10)}... | ChatId: ${ch.config.chatId}`}
                    {ch.type === 'Slack' && `Webhook URL: ${ch.config.webhookUrl?.slice(0,35)}...`}
                    {ch.type === 'Webhook' && `Post Endpoint: ${ch.config.endpointUrl}`}
                    {!['Telegram', 'Slack', 'Webhook'].includes(ch.type) && `Active dynamic credential binding`}
                  </p>
                  <p className="text-[9px] text-[#C45524] font-mono">
                    * 准入评分下限: 综合比对达到 {ch.minScoreThreshold}% 才触发真实群广播
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 shrink-0">
                  {/* Toggle active / inactive */}
                  <button
                    onClick={() => handleToggleChannelStatus(ch.id, ch.status === 'active' ? 'inactive' : 'active')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer ${
                      ch.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' 
                        : 'bg-black/5 text-black/40 hover:bg-black/10'
                    }`}
                  >
                    {ch.status === 'active' ? '● 线上 Active' : '○ 挂起 Standby'}
                  </button>

                  <button
                    onClick={() => handleDeleteChannel(ch.id)}
                    className="p-2 bg-[#FAF9F6] border border-black/5 text-black/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="下卸拆除此路由信道"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Telegram Core Handshake & Test connection widget */}
        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-black/10 space-y-4">
          <p className="text-[11px] font-black text-black/60 font-mono">⚡ 骨干网一键测试 (Telegram Socket Handbook Ping)</p>
          <form onSubmit={handleUpdateChannel} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-mono font-bold text-black/50 mb-1">TELEGRAM BOT TOKEN</label>
                <input
                  type="password"
                  placeholder="Bot API Token..."
                  value={channelForm.telegramBotToken}
                  onChange={(e) => setChannelForm({ ...channelForm, telegramBotToken: e.target.value })}
                  className="w-full bg-white border border-black/10 rounded-lg p-2 text-xs font-mono text-black"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono font-bold text-black/50 mb-1">TARGET GROUP/CHAT ID</label>
                <input
                  type="text"
                  placeholder="如: @MyGroupChat"
                  value={channelForm.telegramChatId}
                  onChange={(e) => setChannelForm({ ...channelForm, telegramChatId: e.target.value })}
                  className="w-full bg-white border border-black/10 rounded-lg p-2 text-xs font-mono text-black"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={handleTelegramTestPush}
                className="flex-1 py-1.5 bg-white border border-black/10 hover:bg-black/5 text-black font-bold text-xs rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#0088cc]" />
                <span>脉冲握手连结测试 (Ping Node)</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-black text-white hover:bg-[#C45524] font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                保存骨干信道参数
              </button>
            </div>
          </form>
        </div>

        {/* Form to connect a NEW custom routing destination channel */}
        <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-black/10 space-y-3.5">
          <div className="flex justify-between items-center">
            <p className="text-[11px] font-black text-black/60 font-mono">🔌 添加全新分布式输出终端 (Add channel outlet)</p>
            <button
              onClick={() => setIsAddingChannel(!isAddingChannel)}
              className="text-[10px] text-[#C45524] hover:underline font-bold"
            >
              {isAddingChannel ? '收起表单' : '展开新增信道表单'}
            </button>
          </div>

          {isAddingChannel && (
            <div className="space-y-3 pt-2 border-t border-black/[0.04]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-black/55 mb-1 text-black">通信路线名称</label>
                  <input
                    type="text"
                    value={newChannelForm.name}
                    onChange={(e) => setNewChannelForm({...newChannelForm, name: e.target.value})}
                    placeholder="例: 全球研发协作 Slack"
                    className="w-full bg-white border border-black/5 rounded-lg p-2 text-xs text-black"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-black/55 mb-1 text-black">通道网络类型</label>
                  <select
                    value={newChannelForm.type}
                    onChange={(e) => setNewChannelForm({...newChannelForm, type: e.target.value as any})}
                    className="w-full bg-white border border-black/5 rounded-lg p-2 text-xs text-black cursor-pointer font-semibold"
                  >
                    <option value="Slack">Slack Webhook URL</option>
                    <option value="Discord">Discord monitoring bot</option>
                    <option value="Webhook">REST API Webhook Outflow</option>
                    <option value="Telegram">Other Telegram Bot</option>
                  </select>
                </div>
              </div>

              {newChannelForm.type === 'Slack' && (
                <div>
                  <label className="block text-[9px] font-bold text-black/55 mb-1">SLACK INCOMING WEBHOOK URL</label>
                  <input
                    type="text"
                    placeholder="https://hooks.slack.com/services/..."
                    value={newChannelForm.webhookUrl}
                    onChange={(e) => setNewChannelForm({...newChannelForm, webhookUrl: e.target.value})}
                    className="w-full bg-white border border-black/5 rounded-lg p-2 text-xs font-mono text-black"
                  />
                </div>
              )}

              {newChannelForm.type === 'Webhook' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-black/55 mb-1">POST ENDPOINT URL</label>
                    <input
                      type="text"
                      placeholder="https://api.mycorp.org/..."
                      value={newChannelForm.endpointUrl}
                      onChange={(e) => setNewChannelForm({...newChannelForm, endpointUrl: e.target.value})}
                      className="w-full bg-white border border-black/5 rounded-lg p-2 text-xs font-mono text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-black/55 mb-1">SECRET SECURITY SIGN KEY</label>
                    <input
                      type="text"
                      placeholder="..."
                      value={newChannelForm.secretHeader}
                      onChange={(e) => setNewChannelForm({...newChannelForm, secretHeader: e.target.value})}
                      className="w-full bg-white border border-black/5 rounded-lg p-2 text-xs font-mono text-black"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={async () => {
                  if (!newChannelForm.name) {
                    triggerToast('请输入通信路线的自定义名称！', 'error');
                    return;
                  }
                  const config: any = {};
                  if (newChannelForm.type === 'Slack') config.webhookUrl = newChannelForm.webhookUrl;
                  if (newChannelForm.type === 'Webhook') {
                    config.endpointUrl = newChannelForm.endpointUrl;
                    config.secretHeader = newChannelForm.secretHeader;
                  }
                  await handleAddChannel(newChannelForm.name, newChannelForm.type, config);
                  // Reset
                  setNewChannelForm({
                    name: '',
                    type: 'Slack',
                    webhookUrl: '',
                    botToken: '',
                    chatId: '',
                    endpointUrl: '',
                    secretHeader: ''
                  });
                  setIsAddingChannel(false);
                }}
                className="w-full py-2 bg-black hover:bg-[#C45524] text-[#FFFFFF] text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                ➕ 部署此物理信道并注册至骨干中
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ADMIN CONFIG 2: Enterprise context & Multi-tier matchmaking profile base (企业文化一阶底座与权重) */}
      <div className="bg-white p-6 rounded-3xl border border-black/[0.04] shadow-sm space-y-6">
        
        <div className="border-b border-black/5 pb-3">
          <h3 className="text-lg font-serif font-black flex items-center gap-2 text-black">
            <Cpu className="w-5 h-5 text-[#C45524]" />
            <span>公司一阶文化特质底座与权重评级设定 (Enterprise Base Settings)</span>
          </h3>
          <p className="text-xs text-black/40 mt-1">控制系统对人才库匹配度评估一阶部分的默认偏好评分</p>
        </div>

        <form onSubmit={handleUpdateCompany} className="space-y-4">
          <div>
            <label className="block text-[10.5px] font-bold text-black/55 mb-1.5">企业认证实体全称</label>
            <input
              type="text"
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              className="w-full bg-[#FAF9F6] border border-black/10 rounded-xl px-3 py-2 text-xs text-black font-semibold"
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-black/55 mb-1.5 font-mono">核心技术聚焦关键字 (Core Technology Keywords)</label>
            <input
              type="text"
              value={companyForm.techFocus}
              onChange={(e) => setCompanyForm({ ...companyForm, techFocus: e.target.value })}
              className="w-full bg-[#FAF9F6] border border-black/10 rounded-xl px-3 py-2 text-xs text-black font-mono"
            />
          </div>

          <div className="space-y-3.5 pt-2 border-t border-black/[0.04]">
            <label className="block text-[10.5px] font-bold text-black/60">默认企业特质评估权重评估 (Matchmaking weights presets)</label>
            
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-mono">
                <span>敏捷交付开发速度分 (Speed & Delivery Agility)</span>
                <span className="font-bold text-black">{companyForm.speedRating}%</span>
              </div>
              <input
                type="range"
                value={companyForm.speedRating}
                onChange={(e) => setCompanyForm({ ...companyForm, speedRating: Number(e.target.value) })}
                className="w-full h-1 accent-[#C45524] bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-mono">
                <span>前沿开源技术探索突破分 (Tech Innovation & Architecture)</span>
                <span className="font-bold text-black">{companyForm.cultureRating}%</span>
              </div>
              <input
                type="range"
                value={companyForm.cultureRating}
                onChange={(e) => setCompanyForm({ ...companyForm, cultureRating: Number(e.target.value) })}
                className="w-full h-1 accent-[#C45524] bg-black/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-black/55 mb-1.5">物理实验室/企业简介陈述描述</label>
            <textarea
              rows={4}
              value={companyForm.description}
              onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
              className="w-full bg-[#FAF9F6] border border-black/10 rounded-xl p-3 text-xs text-black leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 bg-black hover:bg-[#C45524] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm text-center"
          >
            {isSaving ? '正在录入同步数据...' : '💾 一键更新企业一阶文化底座与权重'}
          </button>
        </form>

      </div>

    </div>
  );
}
