import React from 'react';
import { X, ExternalLink, BookCheck, Sparkles } from 'lucide-react';
import { CardReviewRecord, FSRSState, WordEntry } from '../types/vocabulary';
import { formatPos } from '../lib/data';
import { AudioButton } from './AudioButton';

interface WordModalProps {
  word: WordEntry | null;
  card?: CardReviewRecord | null;
  onClose: () => void;
  onSelectWord?: (wordId: string) => void;
}

export const WordModal: React.FC<WordModalProps> = ({
  word,
  card,
  onClose,
  onSelectWord,
}) => {
  if (!word) return null;

  const getStatusBadge = () => {
    if (!card || card.state === FSRSState.New) {
      return {
        text: 'Chưa học',
        bg: 'bg-stone-100 text-stone-600 border-stone-200',
      };
    }
    if (card.state === FSRSState.Learning || card.state === FSRSState.Relearning) {
      return {
        text: 'Đang học',
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    if (card.stability >= 21) {
      return {
        text: 'Đã thuộc vững chắc',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    return {
      text: `Đang ôn tập (${card.scheduled_days} ngày)`,
      bg: 'bg-blue-100 text-blue-800 border-blue-200',
    };
  };

  const status = getStatusBadge();

  // Highlight word in sentence
  const highlightWord = (sentence: string, target: string) => {
    const parts = sentence.split(new RegExp(`(\\b${target}\\b|\\b${target}s\\b|\\b${target}ed\\b|\\b${target}ing\\b)`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase().startsWith(target.toLowerCase()) ? (
        <span key={i} className="font-semibold text-brand-800 bg-brand-50 px-1 rounded underline decoration-brand-400">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-stone-200/80 p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-medium">
              Bài {word.lesson}: {word.topic}
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${status.bg}`}>
              {status.text}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Word Title & Pronunciation */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="flex items-baseline space-x-3 flex-wrap">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              {word.word}
            </h2>
            <span className="px-2.5 py-1 text-xs sm:text-sm rounded-lg bg-stone-100 text-stone-700 font-medium">
              {formatPos(word.part_of_speech)}
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            {word.ipa_uk ? (
              <span className="font-mono text-base sm:text-lg text-stone-700 bg-stone-50 px-3 py-1 rounded-lg border border-stone-200">
                {word.ipa_uk}
              </span>
            ) : (
              <span className="text-xs text-stone-400 italic">IPA chuẩn UK</span>
            )}
            <AudioButton word={word.word} size="md" />
          </div>
        </div>

        {/* Meaning in Vietnamese */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-brand-50/70 border border-brand-100">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-800 block mb-1">
            Định nghĩa tiếng Việt
          </span>
          <p className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">{word.meaning_vi}</p>
        </div>

        {/* Antonyms & Collocations if any */}
        {(word.antonyms.length > 0 || word.collocations.length > 0) && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {word.antonyms.length > 0 && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="text-xs font-semibold text-stone-500 uppercase block mb-1.5">
                  Từ trái nghĩa (Antonyms)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {word.antonyms.map((ant, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectWord && onSelectWord(ant)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-800 hover:border-brand-400 hover:text-brand-800 transition-colors"
                    >
                      ≠ {ant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {word.collocations.length > 0 && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="text-xs font-semibold text-stone-500 uppercase block mb-1.5">
                  Cụm từ đi kèm (Collocations)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {word.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-800"
                    >
                      • {col}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
              <BookCheck size={16} className="text-brand-600" />
              <span>Ví dụ ứng dụng thực tế (2 cặp câu)</span>
            </h3>
            {word.examples_status === 'reviewed' && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Đã kiểm duyệt
              </span>
            )}
          </div>

          {word.examples && word.examples.length > 0 ? (
            <div className="space-y-3.5">
              {word.examples.map((eg, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 hover:bg-stone-50/80 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed">
                      {highlightWord(eg.en, word.word)}
                    </p>
                    <AudioButton word={eg.en} size="sm" />
                  </div>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">{eg.vi}</p>

                  {/* Grammar note: show only when present & adds learning value */}
                  {eg.grammar_note && (
                    <div className="mt-2.5 pt-2.5 border-t border-stone-200/70 flex items-start space-x-2 text-xs sm:text-sm text-amber-900 bg-amber-50/80 p-3 rounded-xl">
                      <Sparkles size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-800 mr-1.5">Lưu ý ngữ pháp:</span>
                        <span>{eg.grammar_note}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-center">
              <p className="text-xs text-stone-500">
                Ví dụ ngữ cảnh IELTS Foundation cho từ này đang được cập nhật.
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Bạn có thể xem đầy đủ ví dụ và phát âm trực tiếp từ từ điển Cambridge bên dưới.
              </p>
            </div>
          )}
        </div>

        {/* Spaced Repetition Stats if card exists */}
        {card && card.state !== FSRSState.New && (
          <div className="mt-6 p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-600 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-stone-400 block">Độ bền (Stability)</span>
              <span className="font-semibold text-stone-800">
                {Math.round(card.stability * 10) / 10} ngày
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Độ khó (Difficulty)</span>
              <span className="font-semibold text-stone-800">
                {Math.round(card.difficulty * 10) / 10} / 10
              </span>
            </div>
            <div>
              <span className="text-stone-400 block">Số lần lặp lại</span>
              <span className="font-semibold text-stone-800">{card.reps} lần</span>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
          {word.cambridge_url ? (
            <a
              href={word.cambridge_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-xs text-brand-700 hover:text-brand-900 font-medium underline-offset-4 hover:underline"
            >
              <span>Xem trên từ điển Cambridge UK</span>
              <ExternalLink size={13} />
            </a>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
