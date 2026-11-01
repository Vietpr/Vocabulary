import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('./English_Restart_IELTS_Foundation_v3.json', 'utf8'));

for (let d = 4; d <= 10; d++) {
  const lesson = data.lessons.find(l => l.day === d);
  const words = data.words.filter(w => w.lesson === d);
  console.log('=== Day ' + d + ': ' + lesson.title + ' (' + words.length + ' words) ===');
  words.forEach(w => {
    console.log(w.id + ' | ' + w.word + ' (' + w.part_of_speech + '): ' + w.meaning_vi + ' | IPA: ' + w.ipa_uk);
  });
}
