import React, { useState } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  List,
  CheckCircle,
  Repeat,
  Type
} from 'lucide-react';
import { CardReviewRecord, FSRSRating, FSRSState, UserProgressData, WordEntry } from '../types/vocabulary';
import { getLessonInfo, getWordsForLesson, lessons } from '../lib/data';
import { Flashcard } from './Flashcard';
import { AudioButton } from './AudioButton';
import { PracticeQuiz } from './PracticeQuiz';
import { WordModal } from './WordModal';
import { fsrs } from '../lib/fsrs';
import { recordStudyActivity } from '../lib/storage';

interface DailyStudyProps {
  progressData: UserProgressData;
  onUpdateProgress: (updated: UserProgressData) => void;
  allWords: WordEntry[];
  onOpenReviewTab: () => void;
}

type StudySubMode = 'flashcards' | 'overview' | 'quiz';

export const DailyStudy: React.FC<DailyStudyProps> = ({
  progressData,
  onUpdateProgress,
  allWords,
  onOpenReviewTab,
}) => {
  const currentDay = progressData.settings.currentLessonDay || 1;
  const wordsPerDay = progressData.settings.dailyNewWords || 12;
  const currentFontSize = progressData.settings.fontSize || 'large';

  const [subMode, setSubMode] = useState<StudySubMode>('flashcards');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [modalWord, setModalWord] = useState<WordEntry | null>(null);

  // Get current lesson & words
  const lessonInfo = getLessonInfo(currentDay) || {
    day: currentDay,
    title: `Bài ${currentDay}`,
    word_ids: [],
  };

  const rawLessonWords = getWordsForLesson(currentDay);
  // Slice to user's daily words setting (e.g. 10, 12, 15)
  const todayWords = rawLessonWords.slice(0, wordsPerDay);

  // Calculate today's completion stats
  const learnedCount = todayWords.filter(
    (w) => progressData.cards[w.id] && progressData.cards[w.id].state !== FSRSState.New
  ).length;

  const currentWord = todayWords[activeWordIndex] || todayWords[0];
  const currentCard: CardReviewRecord =
    (currentWord && progressData.cards[currentWord.id]) ||
    (currentWord ? fsrs.createEmptyCard(currentWord.id) : ({} as CardReviewRecord));

  // Handle FSRS rating from flashcard
  const handleRate = (rating: FSRSRating) => {
    if (!currentWord) return;

    const isFirstTime = !progressData.cards[currentWord.id] || progressData.cards[currentWord.id].state === FSRSState.New;
    const updatedCard = fsrs.repeat(currentCard, rating);

    const newCards = {
      ...progressData.cards,
      [currentWord.id]: updatedCard,
    };

    let updated = {
      ...progressData,
      cards: newCards,
    };

    updated = recordStudyActivity(updated, isFirstTime);
    onUpdateProgress(updated);

    // Advance to next word
    if (activeWordIndex < todayWords.length - 1) {
      setActiveWordIndex((idx) => idx + 1);
    } else {
      // Completed current day batch
      setSubMode('overview');
    }
  };

  const handlePrevWord = () => {
    if (activeWordIndex > 0) {
      setActiveWordIndex((idx) => idx - 1);
    }
  };

  const handleNextWord = () => {
    if (activeWordIndex < todayWords.length - 1) {
      setActiveWordIndex((idx) => idx + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    if (day < 1 || day > lessons.length) return;
    const updated = {
      ...progressData,
      settings: {
        ...progressData.settings,
        currentLessonDay: day,
      },
    };
    onUpdateProgress(updated);
    setActiveWordIndex(0);
    setSubMode('flashcards');
  };

  const handleToggleFontSize = () => {
    const nextSize: 'normal' | 'large' | 'xlarge' =
      currentFontSize === 'normal' ? 'large' : currentFontSize === 'large' ? 'xlarge' : 'normal';
    const updated = {
      ...progressData,
      settings: {
        ...progressData.settings,
        fontSize: nextSize,
      },
    };
    onUpdateProgress(updated);
  };

  const isTodayComplete = learnedCount === todayWords.length && todayWords.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Lesson Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-brand-800 bg-brand-100/70 px-2.5 py-0.5 rounded-full">
              Ngày {currentDay} / 76
            </span>
            <span className="text-xs text-stone-500">
              Mục tiêu: {wordsPerDay} từ/ngày
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
            {lessonInfo.title}
          </h2>
        </div>

        {/* Lesson Pagination & Font Size Controls */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Quick Font Size Switcher Button */}
          <button
            type="button"
            onClick={handleToggleFontSize}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-1 shadow-2xs"
            title="Đổi cỡ chữ hiển thị (Vừa / Lớn / Rất lớn)"
          >
            <Type size={14} className="text-brand-700" />
            <span>Cỡ chữ: {currentFontSize === 'normal' ? 'Vừa' : currentFontSize === 'large' ? 'Lớn' : 'Rất lớn'}</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              disabled={currentDay <= 1}
              onClick={() => handleSelectDay(currentDay - 1)}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Bài học trước"
            >
              <ChevronLeft size={18} />
            </button>

            <select
              value={currentDay}
              onChange={(e) => handleSelectDay(Number(e.target.value))}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500 max-w-[180px] sm:max-w-[220px]"
            >
              {lessons.map((l) => (
                <option key={l.day} value={l.day}>
                  Ngày {l.day}: {l.title.slice(0, 28)}...
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={currentDay >= lessons.length}
              onClick={() => handleSelectDay(currentDay + 1)}
              className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Bài học kế tiếp"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Daily Progress Tracker */}
      <div className="mt-6 mb-8 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-1.5">
            <span className="text-stone-700">Tiến độ bài học hôm nay</span>
            <span className="text-brand-800 font-bold">
              {learnedCount} / {todayWords.length} từ
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-brand-600 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${todayWords.length > 0 ? (learnedCount / todayWords.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSubMode('flashcards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subMode === 'flashcards'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers size={14} />
            <span>Thẻ Flashcard</span>
          </button>

          <button
            type="button"
            onClick={() => setSubMode('overview')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subMode === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <List size={14} />
            <span>Danh sách từ ({todayWords.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubMode('quiz')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subMode === 'quiz'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles size={14} />
            <span>Củng cố</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on subMode */}
      {subMode === 'flashcards' && currentWord && (
        <div>
          {/* Card index indicator */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-stone-500 mb-4 max-w-3xl mx-auto px-1">
            <span className="font-medium">
              Từ {activeWordIndex + 1} trên tổng số {todayWords.length}
            </span>
            <div className="flex items-center space-x-1.5">
              {todayWords.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveWordIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === activeWordIndex
                      ? 'bg-brand-700 scale-125'
                      : progressData.cards[todayWords[idx].id]?.state !== FSRSState.New
                      ? 'bg-emerald-400'
                      : 'bg-stone-200'
                  }`}
                  title={`Từ ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <Flashcard
            word={currentWord}
            card={currentCard}
            onRate={handleRate}
            autoPlayAudio={progressData.settings.autoPlayAudio}
            onPrev={handlePrevWord}
            onNext={handleNextWord}
            hasPrev={activeWordIndex > 0}
            hasNext={activeWordIndex < todayWords.length - 1}
            fontSize={currentFontSize}
          />
        </div>
      )}

      {subMode === 'overview' && (
        <div className="space-y-4">
          {isTodayComplete && (
            <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-start space-x-3">
                <CheckCircle size={28} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-950 text-base sm:text-lg">
                    Hoàn thành mục tiêu Ngày {currentDay}!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-0.5">
                    Tất cả {todayWords.length} từ đã được nạp vào thuật toán lặp lại ngắt quãng FSRS.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <button
                  type="button"
                  onClick={() => setSubMode('quiz')}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm"
                >
                  Luyện tập củng cố ngay
                </button>
                <button
                  type="button"
                  onClick={onOpenReviewTab}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors flex items-center space-x-1"
                >
                  <Repeat size={14} />
                  <span>Xem từ ôn tập</span>
                </button>
                {currentDay < lessons.length && (
                  <button
                    type="button"
                    onClick={() => handleSelectDay(currentDay + 1)}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                  >
                    Ngày {currentDay + 1} →
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {todayWords.map((word, idx) => {
              const card = progressData.cards[word.id];
              const isLearned = card && card.state !== FSRSState.New;

              return (
                <div
                  key={word.id}
                  onClick={() => setModalWord(word)}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-brand-300 hover:shadow-sm cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-mono text-stone-400">#{idx + 1}</span>
                      <h4 className="font-serif font-bold text-xl text-stone-900 group-hover:text-brand-800 transition-colors">
                        {word.word}
                      </h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium">
                        {word.part_of_speech}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-stone-800">{word.meaning_vi}</p>

                    {word.ipa_uk && (
                      <p className="font-mono text-xs sm:text-sm text-stone-400 mt-1">{word.ipa_uk}</p>
                    )}

                    {word.examples && word.examples.length > 0 && (
                      <p className="text-xs text-stone-500 italic mt-2 line-clamp-1">
                        "{word.examples[0].en}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2.5">
                    <AudioButton word={word.word} size="md" />
                    {isLearned ? (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        Đã học
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveWordIndex(idx);
                          setSubMode('flashcards');
                        }}
                        className="text-xs px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 hover:bg-brand-50 hover:text-brand-800 font-medium transition-colors"
                      >
                        Học thẻ →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subMode === 'quiz' && (
        <PracticeQuiz
          words={todayWords}
          allWords={allWords}
          onComplete={() => setSubMode('overview')}
        />
      )}

      {/* Word Detail Modal */}
      {modalWord && (
        <WordModal
          word={modalWord}
          card={progressData.cards[modalWord.id] || null}
          onClose={() => setModalWord(null)}
          onSelectWord={(wordText) => {
            const found = allWords.find(
              (w) => w.word.toLowerCase() === wordText.toLowerCase()
            );
            if (found) setModalWord(found);
          }}
        />
      )}
    </div>
  );
};
