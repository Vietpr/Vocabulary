import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { FSRSState, UserProgressData, WordEntry } from '../types/vocabulary';
import { formatPos, lessons, searchWords } from '../lib/data';
import { AudioButton } from './AudioButton';
import { WordModal } from './WordModal';

interface VocabularyLibraryProps {
  allWords: WordEntry[];
  progressData: UserProgressData;
}

export const VocabularyLibrary: React.FC<VocabularyLibraryProps> = ({
  allWords,
  progressData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<number | 'all'>('all');
  const [selectedPos, setSelectedPos] = useState<string | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [hasAntonymsOnly, setHasAntonymsOnly] = useState(false);
  const [hasExamplesOnly, setHasExamplesOnly] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);

  // Filter words
  const filteredWords = useMemo(() => {
    let result = searchWords({
      query: searchQuery,
      lesson: selectedLesson,
      partOfSpeech: selectedPos,
      hasAntonyms: hasAntonymsOnly,
      hasExamples: hasExamplesOnly,
    });

    if (selectedStatus !== 'all') {
      result = result.filter((w) => {
        const card = progressData.cards[w.id];
        if (selectedStatus === 'unlearned') {
          return !card || card.state === FSRSState.New;
        }
        if (selectedStatus === 'learning') {
          return card && (card.state === FSRSState.Learning || card.state === FSRSState.Relearning);
        }
        if (selectedStatus === 'mastered') {
          return card && card.state === FSRSState.Review && card.stability >= 21;
        }
        if (selectedStatus === 'reviewing') {
          return card && card.state === FSRSState.Review;
        }
        return true;
      });
    }

    return result;
  }, [searchQuery, selectedLesson, selectedPos, selectedStatus, hasAntonymsOnly, hasExamplesOnly, progressData.cards]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLesson('all');
    setSelectedPos('all');
    setSelectedStatus('all');
    setHasAntonymsOnly(false);
    setHasExamplesOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedLesson !== 'all' ||
    selectedPos !== 'all' ||
    selectedStatus !== 'all' ||
    hasAntonymsOnly ||
    hasExamplesOnly;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-brand-800 bg-brand-100/70 px-2.5 py-0.5 rounded-full">
            1,055 từ vựng IELTS Foundation
          </span>
          <span className="text-xs text-stone-500">
            Phát âm chuẩn Anh - Anh (UK)
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Thư viện từ vựng
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Tra cứu, lọc từ theo bài học, từ loại và xem chi tiết ví dụ song ngữ cùng lưu ý ngữ pháp.
        </p>
      </div>

      {/* Search and Filters Controls */}
      <div className="mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3.5">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo từ tiếng Anh, nghĩa tiếng Việt hoặc chủ đề..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-stone-50/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter selectors row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Filter by Lesson */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">
              Bài học (Chủ đề)
            </label>
            <select
              value={selectedLesson}
              onChange={(e) =>
                setSelectedLesson(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Tất cả bài học (76 ngày)</option>
              {lessons.map((l) => (
                <option key={l.day} value={l.day}>
                  Ngày {l.day}: {l.title.slice(0, 32)}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Part of Speech */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">Từ loại</label>
            <select
              value={selectedPos}
              onChange={(e) => setSelectedPos(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Tất cả từ loại</option>
              <option value="n.">Danh từ (n.)</option>
              <option value="v.">Động từ (v.)</option>
              <option value="adj.">Tính từ (adj.)</option>
              <option value="adv.">Trạng từ (adv.)</option>
              <option value="pron.">Đại từ (pron.)</option>
              <option value="prep.">Giới từ (prep.)</option>
              <option value="det.">Từ hạn định (det.)</option>
            </select>
          </div>

          {/* Filter by Learning Status */}
          <div>
            <label className="text-[11px] font-semibold text-stone-500 block mb-1">
              Trạng thái học
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="unlearned">Chưa học</option>
              <option value="learning">Đang học</option>
              <option value="reviewing">Đang ôn tập</option>
              <option value="mastered">Đã thuộc vững chắc</option>
            </select>
          </div>
        </div>

        {/* Quick filter checkboxes & clear */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer text-stone-600">
              <input
                type="checkbox"
                checked={hasAntonymsOnly}
                onChange={(e) => setHasAntonymsOnly(e.target.checked)}
                className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Có từ trái nghĩa</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-stone-600">
              <input
                type="checkbox"
                checked={hasExamplesOnly}
                onChange={(e) => setHasExamplesOnly(e.target.checked)}
                className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
              />
              <span>Có ví dụ song ngữ</span>
            </label>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="mt-4 mb-3 flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Hiển thị <span className="font-bold text-stone-800">{filteredWords.length}</span> / 1,055 từ
        </span>
        <span className="text-stone-400">Nhấp vào từ để xem đầy đủ chi tiết và ví dụ</span>
      </div>

      {/* Words List */}
      {filteredWords.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 text-stone-500 text-xs">
          Không tìm thấy từ vựng nào khớp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWords.map((word) => {
            const card = progressData.cards[word.id];
            let statusText = 'Chưa học';
            let statusBadge = 'bg-stone-100 text-stone-600';

            if (card) {
              if (card.state === FSRSState.Learning || card.state === FSRSState.Relearning) {
                statusText = 'Đang học';
                statusBadge = 'bg-amber-100 text-amber-800';
              } else if (card.stability >= 21) {
                statusText = 'Đã thuộc';
                statusBadge = 'bg-emerald-100 text-emerald-800';
              } else if (card.state === FSRSState.Review) {
                statusText = 'Ôn tập';
                statusBadge = 'bg-blue-100 text-blue-800';
              }
            }

            return (
              <div
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-brand-400 hover:shadow-sm cursor-pointer transition-all flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 group-hover:text-brand-800 transition-colors">
                      {word.word}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                      {formatPos(word.part_of_speech)}
                    </span>
                    {word.ipa_uk && (
                      <span className="font-mono text-xs sm:text-sm text-stone-500">
                        {word.ipa_uk}
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-medium text-stone-800 mt-1.5 truncate">
                    {word.meaning_vi}
                  </p>

                  <div className="flex items-center space-x-2 mt-2 text-xs text-stone-400">
                    <span>Bài {word.lesson}</span>
                    {word.antonyms.length > 0 && (
                      <span className="text-stone-500">
                        · Trái nghĩa: {word.antonyms.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2.5">
                  <AudioButton word={word.word} size="md" />
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${statusBadge}`}>
                    {statusText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <WordModal
          word={selectedWord}
          card={progressData.cards[selectedWord.id] || null}
          onClose={() => setSelectedWord(null)}
          onSelectWord={(wordText) => {
            const found = allWords.find(
              (w) => w.word.toLowerCase() === wordText.toLowerCase()
            );
            if (found) setSelectedWord(found);
          }}
        />
      )}
    </div>
  );
};
