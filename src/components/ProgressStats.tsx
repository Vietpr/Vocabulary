import React, { useRef } from 'react';
import {
  Flame,
  Award,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { FSRSState, UserProgressData, WordEntry } from '../types/vocabulary';
import { exportProgressToJson, importProgressFromJson, getInitialProgress, saveUserProgress } from '../lib/storage';

interface ProgressStatsProps {
  progressData: UserProgressData;
  allWords: WordEntry[];
  onUpdateProgress: (updated: UserProgressData) => void;
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({
  progressData,
  allWords,
  onUpdateProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute stats
  const totalWords = allWords.length;
  const cards = Object.values(progressData.cards);

  const learnedCards = cards.filter((c) => c.state !== FSRSState.New);
  const learningCount = cards.filter(
    (c) => c.state === FSRSState.Learning || c.state === FSRSState.Relearning
  ).length;
  const reviewCount = cards.filter(
    (c) => c.state === FSRSState.Review && c.stability < 21
  ).length;
  const masteredCount = cards.filter(
    (c) => c.state === FSRSState.Review && c.stability >= 21
  ).length;
  const unlearnedCount = totalWords - learnedCards.length;

  const totalReviews = cards.reduce((sum, c) => sum + (c.reps || 0), 0);

  // Recent 7 days activity
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;
    const weekday = d.toLocaleDateString('vi-VN', { weekday: 'short' });
    return {
      date: key,
      dayNumber: d.getDate(),
      weekday,
      entry: progressData.history[key] || { wordsLearned: 0, wordsReviewed: 0 },
    };
  });

  const handleExport = () => {
    exportProgressToJson(progressData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importProgressFromJson(text);
        onUpdateProgress(imported);
        alert('Khôi phục dữ liệu tiến độ thành công!');
      } catch (err) {
        alert('Tệp sao lưu không hợp lệ. Vui lòng kiểm tra lại!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    const ok = window.confirm(
      'Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập? Mọi từ đã thuộc và chuỗi ngày học sẽ trở về ban đầu.'
    );
    if (ok) {
      const fresh = getInitialProgress();
      saveUserProgress(fresh);
      onUpdateProgress(fresh);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-8">
      {/* Page Title */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-brand-800 bg-brand-100/70 px-2.5 py-0.5 rounded-full">
            Thống kê trí nhớ FSRS
          </span>
          <span className="text-xs text-stone-500">Mục tiêu ghi nhớ bền vững</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Tiến độ học tập
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Theo dõi chuỗi thói quen hàng ngày và sự phân bổ trí nhớ dài hạn của bạn.
        </p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Chuỗi học tập</span>
            <Flame size={18} className="text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span className="text-3xl font-bold text-stone-900 font-serif">
              {progressData.streak}
            </span>
            <span className="text-xs text-stone-500 block mt-0.5">ngày liên tục</span>
          </div>
        </div>

        {/* Total Words Learned */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Đã nạp vào não</span>
            <Brain size={18} className="text-brand-600" />
          </div>
          <div>
            <span className="text-3xl font-bold text-stone-900 font-serif">
              {learnedCards.length}
            </span>
            <span className="text-xs text-stone-500 block mt-0.5">
              / {totalWords} từ vựng
            </span>
          </div>
        </div>

        {/* Mastered Words */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Đã thuộc vững</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div>
            <span className="text-3xl font-bold text-emerald-900 font-serif">
              {masteredCount}
            </span>
            <span className="text-xs text-stone-500 block mt-0.5">
              Độ bền ≥ 21 ngày
            </span>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500">Lượt lặp lại</span>
            <Award size={18} className="text-blue-500" />
          </div>
          <div>
            <span className="text-3xl font-bold text-stone-900 font-serif">
              {totalReviews}
            </span>
            <span className="text-xs text-stone-500 block mt-0.5">lượt phản xạ FSRS</span>
          </div>
        </div>
      </div>

      {/* Memory Stage Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
          Phân bố trạng thái ghi nhớ (1,055 từ)
        </h3>

        {/* Multi-segment progress bar */}
        <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden flex">
          <div
            title={`Đã thuộc vững: ${masteredCount} từ`}
            className="bg-emerald-500 transition-all duration-300"
            style={{ width: `${(masteredCount / totalWords) * 100}%` }}
          />
          <div
            title={`Đang ôn tập: ${reviewCount} từ`}
            className="bg-blue-500 transition-all duration-300"
            style={{ width: `${(reviewCount / totalWords) * 100}%` }}
          />
          <div
            title={`Đang học: ${learningCount} từ`}
            className="bg-amber-400 transition-all duration-300"
            style={{ width: `${(learningCount / totalWords) * 100}%` }}
          />
          <div
            title={`Chưa học: ${unlearnedCount} từ`}
            className="bg-stone-200 transition-all duration-300"
            style={{ width: `${(unlearnedCount / totalWords) * 100}%` }}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-stone-600">Đã thuộc vững ({masteredCount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-stone-600">Đang ôn tập ({reviewCount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-stone-600">Đang học ({learningCount})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-stone-300" />
            <span className="text-stone-600">Chưa học ({unlearnedCount})</span>
          </div>
        </div>
      </div>

      {/* 7-Day Habit Tracker */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
            <Calendar size={16} className="text-brand-700" />
            <span>Thói quen 7 ngày gần đây</span>
          </h3>
          <span className="text-xs text-stone-400">Duy trì học 10–15 từ mỗi ngày</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {past7Days.map((d, idx) => {
            const hasActivity = d.entry.wordsLearned > 0 || d.entry.wordsReviewed > 0;
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-center flex flex-col justify-between transition-colors ${
                  hasActivity
                    ? 'bg-brand-50/70 border-brand-200'
                    : 'bg-stone-50/50 border-stone-200'
                }`}
              >
                <span className="text-[11px] font-semibold text-stone-400 uppercase">
                  {d.weekday}
                </span>
                <span className="text-base font-bold text-stone-800 my-1">
                  {d.dayNumber}
                </span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    hasActivity
                      ? 'bg-brand-200/80 text-brand-900'
                      : 'text-stone-400'
                  }`}
                >
                  {hasActivity ? `${d.entry.wordsLearned + d.entry.wordsReviewed} từ` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700">
            Bảo lưu & Sao lưu dữ liệu học tập
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Dữ liệu được lưu trữ tự động trên trình duyệt. Bạn có thể xuất file sao lưu để chuyển sang máy tính hoặc điện thoại khác.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Download size={14} />
            <span>Xuất file sao lưu (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors flex items-center space-x-1.5"
          >
            <Upload size={14} />
            <span>Khôi phục từ file</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100 transition-colors flex items-center space-x-1.5 ml-auto"
          >
            <RefreshCw size={14} />
            <span>Đặt lại tiến độ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
