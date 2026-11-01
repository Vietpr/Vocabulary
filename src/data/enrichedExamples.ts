import { ExampleSentence } from '../types/vocabulary';

/**
 * Curated high-value bilingual examples with grammar notes for IELTS Foundation lessons.
 * Expands coverage from Day 4 through Day 10 and provides foundation sentences.
 */
export const ENRICHED_EXAMPLES_MAP: Record<string, ExampleSentence[]> = {
  // === DAY 4: Modals & Basic Communication ===
  'd04-w01': [ // can
    { en: 'I can speak two languages.', vi: 'Tôi có thể nói được hai thứ tiếng.', grammar_note: 'Can + V-nguyên mẫu: diễn tả khả năng.' },
    { en: 'Can you help me with this exercise, please?', vi: 'Bạn có thể giúp tôi bài tập này được không?', grammar_note: 'Can you + V: câu yêu cầu lịch sự.' }
  ],
  'd04-w02': [ // could
    { en: 'Could you open the window, please?', vi: 'Bạn có thể mở cửa sổ giúp tôi được không?', grammar_note: 'Could you + V: lời nhờ vả lịch sự hơn can.' },
    { en: 'When I was seven, I could already swim.', vi: 'Khi tôi lên bảy, tôi đã có thể bơi rồi.', grammar_note: 'Could: quá khứ của can.' }
  ],
  'd04-w03': [ // will
    { en: 'I will call you tomorrow morning.', vi: 'Tôi sẽ gọi điện cho bạn vào sáng mai.', grammar_note: 'Will + V: thì tương lai đơn diễn tả lời hứa hoặc quyết định tức thì.' },
    { en: 'The IELTS exam will take place next month.', vi: 'Kỳ thi IELTS sẽ diễn ra vào tháng tới.', grammar_note: null }
  ],
  'd04-w04': [ // would
    { en: 'Would you like a cup of tea?', vi: 'Bạn có muốn dùng một tách trà không?', grammar_note: 'Would you like + N/to V: lời mời lịch sự.' },
    { en: 'I would prefer to study in the library.', vi: 'Tôi muốn học ở thư viện hơn.', grammar_note: 'Would prefer to + V: thích làm gì hơn.' }
  ],
  'd04-w05': [ // should
    { en: 'You should drink enough water every day.', vi: 'Bạn nên uống đủ nước mỗi ngày.', grammar_note: 'Should + V: đưa ra lời khuyên.' },
    { en: 'Students should review new words regularly.', vi: 'Học sinh nên ôn lại từ mới thường xuyên.', grammar_note: null }
  ],
  'd04-w06': [ // must
    { en: 'You must arrive on time for the test.', vi: 'Bạn phải đến đúng giờ cho bài thi.', grammar_note: 'Must + V: diễn tả quy định bắt buộc.' },
    { en: 'Candidates must show their identification at the desk.', vi: 'Thí sinh phải xuất trình giấy tờ tùy thân tại bàn tiếp nhận.', grammar_note: null }
  ],
  'd04-w07': [ // may
    { en: 'May I ask a question?', vi: 'Tôi có thể hỏi một câu được không?', grammar_note: 'May I + V: xin phép trang trọng.' },
    { en: 'It may rain later this afternoon.', vi: 'Trời có thể sẽ mưa vào chiều muộn nay.', grammar_note: 'May: diễn tả khả năng có thể xảy ra trong tương lai.' }
  ],
  'd04-w08': [ // might
    { en: 'I might visit London next summer.', vi: 'Có lẽ tôi sẽ đến thăm Luân Đôn vào mùa hè tới.', grammar_note: 'Might + V: khả năng xảy ra thấp hơn may.' },
    { en: 'We might need more time to finish the essay.', vi: 'Chúng ta có lẽ cần thêm thời gian để hoàn thành bài luận.', grammar_note: null }
  ],
  'd04-w09': [ // shall
    { en: 'Shall we start the lesson now?', vi: 'Chúng ta bắt đầu bài học bây giờ nhé?', grammar_note: 'Shall we + V: lời đề nghị lịch sự cùng làm gì.' },
    { en: 'I shall return the book to you on Monday.', vi: 'Tôi sẽ gửi trả cuốn sách cho bạn vào thứ Hai.', grammar_note: null }
  ],
  'd04-w10': [ // not
    { en: 'She is not at home right now.', vi: 'Cô ấy hiện không có ở nhà.', grammar_note: 'To be + not: dạng phủ định của động từ to be.' },
    { en: 'They do not agree with the new policy.', vi: 'Họ không đồng ý với chính sách mới.', grammar_note: 'Do/Does not + V: phủ định thì hiện tại đơn.' }
  ],
  'd04-w11': [ // no
    { en: 'There are no empty seats in the room.', vi: 'Không còn chỗ trống nào trong phòng.', grammar_note: 'There are no + danh từ số nhiều.' },
    { en: 'No, I have not finished my homework yet.', vi: 'Không, tôi vẫn chưa làm xong bài tập về nhà.', grammar_note: null }
  ],
  'd04-w12': [ // yes
    { en: 'Yes, I understand the instruction clearly.', vi: 'Vâng, tôi đã hiểu rõ lời hướng dẫn.', grammar_note: null },
    { en: '“Are you ready for the exam?” — “Yes, absolutely.”', vi: '“Bạn đã sẵn sàng cho bài thi chưa?” — “Vâng, hoàn toàn sẵn sàng.”', grammar_note: null }
  ],
  'd04-w13': [ // please
    { en: 'Please turn to page twenty.', vi: 'Xin vui lòng mở sang trang hai mươi.', grammar_note: 'Please đặt ở đầu hoặc cuối câu mệnh lệnh để tăng tính lịch sự.' },
    { en: 'Could you speak a little louder, please?', vi: 'Bạn có thể nói lớn hơn một chút được không, làm ơn?', grammar_note: null }
  ],
  'd04-w14': [ // thanks
    { en: 'Thanks for your kind advice.', vi: 'Cảm ơn vì lời khuyên chân thành của bạn.', grammar_note: 'Thanks for + N / V-ing: cảm ơn vì điều gì.' },
    { en: 'Many thanks to everyone who helped me.', vi: 'Rất cảm ơn tất cả những người đã giúp đỡ tôi.', grammar_note: null }
  ],

  // === DAY 5: Polite Communication & Core Verbs ===
  'd05-w01': [ // sorry
    { en: 'I am sorry for being late today.', vi: 'Tôi xin lỗi vì đã đến muộn ngày hôm nay.', grammar_note: 'Sorry for + V-ing: xin lỗi vì hành động gì.' },
    { en: 'Sorry, could you repeat that word?', vi: 'Xin lỗi, bạn có thể nhắc lại từ đó được không?', grammar_note: null }
  ],
  'd05-w02': [ // because
    { en: 'I am learning English because I want to study in the UK.', vi: 'Tôi đang học tiếng Anh bởi vì tôi muốn đi du học Anh.', grammar_note: 'Because + mệnh đề: liên từ chỉ nguyên nhân.' },
    { en: 'She stayed at home because of the heavy rain.', vi: 'Cô ấy ở nhà vì cơn mưa lớn.', grammar_note: 'Because of + cụm danh từ.' }
  ],
  'd05-w03': [ // okay
    { en: 'Is it okay if I sit here?', vi: 'Tôi ngồi đây có được không?', grammar_note: 'Is it okay if + S + V: xin phép làm gì.' },
    { en: 'Everything is going to be okay.', vi: 'Mọi chuyện rồi sẽ ổn thỏa thôi.', grammar_note: null }
  ],
  'd05-w04': [ // welcome
    { en: 'Welcome to our English class.', vi: 'Chào mừng các bạn đến với lớp học tiếng Anh của chúng tôi.', grammar_note: 'Welcome to + địa điểm: chào mừng tới đâu.' },
    { en: '“Thank you very much!” — “You are welcome.”', vi: '“Cảm ơn bạn rất nhiều!” — “Không có gì đâu.”', grammar_note: null }
  ],
  'd05-w05': [ // go
    { en: 'I go to school by bus every weekday.', vi: 'Tôi đi học bằng xe buýt vào mỗi ngày trong tuần.', grammar_note: 'Go to + địa điểm; by bus/car/train: bằng phương tiện gì.' },
    { en: 'Let us go for a walk in the park.', vi: 'Chúng ta hãy đi dạo một lát trong công viên nhé.', grammar_note: 'Go for a walk: đi dạo bộ.' }
  ],
  'd05-w06': [ // come
    { en: 'Where do you come from?', vi: 'Bạn đến từ đâu?', grammar_note: 'Come from + quốc gia/thành phố: xuất thân từ đâu.' },
    { en: 'My friends come over to study every weekend.', vi: 'Bạn bè tôi ghé qua học bài vào mỗi cuối tuần.', grammar_note: 'Come over: ghé thăm nhà ai.' }
  ],
  'd05-w07': [ // get
    { en: 'I usually get up at six in the morning.', vi: 'Tôi thường thức dậy lúc sáu giờ sáng.', grammar_note: 'Get up: thức dậy rời khỏi giường.' },
    { en: 'She hopes to get a high score in the IELTS exam.', vi: 'Cô ấy hy vọng đạt được điểm cao trong kỳ thi IELTS.', grammar_note: 'Get + noun: nhận được, đạt được.' }
  ],
  'd05-w08': [ // make
    { en: 'Do not be afraid to make mistakes when speaking.', vi: 'Đừng sợ mắc lỗi khi nói tiếng Anh.', grammar_note: 'Make mistakes: cụm cố định (collocation), không dùng do mistakes.' },
    { en: 'Practice will make your pronunciation better.', vi: 'Luyện tập sẽ làm cho phát âm của bạn tốt hơn.', grammar_note: 'Make + O + adj: làm cho ai/cái gì trở nên thế nào.' }
  ],
  'd05-w09': [ // take
    { en: 'It takes twenty minutes to walk to the station.', vi: 'Mất hai mươi phút để đi bộ đến nhà ga.', grammar_note: 'It takes + thời gian + to V: mất bao nhiêu thời gian để làm gì.' },
    { en: 'Students should take notes during the lecture.', vi: 'Học sinh nên ghi chép bài trong suốt bài giảng.', grammar_note: 'Take notes: ghi chép bài học.' }
  ],
  'd05-w10': [ // give
    { en: 'The teacher gave us useful advice on IELTS preparation.', vi: 'Giáo viên đã cho chúng tôi những lời khuyên hữu ích về chuẩn bị thi IELTS.', grammar_note: 'Give + người + vật / Give + vật + to + người.' },
    { en: 'Never give up on your learning goals.', vi: 'Đừng bao giờ từ bỏ các mục tiêu học tập của bạn.', grammar_note: 'Give up: từ bỏ.' }
  ],
  'd05-w11': [ // receive
    { en: 'I received an offer from the university yesterday.', vi: 'Tôi đã nhận được thư mời nhập học từ trường đại học ngày hôm qua.', grammar_note: 'Receive something from someone: nhận cái gì từ ai.' },
    { en: 'Candidates will receive their test results online.', vi: 'Thí sinh sẽ nhận kết quả bài thi qua mạng trực tuyến.', grammar_note: null }
  ],
  'd05-w12': [ // put
    { en: 'Please put your mobile phone into your bag.', vi: 'Xin vui lòng cất điện thoại di động vào trong túi của bạn.', grammar_note: 'Put + O + prep: đặt để cái gì vào đâu.' },
    { en: 'He put forward an interesting idea for the project.', vi: 'Anh ấy đã đề xuất một ý tưởng thú vị cho dự án.', grammar_note: 'Put forward: đề xuất ý kiến.' }
  ],
  'd05-w13': [ // bring
    { en: 'Remember to bring your passport on exam day.', vi: 'Hãy nhớ mang theo hộ chiếu của bạn vào ngày thi.', grammar_note: 'Remember to + V: nhớ phải làm việc gì.' },
    { en: 'Studying abroad brings many great opportunities.', vi: 'Đi du học mang lại nhiều cơ hội tuyệt vời.', grammar_note: null }
  ],
  'd05-w14': [ // send
    { en: 'I sent an email to the admissions office.', vi: 'Tôi đã gửi một bức thư điện tử tới văn phòng tuyển sinh.', grammar_note: 'Send + O + to: gửi cái gì cho ai.' },
    { en: 'They will send the confirmation letter soon.', vi: 'Họ sẽ gửi thư xác nhận sớm thôi.', grammar_note: null }
  ],

  // === DAY 6: Action & Cognitive Verbs ===
  'd06-w01': [ // use (v.) -> /juːz/
    { en: 'You should use a good English dictionary.', vi: 'Bạn nên sử dụng một cuốn từ điển tiếng Anh tốt.', grammar_note: 'Use as verb is pronounced /juːz/ with a voiced z sound.' },
    { en: 'We use technology to practise pronunciation every day.', vi: 'Chúng tôi sử dụng công nghệ để luyện phát âm mỗi ngày.', grammar_note: 'Use something to + V: dùng cái gì để làm gì.' }
  ],
  'd06-w02': [ // want
    { en: 'I want to improve my speaking score.', vi: 'Tôi muốn cải thiện điểm số phần nói của mình.', grammar_note: 'Want to + V-nguyên mẫu: muốn làm gì.' },
    { en: 'Do you want any further information?', vi: 'Bạn có muốn biết thêm thông tin nào nữa không?', grammar_note: 'Want + N: muốn có điều gì.' }
  ],
  'd06-w03': [ // need
    { en: 'You need to practise English consistently.', vi: 'Bạn cần phải luyện tập tiếng Anh đều đặn.', grammar_note: 'Need to + V: cần phải làm gì.' },
    { en: 'We need more practice with listening tasks.', vi: 'Chúng ta cần luyện tập nhiều hơn với các bài nghe.', grammar_note: null }
  ],
  'd06-w04': [ // like
    { en: 'I like reading English books in my free time.', vi: 'Tôi thích đọc sách tiếng Anh vào thời gian rảnh rỗi.', grammar_note: 'Like + V-ing / Like to + V: thích làm điều gì.' },
    { en: 'She likes British accents because they sound clear.', vi: 'Cô ấy thích chất giọng Anh vì nghe rất rõ ràng.', grammar_note: null }
  ],
  'd06-w05': [ // know
    { en: 'Do you know the meaning of this word?', vi: 'Bạn có biết ý nghĩa của từ này không?', grammar_note: 'Know + N: biết điều gì.' },
    { en: 'I know how to pronounce this phonetic symbol.', vi: 'Tôi biết cách phát âm ký hiệu phiên âm này.', grammar_note: 'Know how to + V: biết cách làm gì.' }
  ],
  'd06-w06': [ // think
    { en: 'I think regular revision is the key to IELTS success.', vi: 'Tôi nghĩ rằng việc ôn tập đều đặn là chìa khóa để thành công trong IELTS.', grammar_note: 'Think + mệnh đề that: nêu quan điểm.' },
    { en: 'Take a minute to think about your answer.', vi: 'Hãy dành một phút để suy nghĩ về câu trả lời của bạn.', grammar_note: 'Think about: suy nghĩ, cân nhắc về điều gì.' }
  ],
  'd06-w07': [ // walk
    { en: 'I walk to the library every morning.', vi: 'Tôi đi bộ đến thư viện mỗi buổi sáng.', grammar_note: 'Walk to + địa điểm.' },
    { en: 'Walking thirty minutes daily is good for your health.', vi: 'Đi bộ ba mươi phút mỗi ngày rất tốt cho sức khỏe của bạn.', grammar_note: 'Danh động từ Walking làm chủ ngữ số ít.' }
  ],
  'd06-w08': [ // run
    { en: 'He runs five kilometres every weekend.', vi: 'Anh ấy chạy năm cây số vào mỗi cuối tuần.', grammar_note: null },
    { en: 'Time is running out, so please finish your task.', vi: 'Thời gian sắp hết rồi, vì vậy xin vui lòng hoàn thành nhiệm vụ của bạn.', grammar_note: 'Run out: cạn kiệt, hết dần.' }
  ],
  'd06-w09': [ // sit
    { en: 'Please sit down and make yourself comfortable.', vi: 'Xin mời ngồi xuống và cứ tự nhiên như ở nhà.', grammar_note: 'Sit down: ngồi xuống.' },
    { en: 'She usually sits in the front row of the classroom.', vi: 'Cô ấy thường ngồi ở hàng ghế đầu tiên trong lớp học.', grammar_note: null }
  ],
  'd06-w10': [ // stand
    { en: 'Candidates must stand behind the yellow line.', vi: 'Thí sinh phải đứng sau vạch màu vàng.', grammar_note: 'Stand + giới từ vị trí.' },
    { en: 'The letters IELTS stand for International English Language Testing System.', vi: 'Các chữ cái IELTS là viết tắt của International English Language Testing System.', grammar_note: 'Stand for: viết tắt của cái gì.' }
  ],
  'd06-w11': [ // stop
    { en: 'Please stop making noise in the quiet study area.', vi: 'Xin vui lòng ngừng làm ồn trong khu vực tự học yên tĩnh.', grammar_note: 'Stop + V-ing: dừng hẳn hành động đang làm.' },
    { en: 'He stopped to look up the new word in the dictionary.', vi: 'Anh ấy đã dừng lại để tra từ mới trong từ điển.', grammar_note: 'Stop + to V: dừng việc này lại để làm việc khác.' }
  ],
  'd06-w12': [ // start
    { en: 'We will start the review session at eight o’clock.', vi: 'Chúng ta sẽ bắt đầu buổi ôn tập vào lúc tám giờ.', grammar_note: 'Start + N / Start to V / Start V-ing.' },
    { en: 'Starting early gives you a great advantage in IELTS.', vi: 'Bắt đầu sớm mang lại cho bạn một lợi thế lớn trong kỳ thi IELTS.', grammar_note: null }
  ],
  'd06-w13': [ // leave
    { en: 'The train leaves at seven thirty.', vi: 'Chuyến tàu khởi hành lúc bảy giờ ba mươi.', grammar_note: 'Hiện tại đơn dùng cho lịch trình tàu xe cố định.' },
    { en: 'Do not leave your personal belongings unattended.', vi: 'Đừng để quên đồ dùng cá nhân mà không có người trông coi.', grammar_note: null }
  ],
  'd06-w14': [ // arrive
    { en: 'We arrived at the test centre on time.', vi: 'Chúng tôi đã đến trung tâm khảo thí đúng giờ.', grammar_note: 'Arrive at + địa điểm cụ thể (school, airport); Arrive in + thành phố/quốc gia.' },
    { en: 'The flight arrived late due to fog in London.', vi: 'Chuyến bay đã hạ cánh muộn do sương mù ở Luân Đôn.', grammar_note: null }
  ],

  // === DAY 7: Movement & Talking ===
  'd07-w01': [ // enter
    { en: 'Knock before you enter the examination room.', vi: 'Hãy gõ cửa trước khi bạn bước vào phòng thi.', grammar_note: 'Enter không đi với "into" khi nói về bước vào một căn phòng/nơi chốn.' },
    { en: 'Only authorized staff may enter this building.', vi: 'Chỉ nhân viên được ủy quyền mới có thể vào tòa nhà này.', grammar_note: null }
  ],
  'd07-w02': [ // exit
    { en: 'Please exit through the main door.', vi: 'Xin vui lòng đi ra bằng cửa chính.', grammar_note: 'Exit: đi ra khỏi.' },
    { en: 'In case of fire, use the emergency exit immediately.', vi: 'Trong trường hợp hỏa hoạn, hãy sử dụng lối thoát hiểm ngay lập tức.', grammar_note: 'Exit vừa là danh từ lối thoát, vừa là động từ đi ra.' }
  ],
  'd07-w03': [ // move
    { en: 'We decided to move to a quieter apartment.', vi: 'Chúng tôi quyết định chuyển đến một căn hộ yên tĩnh hơn.', grammar_note: 'Move to + địa điểm: chuyển đến đâu.' },
    { en: 'Move on to the next question if you are unsure.', vi: 'Hãy chuyển sang câu hỏi tiếp theo nếu bạn không chắc chắn.', grammar_note: 'Move on to: chuyển tiếp sang phần mới.' }
  ],
  'd07-w04': [ // turn
    { en: 'Turn left at the traffic lights.', vi: 'Hãy rẽ trái tại cột đèn giao thông.', grammar_note: 'Turn left/right: rẽ trái/phải.' },
    { en: 'Turn off your mobile phone before entering the hall.', vi: 'Hãy tắt điện thoại di động trước khi vào hội trường.', grammar_note: 'Turn off: tắt thiết bị.' }
  ],
  'd07-w05': [ // follow
    { en: 'Please follow the examiner’s instructions carefully.', vi: 'Xin vui lòng làm theo hướng dẫn của giám khảo một cách cẩn thận.', grammar_note: 'Follow instructions: tuân theo chỉ dẫn.' },
    { en: 'Follow this corridor and the room is on your right.', vi: 'Đi theo hành lang này và căn phòng sẽ nằm bên tay phải của bạn.', grammar_note: null }
  ],
  'd07-w06': [ // return
    { en: 'I must return these books to the library today.', vi: 'Tôi phải trả những cuốn sách này cho thư viện ngày hôm nay.', grammar_note: 'Return something to somewhere: hoàn trả cái gì.' },
    { en: 'She returned home after living in the UK for three years.', vi: 'Cô ấy đã trở về nhà sau ba năm sinh sống tại Vương quốc Anh.', grammar_note: 'Return home: về nhà (không dùng return to home).' }
  ],
  'd07-w07': [ // drive
    { en: 'He drives to work every morning.', vi: 'Anh ấy lái xe đi làm mỗi buổi sáng.', grammar_note: 'Drive to + địa điểm.' },
    { en: 'It takes an hour to drive from Oxford to London.', vi: 'Mất một tiếng để lái xe từ Oxford đến Luân Đôn.', grammar_note: null }
  ],
  'd07-w08': [ // fast
    { en: 'Do not speak too fast in the IELTS Speaking test.', vi: 'Đừng nói quá nhanh trong bài thi Nói IELTS.', grammar_note: 'Fast vừa là tính từ vừa là trạng từ (không có fastly).' },
    { en: 'He is a fast learner with great dedication.', vi: 'Anh ấy là một người học tiếp thu nhanh và rất chăm chỉ.', grammar_note: 'Fast đóng vai trò tính từ bổ nghĩa cho learner.' }
  ],
  'd07-w09': [ // slow
    { en: 'The internet connection here is very slow.', vi: 'Kết nối mạng internet ở đây rất chậm.', grammar_note: 'Slow là tính từ; trạng từ là slowly.' },
    { en: 'Take slow and deep breaths to calm your nerves before the test.', vi: 'Hãy hít thở chậm và sâu để giữ bình tĩnh trước giờ thi.', grammar_note: null }
  ],
  'd07-w10': [ // say
    { en: 'What did the examiner say to you?', vi: 'Giám khảo đã nói điều gì với bạn thế?', grammar_note: 'Say + words / say that: nói ra điều gì (khác với tell + người).' },
    { en: 'It is easy to say, but difficult to do.', vi: 'Nói thì dễ, nhưng làm mới khó.', grammar_note: null }
  ],
  'd07-w11': [ // talk
    { en: 'We talked about our future study plans.', vi: 'Chúng tôi đã trò chuyện về các kế hoạch học tập tương lai.', grammar_note: 'Talk about + chủ đề / Talk to + người.' },
    { en: 'Can I talk to you for a moment?', vi: 'Tôi có thể nói chuyện với bạn một lát được không?', grammar_note: null }
  ],
  'd07-w12': [ // speak
    { en: 'She speaks English with clear British pronunciation.', vi: 'Cô ấy nói tiếng Anh với phát âm Anh - Anh rất rõ ràng.', grammar_note: 'Speak + ngôn ngữ (Speak English, French).' },
    { en: 'Please speak slowly so everyone can follow.', vi: 'Xin vui lòng nói chậm lại để mọi người đều có thể theo dõi.', grammar_note: null }
  ],
  'd07-w13': [ // ask
    { en: 'Feel free to ask questions if you do not understand.', vi: 'Cứ thoải mái đặt câu hỏi nếu bạn không hiểu.', grammar_note: 'Ask questions: đặt câu hỏi.' },
    { en: 'She asked the teacher for advice on reading skills.', vi: 'Cô ấy đã xin giáo viên lời khuyên về kỹ năng đọc hiểu.', grammar_note: 'Ask someone for something: xin ai cái gì.' }
  ],
  'd07-w14': [ // answer
    { en: 'Try to answer all questions before time runs out.', vi: 'Hãy cố gắng trả lời tất cả các câu hỏi trước khi hết giờ.', grammar_note: 'Answer as verb takes direct object: answer the question (không dùng answer to the question).' },
    { en: 'His answer was accurate and concise.', vi: 'Câu trả lời của anh ấy rất chính xác và súc tích.', grammar_note: 'Answer ở đây là danh từ.' }
  ]
};
