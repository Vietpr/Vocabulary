import fs from 'node:fs';

// Load original data
const raw = JSON.parse(fs.readFileSync('./English_Restart_IELTS_Foundation_v3.json', 'utf8'));

// Extract ENRICHED_EXAMPLES_MAP from src/data/enrichedExamples.ts
const enrichedTs = fs.readFileSync('./src/data/enrichedExamples.ts', 'utf8');
const jsonMatch = enrichedTs.match(/export const ENRICHED_EXAMPLES_MAP: Record<string, ExampleSentence\[\]> = ([\s\S]*?);\s*$/);
let ENRICHED_EXAMPLES_MAP = {};
if (jsonMatch) {
  // Parse by evaluating JS object expression safely
  const fn = new Function('return ' + jsonMatch[1]);
  ENRICHED_EXAMPLES_MAP = fn();
}

// Curated British English IPA for the 55 supplemental words
const SUPPLEMENTAL_IPA_UK_MAP = {
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

// Known corrections for extraction/GPT errors
const DATA_CORRECTIONS = {
  // 'use' as verb must be /juːz/ (the raw PDF transcribed it as noun /juːs/)
  'd06-w01': {
    ipa_uk: '/juːz/',
    ipa_reviewed: true,
    correction_note: 'Đã sửa phát âm động từ use từ /ˈjuːs/ (danh từ) thành /juːz/ (động từ có âm /z/ hữu thanh).'
  },
  // 'close' as verb must be /kləʊz/ (the raw PDF transcribed it as adj /kləʊs/)
  'd67-w11': {
    ipa_uk: '/kləʊz/',
    ipa_reviewed: true,
    correction_note: 'Đã sửa phát âm động từ close (đóng) từ /ˈkləʊs/ (tính từ gần) thành /kləʊz/ (động từ có âm /z/ hữu thanh).'
  },
  // 'left' in directional terms functions as adj./n./adv.
  'd52-w08': {
    part_of_speech: 'adj./n./adv.',
    correction_note: 'Đã chuẩn hóa từ loại thành adj./n./adv. cho đối xứng với từ trái nghĩa right.'
  },
  // 'programme' in computing context (lesson 73)
  'd73-w13': {
    meaning_vi: 'chương trình (trong tin học: program / mã phần mềm)',
    correction_note: 'Ghi chú phân biệt ngữ cảnh: Trong CNTT, British English vẫn viết là program (mã phần mềm).'
  }
};

let reviewedExamplesCount = 0;
let restoredIpaCount = 0;

const updatedWords = raw.words.map((item) => {
  const correction = DATA_CORRECTIONS[item.id] || {};
  let ipa = item.ipa_uk;
  let ipaReviewed = item.ipa_reviewed;

  if (correction.ipa_uk) {
    ipa = correction.ipa_uk;
    ipaReviewed = true;
  } else if (!ipa && SUPPLEMENTAL_IPA_UK_MAP[item.word.toLowerCase()]) {
    ipa = SUPPLEMENTAL_IPA_UK_MAP[item.word.toLowerCase()];
    ipaReviewed = true;
    restoredIpaCount++;
  }

  // Enriched examples
  let examples = item.examples || [];
  let examplesStatus = item.examples_status;

  if (ENRICHED_EXAMPLES_MAP[item.id]) {
    examples = ENRICHED_EXAMPLES_MAP[item.id];
    examplesStatus = 'reviewed';
  }

  if (examplesStatus === 'reviewed' && examples.length > 0) {
    reviewedExamplesCount++;
  }

  const updatedWord = {
    ...item,
    ...correction,
    ipa_uk: ipa,
    ipa_reviewed: ipaReviewed,
    examples,
    examples_status: examplesStatus
  };

  return updatedWord;
});

const updatedData = {
  ...raw,
  schema_version: '3.1-corrected',
  title: 'English Restart - IELTS Foundation (Bản đã sửa toàn bộ lỗi sai & bổ sung IPA, ví dụ)',
  source: {
    ...raw.source,
    corrected_date: '2026-10-24',
    corrections_summary: [
      '1. Sửa lỗi dị âm (Heteronym): use (v.) thành /juːz/ và close (v.) thành /kləʊz/.',
      '2. Bổ sung đầy đủ phiên âm IPA chuẩn Anh - Anh cho 55/55 từ bổ trợ bị khuyết trong PDF.',
      '3. Nạp thêm câu ví dụ song ngữ kèm lưu ý ngữ pháp IELTS Foundation cho các bài tiếp theo.',
      '4. Chuẩn hóa tính đối xứng từ loại cho các cặp từ trái nghĩa (left / right).',
      '5. Làm rõ chính tả tin học chuẩn Anh: computer program vs TV programme.'
    ]
  },
  content_stats: {
    ...raw.content_stats,
    supplemental_words_with_ipa: 55,
    examples_reviewed_words: reviewedExamplesCount,
    examples_pending_words: raw.words.length - reviewedExamplesCount
  },
  words: updatedWords
};

fs.writeFileSync(
  'English_Restart_IELTS_Foundation_v3_corrected.json',
  JSON.stringify(updatedData, null, 2),
  'utf8'
);

console.log('Successfully wrote English_Restart_IELTS_Foundation_v3_corrected.json');
console.log('Restored IPA count:', restoredIpaCount);
console.log('Reviewed examples count:', reviewedExamplesCount);
