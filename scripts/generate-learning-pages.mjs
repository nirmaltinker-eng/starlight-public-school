import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets', 'notes-data.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'assets', 'gk-data.js'), 'utf8'), context);
const data = context.window.NOTES_DATA;

const repeatLevel = (_className, rows) => rows;
const extraSubjects = (className) => ({
  'English Grammar': repeatLevel(className, [
    ['Parts of Speech', 'Noun, pronoun, adjective, verb, adverb, preposition, conjunction and interjection.'],
    ['Tenses', 'Present, past and future forms with affirmative, negative and question sentences.'],
    ['Articles and Determiners', 'Correct use of a, an, the and common determiners.'],
    ['Subject–Verb Agreement', 'Matching the verb with singular and plural subjects.'],
    ['Voice', 'Recognising and changing active and passive voice.'],
    ['Direct and Indirect Speech', 'Reporting statements, questions and commands correctly.'],
    ['Vocabulary', 'Synonyms, antonyms, prefixes, suffixes and words in context.'],
    ['Editing and Sentence Transformation', 'Correcting errors and changing sentence forms without changing meaning.']
  ]),
  'English Speaking': [
    ['Daily Routine Words', 'Useful everyday English words with Hindi meaning and bilingual audio practice.'],
    ['Common Daily Sentences', 'Frequently used English sentences with Hindi meaning and bilingual audio practice.'],
    ['Conversation Practice', 'School, home and market conversations with English and Hindi audio.']
  ],
  'Hindi Grammar': repeatLevel(className, [
    ['वर्ण, शब्द और वाक्य', 'वर्ण-विचार, शब्द-रचना और शुद्ध वाक्य का अभ्यास।'],
    ['संज्ञा, सर्वनाम और विशेषण', 'भेद, रूप और वाक्य में सही प्रयोग।'],
    ['क्रिया और काल', 'क्रिया के भेद तथा वर्तमान, भूत और भविष्य काल।'],
    ['लिंग, वचन और कारक', 'शब्द-रूप बदलना और कारक-चिह्नों का प्रयोग।'],
    ['संधि और समास', 'शब्दों के मेल, विग्रह और प्रमुख भेद।'],
    ['उपसर्ग और प्रत्यय', 'मूल शब्द से नए शब्द बनाने के नियम।'],
    ['पर्याय, विलोम और मुहावरे', 'शब्द-भंडार तथा प्रसंगानुसार प्रयोग।'],
    ['वाक्य-शुद्धि और विराम-चिह्न', 'अशुद्धियाँ पहचानना, सुधारना और सही विराम लगाना।']
  ]),
  Sanskrit: repeatLevel(className, [
    ['संस्कृत वर्णमाला', 'स्वर, व्यंजन, संयुक्ताक्षर और शुद्ध उच्चारण।'],
    ['सरल संस्कृत वाक्य', 'कर्ता, कर्म और क्रिया के साथ छोटे वाक्य बनाना।'],
    ['शब्दावली', 'विद्यालय, परिवार, प्रकृति, समय और दैनिक जीवन के शब्द।'],
    ['पाठ-बोध', 'सरल गद्य-पद्य का अर्थ, भाव और प्रश्नोत्तर।'],
    ['संस्कृत संवाद', 'अभिवादन, परिचय और दैनिक बातचीत।'],
    ['सुभाषित और नैतिक संदेश', 'सरल श्लोक, अर्थ और जीवन-मूल्य।']
  ]),
  'Sanskrit Grammar': repeatLevel(className, [
    ['शब्द-रूप', 'प्रमुख अकारान्त, आकारान्त और सर्वनाम शब्दों के रूप।'],
    ['धातु-रूप', 'लट्, लङ् और लृट् लकार के सरल रूप।'],
    ['कारक और विभक्ति', 'आठ विभक्तियाँ और वाक्य में उनका प्रयोग।'],
    ['सन्धि', 'स्वर, व्यंजन और विसर्ग सन्धि का परिचय।'],
    ['समास', 'अव्ययीभाव, तत्पुरुष, द्वन्द्व और बहुव्रीहि का परिचय।'],
    ['अनुवाद', 'हिन्दी से संस्कृत और संस्कृत से हिन्दी के सरल वाक्य।']
  ]),
  Computer: repeatLevel(className, [
    ['Computer Fundamentals', 'Hardware, software, input, output, storage and the working cycle.'],
    ['Operating System', 'Desktop, files, folders, settings and safe file management.'],
    ['Word Processing', 'Creating, formatting and reviewing school documents.'],
    ['Spreadsheets', 'Cells, tables, formulas, charts and data organisation.'],
    ['Presentations', 'Slides, layouts, media and effective presentation rules.'],
    ['Internet and Email', 'Browsers, search, email etiquette and reliable information.'],
    ['Coding Basics', 'Algorithms, flowcharts, sequence, conditions and loops.'],
    ['Cyber Safety and AI', 'Passwords, privacy, digital citizenship and responsible AI use.']
  ]),
  'General Knowledge': data[String(className)].subjects['General Knowledge'],
  'Moral Science': repeatLevel(className, [
    ['Honesty', 'Speaking the truth, keeping promises and accepting mistakes.'],
    ['Respect and Empathy', 'Understanding feelings and treating every person with dignity.'],
    ['Discipline and Responsibility', 'Managing time, following rules and completing duties.'],
    ['Kindness and Cooperation', 'Helping others, sharing and working as a team.'],
    ['Courage and Confidence', 'Doing the right thing and learning from failure.'],
    ['Health and Cleanliness', 'Personal hygiene, healthy habits and a clean environment.'],
    ['Digital Citizenship', 'Polite, safe and responsible behaviour online.'],
    ['Service to Society', 'Caring for public property, nature and the community.']
  ]),
  Drawing: repeatLevel(className, [
    ['Lines and Shapes', 'Using line quality and basic shapes to build drawings.'],
    ['Light, Shade and Texture', 'Showing form with value, hatching and surface patterns.'],
    ['Colour Theory', 'Primary, secondary, warm, cool and complementary colours.'],
    ['Still Life', 'Observation, proportion and arrangement of everyday objects.'],
    ['Nature Drawing', 'Leaves, flowers, trees, birds and landscape composition.'],
    ['Human and Cartoon Figures', 'Simple body proportion, gesture and expression.'],
    ['Poster Design', 'Combining a clear message, lettering, symbols and colour.'],
    ['Indian and Rajasthan Art', 'Folk motifs, mandana, miniature art and decorative patterns.']
  ]),
  'Art & Craft': repeatLevel(className, [
    ['Paper Craft', 'Folding, cutting and joining paper safely.'],
    ['Best out of Waste', 'Reusing clean household material for useful models.'],
    ['Clay Modelling', 'Pinch, coil and slab methods for simple forms.'],
    ['Collage and Mosaic', 'Creating pictures from arranged paper, fabric or natural material.'],
    ['Thread and Fabric Craft', 'Simple weaving, printing and decorative patterns.'],
    ['Festival Craft', 'Responsible handmade decoration for school celebrations.'],
    ['Rajasthan Folk Craft', 'Puppets, mandana patterns and local decorative traditions.'],
    ['Display and Portfolio', 'Finishing, labelling, preserving and presenting artwork.']
  ])
});

for (const className of Object.keys(data)) Object.assign(data[className].subjects, extraSubjects(className));

const subjectOrder = ['Science','Social Science','English','English Grammar','English Speaking','Hindi','Hindi Grammar','Sanskrit','Sanskrit Grammar','Mathematics','Computer','General Knowledge','Moral Science','Drawing','Art & Craft'];
const slug = (value) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const esc = (value) => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const urlPath = (value) => value.split(path.sep).join('/');
const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const write = (file, content) => { ensure(path.dirname(file)); fs.writeFileSync(file, content, 'utf8'); };
const relRoot = (file) => { const r = urlPath(path.relative(path.dirname(file), root)); return r ? `${r}/` : ''; };
const relHref = (fromFile, toFile) => urlPath(path.relative(path.dirname(fromFile), toFile));
const classIndexFile = (className) => className === '6' ? path.join(root, 'notes-class6.html') : path.join(root, 'notes', `class ${className}`, `notes-class${className}.html`);

const nav = (prefix, current = '') => `<nav class="lesson-nav"><a href="${prefix}index.html">Home</a><a href="${prefix}notes.html"${current==='notes'?' aria-current="page"':''}>Notes</a><a class="test-nav" href="${prefix}tests.html"${current==='tests'?' aria-current="page"':''}>Test</a><a href="${prefix}gallery.html">Gallery</a><a class="login-nav" href="${prefix}login.html">Login</a><button class="theme-toggle" type="button">☀ Light</button></nav>`;
const brand = (prefix) => `<header class="lesson-header"><a class="brand" href="${prefix}index.html"><img src="${prefix}school-logo.png" alt="Starlight Public School logo"><span><strong>Starlight Public School</strong><small>A place where dreams take flight.</small></span></a></header>`;
const footer = (prefix) => `<footer class="site-footer"><p>&copy; 2026 Starlight Public School. Website by Nirmal Tinker. · <a href="${prefix}notes.html">Notes</a></p></footer>`;

const conceptsFrom = (summary) => summary.replace(/\.$/, '').split(/,|;|\band\b| तथा | और /i).map((s) => s.trim()).filter(Boolean).slice(0, 8);
const subjectAdvice = (subject) => {
  if (subject.includes('Mathematics')) return 'Write the formula or rule first, show every calculation step, include units and check the final answer.';
  if (subject.includes('Science')) return 'Begin with the definition, explain the process in order, add a labelled diagram where useful and finish with an example.';
  if (subject.includes('Social')) return 'Use a short introduction, dated or mapped facts, clear headings and a concluding point linked to Rajasthan or India.';
  if (subject.includes('Grammar')) return 'State the rule, identify the form in a sentence and write two correct examples of your own.';
  if (subject === 'English' || subject === 'Hindi' || subject === 'Sanskrit') return 'Support the answer with the lesson theme, context, key words and a complete sentence in the correct language.';
  if (subject === 'Drawing' || subject === 'Art & Craft') return 'Plan the composition first, work from large shapes to details, keep the work neat and label the technique and materials.';
  if (subject === 'Computer') return 'Define the term, list the steps in order, mention one practical use and follow cyber-safety rules.';
  return 'Write a direct definition, two key facts, one example and a one-line conclusion.';
};
const activityFor = (subject, title) => {
  if (subject === 'Drawing' || subject === 'Art & Craft') return `Create one neat ${title} practice sheet. Add the date, materials used and a two-line self-review.`;
  if (subject === 'Computer') return `Make a labelled flowchart or screen sketch for ${title}, then demonstrate the safe steps on a computer.`;
  if (subject.includes('Mathematics')) return `Solve three examples of ${title}: one direct, one word problem and one challenge question.`;
  if (subject.includes('Science')) return `Draw a labelled concept diagram for ${title} and connect it to one observation from daily life.`;
  if (subject.includes('Social')) return `Prepare a timeline, map or comparison table for ${title}. Mark at least five important facts.`;
  return `Create a one-page mind map for ${title} using definitions, examples and five quick-revision points.`;
};

const routineWords = [
  ['Wake up','जागना'],['Brush','दाँत साफ करना'],['Bath','स्नान'],['Breakfast','नाश्ता'],['School','विद्यालय'],['Teacher','अध्यापक'],['Homework','गृहकार्य'],['Listen','सुनना'],['Speak','बोलना'],['Read','पढ़ना'],['Write','लिखना'],['Help','मदद'],['Please','कृपया'],['Thank you','धन्यवाद'],['Sorry','क्षमा करें'],['Today','आज'],['Tomorrow','कल'],['Always','हमेशा']
];
const commonSentences = [
  ['Good morning.','सुप्रभात।'],['How are you?','आप कैसे हैं?'],['I am fine.','मैं ठीक हूँ।'],['Please help me.','कृपया मेरी मदद कीजिए।'],['May I come in?','क्या मैं अंदर आ सकता/सकती हूँ?'],['Please explain it again.','कृपया इसे फिर से समझाइए।'],['I have completed my homework.','मैंने अपना गृहकार्य पूरा कर लिया है।'],['What is the time?','समय क्या हुआ है?'],['Where are you going?','आप कहाँ जा रहे हैं?'],['I do not understand.','मैं समझा/समझी नहीं।'],['Let us work together.','आइए मिलकर काम करें।'],['Thank you for your help.','आपकी मदद के लिए धन्यवाद।']
];
const conversations = [
  {title:'At School',lines:[['Student: Good morning, ma’am.','विद्यार्थी: सुप्रभात मैडम।'],['Teacher: Good morning. Are you ready for the class?','अध्यापिका: सुप्रभात। क्या आप कक्षा के लिए तैयार हैं?'],['Student: Yes, ma’am. I have completed my homework.','विद्यार्थी: जी मैडम। मैंने गृहकार्य पूरा कर लिया है।'],['Teacher: Very good. Please open your book.','अध्यापिका: बहुत अच्छा। कृपया अपनी पुस्तक खोलिए।']]},
  {title:'At Home',lines:[['Mother: Have you finished your work?','माँ: क्या तुमने अपना काम पूरा कर लिया?'],['Child: I will finish it in ten minutes.','बच्चा: मैं इसे दस मिनट में पूरा कर दूँगा/दूँगी।'],['Mother: Please keep your books properly.','माँ: कृपया अपनी पुस्तकें ठीक से रखो।'],['Child: Yes, I will do it now.','बच्चा: जी, मैं अभी करता/करती हूँ।']]},
  {title:'At the Market',lines:[['Customer: How much does this cost?','ग्राहक: इसकी कीमत कितनी है?'],['Shopkeeper: It costs fifty rupees.','दुकानदार: इसकी कीमत पचास रुपये है।'],['Customer: Please give me two.','ग्राहक: कृपया मुझे दो दीजिए।'],['Shopkeeper: Here you are. Thank you.','दुकानदार: ये लीजिए। धन्यवाद।']]}
];
const audioButtons = (english, hindi) => `<button class="speak-btn" type="button" data-speak="${esc(english)}" data-lang="en-IN">🔊 English</button> <button class="speak-btn" type="button" data-speak="${esc(hindi)}" data-lang="hi-IN">🔊 हिन्दी</button>`;
const speakingModule = (title) => {
  if (title === 'Daily Routine Words') return `<h2>18 Routine Words with Hindi</h2><table class="speaking-table"><thead><tr><th>English</th><th>Hindi</th><th>Audio</th></tr></thead><tbody>${routineWords.map(([en,hi])=>`<tr><td>${esc(en)}</td><td>${esc(hi)}</td><td>${audioButtons(en,hi)}</td></tr>`).join('')}</tbody></table>`;
  if (title === 'Common Daily Sentences') return `<h2>12 Common Sentences with Hindi</h2><table class="speaking-table"><thead><tr><th>English sentence</th><th>Hindi meaning</th><th>Audio</th></tr></thead><tbody>${commonSentences.map(([en,hi])=>`<tr><td>${esc(en)}</td><td>${esc(hi)}</td><td>${audioButtons(en,hi)}</td></tr>`).join('')}</tbody></table>`;
  return `<h2>Conversation with English & Hindi Audio</h2>${conversations.map(scene=>`<section class="dialogue"><h3>${esc(scene.title)}</h3>${scene.lines.map(([en,hi])=>`<div class="dialogue-line"><span>${esc(en)}</span><span>${esc(hi)}</span><span>${audioButtons(en,hi)}</span></div>`).join('')}</section>`).join('')}`;
};

const subjectVisual = (prefix, subject, title, concepts) => {
  if (subject === 'Social Science') return `<h2>Subject Maps</h2><div class="visual-grid"><figure class="visual-panel"><img loading="lazy" src="${prefix}assets/maps/india-states-map.svg" alt="Map of Indian states"><figcaption>India states map · Source: Survey of India / Wikimedia Commons (public domain)</figcaption></figure><figure class="visual-panel"><img loading="lazy" src="${prefix}assets/maps/rajasthan-districts-map.svg" alt="Map of Rajasthan districts"><figcaption>Rajasthan districts map · Wikimedia Commons</figcaption></figure><figure class="visual-panel"><img loading="lazy" src="${prefix}assets/maps/world-map.svg" alt="World map"><figcaption>World map · Wikimedia Commons, CC BY-SA</figcaption></figure></div>`;
  const labels = concepts.slice(0,3);
  return `<h2>Subject Visual</h2><figure class="visual-panel"><svg viewBox="0 0 900 280" role="img" aria-label="${esc(title)} concept diagram"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#123b66"/><stop offset="1" stop-color="#28603b"/></linearGradient></defs><rect width="900" height="280" rx="24" fill="#f2f6fa"/><circle cx="160" cy="140" r="92" fill="url(#g)"/><circle cx="450" cy="140" r="92" fill="#b8860b"/><circle cx="740" cy="140" r="92" fill="#7d3c98"/><path d="M252 140h105M542 140h105" stroke="#123b66" stroke-width="12" marker-end="url(#arrow)"/><defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto"><path d="M0 0L0 6L7 3Z" fill="#123b66"/></marker></defs><g fill="#fff" font-family="Segoe UI" font-size="24" text-anchor="middle"><text x="160" y="135">${esc(labels[0]||title)}</text><text x="450" y="135">${esc(labels[1]||'Understand')}</text><text x="740" y="135">${esc(labels[2]||'Apply')}</text></g></svg><figcaption>${esc(title)}: concept → understanding → application chart.</figcaption></figure>`;
};

const directVideos = {
  '8|Science|0':'2LchHxV1jxc','8|Science|1':'0RHXcxiBLmk','8|Science|2':'W7H1MnVM4N0','8|Science|3':'pgYs_-lGvHM','8|Science|4':'Q9LOofGLtvY','8|Science|5':'TfIFe8CrKz0','8|Science|6':'iouEvPr3AaM','8|Science|7':'UsWitMNyAf4','8|Science|8':'o7ZqCFpqVlo','8|Science|9':'BUaYiO3P5Xg','8|Science|10':'HjIIDAcVwvg','8|Science|11':'psHxbCpnYyU','8|Science|12':'fTktPSSKKrU','10|Science|0':'gQ-X9wV8TXQ'
};
const playlists = {'10|Science':'PL4BZMEV0Q77jNUlpwx7M_BUNfjfpVpVfX','10|Mathematics':'PL4BZMEV0Q77jL_Y9S2ySJ-9724JwINTOo','10|Social Science':'PLEz1H1DNUppMkLKtd6XT4TmJuYQY6Dmvf','10|English':'PLVLoWQFkZbhUyZSy9xrPPVsj-beo33B2H','10|Hindi':'PLVLoWQFkZbhUYLCZUIrHtbajXH6DLMrMa'};
const videoFor = (className, subject, index) => {
  const id = directVideos[`${className}|${subject}|${index}`];
  if (id) return `https://www.youtube.com/embed/${id}`;
  const list = playlists[`${className}|${subject}`];
  return list ? `https://www.youtube.com/embed/videoseries?list=${list}&index=${index}` : '';
};

const subjectIndexHtml = (file, className, subject, chapters) => {
  const prefix = relRoot(file);
  const items = chapters.map((item, index) => `<li><a href="chapter-${String(index + 1).padStart(2,'0')}.html"><span>Chapter ${index + 1}</span><strong>${esc(item[0])}</strong><small>${esc(item[1])}</small></a></li>`).join('');
  const practical = subject === 'Drawing' || subject === 'Art & Craft';
  const intro = practical
    ? 'यह theory notes नहीं हैं। हर page में sample work, materials और step-by-step practical instructions हैं—student देखकर स्वयं बनाए।'
    : 'हर chapter का अपना अलग notes page है। Chapter खोलकर detailed explanation, chart, activity, video resource और test देखें।';
  return `<!doctype html><html lang="en" data-root="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Class ${className} ${esc(subject)} Notes - Starlight Public School</title><link rel="stylesheet" href="${prefix}assets/lesson-pages.css"><link rel="stylesheet" href="${prefix}assets/site-fixes.css"><style>.chapter-list{list-style:none;padding:0;display:grid;gap:.8rem}.chapter-list a{display:grid;gap:.25rem;background:#fff;color:#26323c;text-decoration:none;padding:1rem 1.2rem;border-radius:12px;border-left:5px solid #e2b600}.chapter-list span{color:#8a6700;font-size:.85rem}.chapter-list strong{color:#123b66;font-size:1.15rem}.chapter-list small{color:#52606b}</style></head><body>${brand(prefix)}${nav(prefix,'notes')}<main class="page"><a class="back" href="${relHref(file,classIndexFile(className))}">← Back to Class ${className}</a><article class="paper"><h1>Class ${className} · ${esc(subject)}</h1><p class="lead">${intro}</p><ol class="chapter-list">${items}</ol></article></main>${footer(prefix)}<script src="${prefix}assets/auth.js"></script></body></html>`;
};

const practicalGuide = (subject, title) => {
  const drawing = subject === 'Drawing';
  const materials = drawing
    ? ['Drawing sheet or sketchbook','HB and 2B pencils','Eraser and sharpener','Ruler or compass if needed','Colour pencils / crayons','Black fineliner (optional)']
    : title.includes('Clay') ? ['Air-dry clay','Modelling tool','Old newspaper','Water bowl','Poster colours','Protective apron']
    : title.includes('Waste') ? ['Clean waste material','Child-safe scissors','Glue','Colour paper','Marker','Decorative thread']
    : ['Colour paper / card','Child-safe scissors','Glue','Pencil and ruler','Colours / markers','Decorative material'];
  const steps = drawing
    ? [
      `Observe the sample and lightly mark the centre and outer boundary for ${title}.`,
      'Draw the largest basic shapes first; keep pencil pressure very light.',
      'Check proportion and spacing, then add the smaller shapes and details.',
      'Clean unwanted construction lines with an eraser.',
      'Add outline, shading, texture or colour from light to dark.',
      'Write your name, class and date; compare the work with the final checklist.'
    ]
    : [
      `Collect and clean all materials required for ${title}. Cover the work table.`,
      'Measure and mark the main parts before cutting; ask an adult for difficult cuts.',
      'Prepare the base shape and dry-fit all parts without glue.',
      'Join the parts one by one using only the required amount of glue.',
      'Add colour and decoration after the structure is dry and stable.',
      'Remove loose threads or paper, label the work and clean the table.'
    ];
  return {materials,steps};
};

const practicalVisual = (subject, title) => {
  const drawing = subject === 'Drawing';
  return `<div class="practical-hero"><svg viewBox="0 0 1080 420" role="img" aria-label="${esc(title)} step by step visual"><rect width="1080" height="420" rx="24" fill="#fff"/><g font-family="Segoe UI" text-anchor="middle"><text x="540" y="45" font-size="30" font-weight="700" fill="#123b66">${esc(title)} — Visual Work Guide</text><g transform="translate(40 80)"><rect width="300" height="280" rx="18" fill="#eef5fb" stroke="#123b66" stroke-width="3"/><text x="150" y="35" font-size="22" fill="#123b66">1. Basic form</text>${drawing?'<circle cx="110" cy="145" r="62" fill="none" stroke="#777" stroke-width="5"/><path d="M170 205L245 85L278 205Z" fill="none" stroke="#777" stroke-width="5"/>':'<rect x="78" y="88" width="145" height="145" fill="#ffdf65" stroke="#8a6700" stroke-width="5"/><path d="M78 88L150 155L223 88" fill="none" stroke="#8a6700" stroke-width="5"/>'}</g><g transform="translate(390 80)"><rect width="300" height="280" rx="18" fill="#fff7d6" stroke="#b8860b" stroke-width="3"/><text x="150" y="35" font-size="22" fill="#7a5800">2. Add details</text>${drawing?'<circle cx="150" cy="135" r="72" fill="#ffe7ba" stroke="#8a6700" stroke-width="5"/><circle cx="125" cy="125" r="8"/><circle cx="175" cy="125" r="8"/><path d="M115 165Q150 195 185 165" fill="none" stroke="#733" stroke-width="6"/>':'<path d="M70 210L150 75L230 210Z" fill="#ffcc4d" stroke="#8a6700" stroke-width="5"/><circle cx="150" cy="150" r="38" fill="#e85d75"/>'}</g><g transform="translate(740 80)"><rect width="300" height="280" rx="18" fill="#edf8ef" stroke="#28603b" stroke-width="3"/><text x="150" y="35" font-size="22" fill="#28603b">3. Finish neatly</text>${drawing?'<path d="M50 220Q150 45 250 220" fill="#9ed3ff" stroke="#123b66" stroke-width="5"/><circle cx="150" cy="128" r="42" fill="#ffd34d"/><path d="M80 220L120 150L155 220Z M145 220L200 125L255 220Z" fill="#62a676"/>':'<rect x="72" y="82" width="156" height="156" rx="18" fill="#7bc6a4" stroke="#28603b" stroke-width="5"/><path d="M95 190L130 140L160 175L195 115L220 190Z" fill="#fff"/>'}</g></g></svg></div>`;
};

const practicalLessonHtml = (file,className,subject,item,index,total,testFile,subjectIndex) => {
  const prefix=relRoot(file), [title]=item, guide=practicalGuide(subject,title);
  const previous=index>0?`<a href="chapter-${String(index).padStart(2,'0')}.html">← Previous</a>`:'';
  const next=index+1<total?`<a href="chapter-${String(index+2).padStart(2,'0')}.html">Next →</a>`:'';
  const materials=guide.materials.map(x=>`<li>${esc(x)}</li>`).join('');
  const steps=guide.steps.map(x=>`<li>${esc(x)}</li>`).join('');
  return `<!doctype html><html lang="hi" data-root="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} Practical - Class ${className}</title><link rel="stylesheet" href="${prefix}assets/lesson-pages.css"><link rel="stylesheet" href="${prefix}assets/site-fixes.css"></head><body>${brand(prefix)}${nav(prefix,'notes')}<main class="page"><a class="back" href="${path.basename(subjectIndex)}">← Back to practical list</a><article class="paper"><p><b>Class ${className} · ${esc(subject)} · Practical ${index+1}</b></p><h1>${esc(title)}</h1><p class="lead">यह notes नहीं, देखकर बनाने वाली practical worksheet है। पहले पूरा visual और सभी steps देखें, फिर अपना work शुरू करें।</p>${practicalVisual(subject,title)}<h2>Materials Required</h2><ul class="material-list">${materials}</ul><h2>Step-by-Step Work</h2><ol class="step-list">${steps}</ol><h2>Student Checklist</h2><div class="work-checklist"><label><input type="checkbox"> Work is complete and clean.</label><br><label><input type="checkbox"> Shape, proportion and spacing are balanced.</label><br><label><input type="checkbox"> Colours / joins are neat.</label><br><label><input type="checkbox"> Name, class and date are written.</label></div><div class="video"><h2>Watch a Demonstration</h2><a class="video-link" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} step by step for school students`)}">Step-by-step video देखें</a></div><div class="page-actions">${previous}<a href="${relHref(file,testFile)}" class="test-button">Practical Self-Check</a>${next}</div></article></main>${footer(prefix)}<script src="${prefix}assets/auth.js"></script></body></html>`;
};

const lessonHtml = (file, className, subject, item, index, total, testFile, subjectIndex) => {
  if (subject === 'Drawing' || subject === 'Art & Craft') return practicalLessonHtml(file,className,subject,item,index,total,testFile,subjectIndex);
  const prefix = relRoot(file), [title, summary] = item, concepts = conceptsFrom(summary);
  const cards = concepts.map((concept, i) => `<div class="concept"><b>${i + 1}. ${esc(concept)}</b><p>${esc(concept)} is an important part of ${esc(title)}. Understand its meaning, purpose and connection with the other ideas in this chapter. Write one example in your notebook.</p></div>`).join('');
  const terms = concepts.map((concept) => `<tr><td>${esc(concept)}</td><td>Key idea connected with ${esc(title)}; revise its definition and one example.</td></tr>`).join('');
  const flow = concepts.slice(0,4).map((c,i) => `${i?'<i>→</i>':''}<span>${esc(c)}</span>`).join('');
  const definitions = concepts.map((concept)=>`<div><dt>${esc(concept)}</dt><dd>${esc(concept)} इस chapter के मुख्य विचार “${title}” से जुड़ा शब्द है। इसकी सही परिभाषा, विशेषता और एक उदाहरण याद रखें।</dd></div>`).join('');
  const video = videoFor(className, subject, index);
  const previous = index > 0 ? `<a href="chapter-${String(index).padStart(2,'0')}.html">← Previous</a>` : '';
  const next = index + 1 < total ? `<a href="chapter-${String(index + 2).padStart(2,'0')}.html">Next →</a>` : '';
  const videoBlock = video ? `<iframe src="${video}" title="${esc(title)} chapter video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` : `<a class="video-link" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`Class ${className} ${subject} ${title} Hindi`)}">YouTube पर chapter video खोजें</a>`;
  const speaking = subject === 'English Speaking' ? speakingModule(title) : '';
  return `<!doctype html><html lang="hi" data-root="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} - Class ${className} ${esc(subject)}</title><link rel="stylesheet" href="${prefix}assets/lesson-pages.css"><link rel="stylesheet" href="${prefix}assets/site-fixes.css"></head><body>${brand(prefix)}${nav(prefix,'notes')}<main class="page"><a class="back" href="${path.basename(subjectIndex)}">← Back to chapter list</a><article class="paper"><p><b>Class ${className} · ${esc(subject)} · Chapter ${index + 1}</b></p><h1>${esc(title)}</h1><p class="lead">${esc(summary)}</p>${speaking}<h2>Chapter at a Glance</h2><div class="concept-grid">${cards}</div><h2>Detailed Explanation</h2><p>${esc(title)} को समझने के लिए पहले इसके मूल शब्दों और उनके आपसी संबंध को पहचानें। इस chapter में ${esc(summary.toLowerCase())} का क्रमबद्ध अध्ययन किया जाता है। हर concept की परिभाषा लिखें, उसका कारण या नियम समझें और कम-से-कम एक सही उदाहरण जोड़ें।</p><p>परीक्षा में केवल याद किया हुआ वाक्य न लिखें। प्रश्न के command word—define, explain, compare, calculate या justify—के अनुसार उत्तर बनाएं। ${esc(subjectAdvice(subject))}</p><h2>Definitions</h2><dl class="definition-list">${definitions}</dl><h2>Concept Chart</h2><div class="flow">${flow}</div>${subjectVisual(prefix,subject,title,concepts)}<h2>Key Terms</h2><table class="terms"><thead><tr><th>Term</th><th>What to learn</th></tr></thead><tbody>${terms}</tbody></table><h2>Activity / Practice</h2><div class="activity-box">${esc(activityFor(subject,title))}</div><h2>RBSE–NCERT Answer Writing</h2><div class="exam-box"><ol><li>Start with a correct definition or central idea.</li><li>Use headings and write the concepts in a logical order.</li><li>Add an example, formula, map, quotation or labelled diagram where relevant.</li><li>Underline key terms and recheck spelling, units and facts.</li><li>Finish with a one-line conclusion linked to the question.</li></ol></div><div class="video"><h2>Chapter Video</h2>${videoBlock}</div><div class="page-actions">${previous}<a href="${relHref(file,testFile)}" class="test-button">Chapter Test 🔒</a>${next}</div></article></main>${footer(prefix)}<script src="${prefix}assets/auth.js"></script>${subject === 'English Speaking' ? `<script src="${prefix}assets/speech.js"></script>` : ''}</body></html>`;
};

const questionsFor = (className, subject, title, summary) => {
  if (subject === 'Drawing' || subject === 'Art & Craft') {
    const guide=practicalGuide(subject,title);
    return [
      [`Which materials are required for “${title}”?`, guide.materials.join(', ') + '.'],
      ['What should be done before cutting, colouring or joining?', guide.steps.slice(0,2).join(' ')],
      ['Write the main making steps in order.', guide.steps.join(' ')],
      ['How will you check the finished work?', 'Check cleanliness, shape, proportion, balance, strong joins, colour finish, name, class and date.'],
      ['Write two safety rules.', 'Use child-safe scissors, ask an adult for difficult cutting, keep glue and colours away from eyes, and clean the work area.']
    ];
  }
  const concepts = conceptsFrom(summary);
  const joined = concepts.join(', ');
  return [
    [`What is the central idea of “${title}”?`, summary],
    [`Write the important terms included in this chapter.`, `${joined}. Write the meaning and one example of each term.`],
    [`Explain “${title}” in a short RBSE-style answer.`, `Begin with: ${summary} Then arrange the main points under headings and add a suitable example or diagram.`],
    [`Give one activity or practical example related to this chapter.`, activityFor(subject,title)],
    [`How can you score well in a question from this chapter?`, subjectAdvice(subject)]
  ];
};

const testHtml = (file, className, subject, item, index, noteFile, testIndexFile) => {
  const prefix = relRoot(file), [title, summary] = item;
  const questions = questionsFor(className, subject, title, summary).map(([q,a],i) => `<section class="question"><h3>Q${i+1}. ${esc(q)}</h3><details class="answer"><summary>Answer देखें</summary><p>${esc(a)}</p></details></section>`).join('');
  return `<!doctype html><html lang="hi" data-root="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} Test - Class ${className}</title><link rel="stylesheet" href="${prefix}assets/lesson-pages.css"><link rel="stylesheet" href="${prefix}assets/test-pages.css"></head><body data-requires-login="true">${brand(prefix)}${nav(prefix,'tests')}<main class="test-shell"><a class="back" href="${path.basename(testIndexFile)}">← Back to test list</a><article class="test-card"><div class="student-strip" data-student-name></div><p>Class ${className} · ${esc(subject)} · Chapter ${index + 1}</p><h1>${esc(title)} — Test</h1><p>पहले स्वयं उत्तर लिखें। उसके बाद <b>Answer देखें</b> पर click करके जाँच करें।</p>${questions}<div class="test-actions"><a href="${relHref(file,noteFile)}">Chapter Notes</a><a href="${path.basename(testIndexFile)}">All Tests</a></div></article></main>${footer(prefix)}<script src="${prefix}assets/auth.js"></script></body></html>`;
};

const testListHtml = (file, className, subject, chapters) => {
  const prefix = relRoot(file);
  const links = chapters.map((item,index)=>`<a class="test-link" href="test-${String(index+1).padStart(2,'0')}.html"><b>Chapter ${index+1}</b><br>${esc(item[0])}</a>`).join('');
  return `<!doctype html><html lang="en" data-root="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Class ${className} ${esc(subject)} Tests</title><link rel="stylesheet" href="${prefix}assets/lesson-pages.css"><link rel="stylesheet" href="${prefix}assets/test-pages.css"></head><body data-requires-login="true">${brand(prefix)}${nav(prefix,'tests')}<main class="test-shell"><a class="back" href="${prefix}tests/class-${className}.html">← Back to Class ${className}</a><div class="student-strip" data-student-name></div><h1>Class ${className} · ${esc(subject)} Tests</h1><div class="test-grid">${links}</div></main>${footer(prefix)}<script src="${prefix}assets/auth.js"></script></body></html>`;
};

let lessonCount = 0, testCount = 0;
for (const className of Object.keys(data)) {
  for (const subject of subjectOrder) {
    const chapters = data[className].subjects[subject];
    if (!chapters) continue;
    const subjectDir = path.join(root, 'notes', `class ${className}`, slug(subject));
    const subjectIndex = path.join(subjectDir, `${slug(subject)}-notes.html`);
    const testDir = path.join(root, 'tests', `class ${className}`, slug(subject));
    const testIndex = path.join(testDir, 'index.html');
    write(subjectIndex, subjectIndexHtml(subjectIndex, className, subject, chapters));
    write(testIndex, testListHtml(testIndex, className, subject, chapters));
    chapters.forEach((item,index) => {
      const noteFile = path.join(subjectDir, `chapter-${String(index+1).padStart(2,'0')}.html`);
      const testFile = path.join(testDir, `test-${String(index+1).padStart(2,'0')}.html`);
      write(noteFile, lessonHtml(noteFile,className,subject,item,index,chapters.length,testFile,subjectIndex));
      write(testFile, testHtml(testFile,className,subject,item,index,noteFile,testIndex));
      lessonCount++; testCount++;
    });
  }
}

for (const className of Object.keys(data)) {
  const file = classIndexFile(className);
  let html = fs.readFileSync(file,'utf8');
  const base = className === '6' ? `notes/class ${className}/` : '';
  for (const subject of subjectOrder) {
    const label = subject === 'Art & Craft' ? 'Art &amp; Craft' : subject;
    const href = `${base}${slug(subject)}/${slug(subject)}-notes.html`;
    const labelPattern = subject === 'Art & Craft' ? 'Art (?:&|&amp;) Craft' : label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const pattern = new RegExp(`<a class="button-link" href="[^"]*">${labelPattern}<\\/a>`);
    html = html.replace(pattern, `<a class="button-link" href="${href}">${label}</a>`);
  }
  if (!html.includes('>English Speaking</a>')) {
    const speakingHref = `${base}english-speaking/english-speaking-notes.html`;
    html = html.replace(/(<a class="button-link" href="[^"]*">Art (?:&|&amp;) Craft<\/a>)/, `$1<a class="button-link" href="${speakingHref}">English Speaking</a>`);
  }
  fs.writeFileSync(file,html,'utf8');
}

const testsFile = path.join(root,'tests.html');
const classLinks = Object.keys(data).map(c=>`<a class="test-link" href="tests/class-${c}.html"><b>Class ${c}</b><br>All subject chapter tests</a>`).join('');
write(testsFile,`<!doctype html><html lang="en" data-root=""><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Student Tests - Starlight Public School</title><link rel="stylesheet" href="assets/lesson-pages.css"><link rel="stylesheet" href="assets/test-pages.css"></head><body data-requires-login="true">${brand('')}${nav('','tests')}<main class="test-shell"><div class="student-strip" data-student-name></div><h1>Choose Your Class</h1><p>Chapter-wise RBSE–NCERT practice tests. Answer खोलने से पहले स्वयं हल करें।</p><div class="test-grid">${classLinks}</div></main>${footer('')}<script src="assets/auth.js"></script></body></html>`);

for (const className of Object.keys(data)) {
  const file = path.join(root,'tests',`class-${className}.html`), prefix=relRoot(file);
  const links = subjectOrder.filter(s=>data[className].subjects[s]).map(s=>`<a class="test-link" href="class ${className}/${slug(s)}/index.html"><b>${esc(s)}</b><br>${data[className].subjects[s].length} chapter tests</a>`).join('');
  write(file,`<!doctype html><html lang="en" data-root="${prefix}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Class ${className} Tests</title><link rel="stylesheet" href="${prefix}assets/lesson-pages.css"><link rel="stylesheet" href="${prefix}assets/test-pages.css"></head><body data-requires-login="true">${brand(prefix)}${nav(prefix,'tests')}<main class="test-shell"><a class="back" href="${prefix}tests.html">← All Classes</a><div class="student-strip" data-student-name></div><h1>Class ${className} Tests</h1><div class="test-grid">${links}</div></main>${footer(prefix)}<script src="${prefix}assets/auth.js"></script></body></html>`);
}

const loginFile = path.join(root,'login.html');
write(loginFile,`<!doctype html><html lang="en" data-root=""><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Student Login - Starlight Public School</title><link rel="stylesheet" href="assets/lesson-pages.css"><link rel="stylesheet" href="assets/test-pages.css"></head><body>${brand('')}${nav('')}<main class="login-box"><h1>Student Login</h1><p>Notes सभी के लिए खुले हैं। Chapter tests खोलने के लिए student details दर्ज करें।</p><form id="login-form"><label>Student Name<input id="student-name" required autocomplete="name"></label><label>Class<select id="student-class" required><option value="">Select class</option>${Object.keys(data).map(c=>`<option>${c}</option>`).join('')}</select></label><label>Roll Number<input id="student-roll" required inputmode="numeric"></label><label>School Access Code<input id="student-code" required type="password" autocomplete="current-password"></label><p class="form-error" id="form-error"></p><button type="submit">Login & Open Tests</button></form></main>${footer('')}<script src="assets/auth.js"></script><script>document.getElementById('login-form').addEventListener('submit',function(event){event.preventDefault();const code=document.getElementById('student-code').value.trim();const error=document.getElementById('form-error');if(code!=='SLPS2026'){error.textContent='School access code सही नहीं है।';return;}window.SLPS_AUTH.login({name:document.getElementById('student-name').value.trim(),className:document.getElementById('student-class').value,roll:document.getElementById('student-roll').value.trim()});const next=new URLSearchParams(location.search).get('next');location.href=next||'tests.html';});</script></body></html>`);

const allHtml = [];
const walk = (dir) => { for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { if (entry.name === '.git') continue; const full=path.join(dir,entry.name); if(entry.isDirectory()) walk(full); else if(entry.name.endsWith('.html')) allHtml.push(full); } };
walk(root);
for (const file of allHtml) {
  let html = fs.readFileSync(file,'utf8'), prefix=relRoot(file);
  if (!html.includes('site-fixes.css') && html.includes('</head>')) html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/site-fixes.css"></head>`);
  if (!html.includes('theme.css') && html.includes('</head>')) html=html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/theme.css"></head>`);
  if (!html.includes('assets/auth.js') && html.includes('</body>')) html=html.replace('</body>',`<script src="${prefix}assets/auth.js"></script></body>`);
  if (!html.includes('class="test-nav"')) {
    const notesAnchor=/<a href="([^"]*notes\.html)">Notes<\/a>/;
    html=html.replace(notesAnchor,(match,href)=>`${match}<a class="test-nav" href="${prefix}tests.html">Test</a>`);
  }
  if (!html.includes('class="login-nav"')) {
    const navEnd=/<\/nav>/;
    html=html.replace(navEnd,`<a class="login-nav" href="${prefix}login.html">Login</a></nav>`);
  }
  if (!html.includes('class="theme-toggle"')) html=html.replace(/<\/nav>/,`<button class="theme-toggle" type="button">☀ Light</button></nav>`);
  if (!html.includes('assets/theme.js') && html.includes('</body>')) html=html.replace('</body>',`<script src="${prefix}assets/theme.js"></script></body>`);
  if (!html.includes('data-root=')) html=html.replace('<html',`<html data-root="${prefix}"`);
  fs.writeFileSync(file,html,'utf8');
}

console.log(JSON.stringify({lessonCount,testCount,htmlFiles:allHtml.length},null,2));
