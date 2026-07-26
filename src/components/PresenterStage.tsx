import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, PartyPopper } from 'lucide-react';

interface PresenterStageProps {
  currentPresenter: string | null;
  spinningName: string | null;
  isDrawing: boolean;
  historyCount: number;
}

export const PresenterStage: React.FC<PresenterStageProps> = ({
  currentPresenter,
  spinningName,
  isDrawing,
  historyCount,
}) => {
  const displayName = isDrawing
    ? spinningName
    : currentPresenter;

  return (
    <div className="relative overflow-hidden sleek-card rounded-3xl border border-indigo-100/90 p-8 text-center flex flex-col items-center justify-center min-h-[230px] shadow-sm">
      {/* Background glowing gradient circles */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Confetti Party Icon or Stage Header */}
      <div className="flex items-center justify-center gap-1.5 mb-2 relative z-10">
        {displayName ? (
          <PartyPopper className="w-7 h-7 text-amber-500 animate-bounce" />
        ) : (
          <Sparkles className="w-6 h-6 text-indigo-600" />
        )}
      </div>

      <p className="text-base font-bold text-indigo-600 tracking-tight relative z-10">
        오늘의 발표자!
      </p>

      {/* Main Displayed Name with Animation */}
      <div className="my-3 min-h-[72px] flex items-center justify-center w-full px-4 relative z-10">
        <AnimatePresence mode="wait">
          {displayName ? (
            <motion.div
              key={isDrawing ? spinningName : currentPresenter}
              initial={{ scale: isDrawing ? 0.9 : 0.6, opacity: 0, y: isDrawing ? 0 : 10 }}
              animate={{ scale: isDrawing ? 1 : 1.1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: isDrawing ? 0.05 : 0.35, ease: 'easeOut' }}
              className="text-4xl md:text-6xl font-black text-indigo-950 tracking-tight drop-shadow-xs select-none"
            >
              {displayName}
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 font-medium text-lg md:text-xl"
            >
              왼쪽의 <span className="text-indigo-600 font-bold">'발표자 뽑기'</span> 버튼을 눌러주세요!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Subtext info */}
      {currentPresenter && !isDrawing && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mt-1 shadow-xs relative z-10"
        >
          <span>🎉 당첨을 축하합니다!</span>
          {historyCount > 1 && <span className="text-emerald-600 font-bold">({historyCount}번째 추첨)</span>}
        </motion.div>
      )}
    </div>
  );
};
