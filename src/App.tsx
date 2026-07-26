import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { NameInputCard } from './components/NameInputCard';
import { PresenterStage } from './components/PresenterStage';
import { StatCards } from './components/StatCards';
import { RemainingListCard } from './components/RemainingListCard';
import { PickedListCard } from './components/PickedListCard';
import { FullScreenStageModal } from './components/FullScreenStageModal';
import { Student, PickHistoryItem } from './types';
import { DEFAULT_STUDENTS_TEXT } from './utils/constants';
import { soundEngine } from './utils/sound';

const STORAGE_KEYS = {
  INPUT_TEXT: 'random_presenter_input_text_v2',
  PICKED_HISTORY: 'random_presenter_picked_history_v2',
  ALLOW_DUPLICATES: 'random_presenter_allow_duplicates_v2',
  SOUND_ENABLED: 'random_presenter_sound_enabled_v2',
  CURRENT_PRESENTER: 'random_presenter_current_v2',
};

export default function App() {
  // Load initial input text
  const [inputText, setInputText] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INPUT_TEXT);
    return saved !== null ? saved : DEFAULT_STUDENTS_TEXT;
  });

  // Load picked history - Default initial state matching screenshot if first run
  const [pickedHistory, setPickedHistory] = useState<PickHistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PICKED_HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    // Default initial match with screenshot (1 picked: 김민준)
    return [
      {
        id: 'initial-1',
        studentName: '김민준',
        timestamp: new Date(),
        order: 1,
      },
    ];
  });

  // Current presenter display
  const [currentPresenter, setCurrentPresenter] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PRESENTER);
    if (saved !== null) return saved;
    return '김민준'; // Default matching screenshot
  });

  // Settings
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALLOW_DUPLICATES);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [pickCount, setPickCount] = useState<number>(1);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [spinningName, setSpinningName] = useState<string | null>(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState<boolean>(false);

  // Parse all students from input text
  const allStudents = useMemo<Student[]>(() => {
    const lines = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines.map((name, index) => ({
      id: `student-${index}-${name}`,
      name,
    }));
  }, [inputText]);

  // Derived: remaining students (those in allStudents not in pickedHistory)
  const remainingStudents = useMemo<Student[]>(() => {
    if (allowDuplicates) return allStudents;

    const pickedNamesSet = new Set(pickedHistory.map((item) => item.studentName));
    return allStudents.filter((student) => !pickedNamesSet.has(student.name));
  }, [allStudents, pickedHistory, allowDuplicates]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INPUT_TEXT, inputText);
  }, [inputText]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PICKED_HISTORY, JSON.stringify(pickedHistory));
  }, [pickedHistory]);

  useEffect(() => {
    if (currentPresenter) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PRESENTER, currentPresenter);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PRESENTER);
    }
  }, [currentPresenter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALLOW_DUPLICATES, JSON.stringify(allowDuplicates));
  }, [allowDuplicates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Handle Pick Logic
  const handlePick = useCallback(() => {
    if (isDrawing) return;

    // Candidate pool
    const candidates = allowDuplicates ? allStudents : remainingStudents;

    if (candidates.length === 0) {
      if (soundEnabled) soundEngine.playClickSound();
      return;
    }

    setIsDrawing(true);
    if (soundEnabled) soundEngine.playClickSound();

    // Roulette Spin animation duration
    const spinDuration = 2200;
    const intervalTime = 70;
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
      setSpinningName(randomCandidate.name);

      if (soundEnabled) {
        soundEngine.playTickSound(0.12);
      }

      if (Date.now() - startTime >= spinDuration) {
        clearInterval(intervalId);

        // Final Winner Selection
        const winner = candidates[Math.floor(Math.random() * candidates.length)];
        const winnerName = winner.name;

        setCurrentPresenter(winnerName);
        setSpinningName(null);
        setIsDrawing(false);

        // Record history
        const newHistoryItem: PickHistoryItem = {
          id: `pick-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          studentName: winnerName,
          timestamp: new Date(),
          order: pickedHistory.length + 1,
        };

        setPickedHistory((prev) => [...prev, newHistoryItem]);

        // Fanfare Sound & Confetti Celebration
        if (soundEnabled) {
          soundEngine.playWinFanfare(0.25);
        }

        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
        });
      }
    }, intervalTime);
  }, [isDrawing, allowDuplicates, allStudents, remainingStudents, soundEnabled, pickedHistory.length]);

  // Handle Reset All
  const handleResetAll = useCallback(() => {
    if (isDrawing) return;
    if (soundEnabled) soundEngine.playResetSound();
    setPickedHistory([]);
    setCurrentPresenter(null);
    setSpinningName(null);
  }, [isDrawing, soundEnabled]);

  // Handle Preset Class Selection
  const handleSelectPreset = useCallback((presetText: string) => {
    if (isDrawing) return;
    if (soundEnabled) soundEngine.playResetSound();
    setInputText(presetText);
    setPickedHistory([]);
    setCurrentPresenter(null);
  }, [isDrawing, soundEnabled]);

  // Restore a specific picked student back to remaining
  const handleRestoreStudent = useCallback((historyId: string) => {
    if (soundEnabled) soundEngine.playClickSound();
    setPickedHistory((prev) => {
      const updated = prev.filter((item) => item.id !== historyId);
      // If current presenter was the one removed, update currentPresenter to last item
      if (updated.length > 0) {
        setCurrentPresenter(updated[updated.length - 1].studentName);
      } else {
        setCurrentPresenter(null);
      }
      return updated;
    });
  }, [soundEnabled]);

  // Clear Picked History list
  const handleClearPickedHistory = useCallback(() => {
    if (isDrawing) return;
    if (soundEnabled) soundEngine.playResetSound();
    setPickedHistory([]);
    setCurrentPresenter(null);
  }, [isDrawing, soundEnabled]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col justify-between antialiased">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        {/* Header */}
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
          onOpenFullScreen={() => setIsFullScreenOpen(true)}
          onSelectPreset={handleSelectPreset}
          onResetAll={handleResetAll}
        />

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Left Panel (~5 Cols): Student Name Input & Buttons */}
          <div className="md:col-span-5 flex flex-col">
            <NameInputCard
              inputText={inputText}
              onChangeInputText={setInputText}
              onPick={handlePick}
              onResetAll={handleResetAll}
              isDrawing={isDrawing}
              remainingCount={remainingStudents.length}
              allowDuplicates={allowDuplicates}
              onToggleDuplicates={() => setAllowDuplicates((prev) => !prev)}
              pickCount={pickCount}
              onChangePickCount={setPickCount}
            />
          </div>

          {/* Right Panel (~7 Cols): Presenter Stage & Stats */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {/* Top Right: Today's Presenter Stage Card */}
            <PresenterStage
              currentPresenter={currentPresenter}
              spinningName={spinningName}
              isDrawing={isDrawing}
              historyCount={pickedHistory.length}
            />

            {/* Middle Right: 2 Stat Cards */}
            <StatCards
              remainingCount={remainingStudents.length}
              pickedCount={pickedHistory.length}
            />
          </div>
        </div>

        {/* Bottom 2 Cards Grid: Remaining Students List & Picked Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Bottom Left: Remaining Students List */}
          <RemainingListCard
            remainingStudents={remainingStudents}
          />

          {/* Bottom Right: Picked Students List */}
          <PickedListCard
            pickedHistory={pickedHistory}
            onRestoreStudent={handleRestoreStudent}
            onClearPickedHistory={handleClearPickedHistory}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full pt-8 text-center text-xs text-slate-400 font-medium">
        <p>랜덤 발표자 뽑기 — 스마트 교실 수업 지원 도구</p>
      </footer>

      {/* Fullscreen Projection Modal */}
      <FullScreenStageModal
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        currentPresenter={currentPresenter}
        spinningName={spinningName}
        isDrawing={isDrawing}
        onPick={handlePick}
        onResetAll={handleResetAll}
        remainingCount={remainingStudents.length}
        pickedCount={pickedHistory.length}
        totalCount={allStudents.length}
      />
    </div>
  );
}
