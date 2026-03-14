const fs = require('fs');
const path = require('path');
const readline = require('readline');

const BOOK_MAP = {
  'Genesis':       { en: 'Genesis',       de: '1. Mose',        zh: '创世记',       ja: '創世記', ko: '창세기' },
  'Exodus':        { en: 'Exodus',        de: '2. Mose',        zh: '出埃及记',      ja: '出エジプト記', ko: '출애굽기' },
  'Leviticus':     { en: 'Leviticus',     de: '3. Mose',        zh: '利未记',       ja: 'レビ記', ko: '레위기' },
  'Numbers':       { en: 'Numbers',       de: '4. Mose',        zh: '民数记',       ja: '民数記', ko: '민수기' },
  'Deuteronomy':   { en: 'Deuteronomy',   de: '5. Mose',        zh: '申命记',       ja: '申命記', ko: '신명기' },
  'Joshua':        { en: 'Joshua',        de: 'Josua',          zh: '约书亚记',      ja: 'ヨシュア記', ko: '여호수아' },
  'Judges':        { en: 'Judges',        de: 'Richter',        zh: '士师记',       ja: '士師記', ko: '사사기' },
  'Ruth':          { en: 'Ruth',          de: 'Ruth',           zh: '路得记',       ja: 'ルツ記', ko: '룻기' },
  '1 Samuel':      { en: '1 Samuel',      de: '1. Samuel',      zh: '撒母耳记上',    ja: 'サムエル記上', ko: '사무엘상' },
  '2 Samuel':      { en: '2 Samuel',      de: '2. Samuel',      zh: '撒母耳记下',    ja: 'サムエル記下', ko: '사무엘하' },
  '1 Kings':       { en: '1 Kings',       de: '1. Könige',      zh: '列王纪上',      ja: '王記上', ko: '열왕기상' },
  '2 Kings':       { en: '2 Kings',       de: '2. Könige',      zh: '列王纪下',      ja: '王記下', ko: '열왕기하' },
  '1 Chronicles':  { en: '1 Chronicles',  de: '1. Chronik',     zh: '历代志上',      ja: '歴代志上', ko: '역대상' },
  '2 Chronicles':  { en: '2 Chronicles',  de: '2. Chronik',     zh: '历代志下',      ja: '歴代志下', ko: '역대하' },
  'Ezra':          { en: 'Ezra',          de: 'Esra',           zh: '以斯拉记',      ja: 'エズラ記', ko: '에스라' },
  'Nehemiah':      { en: 'Nehemiah',      de: 'Nehemia',        zh: '尼希米记',      ja: 'ネヘミヤ記', ko: '느헤미야' },
  'Esther':        { en: 'Esther',        de: 'Esther',         zh: '以斯帖记',      ja: 'エステル記', ko: '에스더' },
  'Job':           { en: 'Job',           de: 'Hiob',           zh: '约伯记',       ja: 'ヨブ記', ko: '욥기' },
  'Psalms':        { en: 'Psalms',        de: 'Psalmen',        zh: '诗篇',         ja: '詩篇', ko: '시편' },
  'Proverbs':      { en: 'Proverbs',      de: 'Sprüche',        zh: '箴言',         ja: '箴言', ko: '잠언' },
  'Ecclesiastes':  { en: 'Ecclesiastes',  de: 'Prediger',       zh: '传道书',       ja: '伝道者の書', ko: '전도서' },
  'Song of Songs': { en: 'Song of Songs', de: 'Hohelied',       zh: '雅歌',         ja: '雅歌', ko: '아가' },
  'Isaiah':        { en: 'Isaiah',        de: 'Jesaja',         zh: '以赛亚书',      ja: 'イザヤ書', ko: '이사야' },
  'Jeremiah':      { en: 'Jeremiah',      de: 'Jeremia',        zh: '耶利米书',      ja: 'エレミヤ書', ko: '예레미야' },
  'Lamentations':  { en: 'Lamentations',  de: 'Klagelieder',    zh: '耶利米哀歌',    ja: 'エレミヤの哀歌', ko: '예레미야애가' },
  'Ezekiel':       { en: 'Ezekiel',       de: 'Hesekiel',       zh: '以西结书',      ja: 'エゼキエル書', ko: '에스겔' },
  'Daniel':        { en: 'Daniel',        de: 'Daniel',         zh: '但以理书',      ja: 'ダニエル書', ko: '다니엘' },
  'Hosea':         { en: 'Hosea',         de: 'Hosea',          zh: '何西阿书',      ja: 'ホセア書', ko: '호세아' },
  'Joel':          { en: 'Joel',          de: 'Joel',           zh: '约珥书',       ja: 'ヨエル書', ko: '요엘' },
  'Amos':          { en: 'Amos',          de: 'Amos',           zh: '阿摩司书',      ja: 'アモス書', ko: '아모스' },
  'Obadiah':       { en: 'Obadiah',       de: 'Der Prophet Obadja', zh: '俄巴底亚书', ja: 'オバデヤ書', ko: '오바댜' },
  'Jonah':         { en: 'Jonah',         de: 'Jona',           zh: '约拿书',       ja: 'ヨナ書', ko: '요나' },
  'Micah':         { en: 'Micah',         de: 'Micha',          zh: '弥迦书',       ja: 'ミカ書', ko: '미가' },
  'Nahum':         { en: 'Nahum',         de: 'Nahum',          zh: '那鸿书',       ja: 'ナホム書', ko: '나훔' },
  'Habakkuk':      { en: 'Habakkuk',      de: 'Habakuk',        zh: '哈巴谷书',      ja: 'ハバクク書', ko: '하박국' },
  'Zephaniah':     { en: 'Zephaniah',     de: 'Zephanja',       zh: '西番雅书',      ja: 'ゼパニヤ書', ko: '스바냐' },
  'Haggai':        { en: 'Haggai',        de: 'Haggai',         zh: '哈该书',       ja: 'ハガイ書', ko: '학개' },
  'Zechariah':     { en: 'Zechariah',     de: 'Sacharja',       zh: '撒迦利亚书',    ja: 'ゼカリヤ書', ko: '스가랴' },
  'Malachi':       { en: 'Malachi',       de: 'Maleachi',       zh: '玛拉基书',      ja: 'マラキ書', ko: '말라기' },

  'Matthew':          { en: 'Matthew',       de: 'Matthäus',                             zh: '马太福音',     ja: 'マタイの福音書', ko: '마태복음' },
  'Mark':             { en: 'Mark',          de: 'Markus',                               zh: '马可福音',     ja: 'マルコの福音書', ko: '마가복음' },
  'Luke':             { en: 'Luke',          de: 'Lukas',                                zh: '路加福音',     ja: 'ルカの福音書', ko: '누가복음' },
  'John':             { en: 'John',          de: 'Johannes',                             zh: '约翰福音',     ja: 'ヨハネの福音書', ko: '요한복음' },
  'Acts':             { en: 'Acts',          de: 'Apostelgeschichte',                    zh: '使徒行传',     ja: '使徒の働き', ko: '사도행전' },
  'Romans':           { en: 'Romans',        de: 'Römer',                                zh: '罗马书',       ja: 'ローマ人への手紙', ko: '로마서' },
  '1 Corinthians':    { en: '1 Corinthians', de: '1. Korinther',                         zh: '哥林多前书',   ja: 'コリント人への手紙第一', ko: '고린도전서' },
  '2 Corinthians':    { en: '2 Corinthians', de: '2. Korinther',                         zh: '哥林多后书',   ja: 'コリント人への手紙第二', ko: '고린도후서' },
  'Galatians':        { en: 'Galatians',     de: 'Galater',                              zh: '加拉太书',     ja: 'ガラテヤ人への手紙', ko: '갈라디아서' },
  'Ephesians':        { en: 'Ephesians',     de: 'Epheser',                              zh: '以弗所书',     ja: 'エペソ人への手紙', ko: '에베소서' },
  'Philippians':      { en: 'Philippians',   de: 'Philipper',                            zh: '腓立比书',     ja: 'ピリピ人への手紙', ko: '빌립보서' },
  'Colossians':       { en: 'Colossians',    de: 'Kolosser',                             zh: '歌罗西书',     ja: 'コロサイ人への手紙', ko: '골로새서' },
  '1 Thessalonians':  { en: '1 Thessalonians', de: '1. Thessalonicher',                 zh: '帖撒罗尼迦前书', ja: 'テサロニケ人への手紙第一', ko: '데살로니가전서' },
  '2 Thessalonians':  { en: '2 Thessalonians', de: '2. Thessalonicher',                 zh: '帖撒罗尼迦后书', ja: 'テサロニケ人への手紙第二', ko: '데살로니가후서' },
  '1 Timothy':        { en: '1 Timothy',     de: '1. Timotheus',                         zh: '提摩太前书',   ja: 'テモテへの手紙第一', ko: '디모데전서' },
  '2 Timothy':        { en: '2 Timothy',     de: '2. Timotheus',                         zh: '提摩太后书',   ja: 'テモテへの手紙第二', ko: '디모데후서' },
  'Titus':            { en: 'Titus',         de: 'Titus',                                zh: '提多书',       ja: 'テトスへの手紙', ko: '디도서' },
  'Philemon':         { en: 'Philemon',      de: 'Der Brief des Apostels Paulus an Philemon', zh: '腓利门书', ja: 'ピレモンへの手紙', ko: '빌레몬서' },
  'Hebrews':          { en: 'Hebrews',       de: 'Hebräer',                              zh: '希伯来书',     ja: 'ヘブル人への手紙', ko: '히브리서' },
  'James':            { en: 'James',         de: 'Jakobus',                              zh: '雅各书',       ja: 'ヤコブの手紙', ko: '야고보서' },
  '1 Peter':          { en: '1 Peter',       de: '1. Petrus',                            zh: '彼得前书',     ja: 'ペテロの手紙第一', ko: '베드로전서' },
  '2 Peter':          { en: '2 Peter',       de: '2. Petrus',                            zh: '彼得后书',     ja: 'ペテロの手紙第二', ko: '베드로후서' },
  '1 John':           { en: '1 John',        de: '1. Johannes',                          zh: '约翰一书',     ja: 'ヨハネの手紙第一', ko: '요한일서' },
  '2 John':           { en: '2 John',        de: 'Der zweite Brief des Johannes',        zh: '约翰二书',     ja: 'ヨハネの手紙第二', ko: '요한이서' },
  '3 John':           { en: '3 John',        de: 'Der dritte Brief des Johannes',        zh: '约翰三书',     ja: 'ヨハネの手紙第三', ko: '요한삼서' },
  'Jude':             { en: 'Jude',          de: 'Der Brief des Judas',                  zh: '犹大书',       ja: 'ユダの手紙', ko: '유다서' },
  'Revelation':       { en: 'Revelation',    de: 'Offenbarung',                          zh: '启示录',       ja: 'ヨハネの黙示録', ko: '요한계시록' },
};

const OT_BOOKS = new Set([
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
  '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra',
  'Nehemiah','Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Songs',
  'Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos',
  'Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'
]);

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const OUT_DIR = path.join(ROOT, 'public', 'data-json');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sanitizeFileName(name) {
  return name.replace(/[\/\\?%*:|"<>]/g, '_');
}

function readVerses(filepath, bookName, chapter) {
  return new Promise((resolve) => {
    if (!fs.existsSync(filepath)) return resolve({});
    const result = {};
    const rl = readline.createInterface({
      input: fs.createReadStream(filepath),
      crlfDelay: Infinity
    });

    const chapterPrefix = `${chapter}:`;

    rl.on('line', (line) => {
      const parts = line.split('\t');
      if (parts.length < 3) return;

      const [book, ref, verse] = parts;
      if (book === bookName && ref.startsWith(chapterPrefix)) {
        const verseNum = parseInt(ref.split(':')[1], 10);
        if (!isNaN(verseNum)) result[verseNum] = verse.trim();
      }
    });

    rl.on('close', () => resolve(result));
  });
}

function getChapters(filepath, bookName) {
  return new Promise((resolve) => {
    if (!fs.existsSync(filepath)) return resolve([]);
    const chapters = new Set();

    const rl = readline.createInterface({
      input: fs.createReadStream(filepath),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      const parts = line.split('\t');
      if (parts.length < 2) return;

      if (parts[0] === bookName) {
        const ch = parseInt(parts[1].split(':')[0], 10);
        if (!isNaN(ch)) chapters.add(ch);
      }
    });

    rl.on('close', () => resolve([...chapters].sort((a, b) => a - b)));
  });
}

async function main() {
  ensureDir(OUT_DIR);
  ensureDir(path.join(OUT_DIR, 'chapters'));
  ensureDir(path.join(OUT_DIR, 'verses'));

  const books = Object.keys(BOOK_MAP).map((enName) => ({
    id: enName,
    en: enName,
    de: BOOK_MAP[enName].de,
    zh: BOOK_MAP[enName].zh,
    ja: BOOK_MAP[enName].ja,
    ko: BOOK_MAP[enName].ko,
    testament: OT_BOOKS.has(enName) ? 'OT' : 'NT'
  }));

  fs.writeFileSync(
    path.join(OUT_DIR, 'books.json'),
    JSON.stringify(books, null, 2),
    'utf8'
  );

  for (const bookId of Object.keys(BOOK_MAP)) {
    const mapping = BOOK_MAP[bookId];
    const isOT = OT_BOOKS.has(bookId);
    const suffix = isOT ? 'OT' : 'NT';

    const enPath = path.join(DATA_DIR, `${suffix}_EN_formatted.txt`);
    const dePath = path.join(DATA_DIR, `${suffix}_GM_formatted.txt`);
    const zhPath = path.join(DATA_DIR, `${suffix}_CH_formatted.txt`);
    const jaPath = path.join(DATA_DIR, `${suffix}_JP_formatted.txt`);
    const koPath = path.join(DATA_DIR, isOT ? 'ko_ot.txt' : 'ko_nt.txt');

    const chapters = await getChapters(enPath, mapping.en);

    fs.writeFileSync(
      path.join(OUT_DIR, 'chapters', `${sanitizeFileName(bookId)}.json`),
      JSON.stringify(chapters, null, 2),
      'utf8'
    );

    const bookVerseDir = path.join(OUT_DIR, 'verses', sanitizeFileName(bookId));
    ensureDir(bookVerseDir);

    for (const ch of chapters) {
      const [enVerses, deVerses, zhVerses, jaVerses, koVerses] = await Promise.all([
        readVerses(enPath, mapping.en, ch),
        readVerses(dePath, mapping.de, ch),
        readVerses(zhPath, mapping.zh, ch),
        readVerses(jaPath, mapping.ja, ch),
        readVerses(koPath, mapping.ko, ch)
      ]);

      const allNums = new Set([
        ...Object.keys(enVerses),
        ...Object.keys(deVerses),
        ...Object.keys(zhVerses),
        ...Object.keys(jaVerses),
        ...Object.keys(koVerses)
      ].map(Number));

      const verses = [...allNums].sort((a, b) => a - b).map((num) => ({
        number: num,
        en: enVerses[num] || '',
        de: deVerses[num] || '',
        zh: zhVerses[num] || '',
        ja: jaVerses[num] || '',
        ko: koVerses[num] || ''
      }));

      const payload = {
        book: bookId,
        chapter: ch,
        verses
      };

      fs.writeFileSync(
        path.join(bookVerseDir, `${ch}.json`),
        JSON.stringify(payload, null, 2),
        'utf8'
      );
    }

    console.log(`[OK] ${bookId} done`);
  }

  console.log('[DONE] JSON generation complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});