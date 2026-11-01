import assert from 'node:assert';
import test from 'node:test';
import fs from 'node:fs';

const rawData = JSON.parse(fs.readFileSync('./English_Restart_IELTS_Foundation_v3.json', 'utf8'));

// Test FSRS Algorithm
const DEFAULT_WEIGHTS = [
  0.4072, 1.1829, 3.1262, 15.4722, // initial stability for Again, Hard, Good, Easy
  7.2102, 0.5316,                   // initial difficulty
  1.0651, 0.0234,                   // difficulty update
  1.616, 0.1544, 1.0824,            // stability update on success
  1.9813, 0.0953, 0.2975, 2.2042,   // stability update on lapse
  0.2407, 2.9466                    // retention factor & decay
];

const FSRSState = {
  New: 0,
  Learning: 1,
  Review: 2,
  Relearning: 3,
};

const FSRSRating = {
  Again: 1,
  Hard: 2,
  Good: 3,
  Easy: 4,
};

class FSRS {
  constructor(weights = DEFAULT_WEIGHTS) {
    this.w = weights;
  }

  createEmptyCard(wordId) {
    return {
      wordId,
      state: FSRSState.New,
      due: new Date().toISOString(),
      stability: 0,
      difficulty: 0,
      elapsed_days: 0,
      scheduled_days: 0,
      reps: 0,
      lapses: 0,
      last_review: null,
    };
  }

  retrievability(card, now = new Date()) {
    if (card.state === FSRSState.New || card.stability <= 0 || !card.last_review) {
      return 0;
    }
    const last = new Date(card.last_review).getTime();
    const elapsed = Math.max(0, (now.getTime() - last) / (1000 * 60 * 60 * 24));
    return Math.pow(1 + 0.19 * (elapsed / card.stability), -0.5);
  }

  repeat(card, rating, now = new Date()) {
    const next = { ...card };
    const nowIso = now.toISOString();

    let elapsed = 0;
    if (card.last_review) {
      elapsed = Math.max(0, (now.getTime() - new Date(card.last_review).getTime()) / (1000 * 60 * 60 * 24));
    }
    next.elapsed_days = Math.round(elapsed * 10) / 10;
    next.last_review = nowIso;
    next.reps += 1;

    if (card.state === FSRSState.New) {
      next.difficulty = this.initDifficulty(rating);
      next.stability = this.initStability(rating);

      if (rating === FSRSRating.Again) {
        next.state = FSRSState.Learning;
        next.scheduled_days = 0;
        next.due = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
      } else if (rating === FSRSRating.Hard) {
        next.state = FSRSState.Learning;
        next.scheduled_days = 1;
        next.due = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      } else {
        next.state = FSRSState.Review;
        const interval = Math.max(1, Math.round(next.stability));
        next.scheduled_days = interval;
        next.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
      }
      return next;
    }

    const r = this.retrievability(card, now);
    next.difficulty = this.nextDifficulty(card.difficulty, rating);

    if (rating === FSRSRating.Again) {
      next.lapses += 1;
      next.state = FSRSState.Relearning;
      next.stability = this.nextForgetStability(card.difficulty, card.stability, r);
      next.scheduled_days = 0;
      next.due = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    } else {
      next.state = FSRSState.Review;
      next.stability = this.nextRecallStability(card.difficulty, card.stability, r, rating);
      const interval = Math.max(1, Math.round(next.stability));
      next.scheduled_days = interval;
      next.due = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000).toISOString();
    }

    return next;
  }

  initStability(rating) {
    return Math.max(0.1, this.w[rating - 1]);
  }

  initDifficulty(rating) {
    const d = this.w[4] - this.w[5] * (rating - 3);
    return Math.min(10, Math.max(1, d));
  }

  nextDifficulty(d, rating) {
    const nextD = d - this.w[6] * (rating - 3);
    const meanReversion = this.w[7] * this.initDifficulty(FSRSRating.Good) + (1 - this.w[7]) * nextD;
    return Math.min(10, Math.max(1, meanReversion));
  }

  nextRecallStability(d, s, r, rating) {
    const hardPenalty = rating === FSRSRating.Hard ? this.w[15] : 1;
    const easyBonus = rating === FSRSRating.Easy ? this.w[16] : 1;
    const factor =
      1 +
      Math.exp(this.w[8]) *
        (11 - d) *
        Math.pow(s, -this.w[9]) *
        (Math.exp((1 - r) * this.w[10]) - 1) *
        hardPenalty *
        easyBonus;
    return Math.max(0.1, s * factor);
  }

  nextForgetStability(d, s, r) {
    const newS =
      this.w[11] *
      Math.pow(d, -this.w[12]) *
      (Math.pow(s + 1, this.w[13]) - 1) *
      Math.exp((1 - r) * this.w[14]);
    return Math.min(s, Math.max(0.1, newS));
  }
}

// 1. Test FSRS Algorithm
test('FSRS initializes new cards properly', () => {
  const fsrs = new FSRS();
  const card = fsrs.createEmptyCard('test-1');
  assert.strictEqual(card.state, FSRSState.New);
  assert.strictEqual(card.reps, 0);
  assert.strictEqual(card.lapses, 0);
  assert.strictEqual(card.stability, 0);
});

test('FSRS handles initial ratings correctly', () => {
  const fsrs = new FSRS();
  const base = fsrs.createEmptyCard('w1');
  const now = new Date('2026-10-24T10:00:00Z');

  const again = fsrs.repeat(base, FSRSRating.Again, now);
  assert.strictEqual(again.state, FSRSState.Learning);
  assert.strictEqual(again.scheduled_days, 0);

  const good = fsrs.repeat(base, FSRSRating.Good, now);
  assert.strictEqual(good.state, FSRSState.Review);
  assert.ok(good.scheduled_days >= 3);
  assert.ok(good.stability >= 3.0);

  const easy = fsrs.repeat(base, FSRSRating.Easy, now);
  assert.strictEqual(easy.state, FSRSState.Review);
  assert.ok(easy.scheduled_days >= 14);
});

test('FSRS stability increases on successful review', () => {
  const fsrs = new FSRS();
  const base = fsrs.createEmptyCard('w1');
  const t0 = new Date('2026-10-24T10:00:00Z');
  const t1 = new Date('2026-10-27T10:00:00Z');

  const afterFirst = fsrs.repeat(base, FSRSRating.Good, t0);
  const afterSecond = fsrs.repeat(afterFirst, FSRSRating.Good, t1);

  assert.ok(afterSecond.stability > afterFirst.stability, 'Stability grows upon successful recall');
  assert.ok(afterSecond.scheduled_days >= afterFirst.scheduled_days);
});

// 2. Test Dataset integrity
test('Dataset schema and vocabulary count', () => {
  assert.strictEqual(rawData.words.length, 1055);
  assert.strictEqual(rawData.lessons.length, 76);
  assert.strictEqual(rawData.source.pronunciation_preference, 'en-GB');

  // Check reviewed lessons 1-3
  const day1Words = rawData.words.filter(w => w.lesson === 1);
  assert.ok(day1Words.length >= 12);
  for (const w of day1Words) {
    assert.ok(w.word);
    assert.ok(w.meaning_vi);
    assert.ok(w.examples.length >= 2);
    assert.ok(w.examples[0].en);
    assert.ok(w.examples[0].vi);
  }
});
