import React from 'react';
import { Users, CheckCircle2 } from 'lucide-react';

interface StatCardsProps {
  remainingCount: number;
  pickedCount: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ remainingCount, pickedCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Stat 1: Remaining Students */}
      <div className="sleek-card rounded-3xl p-6 text-center shadow-xs flex flex-col items-center justify-center border border-slate-200/80">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-2">
          <Users className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="text-sm font-bold text-slate-600">남은 학생 수</div>
        <div className="text-3xl md:text-4xl font-black text-indigo-600 mt-1 tracking-tight">
          {remainingCount}명
        </div>
      </div>

      {/* Stat 2: Picked Students */}
      <div className="sleek-card rounded-3xl p-6 text-center shadow-xs flex flex-col items-center justify-center border border-slate-200/80">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="text-sm font-bold text-slate-600">뽑힌 학생 수</div>
        <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1 tracking-tight">
          {pickedCount}명
        </div>
      </div>
    </div>
  );
};
