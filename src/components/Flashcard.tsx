import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  Sparkles,
  ExternalLink,
  Keyboard,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { CardReviewRecord, FSRSRating, WordEntry } from '../types/vocabulary';
import { formatPos } from '../lib/data';
import { AudioButton } from './AudioButton';
import { fsrs } from '../lib/fsrs';
import { britishAudio } from '../lib/audio';

interface FlashcardProps {
  word: WordEntry;
  card: CardReviewRecord;
  onRate: (rating: FSRSRating) => void;
  autoPlayAudio?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  fontSize?: 'normal' | 'large' | 'xlarge';
}

export const Flashcard: React.FC<FlashcardProps> = ({
  word,
  card,
  onRate,
  autoPlayAudio = true,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  fontSize = 'large',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [intervals, setIntervals] = useState<Record<FSRSRating, string>>({
    [FSRSRating.Again]: '10 phút',
    [FSRSRating.Hard]: '1 ngày',
    [FSRSRating.Good]: '3 ngày',
    [FSRSRating.Easy]: '7 ngày',
  });

  // Calculate dynamic intervals whenever card or word changes
  useEffect(() => {
    setIsFlipped(false);
    const calculated = fsrs.previewIntervals(card);
    setIntervals(calculated);

    if (autoPlayAudio) {
      const timer = setTimeout(() => {
        britishAudio.speak(word.word, 0.88);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [word.id, card, autoPlayAudio]);

  // Keyboard shortcut handler including Left/Right Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Left & Right Arrow keys to navigate words
      if (e.key === 'ArrowLeft') {
        if (onPrev && hasPrev) {
          e.preventDefault();
          onPrev();
        }
      } else if (e.key === 'ArrowRight') {
        if (onNext && hasNext) {
          e.preventDefault();
          onNext();
        }
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        britishAudio.speak(word.word, 0.88);
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          onRate(FSRSRating.Again);
        } else if (e.key === '2') {
          e.preventDefault();
          onRate(FSRSRating.Hard);
        } else if (e.key === '3') {
          e.preventDefault();
          onRate(FSRSRating.Good);
        } else if (e.key === '4') {
          e.preventDefault();
          onRate(FSRSRating.Easy);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onRate, word.word, onPrev, onNext, hasPrev, hasNext]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Font size responsive scaling classes
  const fontConfig = {
    normal: {
      word: 'text-4xl sm:text-5xl md:text-6xl',
      ipa: 'text-base sm:text-lg',
      meaning: 'text-xl sm:text-2xl',
      exampleEn: 'text-sm sm:text-base',
      exampleVi: 'text-xs sm:text-sm',
      notes: 'text-xs sm:text-sm',
    },
    large: {
      word: 'text-5xl sm:text-6xl md:text-7xl',
      ipa: 'text-lg sm:text-xl md:text-2xl',
      meaning: 'text-2xl sm:text-3xl md:text-4xl',
      exampleEn: 'text-base sm:text-lg md:text-xl',
      exampleVi: 'text-sm sm:text-base',
      notes: 'text-sm sm:text-base',
    },
    xlarge: {
      word: 'text-6xl sm:text-7xl md:text-8xl',
      ipa: 'text-xl sm:text-2xl md:text-3xl',
      meaning: 'text-3xl sm:text-4xl md:text-5xl',
      exampleEn: 'text-lg sm:text-xl md:text-2xl',
      exampleVi: 'text-base sm:text-lg',
      notes: 'text-base sm:text-lg',
    },
  }[fontSize];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Top quick navigation bar with arrows */}
      <div className="w-full flex items-center justify-between mb-3 px-1 text-xs sm:text-sm text-stone-500">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-700 shadow-2xs"
          title="Từ trước (Phím mũi tên trái ←)"
        >
          <ArrowLeft size={16} />
          <span className="font-medium hidden sm:inline">Từ trước</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-stone-100 rounded border border-stone-200 font-mono">
            ←
          </kbd>
        </button>

        <span className="text-xs text-stone-400 font-medium">
          Mũi tên <span className="text-stone-700 font-bold">←</span> / <span className="text-stone-700 font-bold">→</span> để đổi từ
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-stone-700 shadow-2xs"
          title="Từ tiếp theo (Phím mũi tên phải →)"
        >
          <span className="font-medium hidden sm:inline">Từ tiếp theo</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-stone-100 rounded border border-stone-200 font-mono">
            →
          </kbd>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Main Flashcard Container */}
      <div
        className="relative w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] cursor-pointer perspective-1000 select-none"
        onClick={handleFlip}
      >
        <div
          className={`w-full h-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] transition-card transform-style-3d bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md p-6 sm:p-9 md:p-11 flex flex-col justify-between ${
            isFlipped ? 'rotate-y-180 bg-[#FAF9F6]' : 'bg-white'
          }`}
        >
          {/* FRONT OF CARD */}
          {!isFlipped && (
            <div className="flex flex-col justify-between h-full">
              {/* Header Info */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-stone-400">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-medium">
                  Bài {word.lesson} · {word.topic}
                </span>
                <span className="flex items-center space-x-1.5 text-stone-400 font-medium">
                  <RotateCw size={15} />
                  <span>Chạm hoặc Space để lật</span>
                </span>
              </div>

              {/* Word & Pronunciation Area */}
              <div className="my-auto py-6 sm:py-10 text-center flex flex-col items-center">
                <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-brand-800 bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-200/80 mb-5">
                  {formatPos(word.part_of_speech)}
                </span>

                <h1 className={`${fontConfig.word} font-serif font-bold text-stone-900 tracking-tight mb-4`}>
                  {word.word}
                </h1>

                <div className="flex items-center space-x-3.5 mt-2">
                  {word.ipa_uk && (
                    <span className={`${fontConfig.ipa} font-mono text-stone-600 bg-stone-50 px-3 py-1 rounded-lg border border-stone-200/80 tracking-wide`}>
                      {word.ipa_uk}
                    </span>
                  )}
                  <AudioButton word={word.word} size="lg" />
                </div>

                <p className="text-xs text-stone-400 mt-5 italic">
                  Chuẩn phát âm Anh - Anh (UK) cho IELTS
                </p>
              </div>

              {/* Bottom bar */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs sm:text-sm text-stone-400">
                <span className="flex items-center space-x-1.5">
                  <Keyboard size={15} />
                  <span>Space: Lật thẻ · A: Nghe lại phát âm</span>
                </span>
                <span className="text-brand-800 font-semibold hover:underline">
                  Xem định nghĩa & ví dụ →
                </span>
              </div>
            </div>
          )}

          {/* BACK OF CARD */}
          {isFlipped && (
            <div
              className="flex flex-col justify-between h-full rotate-y-180 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between pb-3.5 border-b border-stone-200/80 text-xs sm:text-sm text-stone-500">
                  <div className="flex items-center space-x-2.5 flex-wrap">
                    <span className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
                      {word.word}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-stone-100 text-stone-700 text-xs font-semibold">
                      {formatPos(word.part_of_speech)}
                    </span>
                    {word.ipa_uk && (
                      <span className="font-mono text-sm sm:text-base text-stone-600">
                        {word.ipa_uk}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <AudioButton word={word.word} size="md" />
                    <button
                      type="button"
                      onClick={handleFlip}
                      className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors border border-stone-200 hover:bg-stone-100"
                      title="Lật lại mặt trước"
                    >
                      <RotateCw size={15} />
                    </button>
                  </div>
                </div>

                {/* Meaning Section */}
                <div className="mt-4 p-4 sm:p-5 bg-brand-50/70 rounded-2xl border border-brand-100">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-brand-800 block mb-1">
                    Định nghĩa tiếng Việt
                  </span>
                  <p className={`${fontConfig.meaning} font-bold text-stone-900 leading-snug`}>
                    {word.meaning_vi}
                  </p>
                </div>

                {/* Antonyms & Collocations */}
                {word.antonyms.length > 0 && (
                  <div className="mt-3 flex items-center space-x-2 text-xs sm:text-sm">
                    <span className="font-semibold text-stone-500">Từ trái nghĩa:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {word.antonyms.map((ant, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-800 font-medium border border-stone-200"
                        >
                          ≠ {ant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example sentences */}
                <div className="mt-4 space-y-3">
                  <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-stone-400 block">
                    Ví dụ ứng dụng thực tế ({word.examples.length} câu song ngữ)
                  </span>

                  {word.examples && word.examples.length > 0 ? (
                    word.examples.map((eg, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className={`${fontConfig.exampleEn} font-medium text-stone-900 leading-relaxed`}>
                            {eg.en}
                          </p>
                          <AudioButton word={eg.en} size="sm" />
                        </div>
                        <p className={`${fontConfig.exampleVi} text-stone-600 leading-relaxed`}>
                          {eg.vi}
                        </p>
                        {eg.grammar_note && (
                          <div className="mt-2 pt-2 border-t border-stone-100 flex items-start space-x-2 text-amber-900 bg-amber-50/70 p-2.5 rounded-lg text-xs sm:text-sm">
                            <Sparkles size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-amber-800 mr-1.5">
                                Điểm ngữ pháp:
                              </span>
                              <span>{eg.grammar_note}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-stone-100/70 text-xs sm:text-sm text-stone-500 text-center border border-dashed border-stone-300">
                      Ví dụ ngữ cảnh IELTS đang được cập nhật thêm cho từ này. Bạn có thể tra cứu nhanh trên Cambridge Dictionary bên dưới.
                    </div>
                  )}
                </div>
              </div>

              {/* Cambridge link */}
              {word.cambridge_url && (
                <div className="mt-4 pt-2.5 text-right border-t border-stone-100">
                  <a
                    href={word.cambridge_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs sm:text-sm text-brand-700 hover:text-brand-900 font-medium underline-offset-4 hover:underline"
                  >
                    <span>Xem thêm trên từ điển Cambridge UK</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spaced Repetition (FSRS) Rating Bar */}
      {isFlipped ? (
        <div className="w-full mt-6 flex flex-col items-center animate-fade-in">
          <p className="text-xs sm:text-sm text-stone-600 font-medium mb-3">
            Mức độ nhớ từ của bạn? (FSRS tự động lên lịch ngày ôn tập tiếp theo)
          </p>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-full">
            {/* Button 1: Again / Chưa nhớ */}
            <button
              type="button"
              onClick={() => onRate(FSRSRating.Again)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-900 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <span className="text-xs sm:text-sm font-bold">Chưa nhớ</span>
              <span className="text-xs opacity-80 mt-0.5">{intervals[FSRSRating.Again]}</span>
              <span className="text-[10px] text-rose-500 mt-1 font-mono">Phím 1</span>
            </button>

            {/* Button 2: Hard / Khó */}
            <button
              type="button"
              onClick={() => onRate(FSRSRating.Hard)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-amber-200 bg-amber-50/80 hover:bg-amber-100 text-amber-900 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <span className="text-xs sm:text-sm font-bold">Khó</span>
              <span className="text-xs opacity-80 mt-0.5">{intervals[FSRSRating.Hard]}</span>
              <span className="text-[10px] text-amber-500 mt-1 font-mono">Phím 2</span>
            </button>

            {/* Button 3: Good / Nhớ được */}
            <button
              type="button"
              onClick={() => onRate(FSRSRating.Good)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <span className="text-xs sm:text-sm font-bold">Nhớ</span>
              <span className="text-xs opacity-80 mt-0.5">{intervals[FSRSRating.Good]}</span>
              <span className="text-[10px] text-emerald-600 mt-1 font-mono">Phím 3</span>
            </button>

            {/* Button 4: Easy / Rất dễ */}
            <button
              type="button"
              onClick={() => onRate(FSRSRating.Easy)}
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <span className="text-xs sm:text-sm font-bold">Rất dễ</span>
              <span className="text-xs opacity-80 mt-0.5">{intervals[FSRSRating.Easy]}</span>
              <span className="text-[10px] text-blue-500 mt-1 font-mono">Phím 4</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={handleFlip}
            className="px-8 py-3.5 rounded-2xl bg-stone-900 text-white font-semibold text-sm sm:text-base hover:bg-stone-800 transition-all active:scale-95 shadow-sm inline-flex items-center space-x-2.5"
          >
            <span>Lật thẻ kiểm tra nghĩa & ví dụ</span>
            <RotateCw size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
