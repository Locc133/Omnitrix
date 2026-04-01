/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Search, 
  RefreshCcw, 
  Zap, 
  Layers, 
  Heart, 
  Upload, 
  User, 
  Droplets, 
  ChevronRight,
  Loader2,
  Shield,
  Activity,
  Cpu,
  X,
  Settings2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALIENS, generateFusionImage } from './lib/omniService';

type Mode = 'ULTIMATE' | 'BIOMNITRIX' | 'CHAQUETRIX';

export default function App() {
  const [mode, setMode] = useState<Mode>('BIOMNITRIX');
  const [adn1, setAdn1] = useState<typeof ALIENS[0] | null>(null);
  const [adn2, setAdn2] = useState<typeof ALIENS[0] | null>(null);
  const [isSelecting, setIsSelecting] = useState<'adn1' | 'adn2' | null>(null);
  const [fusionResult, setFusionResult] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);
  const [fusionType, setFusionType] = useState<'MAIN' | 'BALANCED'>('MAIN');
  const [stability, setStability] = useState<'ỔN ĐỊNH' | 'BẤT ỔN' | 'HỖN MANG'>('ỔN ĐỊNH');
  const [primarySlot, setPrimarySlot] = useState<'adn1' | 'adn2'>('adn1');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionTab, setSelectionTab] = useState<'TRONG' | 'NGOÀI' | 'LAI_TAO'>('TRONG');
  const [hybridAliens, setHybridAliens] = useState<typeof ALIENS>([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleSelectAlien = (alien: typeof ALIENS[0]) => {
    if (isSelecting === 'adn1') setAdn1(alien);
    if (isSelecting === 'adn2') setAdn2(alien);
    setIsSelecting(null);
  };

  const handleFusion = async () => {
    const primary = primarySlot === 'adn1' ? adn1 : adn2;
    const secondary = primarySlot === 'adn1' ? adn2 : adn1;
    
    if (!primary || !secondary) return;
    setIsFusing(true);
    setIsComplete(false);
    setFusionResult(null);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    const result = await generateFusionImage(primary.name, secondary.name, stability);
    
    clearInterval(interval);
    setProgress(100);
    setFusionResult(result);
    setIsComplete(true);

    if (result) {
      const newHybrid = {
        id: `hybrid-${Date.now()}`,
        name: `${primary.name} X ${secondary.name}`,
        type: "Hybrid",
        image: result,
        power: Math.floor((primary.power + secondary.power) / 2 + (stability === 'HỖN MANG' ? 15 : 0)),
        danger: stability === 'ỔN ĐỊNH' ? 'TRUNG BÌNH' : stability === 'BẤT ỔN' ? 'CAO' : 'NGUY HIỂM'
      };
      setHybridAliens(prev => [newHybrid, ...prev]);
    }
    
    setTimeout(() => {
      setIsFusing(false);
    }, 1500);
  };

  const stabilityDescriptions = {
    'ỔN ĐỊNH': 'Giữ nguyên cấu trúc gốc, ốp giáp/màu sắc, chân thực cao.',
    'BẤT ỔN': 'Cấu trúc gen bị biến dạng, các chi tiết lai tạp ngẫu nhiên.',
    'HỖN MANG': 'Sự kết hợp quái dị, mất kiểm soát cấu trúc sinh học.'
  };

  const getAliensByTab = () => {
    if (selectionTab === 'LAI_TAO') return hybridAliens;
    if (selectionTab === 'NGOÀI') return ALIENS.slice(20);
    return ALIENS.slice(0, 20);
  };

  const filteredAliens = getAliensByTab().filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-omni-bg border-x border-omni-border shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-omni-green flex items-center justify-center neon-glow bg-omni-green/5">
            <Cpu size={28} className="text-omni-green" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-[0.2em] text-omni-green neon-text">LÕI OMNITRIX</h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-tighter">SYSTEM STATUS // OPTIMAL</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-omni-card border border-omni-border text-gray-400 hover:text-omni-green transition-colors">
            <Settings size={18} />
          </button>
          <button className="p-2 rounded-lg bg-omni-card border border-omni-border text-gray-400 hover:text-omni-green transition-colors">
            <Search size={18} />
          </button>
          <button 
            onClick={() => { setAdn1(null); setAdn2(null); setFusionResult(null); }}
            className="p-2 rounded-lg bg-omni-card border border-omni-border text-gray-400 hover:text-omni-green transition-colors"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      {/* Mode Tabs */}
      <nav className="px-6 flex gap-2 mb-6 z-10">
        {[
          { id: 'ULTIMATE', icon: Zap, label: 'ULTIMATE' },
          { id: 'BIOMNITRIX', icon: Layers, label: 'BIOMNITRIX' },
          { id: 'CHAQUETRIX', icon: Heart, label: 'CHAQUETRIX' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id as Mode)}
            className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all duration-300 ${
              mode === tab.id 
                ? 'bg-omni-green/10 border-omni-green text-omni-green' 
                : 'bg-omni-card border-omni-border text-gray-500'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-[10px] font-bold tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-6 overflow-y-auto custom-scrollbar z-10">
        {mode === 'BIOMNITRIX' && (
          <div className="space-y-6">
            {/* ADN Slots Display (For Selection) */}
            <div className="grid grid-cols-2 gap-4">
              <ADNCard 
                label="ADN 1" 
                alien={adn1} 
                onClick={() => setIsSelecting('adn1')} 
              />
              <ADNCard 
                label="ADN 2" 
                alien={adn2} 
                onClick={() => setIsSelecting('adn2')} 
              />
            </div>

            {/* Fusion Controls */}
            <div className="bg-omni-card/50 border border-omni-border rounded-2xl p-1 flex">
              <button 
                onClick={() => setFusionType('MAIN')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  fusionType === 'MAIN' ? 'bg-omni-green/20 text-omni-green border border-omni-green/30 shadow-[0_0_15px_rgba(0,255,159,0.2)]' : 'text-gray-500'
                }`}
              >
                <User size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Chính / Phụ</span>
              </button>
              <button 
                onClick={() => setFusionType('BALANCED')}
                className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  fusionType === 'BALANCED' ? 'bg-omni-green/20 text-omni-green border border-omni-green/30 shadow-[0_0_15px_rgba(0,255,159,0.2)]' : 'text-gray-500'
                }`}
              >
                <Settings2 size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Cân bằng</span>
              </button>
            </div>

            {/* ADN Slots Selection (Primary/Secondary Toggle) */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPrimarySlot('adn1')}
                className={`relative p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-6 ${
                  primarySlot === 'adn1' 
                    ? 'bg-omni-green/10 border-omni-green shadow-[0_0_20px_rgba(0,255,159,0.3)]' 
                    : 'bg-omni-card/30 border-omni-border/50 opacity-40'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${primarySlot === 'adn1' ? 'bg-omni-green/20' : 'bg-white/5'}`}>
                  <User size={32} className={primarySlot === 'adn1' ? 'text-omni-green' : 'text-gray-500'} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-black tracking-widest uppercase mb-1 ${primarySlot === 'adn1' ? 'text-white' : 'text-gray-400'}`}>
                    {primarySlot === 'adn1' ? 'CƠ THỂ GỐC' : 'GEN PHỤ'}
                  </p>
                  <p className="text-[10px] font-bold text-omni-green/60 uppercase tracking-widest">ADN 1</p>
                </div>
              </button>

              <button 
                onClick={() => setPrimarySlot('adn2')}
                className={`relative p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-6 ${
                  primarySlot === 'adn2' 
                    ? 'bg-omni-green/10 border-omni-green shadow-[0_0_20px_rgba(0,255,159,0.3)]' 
                    : 'bg-omni-card/30 border-omni-border/50 opacity-40'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${primarySlot === 'adn2' ? 'bg-omni-green/20' : 'bg-white/5'}`}>
                  <Droplets size={32} className={primarySlot === 'adn2' ? 'text-omni-green' : 'text-gray-500'} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-black tracking-widest uppercase mb-1 ${primarySlot === 'adn2' ? 'text-white' : 'text-gray-400'}`}>
                    {primarySlot === 'adn2' ? 'CƠ THỂ GỐC' : 'GEN PHỤ'}
                  </p>
                  <p className="text-[10px] font-bold text-omni-green/60 uppercase tracking-widest">ADN 2</p>
                </div>
              </button>
            </div>

            {/* Stability Control */}
            <div className="bg-omni-card/30 border border-omni-border rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCcw size={14} className="text-omni-green" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">Kiểm soát bất ổn gen</h3>
              </div>
              
              <div className="flex gap-2">
                {['ỔN ĐỊNH', 'BẤT ỔN', 'HỖN MANG'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStability(s as any)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all border ${
                      stability === s 
                        ? 'bg-omni-green/20 border-omni-green text-omni-green neon-glow' 
                        : 'bg-omni-card border-omni-border text-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              <p className="text-[10px] text-gray-400 italic text-center leading-relaxed px-2">
                {stabilityDescriptions[stability]}
              </p>
            </div>

            {/* Fusion Button */}
            <button 
              disabled={!adn1 || !adn2 || isFusing}
              onClick={handleFusion}
              className={`w-full py-4 rounded-2xl font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-3 border ${
                !adn1 || !adn2 || isFusing
                  ? 'bg-omni-card/50 border-omni-border text-gray-600 cursor-not-allowed'
                  : 'bg-omni-green/10 border-omni-green text-omni-green hover:bg-omni-green/20 neon-glow'
              }`}
            >
              {isFusing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  ĐANG XỬ LÝ...
                </>
              ) : (
                <>
                  <RefreshCcw size={20} />
                  BẮT ĐẦU DUNG HỢP
                </>
              )}
            </button>

            {/* Fusion Progress Panel */}
            <AnimatePresence>
              {isFusing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-omni-card border-2 border-omni-green/30 rounded-[2.5rem] p-8 flex flex-col items-center gap-8 relative overflow-hidden"
                >
                  {/* Central Logo */}
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full border-4 border-omni-green flex items-center justify-center neon-glow bg-black/60 shadow-[0_0_30px_rgba(0,255,159,0.4)]">
                      {isComplete ? (
                        <Layers size={64} className="text-omni-green" />
                      ) : (
                        <div className="text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">DUNG</div>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-[ping_2s_linear_infinite]" />
                    <div className="absolute inset-[-10px] rounded-full border border-omni-green/20 animate-[spin_10s_linear_infinite]" />
                  </div>

                  {/* Status Text Box */}
                  <div className="w-full py-3 px-4 rounded-xl border border-omni-green/30 bg-omni-green/5 text-center">
                    <p className="text-[10px] font-bold tracking-[0.15em] text-omni-green uppercase">
                      {isComplete ? 'HOÀN TẤT ĐỒNG BỘ MÃ GEN!' : 'ĐANG DUNG HỢP CHUỖI GEN CHÉO 2 CHIỀU...'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-omni-green neon-glow"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fusion Result Display */}
            <AnimatePresence>
              {!isFusing && fusionResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-omni-card border-2 border-omni-green/30 rounded-[2.5rem] overflow-hidden relative group"
                >
                  {/* Action Buttons Overlay */}
                  <div className="absolute top-4 left-0 right-0 z-20 px-6 flex justify-between pointer-events-none">
                    <div className="flex gap-2 pointer-events-auto">
                      <button 
                        onClick={() => setShowReport(true)}
                        className="w-10 h-10 rounded-full bg-omni-card/80 border border-omni-green/50 flex items-center justify-center text-omni-green hover:bg-omni-green hover:text-black transition-all"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      </button>
                      <button className="w-10 h-10 rounded-full bg-omni-card/80 border border-omni-green/50 flex items-center justify-center text-omni-green hover:bg-omni-green hover:text-black transition-all">
                        <Layers size={18} />
                      </button>
                    </div>
                    <div className="flex gap-2 pointer-events-auto">
                      <button className="w-10 h-10 rounded-full bg-omni-card/80 border border-omni-green/50 flex items-center justify-center text-omni-green hover:bg-omni-green hover:text-black transition-all">
                        <ChevronRight size={18} className="rotate-45" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-omni-card/80 border border-omni-green/50 flex items-center justify-center text-omni-green hover:bg-omni-green hover:text-black transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="aspect-square w-full bg-white flex items-center justify-center relative p-8">
                    <img 
                      src={fusionResult!} 
                      alt="Fusion Result" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 bg-omni-card border-t border-omni-border">
                    <h3 className="text-xl font-bold text-omni-green neon-text mb-1">
                      {adn1?.name}-{adn2?.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">BIOMNITRIX FUSION // {stability}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {mode !== 'BIOMNITRIX' && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center mb-4">
              <Zap size={32} className="text-gray-800" />
            </div>
            <h2 className="text-gray-600 font-bold tracking-widest">CHẾ ĐỘ {mode}</h2>
            <p className="text-gray-700 text-xs mt-2">Đang trong quá trình hiệu chuẩn...</p>
          </div>
        )}
      </main>

      {/* Alien Selection Modal */}
      <AnimatePresence>
        {isSelecting && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-50 bg-omni-bg p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <RefreshCcw size={20} className="text-omni-green" />
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Lõi đồng bộ dữ liệu</h2>
              </div>
              <button onClick={() => setIsSelecting(null)} className="p-2 bg-omni-card border border-omni-border rounded-xl text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="NHẬP TÊN ALIEN ĐỂ TÌM KIẾM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-omni-card border border-omni-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:border-omni-green outline-none transition-all"
              />
            </div>

            <div className="flex gap-2 mb-6">
              <button 
                onClick={() => setSelectionTab('TRONG')}
                className={`flex-1 py-4 rounded-2xl text-[9px] font-bold tracking-widest transition-all ${
                  selectionTab === 'TRONG' ? 'bg-omni-green text-black neon-glow' : 'bg-omni-card border border-omni-border text-gray-500'
                }`}
              >
                TRONG OMNITRIX
              </button>
              <button 
                onClick={() => setSelectionTab('NGOÀI')}
                className={`flex-1 py-4 rounded-2xl text-[9px] font-bold tracking-widest transition-all ${
                  selectionTab === 'NGOÀI' ? 'bg-omni-green text-black neon-glow' : 'bg-omni-card border border-omni-border text-gray-500'
                }`}
              >
                NGOÀI OMNITRIX
              </button>
              <button 
                onClick={() => setSelectionTab('LAI_TAO')}
                className={`flex-1 py-4 rounded-2xl text-[9px] font-bold tracking-widest transition-all ${
                  selectionTab === 'LAI_TAO' ? 'bg-omni-green text-black neon-glow' : 'bg-omni-card border border-omni-border text-gray-500'
                }`}
              >
                ĐÃ LAI TẠO
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pb-10 custom-scrollbar">
              {filteredAliens.map((alien) => (
                <button
                  key={alien.id}
                  onClick={() => handleSelectAlien(alien)}
                  className="p-0 rounded-3xl bg-omni-card border border-omni-border hover:border-omni-green group transition-all text-left overflow-hidden flex flex-col"
                >
                  <div className="aspect-square w-full bg-black/20 p-4 flex items-center justify-center relative">
                    <img 
                      src={alien.image} 
                      alt={alien.name} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className={`w-1.5 h-1 rounded-full ${i <= (alien.power / 20) ? 'bg-omni-green' : 'bg-gray-800'}`} />
                        ))}
                      </div>
                      <span className={`text-[6px] font-bold px-1 rounded-sm ${
                        alien.danger === 'CAO' || alien.danger === 'NGUY HIỂM' ? 'bg-red-500/20 text-red-500' : 'bg-omni-green/20 text-omni-green'
                      }`}>
                        {alien.danger}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-omni-card/50 border-t border-omni-border">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest group-hover:text-omni-green transition-colors">{alien.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-omni-green/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Power Report Modal */}
      <AnimatePresence>
        {showReport && adn1 && adn2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-2xl bg-omni-bg border-2 border-omni-green rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,159,0.3)]"
            >
              {/* Header */}
              <div className="p-6 border-b border-omni-green/30 flex items-center justify-between bg-omni-green/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-omni-green flex items-center justify-center animate-pulse">
                    <Shield className="text-omni-green" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase">Bản báo cáo năng lực</h2>
                    <p className="text-[10px] text-omni-green font-mono uppercase tracking-widest">Omnitrix Core Analysis // System v4.2</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReport(false)}
                  className="w-10 h-10 rounded-full bg-omni-green/10 flex items-center justify-center text-omni-green hover:bg-omni-green hover:text-black transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Mã định danh chủ thể</label>
                    <div className="text-3xl font-black text-white uppercase tracking-tighter border-l-4 border-omni-green pl-4 leading-none">
                      {adn1.name}<span className="text-omni-green">X</span>{adn2.name}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-omni-card border border-omni-border rounded-2xl p-5">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cấp độ đe dọa</p>
                      <p className={`text-xl font-black ${stability === 'HỖN MANG' ? 'text-red-500' : 'text-omni-green'}`}>
                        {stability === 'ỔN ĐỊNH' ? 'TRUNG BÌNH' : stability === 'BẤT ỔN' ? 'CAO' : 'NGUY HIỂM'}
                      </p>
                    </div>
                    <div className="bg-omni-card border border-omni-border rounded-2xl p-5">
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Chỉ số chiến đấu (PL)</p>
                      <p className="text-3xl font-black text-omni-green neon-text font-mono">
                        {Math.floor((adn1.power + adn2.power) / 2 + (stability === 'HỖN MANG' ? 15 : 0))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Phân loại an toàn</label>
                    <div className={`p-5 rounded-2xl border-2 flex items-center gap-5 ${
                      stability === 'ỔN ĐỊNH' ? 'border-omni-green bg-omni-green/5' : 
                      stability === 'BẤT ỔN' ? 'border-yellow-500 bg-yellow-500/5' : 
                      'border-red-500 bg-red-500/5'
                    }`}>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        stability === 'ỔN ĐỊNH' ? 'bg-omni-green text-black' : 
                        stability === 'BẤT ỔN' ? 'bg-yellow-500 text-black' : 
                        'bg-red-500 text-white'
                      }`}>
                        <Zap size={28} />
                      </div>
                      <div>
                        <div className="font-black text-xl uppercase tracking-widest">
                          {stability === 'ỔN ĐỊNH' ? 'AN TOÀN' : 
                           stability === 'BẤT ỔN' ? 'CẦN GIÁM SÁT' : 
                           'NGUY HIỂM CAO'}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {stability === 'ỔN ĐỊNH' ? 'Cấu trúc gen ổn định. Không có rủi ro đột biến.' : 
                           stability === 'BẤT ỔN' ? 'Phát hiện sai lệch gen nhẹ. Cần theo dõi liên tục.' : 
                           'Rủi ro đột biến cực cao. Nguy cơ mất kiểm soát chủ thể.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col items-center justify-center space-y-8">
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity size={14} className="text-omni-green" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Ma trận năng lượng</p>
                    </div>
                    
                    <div className="relative aspect-square w-full max-w-[240px] mx-auto flex items-center justify-center">
                      {/* Radar Background */}
                      <div className="absolute inset-0 border border-omni-green/20 rounded-full" />
                      <div className="absolute inset-[20%] border border-omni-green/10 rounded-full" />
                      <div className="absolute inset-[40%] border border-omni-green/10 rounded-full" />
                      <div className="absolute inset-[60%] border border-omni-green/10 rounded-full" />
                      <div className="absolute inset-[80%] border border-omni-green/10 rounded-full" />
                      
                      {/* Axis Lines */}
                      {[0, 60, 120, 180, 240, 300].map(deg => (
                        <div 
                          key={deg}
                          className="absolute top-1/2 left-1/2 w-full h-[1px] bg-omni-green/10 origin-left"
                          style={{ transform: `rotate(${deg}deg)` }}
                        />
                      ))}

                      {/* Radar Shape */}
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,255,159,0.6)]">
                        <polygon 
                          points="50,15 80,35 85,70 50,85 15,70 20,35" 
                          fill="rgba(0, 255, 159, 0.3)" 
                          stroke="#00FF9F" 
                          strokeWidth="1.5"
                        />
                      </svg>

                      {/* Scanning Line */}
                      <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-omni-green/50 origin-left animate-[spin_4s_linear_infinite]" />
                      
                      {/* Labels */}
                      <span className="absolute -top-4 text-[8px] font-black text-omni-green uppercase">Sức mạnh</span>
                      <span className="absolute -bottom-4 text-[8px] font-black text-omni-green uppercase">Bền bỉ</span>
                      <span className="absolute -right-4 top-1/3 text-[8px] font-black text-omni-green uppercase">Tốc độ</span>
                      <span className="absolute -left-4 top-1/3 text-[8px] font-black text-omni-green uppercase">Chiến kỹ</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 w-full">
                    {['STR', 'SPD', 'INT', 'END', 'POW', 'AGI'].map(stat => (
                      <div key={stat} className="bg-omni-card border border-omni-border rounded-xl p-3 text-center">
                        <div className="text-[8px] text-gray-500 font-bold mb-1">{stat}</div>
                        <div className="text-sm font-mono text-white font-bold">{(Math.random() * 40 + 60).toFixed(0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-black/40 border-t border-omni-green/20 flex justify-between items-center">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-omni-green animate-pulse" />
                    <span className="text-[9px] text-omni-green font-mono uppercase">System Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] text-blue-500 font-mono uppercase">Data Verified</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowReport(false)}
                  className="px-8 py-3 bg-omni-green text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all rounded-xl shadow-[0_0_20px_rgba(0,255,159,0.4)]"
                >
                  Xác nhận & Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ADNCard({ label, alien, onClick }: { 
  label: string, 
  alien: any, 
  onClick: () => void
}) {
  return (
    <div 
      className="bg-omni-card border border-omni-border rounded-3xl p-5 flex flex-col gap-4 relative group cursor-pointer hover:border-omni-green/50 transition-all" 
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-omni-green tracking-widest">{label}</span>
      </div>
      
      <div className="aspect-square rounded-2xl border-2 border-dashed border-omni-border flex flex-col items-center justify-center gap-3 group-hover:border-omni-green/30 transition-all overflow-hidden relative">
        {alien ? (
          <div className="w-full h-full relative p-2">
            <img 
              src={alien.image} 
              alt={alien.name} 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-2">
              <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{alien.name}</p>
            </div>
          </div>
        ) : (
          <>
            <Upload size={24} className="text-gray-600 group-hover:text-omni-green/50" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest group-hover:text-omni-green/50">Nạp mã gen</span>
          </>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`w-2 h-1.5 rounded-sm ${alien && i <= (alien.power / 20) ? 'bg-omni-green' : 'bg-gray-800'}`} />
          ))}
        </div>
        <span className={`text-[8px] font-bold px-1 rounded-sm ${
          alien?.danger === 'CAO' || alien?.danger === 'NGUY HIỂM' ? 'bg-red-500/20 text-red-500' : 'text-gray-600'
        }`}>
          {alien ? alien.danger : 'B. THƯỜNG'}
        </span>
      </div>
    </div>
  );
}
