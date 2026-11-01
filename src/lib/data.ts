import rawData from '../data/dataset.json';
import { Dataset, LessonInfo, WordEntry } from '../types/vocabulary';
import { ENRICHED_EXAMPLES_MAP } from '../data/enrichedExamples';

// Curated standard British English IPA for supplemental words missing IPA in the PDF
const SUPPLEMENTAL_IPA_UK_MAP: Record<string, string> = {
  'receive': '/rɪˈsiːv/',
  'fast': '/fɑːst/',
  'slow': '/sləʊ/',
  'incorrect': '/ˌɪnkəˈrekt/',
  'expensive': '/ɪkˈspensɪv/',
  'high': '/haɪ/',
  'low': '/ləʊ/',
  'complex': '/ˈkɒmpleks/',
  'full': '/fʊl/',
  'empty': '/ˈempti/',
  'unfriendly': '/ʌnˈfrendli/',
  'rude': '/ruːd/',
  'dishonest': '/dɪsˈɒnɪst/',
  'hardworking': '/ˌhɑːdˈwɜːkɪŋ/',
  'inactive': '/ɪnˈæktɪv/',
  'noisy': '/ˈnɔɪzi/',
  'impatient': '/ɪmˈpeɪʃnt/',
  'confident': '/ˈkɒnfɪdənt/',
  'careless': '/ˈkeələs/',
  'strong': '/strɒŋ/',
  'weak': '/wiːk/',
  'local': '/ˈləʊkl/',
  'global': '/ˈɡləʊbl/',
  'deep': '/diːp/',
  'shallow': '/ˈʃæləʊ/',
  'rich': '/rɪtʃ/',
  'poor': '/pɔː/',
  'continue': '/kənˈtɪnjuː/',
  'worsen': '/ˈwɜːsn/',
  'offline': '/ˌɒfˈlaɪn/',
  'public': '/ˈpʌblɪk/',
  'private': '/ˈpraɪvət/',
  'unequal': '/ʌnˈiːkwəl/',
  'same': '/seɪm/',
  'different': '/ˈdɪfrənt/',
  'unhealthy': '/ʌnˈhelθi/',
  'frown': '/fraʊn/',
  'harm': '/hɑːm/',
  'formal': '/ˈfɔːml/',
  'informal': '/ɪnˈfɔːml/',
  'true': '/truː/',
  'false': '/fɔːls/',
  'positive': '/ˈpɒzətɪv/',
  'negative': '/ˈneɡətɪv/',
  'useless': '/ˈjuːsləs/',
  'unimportant': '/ˌʌnɪmˈpɔːtnt/',
  'rare': '/reə/',
  'available': '/əˈveɪləbl/',
  'unavailable': '/ˌʌnəˈveɪləbl/',
  'unnecessary': '/ʌnˈnesəsəri/',
  'include': '/ɪnˈkluːd/',
  'exclude': '/ɪkˈskluːd/',
  'uninstall': '/ˌʌnɪnˈstɔːl/',
  'destroy': '/dɪˈstrɔɪ/',
  'unsuccessful': '/ˌʌnsəkˈsesfl/'
};

// Known corrections for extraction/GPT errors in the raw PDF
const DATA_CORRECTIONS: Record<string, Partial<WordEntry>> = {
  // 'use' as verb must be /juːz/ (the raw PDF transcribed it with an 's' /juːs/, which is the noun form)
  'd06-w01': {
    ipa_uk: '/juːz/',
    ipa_reviewed: true,
  },
  // 'close' as verb must be /kləʊz/ (the raw PDF transcribed it as /kləʊs/, which is the adjective form)
  'd67-w11': {
    ipa_uk: '/kləʊz/',
    ipa_reviewed: true,
  },
  // 'left' in directional terms functions as adj./n./adv. (symmetrical with 'right')
  'd52-w08': {
    part_of_speech: 'adj./n./adv.',
  },
  // 'programme' in technology context (lesson 73)
  'd73-w13': {
    meaning_vi: 'chương trình (trong tin học: program / mã phần mềm)',
  }
};

const typedData = rawData as unknown as Dataset;

// Normalize, enrich and correct words
const words: WordEntry[] = typedData.words.map((item) => {
  const correction = DATA_CORRECTIONS[item.id] || {};
  const enrichedIpa =
    correction.ipa_uk ||
    item.ipa_uk ||
    SUPPLEMENTAL_IPA_UK_MAP[item.word.toLowerCase()] ||
    null;

  // Use enriched examples if available, or original reviewed examples
  const enrichedExamples =
    ENRICHED_EXAMPLES_MAP[item.id] ||
    (Array.isArray(item.examples) && item.examples.length > 0 ? item.examples : []);

  const hasReviewedExamples =
    enrichedExamples.length > 0 || item.examples_status === 'reviewed';

  return {
    ...item,
    ...correction,
    ipa_uk: enrichedIpa,
    examples: enrichedExamples,
    examples_status: hasReviewedExamples ? 'reviewed' : item.examples_status,
    antonyms: Array.isArray(item.antonyms) ? item.antonyms : [],
    collocations: Array.isArray(item.collocations) ? item.collocations : [],
    review_flags: Array.isArray(item.review_flags) ? item.review_flags : [],
  };
});

const wordsById = new Map<string, WordEntry>();
const wordsByLesson = new Map<number, WordEntry[]>();

for (const w of words) {
  wordsById.set(w.id, w);
  const list = wordsByLesson.get(w.lesson) || [];
  list.push(w);
  wordsByLesson.set(w.lesson, list);
}

export const datasetMeta = {
  title: typedData.title,
  source: typedData.source,
  editorialRules: typedData.content_editorial_rules,
  stats: typedData.content_stats,
  studySettings: typedData.study_settings
};

export const lessons: LessonInfo[] = typedData.lessons;

export function getAllWords(): WordEntry[] {
  return words;
}

export function getWordById(id: string): WordEntry | undefined {
  return wordsById.get(id);
}

export function getWordsForLesson(lessonNum: number): WordEntry[] {
  return wordsByLesson.get(lessonNum) || [];
}

export function getLessonInfo(day: number): LessonInfo | undefined {
  return lessons.find(l => l.day === day);
}

export interface WordFilterOptions {
  query?: string;
  lesson?: number | 'all';
  partOfSpeech?: string | 'all';
  hasAntonyms?: boolean;
  hasExamples?: boolean;
}

export function searchWords(filters: WordFilterOptions): WordEntry[] {
  return words.filter((w) => {
    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      const matchWord = w.word.toLowerCase().includes(q);
      const matchMeaning = w.meaning_vi.toLowerCase().includes(q);
      const matchTopic = w.topic.toLowerCase().includes(q);
      if (!matchWord && !matchMeaning && !matchTopic) return false;
    }

    if (filters.lesson && filters.lesson !== 'all') {
      if (w.lesson !== filters.lesson) return false;
    }

    if (filters.partOfSpeech && filters.partOfSpeech !== 'all') {
      if (!w.part_of_speech.includes(filters.partOfSpeech)) return false;
    }

    if (filters.hasAntonyms) {
      if (!w.antonyms || w.antonyms.length === 0) return false;
    }

    if (filters.hasExamples) {
      if (!w.examples || w.examples.length === 0) return false;
    }

    return true;
  });
}

export const PART_OF_SPEECH_MAP: Record<string, string> = {
  'n.': 'Danh từ',
  'v.': 'Động từ',
  'adj.': 'Tính từ',
  'adv.': 'Trạng từ',
  'pron.': 'Đại từ',
  'det.': 'Từ hạn định',
  'prep.': 'Giới từ',
  'conj.': 'Liên từ',
  'aux.': 'Trợ động từ',
  'modal': 'Khiếm khuyết',
  'num.': 'Số từ',
  'interj.': 'Thán từ',
  'v./aux.': 'Động từ / Trợ ĐT',
  'pron./det.': 'Đại từ / Hạn định',
  'det./pron.': 'Hạn định / Đại từ',
  'adj./adv.': 'Tính từ / Trạng từ',
  'n./v.': 'Danh / Động từ',
  'v./n.': 'Động / Danh từ',
  'n./adj.': 'Danh / Tính từ',
};

export function formatPos(pos: string): string {
  return PART_OF_SPEECH_MAP[pos] || pos;
}
