import React from 'react';
import { CheckCircle2, RotateCcw, Copy, Check } from 'lucide-react';
import { PickHistoryItem } from '../types';

interface PickedListCardProps {
  pickedHistory: PickHistoryItem[];
  onRestoreStudent?: (historyId: string) => void;
  onClearPickedHistory?: () => void;
}

export const PickedListCard: React.FC<PickedListCardProps> = ({
  pickedHistory,
  onRestoreStudent,
  onClearPickedHistory,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (pickedHistory.length === 0) return;
    const text = pickedHistory.map((item, idx) => `${idx + 1}. ${item.studentName}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sleek-card rounded-3xl p-6 flex flex-col h-full min-h-[160px] border border-slate-200/80 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span>뽑힌 학생 목록</span>
          <span className="text-slate-400 font-semibold text-sm">({pickedHistory.length}명)</span>
        </h3>

        {pickedHistory.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition font-medium"
              title="명단 복사하기"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '복사'}</span>
            </button>
            {onClearPickedHistory && (
              <button
                onClick={onClearPickedHistory}
                className="flex items-center gap-1.5 px-2.5 py-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                title="뽑힌 목록 초기화"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>비우기</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Chip Grid */}
      {pickedHistory.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 items-center">
          {pickedHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onRestoreStudent?.(item.id)}
              title="클릭 시 남은 학생 목록으로 복원"
              className="group cursor-pointer px-4 py-2 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/90 rounded-xl font-semibold text-sm transition-all shadow-2xs flex items-center gap-1.5 select-none"
            >
              <span>{item.studentName}</span>
              {onRestoreStudent && (
                <RotateCcw className="w-3 h-3 opacity-0 group-hover:opacity-100 text-emerald-600 transition" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-medium">아직 뽑힌 학생이 없습니다.</p>
          <p className="text-xs text-slate-400 mt-1">추첨 버튼을 누르면 순서대로 기록됩니다.</p>
        </div>
      )}
    </div>
  );
};
