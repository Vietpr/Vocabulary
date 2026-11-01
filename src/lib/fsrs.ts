import { CardReviewRecord, FSRSRating, FSRSState } from '../types/vocabulary';

// FSRS v4.5 parameters
const DEFAULT_WEIGHTS = [
  0.4072, 1.1829, 3.1262, 15.4722, // initial stability for Again, Hard, Good, Easy
  7.2102, 0.5316,                   // initial difficulty
  1.0651, 0.0234,                   // difficulty update
  1.616, 0.1544, 1.0824,            // stability update on success
  1.9813, 0.0953, 0.2975, 2.2042,   // stability update on lapse
  0.2407, 2.9466                    // retention factor & decay
];

export class FSRS {
  private w: number[];

  constructor(weights: number[] = DEFAULT_WEIGHTS) {
    this.w = weights;
  }

  public createEmptyCard(wordId: string): CardReviewRecord {
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

  /**
   * Calculate retrievability R(t) = (1 + factor * t / S)^-decay
   */
  public retrievability(card: CardReviewRecord, now: Date = new Date()): number {
    if (card.state === FSRSState.New || card.stability <= 0 || !card.last_review) {
      return 0;
    }
    const last = new Date(card.last_review).getTime();
    const elapsed = Math.max(0, (now.getTime() - last) / (1000 * 60 * 60 * 24));
    return Math.pow(1 + 0.19 * (elapsed / card.stability), -0.5);
  }

  /**
   * Process a review rating and calculate new card state
   */
  public repeat(card: CardReviewRecord, rating: FSRSRating, now: Date = new Date()): CardReviewRecord {
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
      // First review of this card
      next.difficulty = this.initDifficulty(rating);
      next.stability = this.initStability(rating);

      if (rating === FSRSRating.Again) {
        next.state = FSRSState.Learning;
        next.scheduled_days = 0;
        // Schedule in 10 minutes
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

    // Card has been reviewed before
    const r = this.retrievability(card, now);
    next.difficulty = this.nextDifficulty(card.difficulty, rating);

    if (rating === FSRSRating.Again) {
      next.lapses += 1;
      next.state = FSRSState.Relearning;
      next.stability = this.nextForgetStability(card.difficulty, card.stability, r);
      next.scheduled_days = 0;
      // Repeat in 10 minutes
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

  /**
   * Helper to preview next intervals for UI buttons (Again, Hard, Good, Easy)
   */
  public previewIntervals(card: CardReviewRecord, now: Date = new Date()): Record<FSRSRating, string> {
    const ratings = [FSRSRating.Again, FSRSRating.Hard, FSRSRating.Good, FSRSRating.Easy];
    const result = {} as Record<FSRSRating, string>;

    for (const r of ratings) {
      const simulated = this.repeat(card, r, now);
      if (simulated.scheduled_days === 0) {
        result[r] = '10 phút';
      } else if (simulated.scheduled_days === 1) {
        result[r] = '1 ngày';
      } else if (simulated.scheduled_days < 30) {
        result[r] = `${simulated.scheduled_days} ngày`;
      } else {
        const months = Math.round((simulated.scheduled_days / 30) * 10) / 10;
        result[r] = `${months} tháng`;
      }
    }

    return result;
  }

  private initStability(rating: FSRSRating): number {
    return Math.max(0.1, this.w[rating - 1]);
  }

  private initDifficulty(rating: FSRSRating): number {
    const d = this.w[4] - this.w[5] * (rating - 3);
    return Math.min(10, Math.max(1, d));
  }

  private nextDifficulty(d: number, rating: FSRSRating): number {
    const nextD = d - this.w[6] * (rating - 3);
    const meanReversion = this.w[7] * this.initDifficulty(FSRSRating.Good) + (1 - this.w[7]) * nextD;
    return Math.min(10, Math.max(1, meanReversion));
  }

  private nextRecallStability(d: number, s: number, r: number, rating: FSRSRating): number {
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

  private nextForgetStability(d: number, s: number, r: number): number {
    const newS =
      this.w[11] *
      Math.pow(d, -this.w[12]) *
      (Math.pow(s + 1, this.w[13]) - 1) *
      Math.exp((1 - r) * this.w[14]);
    return Math.min(s, Math.max(0.1, newS));
  }
}

export const fsrs = new FSRS();
