import React, { useState, useEffect } from 'react';
import { Volume2, Keyboard, Info } from 'lucide-react';
import { UserProgressData, UserSettings } from '../types/vocabulary';
import { britishAudio } from '../lib/audio';
import { datasetMeta } from '../lib/data';
import { saveUserProgress } from '../lib/storage';

interface SettingsViewProps {
  progressData: UserProgressData;
  onUpdateProgress: (updated: UserProgressData) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  progressData,
  onUpdateProgress,
}) => {
  const settings = progressData.settings;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testPlaying, setTestPlaying] = useState(false);

  useEffect(() => {
    const list = britishAudio.getAvailableVoices();
    setVoices(list);
  }, []);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updatedSettings: UserSettings = {
      ...settings,
      [key]: value,
    };
    const updatedData: UserProgressData = {
      ...progressData,
      settings: updatedSettings,
    };
    saveUserProgress(updatedData);
    onUpdateProgress(updatedData);
  };

  const handleTestVoice = () => {
    setTestPlaying(true);
    britishAudio.speak(
      'Welcome to English Restart. Perfect your British pronunciation for IELTS.',
      settings.audioSpeed,
      () => setTestPlaying(false),
      () => setTestPlaying(false)
    );
  };

  const handleSelectVoice = (uri: string) => {
    britishAudio.setVoiceByUri(uri);
    updateSetting('voiceURI', uri);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Title */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-brand-800 bg-brand-100/70 px-2.5 py-0.5 rounded-full">
            Tùy chỉnh trải nghiệm
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Cài đặt học tập
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Điều chỉnh mục tiêu từ vựng hàng ngày, cấu hình giọng đọc chuẩn Anh - Anh và phím tắt.
        </p>
      </div>

      {/* Daily Goal Setting */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">
            Mục tiêu từ vựng mỗi ngày
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Số lượng từ mới bạn muốn tiếp nhận mỗi ngày (mặc định khuyến nghị: 12 từ).
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {[10, 12, 15].map((count) => {
            const isSelected = settings.dailyNewWords === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => updateSetting('dailyNewWords', count)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-semibold ring-2 ring-brand-500/20'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-2xl font-bold font-serif block mb-0.5">{count}</span>
                <span className="text-xs text-stone-500">từ / ngày</span>
                {count === 12 && (
                  <span className="mt-1.5 inline-block text-[10px] px-1.5 py-0.2 rounded bg-brand-200/60 text-brand-800 font-medium">
                    Chuẩn IELTS
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size Preference Setting */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">
            Cỡ chữ hiển thị (Typography & Readability)
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Tối ưu kích thước chữ cho máy tính bàn (PC), laptop và điện thoại di động.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { id: 'normal' as const, label: 'Vừa', desc: 'Gọn gàng' },
            { id: 'large' as const, label: 'Lớn', desc: 'Dễ đọc (Khuyên dùng)' },
            { id: 'xlarge' as const, label: 'Rất lớn', desc: 'Rõ nét tối đa' },
          ].map((item) => {
            const isSelected = (settings.fontSize || 'large') === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateSetting('fontSize', item.id)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 text-brand-900 font-semibold ring-2 ring-brand-500/20'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="text-xl font-bold block mb-0.5">{item.label}</span>
                <span className="text-xs text-stone-500">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Pronunciation Settings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 flex items-center space-x-2">
            <Volume2 size={16} className="text-brand-700" />
            <span>Phát âm chuẩn Anh - Anh (British English)</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Ứng dụng sử dụng Web Speech Synthesis với các giọng đọc UK chất lượng cao.
          </p>
        </div>

        {/* Voice selector */}
        {voices.length > 0 && (
          <div className="pt-2">
            <label className="text-xs font-semibold text-stone-700 block mb-2">
              Lựa chọn giọng đọc trên thiết bị ({voices.length} giọng tiếng Anh khả dụng)
            </label>
            <select
              value={settings.voiceURI || ''}
              onChange={(e) => handleSelectVoice(e.target.value)}
              className="w-full max-w-md px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Tự động ưu tiên giọng chuẩn Anh - Anh (en-GB)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}) {v.lang.toLowerCase().includes('gb') ? '🇬🇧 UK' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Speed toggle */}
        <div className="pt-2">
          <label className="text-xs font-semibold text-stone-700 block mb-2">
            Tốc độ phát âm
          </label>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => updateSetting('audioSpeed', 0.85)}
              className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                settings.audioSpeed < 0.95
                  ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              0.85x · Chậm & Rõ khẩu hình (Khuyên dùng)
            </button>
            <button
              type="button"
              onClick={() => updateSetting('audioSpeed', 1.0)}
              className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                settings.audioSpeed >= 0.95
                  ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              1.0x · Tốc độ tự nhiên
            </button>
          </div>
        </div>

        {/* Auto play toggle */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-stone-800 block">
              Tự động phát âm thanh khi hiển thị thẻ từ
            </span>
            <span className="text-[11px] text-stone-500">
              Giúp bạn nghe ngay cách phát âm UK của từ vựng mới.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoPlayAudio}
              onChange={(e) => updateSetting('autoPlayAudio', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {/* Test voice button */}
        <div className="pt-2 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleTestVoice}
            disabled={testPlaying}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center space-x-1.5"
          >
            <Volume2 size={14} />
            <span>{testPlaying ? 'Đang đọc mẫu UK...' : 'Nghe thử giọng phát âm'}</span>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-stone-900 flex items-center space-x-2">
          <Keyboard size={16} className="text-stone-600" />
          <span>Phím tắt học nhanh trên máy tính</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Chuyển từ tiếp theo / Từ trước</span>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white border border-stone-300 rounded font-mono text-[11px] shadow-2xs">
                ←
              </kbd>
              <kbd className="px-2 py-1 bg-white border border-stone-300 rounded font-mono text-[11px] shadow-2xs">
                →
              </kbd>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Lật thẻ Flashcard</span>
            <kbd className="px-2 py-1 bg-white border border-stone-300 rounded font-mono text-[11px] shadow-2xs">
              Space / Enter
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Nghe lại phát âm UK</span>
            <kbd className="px-2 py-1 bg-white border border-stone-300 rounded font-mono text-[11px] shadow-2xs">
              A hoặc R
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Đánh giá "Chưa nhớ" (Again)</span>
            <kbd className="px-2 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded font-mono text-[11px] shadow-2xs">
              1
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Đánh giá "Khó" (Hard)</span>
            <kbd className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded font-mono text-[11px] shadow-2xs">
              2
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Đánh giá "Nhớ được" (Good)</span>
            <kbd className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded font-mono text-[11px] shadow-2xs">
              3
            </kbd>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200/70">
            <span className="text-stone-600 font-medium">Đánh giá "Rất dễ" (Easy)</span>
            <kbd className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded font-mono text-[11px] shadow-2xs">
              4
            </kbd>
          </div>
        </div>
      </div>

      {/* Dataset Info */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
        <div className="flex items-center space-x-1.5 font-semibold text-stone-800">
          <Info size={14} />
          <span>Thông tin bộ từ điển</span>
        </div>
        <p>Giáo trình: {datasetMeta.title}</p>
        <p>Quy mô: {datasetMeta.stats.words} từ vựng cốt lõi · {datasetMeta.stats.lessons} bài học phân theo chủ đề</p>
        <p>Thuật toán lặp lại: Spaced Repetition (FSRS v4.5) với tỷ lệ nhớ mục tiêu 90%</p>
      </div>
    </div>
  );
};
