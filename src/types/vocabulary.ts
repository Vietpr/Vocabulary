export interface ExampleSentence {
  en: string;
  vi: string;
  grammar_note: string | null;
}

export interface WordEntry {
  id: string;
  lesson: number;
  position: number;
  word: string;
  word_original: string;
  part_of_speech: string;
  meaning_vi: string;
  ipa_uk: string | null;
  ipa_reviewed: boolean;
  antonyms: string[];
  cambridge_url: string;
  is_supplemental: boolean;
  topic: string;
  level: string | null;
  collocations: string[];
  examples: ExampleSentence[];
  examples_status: 'reviewed' | 'pending_review' | string;
  review_flags: string[];
}

export interface LessonInfo {
  day: number;
  title: string;
  word_ids: string[];
}

export interface Dataset {
  schema_version: string;
  title: string;
  source: {
    file: string;
    edition: string;
    extracted_date: string;
    pronunciation_preference: string;
    ipa_note: string;
    example_note: string;
  };
  study_settings: {
    default_new_words_per_day: number;
    min: number;
    max: number;
    review_algorithm: string;
  };
  content_editorial_rules: Record<string, string>;
  content_stats: {
    lessons: number;
    words: number;
    supplemental_words: number;
    examples_reviewed_words: number;
    examples_pending_words: number;
  };
  lessons: LessonInfo[];
  words: WordEntry[];
}

export const FSRSState = {
  New: 0,
  Learning: 1,
  Review: 2,
  Relearning: 3,
} as const;
export type FSRSState = typeof FSRSState[keyof typeof FSRSState];

export const FSRSRating = {
  Again: 1, // Chưa nhớ
  Hard: 2,  // Khó
  Good: 3,  // Nhớ
  Easy: 4,  // Dễ
} as const;
export type FSRSRating = typeof FSRSRating[keyof typeof FSRSRating];

export interface CardReviewRecord {
  wordId: string;
  state: FSRSState;
  due: string; // ISO date string
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  last_review: string | null; // ISO date string
}

export interface UserSettings {
  dailyNewWords: number; // 10, 12 (default), 15
  audioSpeed: number;    // 0.85 or 1.0
  autoPlayAudio: boolean;
  voiceURI: string | null;
  currentLessonDay: number;
  fontSize: 'normal' | 'large' | 'xlarge'; // Font size preference
}

export interface StudyHistoryEntry {
  date: string; // YYYY-MM-DD
  wordsLearned: number;
  wordsReviewed: number;
}

export interface UserProgressData {
  cards: Record<string, CardReviewRecord>;
  streak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  history: Record<string, StudyHistoryEntry>; // key: YYYY-MM-DD
  settings: UserSettings;
}
