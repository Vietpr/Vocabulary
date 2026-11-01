import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DailyStudy } from './components/DailyStudy';
import { ReviewSession } from './components/ReviewSession';
import { VocabularyLibrary } from './components/VocabularyLibrary';
import { ProgressStats } from './components/ProgressStats';
import { SettingsView } from './components/SettingsView';
import { getAllWords } from './lib/data';
import { getDueReviewWordIds, loadUserProgress, saveUserProgress } from './lib/storage';
import { UserProgressData } from './types/vocabulary';
import { britishAudio } from './lib/audio';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('learn');
  const [progressData, setProgressData] = useState<UserProgressData>(() => loadUserProgress());

  const allWords = useMemo(() => getAllWords(), []);

  // Compute due review cards count
  const dueReviewCount = useMemo(() => {
    return getDueReviewWordIds(progressData.cards).length;
  }, [progressData.cards]);

  // Sync voice preference on startup
  useEffect(() => {
    if (progressData.settings.voiceURI) {
      britishAudio.setVoiceByUri(progressData.settings.voiceURI);
    }
  }, [progressData.settings.voiceURI]);

  const handleUpdateProgress = (updated: UserProgressData) => {
    setProgressData(updated);
    saveUserProgress(updated);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans text-stone-900 pb-16 md:pb-8">
      {/* Navbar Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        dueReviewCount={dueReviewCount}
        streak={progressData.streak}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {currentTab === 'learn' && (
          <DailyStudy
            progressData={progressData}
            onUpdateProgress={handleUpdateProgress}
            allWords={allWords}
            onOpenReviewTab={() => setCurrentTab('review')}
          />
        )}

        {currentTab === 'review' && (
          <ReviewSession
            progressData={progressData}
            onUpdateProgress={handleUpdateProgress}
            allWords={allWords}
            onOpenLearnTab={() => setCurrentTab('learn')}
          />
        )}

        {currentTab === 'library' && (
          <VocabularyLibrary
            allWords={allWords}
            progressData={progressData}
          />
        )}

        {currentTab === 'stats' && (
          <ProgressStats
            progressData={progressData}
            allWords={allWords}
            onUpdateProgress={handleUpdateProgress}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            progressData={progressData}
            onUpdateProgress={handleUpdateProgress}
          />
        )}
      </main>

      {/* Calm, Minimalist Footer */}
      <footer className="mt-auto border-t border-stone-200/60 py-6 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>English Restart · IELTS Foundation Vocabulary</span>
          <span className="text-[11px]">
            Học mỗi ngày 12 từ · Lặp lại ngắt quãng FSRS · Phát âm UK
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
