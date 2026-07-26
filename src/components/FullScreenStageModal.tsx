import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dices, PartyPopper, Users, CheckCircle2, RotateCcw } from 'lucide-react';

interface FullScreenStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPresenter: string | null;
  spinningName: string | null;
  isDrawing: boolean;
  onPick: () => void;
  onResetAll: () => void;
  remainingCount: number;
  pickedCount: number;
  totalCount: number;
}

export const FullScreenStageModal: React.FC<FullScreenStageModalProps> = ({
  isOpen,
  onClose,
  currentPresenter,
  spinningName,
  isDrawing,
  onPick,
  onResetAll,
  remainingCount,
  pickedCount,
  totalCount,
}) => {
  // Listen for Spacebar key to trigger pick in full screen mode
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isDrawing) {
        e.preventDefault();
        onPick();
      } else if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawing, onPick, onClose]);

  if (!isOpen) return null;

  const displayName = isDrawing ? spinningName : currentPresenter;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col justify-between p-6 md:p-12 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">랜덤 발표자 뽑기</h2>
            <p className="text-xs text-slate-400 font-medium">수업 발표용 전체화면 모드 (Spacebar : 뽑기 / Esc : 닫기)</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl transition border border-slate-800"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-8">
        <div className="mb-4 flex items-center justify-center">
          {displayName ? (
            <PartyPopper className="w-16 h-16 text-amber-400 animate-bounce" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl font-bold animate-pulse">
              🎉
            </div>
          )}
        </div>

        <p className="text-xl md:text-2xl font-extrabold text-indigo-400 mb-6 tracking-wide">
          오늘의 발표자!
        </p>

        <div className="min-h-[140px] md:min-h-[180px] flex items-center justify-center w-full max-w-4xl px-4">
          <AnimatePresence mode="wait">
            {displayName ? (
              <motion.div
                key={isDrawing ? spinningName : currentPresenter}
                initial={{ scale: isDrawing ? 0.9 : 0.5, opacity: 0 }}
                animate={{ scale: isDrawing ? 1 : 1.15, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: isDrawing ? 0.05 : 0.4 }}
                className="text-6xl md:text-9xl font-black text-white tracking-tight drop-shadow-2xl select-none"
              >
                {displayName}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 font-medium text-2xl md:text-3xl"
              >
                아래 <span className="text-indigo-400 font-bold">[발표자 뽑기]</span> 버튼이나 <span className="text-amber-400 font-bold">[Spacebar]</span>를 누르세요!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls & Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-800/80">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm font-semibold">
          <div className="flex items-center gap-2 text-indigo-400 bg-indigo-950/70 border border-indigo-800/80 px-4 py-2.5 rounded-2xl">
            <Users className="w-5 h-5" />
            <span>남은 학생: <strong className="text-lg text-white">{remainingCount}명</strong></span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-4 py-2.5 rounded-2xl">
            <CheckCircle2 className="w-5 h-5" />
            <span>뽑힌 학생: <strong className="text-lg text-white">{pickedCount}명</strong></span>
          </div>
          <div className="text-slate-500 hidden md:block">
            (총 {totalCount}명)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onResetAll}
            disabled={isDrawing}
            className="px-5 py-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 border border-slate-800 text-slate-200 font-bold rounded-2xl transition flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>전체 초기화</span>
          </button>

          <button
            onClick={onPick}
            disabled={isDrawing || remainingCount === 0}
            className={`px-8 py-4 rounded-2xl font-black text-xl text-white shadow-xl transition flex items-center gap-3 ${
              isDrawing || remainingCount === 0
                ? 'bg-indigo-900/50 text-slate-500 cursor-not-allowed'
                : 'gradient-btn shadow-indigo-600/30 active:scale-95'
            }`}
          >
            <Dices className={`w-7 h-7 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDrawing ? '추첨 진행 중...' : '발표자 뽑기 (Space)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
