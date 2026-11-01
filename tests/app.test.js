import assert from 'node:assert';
import test from 'node:test';

// Test FSRS Algorithm
import { FSRS } from '../src/lib/fsrs.ts';
import { FSRSRating, FSRSState } from '../src/types/vocabulary.ts';

test('FSRS initializes new cards correctly', () => {
  const fsrs = new FSRS();
  const card = fsrs.createEmptyCard('test-word-1');
  assert.strictEqual(card.state, FSRSState.New);
  assert.strictEqual(card.reps, 0);
  assert.strictEqual(card.lapses, 0);
  assert.strictEqual(card.stability, 0);
});

test('FSRS schedules initial ratings properly', () => {
  const fsrs = new FSRS();
  const baseCard = fsrs.createEmptyCard('w1');
  const now = new Date('2026-10-24T12:00:00Z');

  // Rating 1: Again
  const againCard = fsrs.repeat(baseCard, FSRSRating.Again, now);
  assert.strictEqual(againCard.state, FSRSState.Learning);
  assert.strictEqual(againCard.reps, 1);
  assert.strictEqual(againCard.scheduled_days, 0);

  // Rating 3: Good
  const goodCard = fsrs.repeat(baseCard, FSRSRating.Good, now);
  assert.strictEqual(goodCard.state, FSRSState.Review);
  assert.strictEqual(goodCard.reps, 1);
  assert.ok(goodCard.scheduled_days >= 3, 'Good should schedule at least 3 days');
  assert.ok(goodCard.stability > 2, 'Stability should be > 2');

  // Rating 4: Easy
  const easyCard = fsrs.repeat(baseCard, FSRSRating.Easy, now);
  assert.strictEqual(easyCard.state, FSRSState.Review);
  assert.ok(easyCard.scheduled_days >= 14, 'Easy should schedule >= 14 days');
});

test('FSRS previewIntervals returns human readable intervals', () => {
  const fsrs = new FSRS();
  const baseCard = fsrs.createEmptyCard('w1');
  const intervals = fsrs.previewIntervals(baseCard);

  assert.strictEqual(intervals[FSRSRating.Again], '10 phút');
  assert.strictEqual(intervals[FSRSRating.Hard], '1 ngày');
  assert.ok(intervals[FSRSRating.Good].includes('ngày'));
  assert.ok(intervals[FSRSRating.Easy].includes('ngày') || intervals[FSRSRating.Easy].includes('tháng'));
});

test('FSRS review updates stability and handles lapse on Again', () => {
  const fsrs = new FSRS();
  const baseCard = fsrs.createEmptyCard('w1');
  const day1 = new Date('2026-10-24T12:00:00Z');
  const day4 = new Date('2026-10-27T12:00:00Z');

  // Learn on day 1 with Good
  const cardAfterGood = fsrs.repeat(baseCard, FSRSRating.Good, day1);
  assert.strictEqual(cardAfterGood.state, FSRSState.Review);
  const stab1 = cardAfterGood.stability;

  // Review on day 4 with Good again -> stability must increase!
  const cardAfterGood2 = fsrs.repeat(cardAfterGood, FSRSRating.Good, day4);
  assert.ok(cardAfterGood2.stability > stab1, 'Stability must grow after successful recall');

  // Review with lapse (Again) -> lapses incremented, stability penalized
  const cardLapse = fsrs.repeat(cardAfterGood2, FSRSRating.Again, day4);
  assert.strictEqual(cardLapse.state, FSRSState.Relearning);
  assert.strictEqual(cardLapse.lapses, 1);
  assert.ok(cardLapse.stability <= cardAfterGood2.stability, 'Lapse decreases or halts stability growth');
});

// Test Dataset and Enrichment
import { getAllWords, getWordsForLesson, searchWords } from '../src/lib/data.ts';

test('Dataset loads and validates all 1055 IELTS Foundation words', () => {
  const all = getAllWords();
  assert.strictEqual(all.length, 1055, 'Should load all 1055 words');

  // Verify supplemental words have standard British IPA enriched
  const receiveWord = all.find(w => w.word === 'receive');
  assert.ok(receiveWord, 'receive word should exist');
  assert.strictEqual(receiveWord.ipa_uk, '/rɪˈsiːv/', 'receive should have enriched British IPA');

  const expensiveWord = all.find(w => w.word === 'expensive');
  assert.ok(expensiveWord, 'expensive word should exist');
  assert.strictEqual(expensiveWord.ipa_uk, '/ɪkˈspensɪv/', 'expensive should have enriched British IPA');

  const fastWord = all.find(w => w.word === 'fast');
  assert.ok(fastWord, 'fast word should exist');
  assert.strictEqual(fastWord.ipa_uk, '/fɑːst/', 'fast should have enriched British IPA');
});

test('Lesson indexing works for all 76 lessons', () => {
  const day1Words = getWordsForLesson(1);
  assert.ok(day1Words.length >= 12, 'Day 1 should have words');
  assert.strictEqual(day1Words[0].word, 'I');
  assert.strictEqual(day1Words[0].examples_status, 'reviewed');
  assert.strictEqual(day1Words[0].examples.length, 2);
  assert.ok(day1Words[0].examples[0].en);
  assert.ok(day1Words[0].examples[0].vi);
});

test('Search & filter engine works accurately', () => {
  // Search by English word
  const searchWater = searchWords({ query: 'water' });
  assert.ok(searchWater.length > 0, 'Should find word water');
  assert.ok(searchWater.some(w => w.word.toLowerCase() === 'water'));

  // Search by Vietnamese meaning
  const searchNuoc = searchWords({ query: 'nước' });
  assert.ok(searchNuoc.length > 0, 'Should find by Vietnamese meaning');

  // Filter by antonyms
  const withAntonyms = searchWords({ hasAntonyms: true });
  assert.ok(withAntonyms.length > 0, 'Should filter words with antonyms');
  assert.ok(withAntonyms.every(w => w.antonyms && w.antonyms.length > 0));

  // Filter by examples
  const withExamples = searchWords({ hasExamples: true });
  assert.ok(withExamples.length >= 42, 'Should filter words with reviewed examples');
});
