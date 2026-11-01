import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { WordEntry } from '../types/vocabulary';
import { britishAudio } from '../lib/audio';

interface PracticeQuizProps {
  words: WordEntry[];
  allWords: WordEntry[];
  onComplete: () => void;
}

interface Question {
  targetWord: WordEntry;
  type: 'meaning' | 'audio';
  options: string[]; // 4 options
  correctAnswer: string;
}

export const PracticeQuiz: React.FC<PracticeQuizProps> = ({
  words,
  allWords,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Generate questions from today's words
    if (words.length === 0) return;
    const shuffledWords = [...words].sort(() => 0.5 - Math.random()).slice(0, Math.min(6, words.length));

    const generated: Question[] = shuffledWords.map((target, idx) => {
      const isAudio = idx % 2 === 1;
      const otherWords = allWords
        .filter((w) => w.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      if (isAudio) {
        const options = [target.word, ...otherWords.map((w) => w.word)].sort(() => 0.5 - Math.random());
        return {
          targetWord: target,
          type: 'audio',
          options,
          correctAnswer: target.word,
        };
      } else {
        const options = [target.meaning_vi, ...otherWords.map((w) => w.meaning_vi)].sort(
          () => 0.5 - Math.random()
        );
        return {
          targetWord: target,
          type: 'meaning',
          options,
          correctAnswer: target.meaning_vi,
        };
      }
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  }, [words, allWords]);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ && currentQ.type === 'audio') {
      britishAudio.speak(currentQ.targetWord.word, 0.88);
    }
  }, [currentIndex, currentQ]);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    return (
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Hoàn thành bài củng cố!
        </h3>
        <p className="text-stone-600 text-sm mb-6">
          Bạn đạt <span className="font-bold text-brand-700">{score}/{questions.length}</span> câu chính xác. Trí nhớ từ vựng đã được kích hoạt hiệu quả.
        </p>

        <div className="flex items-center justify-center space-x-3">
          <button
            type="button"
            onClick={handleRestart}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-1.5"
          >
            <RotateCcw size={14} />
            <span>Làm lại</span>
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-brand-700 text-white hover:bg-brand-800 transition-colors"
          >
            Trở về bài học
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm">
      {/* Progress header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs text-stone-500">
        <span>Luyện tập phản xạ nhanh</span>
        <span>
          Câu {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Question prompt */}
      <div className="my-6 text-center">
        {currentQ.type === 'meaning' ? (
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
              Từ vựng này có nghĩa là gì?
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              {currentQ.targetWord.word}
            </h2>
            {currentQ.targetWord.ipa_uk && (
              <span className="font-mono text-sm text-stone-500 mt-1 block">
                {currentQ.targetWord.ipa_uk}
              </span>
            )}
          </div>
        ) : (
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block mb-2">
              Nghe phát âm UK và chọn từ tương ứng
            </span>
            <button
              type="button"
              onClick={() => britishAudio.speak(currentQ.targetWord.word, 0.88)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-brand-100/70 text-brand-800 font-medium hover:bg-brand-200/70 transition-colors my-2"
            >
              <Volume2 size={20} />
              <span>Nghe lại phát âm UK</span>
            </button>
            <p className="text-xs text-stone-400 mt-1">Gợi ý nghĩa: {currentQ.targetWord.meaning_vi}</p>
          </div>
        )}
      </div>

      {/* Multiple choice options */}
      <div className="space-y-2.5">
        {currentQ.options.map((option, idx) => {
          let btnClass = 'bg-stone-50/70 hover:bg-stone-100 text-stone-800 border-stone-200/80';
          if (isAnswered) {
            if (option === currentQ.correctAnswer) {
              btnClass = 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold';
            } else if (option === selectedOption) {
              btnClass = 'bg-rose-50 text-rose-900 border-rose-300 font-medium';
            } else {
              btnClass = 'bg-stone-50/40 text-stone-400 border-stone-200/50';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(option)}
              className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-150 flex items-center justify-between ${btnClass}`}
            >
              <span>{option}</span>
              {isAnswered && option === currentQ.correctAnswer && (
                <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
              )}
              {isAnswered && option === selectedOption && option !== currentQ.correctAnswer && (
                <XCircle size={18} className="text-rose-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      {isAnswered && (
        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs sm:text-sm hover:bg-stone-800 transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <span>{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
