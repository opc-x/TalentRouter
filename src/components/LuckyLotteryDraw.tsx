import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Star, Send, RotateCcw, Flame } from 'lucide-react';
import { JobProfile } from '../types.js';

interface LuckyLotteryDrawProps {
  jobProfiles: JobProfile[];
  handleExecuteEngineMatch: (jobId: string) => void;
  triggerToast: (text: string, type: 'success' | 'info' | 'error') => void;
  setSelectedId: (id: string | null) => void;
}

export default function LuckyLotteryDraw({
  jobProfiles,
  handleExecuteEngineMatch,
  triggerToast,
  setSelectedId,
}: LuckyLotteryDrawProps) {
  const [activeGame, setActiveGame] = useState<'envelope' | 'scratch'>('envelope');
  
  // Game 1: Red Envelope States
  const [isShaking, setIsShaking] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [revealedOffer, setRevealedOffer] = useState<JobProfile | null>(null);
  const [fortuneText, setFortuneText] = useState('');
  
  // Game 2: Scratch Card States
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [isScratchRevealed, setIsScratchRevealed] = useState(false);
  const [scratchOffer, setScratchOffer] = useState<JobProfile | null>(null);
  const [scratchFortune, setScratchFortune] = useState('');

  // Self-contained high-fidelity win sound using browser Web Audio API
  const playWinSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Cheerful jackpot ascending major scale pentatonic tones
      const freqs = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    } catch (e) {
      console.log('Web Audio context blocked or not supported yet');
    }
  };

  const playShuffleSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  // Fun fortunes generator
  const getFortune = () => {
    const fortunes = [
      '👑 上上大吉 • 金玉满堂: 命中注定此职位与您缘分非凡！极速对齐，富贵逼人！',
      '🔥 乾坤通泰 • 面试必过: 福星照耀，今朝运势冲天！简历直投，捷报飞来！',
      '🌟 锦鲤加护 • 财源广进: AI算力开辟绿色通道，HR一眼相中，金印秒盖！',
      '🚀 飞黄腾达 • 龙腾四海: 绝活技艺契合无间，此番出征必能斩获特等Offer！',
      '💰 暴富在望 • 双喜临门: 技术天梯对齐百分百，迎祥纳福好运来叩门！'
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  };

  const handleOpenEnvelope = () => {
    if (isShaking || isOpened) return;
    playShuffleSound();
    setIsShaking(true);
    
    setTimeout(() => {
      setIsShaking(false);
      setIsOpened(true);
      playWinSound();
      
      // Pick a random job profile to recommend
      if (jobProfiles.length > 0) {
        const randomJob = jobProfiles[Math.floor(Math.random() * jobProfiles.length)];
        setRevealedOffer(randomJob);
        setFortuneText(getFortune());
        // Auto-refresh match calculations
        handleExecuteEngineMatch(randomJob.id);
        triggerToast('🧧 恭喜发财，金鼓齐鸣！完美对齐了您的好运职位！', 'success');
      } else {
        triggerToast('⚠️ 职位画像库为空，请先在下方发布一些职位～', 'info');
      }
    }, 1200);
  };

  const resetEnvelope = () => {
    setIsOpened(false);
    setRevealedOffer(null);
  };

  const handleScratchReveal = () => {
    if (isScratchRevealed) return;
    playWinSound();
    setIsScratchRevealed(true);
    
    if (jobProfiles.length > 0) {
      const idx = Math.floor(Math.random() * jobProfiles.length);
      const randomJob = jobProfiles[idx];
      setScratchOffer(randomJob);
      setScratchFortune(getFortune());
      handleExecuteEngineMatch(randomJob.id);
    } else {
      triggerToast('⚠️ 职位库空空如也，前去添加一个在招机会！', 'info');
    }
  };

  const resetScratch = () => {
    setIsScratchRevealed(false);
    setScratchOffer(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-red-650 via-red-600 to-amber-600 p-1.5 rounded-3xl shadow-xl border-4 border-amber-400 select-none relative overflow-hidden mb-8">
      {/* Dynamic confetti/sparkle particles inside the background */}
      <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
      
      {/* Decorative Golden Corner Seals */}
      <div className="absolute top-2 left-2 text-xl opacity-30 text-amber-200">🧧</div>
      <div className="absolute top-2 right-2 text-xl opacity-30 text-amber-200">👑</div>
      <div className="absolute bottom-2 left-2 text-xl opacity-30 text-amber-200">💰</div>
      <div className="absolute bottom-2 right-2 text-xl opacity-30 text-amber-200">✨</div>

      <div className="bg-red-700/90 rounded-2.5xl p-6 border-2 border-dashed border-amber-300 text-white flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        
        {/* Banner with sound indicator dynamic flashing */}
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
            <Trophy className="w-4 h-4 text-slate-900" />
            <span>🎰 招财纳福 • 求职乐翻天 (Jackpot Portal)</span>
          </div>
          <h2 className="text-3xl font-black text-amber-300 tracking-tight mt-1 animate-bounce">
            开门见喜，天降黄金 Offer！
          </h2>
          <p className="text-red-100 text-xs max-w-xl leading-relaxed">
            告别古板繁重的长篇问答，让AI福星为您指路！点击抽福袋或刮彩票，瞬间爆发出属于您的上上签首选职位，附赠喜庆好运大礼包！
          </p>
        </div>

        {/* Tab switch of games */}
        <div className="inline-flex bg-red-800/80 p-1 rounded-2xl border border-amber-500/30 z-10">
          <button
            onClick={() => setActiveGame('envelope')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeGame === 'envelope' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 shadow-md' 
                : 'text-red-100 hover:text-amber-200'
            }`}
          >
            <span>🧧 天降福袋开门红</span>
          </button>
          <button
            onClick={() => setActiveGame('scratch')}
            className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeGame === 'scratch' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-900 shadow-md' 
                : 'text-red-100 hover:text-amber-200'
            }`}
          >
            <span>🎁 一键爆金刮刮卡</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="w-full max-w-lg mx-auto py-2 z-10">
          
          {/* GAME 1: RED ENVELOPE */}
          {activeGame === 'envelope' && (
            <div className="flex flex-col items-center space-y-4">
              <AnimatePresence mode="wait">
                {!isOpened ? (
                  <motion.div
                    key="closed_env"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
                      rotate: isShaking ? [0, -5, 5, -5, 5, 0] : 0
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleOpenEnvelope}
                    className="w-52 h-72 bg-gradient-to-b from-red-600 to-red-850 rounded-2xl border-4 border-amber-400 shadow-2xl flex flex-col justify-between p-5 cursor-pointer hover:scale-105 active:scale-95 transition-transform relative group"
                  >
                    {/* Ring background shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-xl" />
                    
                    <div className="text-left">
                      <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-black tracking-widest block w-fit shadow-xs uppercase">
                        AI SPECIAL
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center space-y-3.5 my-auto">
                      <div className="w-16 h-16 rounded-full bg-amber-400 border-2 border-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/20 text-2xl font-black text-rose-800 animate-pulse group-hover:scale-110 transition-transform">
                        開
                      </div>
                      <p className="text-[12.5px] font-black text-amber-200 tracking-wider">
                        ★ 点击撕开好运福袋 ★
                      </p>
                    </div>

                    <div className="text-center text-[10px] text-amber-300 font-bold">
                      福运连连 • 锦鲤保过
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="opened_env"
                    initial={{ scale: 0.85, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    className="w-full bg-stone-900 rounded-3xl border-3 border-amber-400 p-6 shadow-2xl space-y-5 text-left relative overflow-hidden"
                  >
                    {/* Golden sparkles */}
                    <div className="absolute top-2 right-2 text-2xl animate-spin-slow pointer-events-none text-amber-300">👑</div>
                    <div className="absolute bottom-2 left-2 text-xl animate-pulse pointer-events-none text-emerald-400">💰</div>
                    
                    <div className="text-center border-b border-white/10 pb-4">
                      <div className="inline-flex p-2 bg-amber-400/10 rounded-xl mb-1 text-amber-400 border border-amber-400/20">
                        <Star className="w-5 h-5 fill-amber-400" />
                      </div>
                      <h4 className="text-xl font-black text-amber-300 leading-none">🎰 头等福袋：金榜题名签</h4>
                      <p className="text-[11px] text-emerald-400 font-bold mt-1.5 tracking-wide uppercase">
                        {fortuneText}
                      </p>
                    </div>

                    {revealedOffer ? (
                      <div className="bg-white/5 border border-amber-400/30 p-4.5 rounded-2xl relative overflow-hidden space-y-3">
                        <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 rounded-bl-xl flex items-center justify-center">
                          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                        </div>
                        
                        <div>
                          <span className="text-[10px] text-amber-300 font-black tracking-widest uppercase block mb-1">
                            🧧 爆款心水推荐 (HOT MATCH)
                          </span>
                          <h5 className="text-base font-black text-white">{revealedOffer.title}</h5>
                          <p className="text-xs text-stone-300 mt-1">
                            必检要求: <span className="text-amber-300 font-bold">{revealedOffer.experienceYearsRequired} 年+ 核心经验</span>
                          </p>
                        </div>

                        <div className="p-2.5 bg-stone-950 rounded-xl text-stone-200 border border-white/5 text-xs font-mono select-all truncate break-all">
                          💥 {revealedOffer.skills}
                        </div>

                        <div className="flex justify-between items-center pt-2 gap-3">
                          <button
                            onClick={resetEnvelope}
                            className="px-4.5 py-2.5 bg-stone-800 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-white/5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>重抽一个</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedId(null);
                              // Highlight this matched position on search bar
                              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                              if (searchInput) {
                                searchInput.value = revealedOffer.title;
                                searchInput.dispatchEvent(new Event('change', { bubbles: true }));
                              }
                              triggerToast('✨ 正在为您锁定当前岗位的极速简历匹配！', 'success');
                            }}
                            className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-300 hover:scale-[1.02] text-stone-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-transform flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>立即自动匹配我的简历</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 text-center py-4">检测到您还未在系统中发布任何在招岗位！请先在下方控制台添加岗位噢～</p>
                    )}

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* GAME 2: SCRATCH CARD */}
          {activeGame === 'scratch' && (
            <div className="flex flex-col items-center space-y-4">
              <AnimatePresence mode="wait">
                {!isScratchRevealed ? (
                  <motion.div
                    key="unscratched"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    className="w-full max-w-sm bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-300 p-1 rounded-3xl shadow-xl space-y-4 text-slate-900 border-4 border-double border-amber-500"
                  >
                    <div className="bg-stone-900 rounded-2.5xl p-6 text-center space-y-4 border-2 border-amber-400/40">
                      <div className="w-12 h-12 rounded-full bg-amber-400 p-2.5 mx-auto flex items-center justify-center text-rose-800 font-extrabold animate-bounce text-xl">
                        💰
                      </div>
                      <h4 className="text-sm tracking-wide font-black uppercase text-amber-300">
                        ✨ 黄金刮刮卡 • 一刷大发 ✨
                      </h4>
                      <p className="text-stone-300 text-[11.5px] leading-relaxed">
                        刮开卡区，立得 AI 智能计算之高阶大厂Offer免推绿卡。试试您的超神手气！
                      </p>

                      <div 
                        onClick={handleScratchReveal}
                        className="h-28 bg-gradient-to-r from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200 rounded-2xl flex items-center justify-center cursor-crosshair shadow-inner border-2 border-amber-400 hover:scale-[1.01] active:scale-98 transition-all group"
                      >
                        <span className="text-stone-900 font-extrabold text-[13px] uppercase tracking-widest animate-pulse group-hover:tracking-wider transition-all">
                          👉 点击刮开黄金图章 👈
                        </span>
                      </div>
                      
                      <p className="text-stone-400 text-[9.5px]">刮奖即启动多通道智能人才配比测算</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="scratched"
                    initial={{ scale: 0.9, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="w-full bg-stone-900 text-white rounded-3xl border-3 border-amber-400 p-6 shadow-2xl space-y-4 text-left"
                  >
                    <div className="text-center border-b border-white/10 pb-3">
                      <span className="inline-flex px-2 py-0.5 bg-yellow-400/10 rounded-full text-[9px] font-bold text-amber-300 tracking-wider mb-1 border border-amber-300/20">
                        💯 JACKPOT WINNER
                      </span>
                      <h4 className="text-lg font-black text-amber-300">👑 刮出极速直通王印</h4>
                      <p className="text-[11px] text-amber-200 mt-1 font-bold italic">
                        {scratchFortune}
                      </p>
                    </div>

                    {scratchOffer ? (
                      <div className="space-y-3">
                        <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                          <h5 className="text-sm font-extrabold text-white">{scratchOffer.title}</h5>
                          <p className="text-[11px] text-stone-300 mt-1">
                            内推星数: <span className="text-amber-300 font-black">★★★★★ 五星黄金直通</span>
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono mt-2 bg-stone-950 p-2 rounded-lg border border-white/5 break-all">
                            🎯 闪光技术特长: {scratchOffer.skills}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={resetScratch}
                            className="px-4 py-2 bg-stone-850 hover:bg-stone-800 rounded-xl text-xs font-bold text-stone-300 cursor-pointer"
                          >
                            再来一张
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedId(null);
                              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                              if (searchInput) {
                                searchInput.value = scratchOffer.title;
                                searchInput.dispatchEvent(new Event('change', { bubbles: true }));
                              }
                              triggerToast('✨ 正在锁定黄金内推直通车通道！', 'success');
                            }}
                            className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-900 font-black rounded-xl text-xs hover:scale-103 active:scale-95 transition-all text-center cursor-pointer shadow-md shadow-amber-500/10 flex items-center justify-center gap-1"
                          >
                            <span>🚀 抢占免试名额直投</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-stone-400 text-center py-4">职位库列表为空，请在管理后台中增加新岗位描述再抽～</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
