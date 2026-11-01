import React, { useState } from 'react';
import { CheckCircle2, RotateCw, BookOpen } from 'lucide-react';
import { FSRSRating, FSRSState, UserProgressData, WordEntry } from '../types/vocabulary';
import { Flashcard } from './Flashcard';
import { fsrs } from '../lib/fsrs';
import { recordStudyActivity } from '../lib/storage';

interface ReviewSessionProps {
  progressData: UserProgressData;
  onUpdateProgress: (updated: UserProgressData) => void;
  allWords: WordEntry[];
  onOpenLearnTab: () => void;
}

export const ReviewSession: React.FC<ReviewSessionProps> = ({
  progressData,
  onUpdateProgress,
  allWords,
  onOpenLearnTab,
}) => {
  const [reviewQueue, setReviewQueue] = useState<string[]>(() => {
    const nowIso = new Date().toISOString();
    return Object.values(progressData.cards)
      .filter((c) => c.state !== FSRSState.New && c.due <= nowIso)
      .map((c) => c.wordId);
  });

  const [reviewedInSessionCount, setReviewedInSessionCount] = useState(0);
  const [isFreeReview, setIsFreeReview] = useState(false);

  // Map word IDs to WordEntry
  const wordMap = new Map(allWords.map((w) => [w.id, w]));

  const currentWordId = reviewQueue[0];
  const currentWord = currentWordId ? wordMap.get(currentWordId) : null;
  const currentCard = currentWordId
    ? progressData.cards[currentWordId] || fsrs.createEmptyCard(currentWordId)
    : null;

  const handleRate = (rating: FSRSRating) => {
    if (!currentWord || !currentCard) return;

    const updatedCard = fsrs.repeat(currentCard, rating);
    const newCards = {
      ...progressData.cards,
      [currentWord.id]: updatedCard,
    };

    let updated = {
      ...progressData,
      cards: newCards,
    };

    updated = recordStudyActivity(updated, false);
    onUpdateProgress(updated);

    setReviewedInSessionCount((c) => c + 1);

    // If rating is Again, push to end of queue so user reviews it again before finishing session
    if (rating === FSRSRating.Again) {
      setReviewQueue((prev) => [...prev.slice(1), currentWord.id]);
    } else {
      setReviewQueue((prev) => prev.slice(1));
    }
  };

  const handleStartFreeReview = () => {
    // Collect all learned words
    const learnedIds = Object.values(progressData.cards)
      .filter((c) => c.state !== FSRSState.New)
      .map((c) => c.wordId);

    if (learnedIds.length === 0) {
      alert('Bạn chưa học từ nào để ôn tập tự do. Hãy học các từ của bài hôm nay trước nhé!');
      return;
    }

    // Shuffle and pick up to 15 words
    const shuffled = [...learnedIds].sort(() => 0.5 - Math.random()).slice(0, 15);
    setReviewQueue(shuffled);
    setIsFreeReview(true);
    setReviewedInSessionCount(0);
  };

  // When no cards in queue
  if (!currentWord || !currentCard) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-100 text-brand-800 flex items-center justify-center mb-4">
          <CheckCircle2 size={36} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
          {reviewedInSessionCount > 0
            ? 'Đã hoàn thành phiên ôn tập!'
            : 'Không có từ nào đến hạn ôn tập'}
        </h2>

        <p className="text-sm text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
          {reviewedInSessionCount > 0
            ? `Tuyệt vời! Bạn vừa ôn tập thành công ${reviewedInSessionCount} từ vựng. Thuật toán FSRS đã tự động gia hạn lịch ôn cho các từ này.`
            : 'Tất cả các từ bạn đã học đều đang trong chu kỳ ghi nhớ tốt theo tính toán của FSRS. Hãy duy trì thói quen học từ mới mỗi ngày nhé!'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenLearnTab}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-700 text-white font-medium text-xs sm:text-sm hover:bg-brand-800 transition-colors flex items-center justify-center space-x-2 shadow-sm"
          >
            <BookOpen size={16} />
            <span>Học bài mới hôm nay</span>
          </button>

          <button
            type="button"
            onClick={handleStartFreeReview}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-medium text-xs sm:text-sm hover:bg-stone-50 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCw size={15} />
            <span>Ôn tập tự do (Cram mode)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header info */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-brand-800 bg-brand-100/70 px-2.5 py-0.5 rounded-full">
              {isFreeReview ? 'Ôn tập tự do' : 'Ôn tập định kỳ FSRS'}
            </span>
            <span className="text-xs text-stone-500">
              Còn {reviewQueue.length} từ trong hàng đợi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            Lặp lại ngắt quãng (Spaced Repetition)
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs text-stone-500 block">Đã ôn phiên này</span>
          <span className="text-lg font-bold text-brand-800">{reviewedInSessionCount} từ</span>
        </div>
      </div>

      {/* Spaced Repetition Flashcard */}
      <Flashcard
        word={currentWord}
        card={currentCard}
        onRate={handleRate}
        autoPlayAudio={progressData.settings.autoPlayAudio}
        onPrev={() => {
          if (reviewQueue.length > 1) {
            // Shift queue to see previous
            setReviewQueue((prev) => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)]);
          }
        }}
        onNext={() => {
          if (reviewQueue.length > 1) {
            // Skip to next word
            setReviewQueue((prev) => [...prev.slice(1), prev[0]]);
          }
        }}
        hasPrev={reviewQueue.length > 1}
        hasNext={reviewQueue.length > 1}
        fontSize={progressData.settings.fontSize || 'large'}
      />
    </div>
  );
};
