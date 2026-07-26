import React from 'react';
import { RotateCcw, Dices, Layers } from 'lucide-react';

interface NameInputCardProps {
  inputText: string;
  onChangeInputText: (text: string) => void;
  onPick: () => void;
  onResetAll: () => void;
  isDrawing: boolean;
  remainingCount: number;
  allowDuplicates: boolean;
  onToggleDuplicates: () => void;
  pickCount: number;
  onChangePickCount: (count: number) => void;
}

export const NameInputCard: React.FC<NameInputCardProps> = ({
  inputText,
  onChangeInputText,
  onPick,
  onResetAll,
  isDrawing,
  remainingCount,
  allowDuplicates,
  onToggleDuplicates,
  pickCount,
  onChangePickCount,
}) => {
  return (
    <div className="sleek-card rounded-3xl p-6 flex flex-col h-full border border-slate-200/80 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          학생 이름 입력
        </h2>
        {/* Duplicates / Pick count quick options */}
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={onToggleDuplicates}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 accent-indigo-600"
            />
            <span>중복 허용</span>
          </label>
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 min-h-[220px] flex flex-col mb-2">
        <textarea
          value={inputText}
          onChange={(e) => onChangeInputText(e.target.value)}
          placeholder={`김민준\n이서연\n박지후\n최예진...`}
          disabled={isDrawing}
          className="w-full h-full min-h-[200px] p-4 text-slate-800 font-medium text-base bg-white/90 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y leading-relaxed shadow-xs"
        />
        <p className="text-xs text-slate-400 mt-2 font-normal">
          이름을 여러 줄로 입력하세요. (한 줄에 한 명)
        </p>
      </div>

      {/* Action Controls & Buttons */}
      <div className="mt-2 space-y-3">
        {/* Optional Multi Pick option bar if > 1 */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <Layers className="w-3.5 h-3.5 text-indigo-500" /> 한 번에 뽑을 인원:
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onChangePickCount(num)}
                className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition ${
                  pickCount === num
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {num}명
              </button>
            ))}
          </div>
        </div>

        {/* Primary and Secondary Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Indigo Gradient Primary Button: "뽑기" */}
          <button
            type="button"
            onClick={onPick}
            disabled={isDrawing || (!allowDuplicates && remainingCount === 0)}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg ${
              isDrawing || (!allowDuplicates && remainingCount === 0)
                ? 'bg-indigo-300 cursor-not-allowed shadow-none'
                : 'gradient-btn shadow-indigo-200 active:scale-[0.98]'
            }`}
          >
            <Dices className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDrawing ? '추첨 중...' : '발표자 뽑기'}</span>
          </button>

          {/* White Secondary Button: "전체 초기화" */}
          <button
            type="button"
            onClick={onResetAll}
            disabled={isDrawing}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-xs transition flex items-center justify-center gap-2 text-base"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>전체 초기화</span>
          </button>
        </div>
      </div>
    </div>
  );
};
