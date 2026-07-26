import React from 'react';
import { User } from 'lucide-react';
import { Student } from '../types';

interface RemainingListCardProps {
  remainingStudents: Student[];
  onPickSpecificStudent?: (studentName: string) => void;
  onRemoveStudent?: (studentId: string) => void;
}

export const RemainingListCard: React.FC<RemainingListCardProps> = ({
  remainingStudents,
}) => {
  return (
    <div className="sleek-card rounded-3xl p-6 flex flex-col h-full min-h-[160px] border border-slate-200/80 shadow-sm">
      {/* Header */}
      <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
          <User className="w-4 h-4 text-indigo-600" />
        </div>
        <span>남은 학생 목록</span>
        <span className="text-slate-400 font-semibold text-sm">({remainingStudents.length}명)</span>
      </h3>

      {/* Chip Grid */}
      {remainingStudents.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 items-center">
          {remainingStudents.map((student) => (
            <div
              key={student.id}
              className="px-4 py-2 bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-700 border border-indigo-200/80 rounded-xl font-semibold text-sm transition-all shadow-2xs flex items-center justify-center select-none"
            >
              {student.name}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-medium">🎉 남은 학생이 없습니다!</p>
          <p className="text-xs text-slate-400 mt-1">모든 학생이 발표자로 추첨되었습니다.</p>
        </div>
      )}
    </div>
  );
};
