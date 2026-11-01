import { CardReviewRecord, FSRSState, UserProgressData, UserSettings } from '../types/vocabulary';
import { fsrs } from './fsrs';

const STORAGE_KEY = 'english_restart_ielts_progress_v1';

const DEFAULT_SETTINGS: UserSettings = {
  dailyNewWords: 12,
  audioSpeed: 0.88,
  autoPlayAudio: true,
  voiceURI: null,
  currentLessonDay: 1,
  fontSize: 'large',
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialProgress(): UserProgressData {
  return {
    cards: {},
    streak: 0,
    lastActiveDate: null,
    history: {},
    settings: DEFAULT_SETTINGS,
  };
}

export function loadUserProgress(): UserProgressData {
  if (typeof window === 'undefined') return getInitialProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialProgress();
    const parsed = JSON.parse(raw) as UserProgressData;
    return {
      ...getInitialProgress(),
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load user progress:', e);
    return getInitialProgress();
  }
}

export function saveUserProgress(data: UserProgressData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save user progress:', e);
  }
}

/**
 * Update daily activity and streak
 */
export function recordStudyActivity(
  prevData: UserProgressData,
  isNewWord: boolean
): UserProgressData {
  const today = getTodayDateString();
  const history = { ...prevData.history };
  const currentTodayEntry = history[today] || {
    date: today,
    wordsLearned: 0,
    wordsReviewed: 0,
  };

  if (isNewWord) {
    currentTodayEntry.wordsLearned += 1;
  } else {
    currentTodayEntry.wordsReviewed += 1;
  }
  history[today] = currentTodayEntry;

  // Streak logic
  let newStreak = prevData.streak;
  if (!prevData.lastActiveDate) {
    newStreak = 1;
  } else if (prevData.lastActiveDate === today) {
    // Already active today, streak remains
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    if (prevData.lastActiveDate === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  }

  const updated: UserProgressData = {
    ...prevData,
    streak: newStreak,
    lastActiveDate: today,
    history,
  };

  saveUserProgress(updated);
  return updated;
}

/**
 * Get or create card record for a word
 */
export function getOrCreateCard(cards: Record<string, CardReviewRecord>, wordId: string): CardReviewRecord {
  if (cards[wordId]) {
    return cards[wordId];
  }
  return fsrs.createEmptyCard(wordId);
}

/**
 * Filter words that are due for review based on FSRS due date
 */
export function getDueReviewWordIds(cards: Record<string, CardReviewRecord>, now: Date = new Date()): string[] {
  const nowIso = now.toISOString();
  return Object.values(cards)
    .filter((c) => c.state !== FSRSState.New && c.due <= nowIso)
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .map((c) => c.wordId);
}

/**
 * Export progress data as downloadable JSON
 */
export function exportProgressToJson(data: UserProgressData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `english-restart-progress-${getTodayDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import progress data from JSON file content
 */
export function importProgressFromJson(jsonText: string): UserProgressData {
  const parsed = JSON.parse(jsonText);
  if (!parsed.cards || typeof parsed.cards !== 'object') {
    throw new Error('Dữ liệu không đúng định dạng!');
  }
  const loaded: UserProgressData = {
    cards: parsed.cards || {},
    streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
    lastActiveDate: parsed.lastActiveDate || null,
    history: parsed.history || {},
    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed.settings || {}),
    },
  };
  saveUserProgress(loaded);
  return loaded;
}
