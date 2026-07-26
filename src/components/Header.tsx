import React from 'react';
import { Users, RotateCw, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';
import { PRESET_CLASSES } from '../utils/constants';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenFullScreen: () => void;
  onSelectPreset: (text: string) => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenFullScreen,
  onSelectPreset,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
      {/* Title & Badge */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Users className="w-6 h-6 stroke-[2.5]" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          랜덤 발표자 뽑기
        </h1>
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200">
          수업 도구
        </span>
      </div>

      {/* Right Action Tools */}
      <div className="flex items-center gap-3 text-xs text-slate-500 self-end sm:self-auto flex-wrap">
        {/* Preset Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium rounded-lg transition">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>샘플 명단</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-44 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 hidden group-hover:block transition-all">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400">명단 빠르게 불러오기</div>
            {PRESET_CLASSES.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onSelectPreset(preset.text)}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition font-semibold ${
            soundEnabled
              ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden md:inline">{soundEnabled ? '음성/효과음 ON' : 'OFF'}</span>
        </button>

        {/* Fullscreen Projection */}
        <button
          onClick={onOpenFullScreen}
          className="gradient-btn flex items-center gap-1.5 px-3 py-1.5 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 transition"
          title="수업용 큰 화면 모드"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>전체화면</span>
        </button>

        {/* LocalStorage Sync Info */}
        <div className="flex items-center gap-1 text-slate-400 pl-1 border-l border-slate-200">
          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          <span>새로고침해도 유지됩니다 (localStorage)</span>
        </div>
      </div>
    </header>
  );
};
