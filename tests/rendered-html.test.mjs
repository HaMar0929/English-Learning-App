import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";
const deployedUrl = (path) => `${pagesBasePath}${path}`;

function getWebpDimensions(bytes) {
  const vp8Index = bytes.indexOf(Buffer.from("VP8 "));
  if (vp8Index >= 0) {
    return {
      width: bytes.readUInt16LE(vp8Index + 14) & 0x3fff,
      height: bytes.readUInt16LE(vp8Index + 16) & 0x3fff,
    };
  }

  const vp8lIndex = bytes.indexOf(Buffer.from("VP8L"));
  if (vp8lIndex >= 0) {
    const bits = bytes.readUInt32LE(vp8lIndex + 9);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }

  const vp8xIndex = bytes.indexOf(Buffer.from("VP8X"));
  if (vp8xIndex >= 0) {
    return {
      width: bytes.readUIntLE(vp8xIndex + 12, 3) + 1,
      height: bytes.readUIntLE(vp8xIndex + 15, 3) + 1,
    };
  }

  throw new Error("Unsupported WebP encoding");
}

test("statically exports the English learning homepage", async () => {
  const html = await readFile(
    new URL("../dist/client/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>轻松英语 \| 日常英语入门<\/title>/);
  assert.match(html, /轻松开口说英语/);
  assert.match(html, /英语句子/);
  assert.match(html, /简单对话/);
  assert.match(html, /单词学习/);
  assert.match(html, /单词小测验/);
  assert.match(html, /听音选图/);
  assert.match(html, /V3\.6/);
  assert.match(html, /Words/);
  assert.match(html, /Good morning!/);
  assert.match(html, /Have a nice day!/);
  assert.match(html, /播放发音/);
  assert.match(
    html,
    new RegExp(`rel="manifest" href="${deployedUrl("/manifest.json")}"`),
  );
  assert.match(html, /rel="apple-touch-icon"/);
  assert.match(html, /name="apple-mobile-web-app-capable" content="yes"/);
  assert.match(html, /name="theme-color" content="#0f513f"/);
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("provides 160 words while preserving the approved original vocabulary", async () => {
  const data = await readFile(new URL("../app/data/words.ts", import.meta.url), "utf8");
  const wordsModule = await readFile(new URL("../app/WordsModule.tsx", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const speech = await readFile(new URL("../app/speech.ts", import.meta.url), "utf8");
  const { allWords, wordCategories } = await import("../app/data/words.ts");

  const categoryMatches = [...data.matchAll(/id: "(animals|fruits|colors|family|things|body|numbers|food|vehicles|clothes|actions|feelings)"/g)];
  const categoryIds = categoryMatches.map((match) => match[1]);
  const wordEntries = data.match(/\{ word: "[^"]+", chinese: "[^"]+", emoji: "[^"]*"/g) ?? [];
  const learningDetails = [...data.matchAll(
    /^\s+"([^"]+)": \{ phonetic: "([^"]+)", example: "([^"]+)", exampleCn: "([^"]+)" \},$/gm,
  )];

  assert.deepEqual(categoryIds, [
    "animals",
    "fruits",
    "colors",
    "family",
    "things",
    "body",
    "numbers",
    "food",
    "vehicles",
    "clothes",
    "actions",
    "feelings",
  ]);
  assert.equal(wordEntries.length, 160);
  assert.equal(allWords.length, 160);
  assert.deepEqual(
    wordCategories.map((category) => [category.id, category.words.length]),
    [
      ["animals", 15], ["fruits", 15], ["colors", 10], ["family", 10],
      ["things", 15], ["body", 15], ["numbers", 10], ["food", 15],
      ["vehicles", 15], ["clothes", 15], ["actions", 15], ["feelings", 10],
    ],
  );

  const originalWords = wordCategories.flatMap((category) => category.words.slice(0, 10));
  const originalWordsHash = createHash("sha256")
    .update(JSON.stringify(originalWords))
    .digest("hex");
  assert.equal(originalWords.length, 120);
  assert.equal(
    originalWordsHash,
    "6a9aa223e55c2f06ef6a1c25048a7fffb76608929be1ea7e2f11660aac5b4f3a",
    "the original 120 word objects must match the approved data snapshot",
  );

  const generatedIds = allWords.map((word) => word.id);
  assert.equal(new Set(generatedIds).size, 160);
  assert.equal(learningDetails.length, 160);
  assert.deepEqual(
    learningDetails.map((match) => match[1]).sort(),
    [...generatedIds].sort(),
    "learning details must cover every word ID",
  );
  for (const detail of learningDetails) {
    const [, id, phonetic, example, exampleCn] = detail;
    const word = allWords.find((item) => item.id === id)?.word;

    assert.match(phonetic, /^\/.+\/$/, `${id} must have a phonetic transcription`);
    assert.ok(example.trim(), `${id} must have an English example`);
    assert.ok(exampleCn.trim(), `${id} must have a Chinese example translation`);
    assert.ok(word, `${id} must resolve to a word`);
    assert.ok(
      example.toLowerCase().includes(word.toLowerCase()),
      `${id} example must contain its target word`,
    );
  }
  const expectedNewWords = {
    animals: ["lion", "elephant", "bear", "frog", "turtle"],
    fruits: ["pineapple", "cherry", "kiwi", "coconut", "blueberry"],
    things: ["spoon", "toothbrush", "umbrella", "clock", "doll"],
    body: ["tooth", "finger", "knee", "shoulder", "tongue"],
    food: ["cheese", "soup", "pizza", "cookie", "carrot"],
    vehicles: ["scooter", "helicopter", "motorcycle", "tractor", "rocket"],
    clothes: ["scarf", "gloves", "boots", "pajamas", "sweater"],
    actions: ["swim", "dance", "clap", "sing", "cook"],
  };
  assert.deepEqual(
    Object.fromEntries(
      wordCategories
        .filter((category) => category.words.length === 15)
        .map((category) => [category.id, category.words.slice(10).map((word) => word.word)]),
    ),
    expectedNewWords,
  );
  assert.match(data, /word: "T-shirt", chinese: "T恤"/);
  assert.match(data, /word: "sister", chinese: "姐姐或妹妹"/);
  assert.match(data, /word: "water", chinese: "水"/);
  assert.match(data, /word: "subway", chinese: "地铁"/);
  assert.match(data, /word: "thirsty", chinese: "渴"/);
  assert.match(data, /word: "excited", chinese: "兴奋"/);
  assert.match(data, /phonetic: string/);
  assert.match(data, /example: string/);
  assert.match(data, /exampleCn: string/);
  assert.match(data, /\.\.\.details/);
  assert.match(data, /image: item\.image \?\? null/);
  assert.match(data, /type: item\.type \?\? "emoji"/);
  assert.match(data, /type: "color"/);
  assert.match(page, /type Section = "sentences" \| "dialogues" \| "words" \| "quiz" \| "listening"/);
  assert.match(wordsModule, /mode: "word"/);
  assert.match(speech, /window\.speechSynthesis\.cancel\(\)/);
  assert.match(speech, /utterance\.lang = voice\?\.lang \?\? "en-US"/);
  assert.match(wordsModule, /onClick=\{\(\) => speakWord\(currentWord\.word/);
  assert.match(wordsModule, /wordIndex === category\.words\.length - 1/);
  assert.match(wordsModule, /setView\("complete"\)/);
  assert.match(wordsModule, /返回单词分类/);
});

test("adds GitHub Pages-safe word images with full learning details", async () => {
  const data = await readFile(new URL("../app/data/words.ts", import.meta.url), "utf8");
  const wordsModule = await readFile(new URL("../app/WordsModule.tsx", import.meta.url), "utf8");
  const expectedImages = {
    animals: ["cat", "dog", "bird", "fish", "rabbit", "duck", "pig", "cow", "horse", "monkey", "lion", "elephant", "bear", "frog", "turtle"],
    fruits: ["apple", "banana", "orange", "grape", "pear", "peach", "watermelon", "strawberry", "lemon", "mango", "pineapple", "cherry", "kiwi", "coconut", "blueberry"],
    family: ["mom", "dad", "mother", "father", "sister", "brother", "grandma", "grandpa", "baby", "family"],
    things: ["spoon", "toothbrush", "umbrella", "clock", "doll"],
    body: ["tooth", "finger", "knee", "shoulder", "tongue"],
    food: ["rice", "bread", "egg", "milk", "water", "cake", "candy", "juice", "chicken", "noodles", "cheese", "soup", "pizza", "cookie", "carrot"],
    vehicles: ["car", "bus", "train", "bike", "plane", "boat", "taxi", "truck", "subway", "ship", "scooter", "helicopter", "motorcycle", "tractor", "rocket"],
    clothes: ["shirt", "t-shirt", "pants", "dress", "shoes", "socks", "hat", "coat", "skirt", "shorts", "scarf", "gloves", "boots", "pajamas", "sweater"],
    actions: ["run", "walk", "jump", "eat", "drink", "sleep", "sit", "stand", "read", "write", "swim", "dance", "clap", "sing", "cook"],
  };
  const imagePaths = [...data.matchAll(/image: "(images\/words\/[a-z-]+\/[a-z-]+\.webp)"/g)]
    .map((match) => match[1]);
  const expectedImagePaths = Object.entries(expectedImages).flatMap(([category, names]) =>
    names.map((name) => `images/words/${category}/${name}.webp`),
  );

  assert.deepEqual(imagePaths, expectedImagePaths);
  assert.equal(imagePaths.length, 110);

  for (const imagePath of imagePaths) {
    assert.ok(!imagePath.startsWith("/"), `${imagePath} must be app-relative`);
    const publicImage = await readFile(new URL(`../public/${imagePath}`, import.meta.url));
    assert.equal(publicImage.subarray(0, 4).toString(), "RIFF");
    assert.deepEqual(getWebpDimensions(publicImage), { width: 640, height: 640 });
    assert.ok(publicImage.byteLength < 100_000, `${imagePath} must stay below 100 KB`);
    await access(new URL(`../dist/client/${imagePath}`, import.meta.url));
  }

  assert.match(wordsModule, /src=\{item\.image\}/);
  assert.match(wordsModule, /onError=\{\(\) => setFailedImage\(item\.image\)\}/);
  assert.match(
    wordsModule,
    /<WordVisual item=\{currentWord\}[\s\S]*currentWord\.word[\s\S]*currentWord\.phonetic[\s\S]*currentWord\.chinese[\s\S]*currentWord\.example[\s\S]*currentWord\.exampleCn[\s\S]*word-speak-button[\s\S]*word-status-actions/,
  );
  assert.match(wordsModule, /toggleCurrentWordState\("favorite"\)/);
  assert.match(wordsModule, /toggleCurrentWordState\("mastered"\)/);
});

test("builds 10-question image quizzes with three unique randomized answers", async () => {
  const {
    QUIZ_LENGTH,
    QUIZ_OPTION_COUNT,
    createQuizRound,
    getImageQuizWords,
  } = await import("../app/quiz/quiz-logic.ts");

  const seededRandom = (seed) => {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 2 ** 32;
    };
  };

  const imageWords = getImageQuizWords();
  const firstRound = createQuizRound(imageWords, seededRandom(34));
  const secondRound = createQuizRound(imageWords, seededRandom(91));

  assert.equal(imageWords.length, 110);
  assert.equal(firstRound.length, QUIZ_LENGTH);
  assert.equal(new Set(firstRound.map((question) => question.id)).size, QUIZ_LENGTH);
  assert.notDeepEqual(
    firstRound.map((question) => question.id),
    secondRound.map((question) => question.id),
    "a restarted quiz must be able to generate a new question order",
  );

  for (const question of firstRound) {
    assert.equal(question.options.length, QUIZ_OPTION_COUNT);
    assert.equal(new Set(question.options).size, QUIZ_OPTION_COUNT);
    assert.ok(question.options.includes(question.word.word));
    assert.ok(question.word.image);
  }

  const correctPositions = new Set(
    Array.from({ length: 12 }, (_, seed) =>
      createQuizRound(imageWords, seededRandom(seed + 1)),
    )
      .flat()
      .map((question) => question.options.indexOf(question.word.word)),
  );
  assert.deepEqual([...correctPositions].sort(), [0, 1, 2]);
});

test("builds 10-question listening quizzes with three distinct randomized images", async () => {
  const {
    QUIZ_LENGTH,
    QUIZ_OPTION_COUNT,
    createListeningQuizRound,
    getImageQuizWords,
  } = await import("../app/quiz/quiz-logic.ts");

  const seededRandom = (seed) => {
    let state = seed >>> 0;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 2 ** 32;
    };
  };

  const imageWords = getImageQuizWords();
  const firstRound = createListeningQuizRound(imageWords, seededRandom(35));
  const secondRound = createListeningQuizRound(imageWords, seededRandom(92));

  assert.equal(firstRound.length, QUIZ_LENGTH);
  assert.equal(new Set(firstRound.map((question) => question.id)).size, QUIZ_LENGTH);
  assert.notDeepEqual(
    firstRound.map((question) => question.id),
    secondRound.map((question) => question.id),
    "a restarted listening quiz must be able to generate a new question order",
  );

  for (const question of firstRound) {
    assert.equal(question.options.length, QUIZ_OPTION_COUNT);
    assert.equal(new Set(question.options.map((option) => option.id)).size, QUIZ_OPTION_COUNT);
    assert.equal(new Set(question.options.map((option) => option.image)).size, QUIZ_OPTION_COUNT);
    assert.ok(question.options.some((option) => option.id === question.word.id));
  }

  const correctPositions = new Set(
    Array.from({ length: 12 }, (_, seed) =>
      createListeningQuizRound(imageWords, seededRandom(seed + 101)),
    )
      .flat()
      .map((question) => question.options.findIndex((option) => option.id === question.word.id)),
  );
  assert.deepEqual([...correctPositions].sort(), [0, 1, 2]);
});

test("counts quiz results and keeps the child-friendly score messages exact", async () => {
  const {
    QUIZ_LENGTH,
    countCorrectAnswers,
    createQuizRound,
    getQuizEncouragement,
  } = await import("../app/quiz/quiz-logic.ts");

  const round = createQuizRound();
  const results = round.map((question, index) => ({
    word: question.word,
    selectedAnswer: index < 8 ? question.word.word : question.options.find((answer) => answer !== question.word.word),
    correct: index < 8,
  }));

  assert.equal(results.length, QUIZ_LENGTH);
  assert.equal(countCorrectAnswers(results), 8);
  assert.equal(getQuizEncouragement(10), "太棒啦！🌟");
  assert.equal(getQuizEncouragement(8), "真厉害！👏");
  assert.equal(getQuizEncouragement(5), "继续加油！💪");
  assert.equal(getQuizEncouragement(4), "再玩一次吧！😊");
});

test("includes the complete quiz flow in the GitHub Pages client build", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const quizModule = await readFile(new URL("../app/quiz/QuizModule.tsx", import.meta.url), "utf8");
  const quizQuestion = await readFile(new URL("../app/quiz/QuizQuestion.tsx", import.meta.url), "utf8");
  const listeningQuizModule = await readFile(new URL("../app/quiz/ListeningQuizModule.tsx", import.meta.url), "utf8");
  const listeningQuizQuestion = await readFile(new URL("../app/quiz/ListeningQuizQuestion.tsx", import.meta.url), "utf8");
  const quizResult = await readFile(new URL("../app/quiz/QuizResult.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(page, /单词小测验/);
  assert.match(page, /<QuizModule onReturnToLearning=/);
  assert.match(page, /听音选图/);
  assert.match(page, /<ListeningQuizModule onReturnToLearning=/);
  assert.match(quizModule, /createQuizRound\(\)/);
  assert.match(quizModule, /speakEnglish\(word, \{ mode: "word" \}\)/);
  assert.match(quizModule, /onSpeakChinese=\{speakChinese\}/);
  assert.match(quizModule, /setTimeout\(goToNextQuestion, 1100\)/);
  assert.match(quizQuestion, /答对啦！/);
  assert.match(quizQuestion, /🔊 再听一次/);
  assert.match(quizQuestion, /className="quiz-chinese-speak-button"/);
  assert.match(quizQuestion, /event\.stopPropagation\(\)/);
  assert.match(quizQuestion, /onSpeakChinese\(question\.word\.chinese\)/);
  assert.match(quizQuestion, /onClick=\{\(\) => onAnswer\(answer\)\}/);
  assert.match(quizResult, /本轮完成！/);
  assert.match(quizResult, /这几个再看看/);
  assert.match(quizResult, /返回学习/);
  assert.match(listeningQuizModule, /createListeningQuizRound\(\)/);
  assert.match(listeningQuizModule, /setTimeout\(goToNextQuestion, 1300\)/);
  assert.match(listeningQuizModule, /speakEnglish\(word, \{ mode: "word" \}\)/);
  assert.match(listeningQuizModule, /onSpeakChinese=\{speakChinese\}/);
  assert.match(listeningQuizQuestion, /听一听，选出正确图片/);
  assert.match(listeningQuizQuestion, /alt=""/);
  assert.doesNotMatch(listeningQuizQuestion, /answer\.word\}/);
  assert.match(listeningQuizQuestion, /className="listening-option-card"/);
  assert.match(listeningQuizQuestion, /className="listening-chinese-speak-button"/);
  assert.match(listeningQuizQuestion, /event\.stopPropagation\(\)/);
  assert.match(listeningQuizQuestion, /onSpeakChinese\(answer\.chinese\)/);
  assert.doesNotMatch(
    `${listeningQuizModule}\n${listeningQuizQuestion}`,
    /\bfetch\s*\(|\baxios\b|https?:\/\//,
    "listening quiz must not add a runtime network API dependency",
  );
  assert.match(css, /\.quiz-answer-button\s*\{[^}]*min-height: 68px/s);
  assert.match(css, /\.quiz-chinese-speak-button,[\s\S]*width: 48px;[^}]*height: 48px;/s);
  assert.match(css, /\.listening-image-options\s*\{[^}]*grid-template-columns: repeat\(3,/s);
  assert.match(css, /\.listening-chinese-speak-button\s*\{[^}]*width: 48px;[^}]*height: 48px;/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.listening-image-options\s*\{[^}]*grid-template-columns: repeat\(2,/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.quiz-review-grid\s*\{[^}]*grid-template-columns: 1fr/s);

  const clientFiles = await readdir(new URL("../dist/client", import.meta.url), {
    recursive: true,
  });
  const clientJavaScript = (
    await Promise.all(
      clientFiles
        .filter((file) => file.endsWith(".js"))
        .map((file) => readFile(new URL(`../dist/client/${file}`, import.meta.url), "utf8")),
    )
  ).join("\n");

  assert.match(clientJavaScript, /本轮完成！/);
  assert.match(clientJavaScript, /再听一次/);
  assert.match(clientJavaScript, /听一听，选出正确图片/);
  assert.match(clientJavaScript, /这几个再看看/);
});

test("persists word progress safely after client hydration", async () => {
  const {
    getWordLearningState,
    loadWordProgress,
    parseWordProgress,
    saveWordProgress,
    toggleWordProgress,
  } = await import("../app/word-progress.ts");
  const wordsModule = await readFile(new URL("../app/WordsModule.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.deepEqual(parseWordProgress(null), {});
  assert.deepEqual(parseWordProgress("not JSON"), {});
  assert.deepEqual(parseWordProgress("[]"), {});
  assert.deepEqual(parseWordProgress('{"animals-cat":{"favorite":true,"mastered":false}}'), {
    "animals-cat": { favorite: true, mastered: false },
  });
  assert.deepEqual(parseWordProgress('{"animals-cat":{"favorite":"yes"}}'), {
    "animals-cat": { favorite: false, mastered: false },
  });

  const favoriteProgress = toggleWordProgress({}, "animals-cat", "favorite");
  assert.deepEqual(getWordLearningState(favoriteProgress, "animals-cat"), {
    favorite: true,
    mastered: false,
  });
  const masteredProgress = toggleWordProgress(favoriteProgress, "animals-cat", "mastered");
  assert.deepEqual(getWordLearningState(masteredProgress, "animals-cat"), {
    favorite: true,
    mastered: true,
  });

  let storedValue = null;
  globalThis.window = {
    localStorage: {
      getItem: () => storedValue,
      setItem: (_key, value) => {
        storedValue = value;
      },
    },
  };

  try {
    assert.equal(saveWordProgress(masteredProgress), true);
    assert.deepEqual(loadWordProgress(), masteredProgress);
    storedValue = "damaged";
    assert.deepEqual(loadWordProgress(), {});
    globalThis.window.localStorage.getItem = () => {
      throw new Error("storage unavailable");
    };
    assert.deepEqual(loadWordProgress(), {});
    globalThis.window.localStorage.setItem = () => {
      throw new Error("storage unavailable");
    };
    assert.equal(saveWordProgress(masteredProgress), false);
  } finally {
    delete globalThis.window;
  }

  assert.match(wordsModule, /useState<WordProgress>\(\{\}\)/);
  assert.match(wordsModule, /useEffect\(\(\) => \{[\s\S]*queueMicrotask\(\(\) => \{[\s\S]*setProgress\(loadWordProgress\(\)\)/);
  assert.doesNotMatch(wordsModule, /useState<WordProgress>\([^)]*loadWordProgress/);
  assert.match(wordsModule, /aria-pressed=\{currentWordState\.favorite\}/);
  assert.match(wordsModule, /aria-pressed=\{currentWordState\.mastered\}/);
  assert.match(wordsModule, />\s*收藏\s*<\/button>/s);
  assert.match(wordsModule, />\s*已掌握\s*<\/button>/s);
  assert.match(css, /\.word-status-actions\s*\{[^}]*grid-template-columns: 1fr 1fr/s);
  assert.match(css, /\.word-status-actions button\s*\{[^}]*min-height: 48px/s);
});

test("keeps the words experience responsive and touch friendly", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.category-grid\s*\{[^}]*grid-template-columns: repeat\(3,/s);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.category-grid\s*\{[^}]*repeat\(2,/);
  assert.match(css, /@media \(max-width: 420px\)/);
  assert.match(css, /\.word-learning\s*\{[^}]*width: min\(700px, 100%\)/s);
  assert.match(css, /\.word-visual\s*\{[^}]*width: min\(100%, 440px\)/s);
  assert.match(css, /\.word-navigation\s*\{[^}]*grid-template-columns: 1fr 1fr/s);
  assert.match(css, /\.word-navigation button,[\s\S]*min-height: 54px/);
});

test("all generated page assets resolve below the GitHub Pages path", async () => {
  const html = await readFile(
    new URL("../dist/client/index.html", import.meta.url),
    "utf8",
  );
  const references = [...html.matchAll(/(?:href|src)="([^"#?]+)"/g)]
    .map((match) => match[1])
    .filter((value) => value.startsWith("/"));

  assert.ok(references.length > 0);

  for (const reference of new Set(references)) {
    assert.ok(
      reference.startsWith(`${pagesBasePath}/`),
      `${reference} must stay inside ${pagesBasePath || "/"}`,
    );
    const outputPath = reference.slice(pagesBasePath.length + 1);
    await access(new URL(`../dist/client/${outputPath}`, import.meta.url));
  }

  await access(new URL("../dist/client/.nojekyll", import.meta.url));
});

test("includes the requested learning content and browser speech support", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const wordsModule = await readFile(new URL("../app/WordsModule.tsx", import.meta.url), "utf8");
  const speech = await readFile(new URL("../app/speech.ts", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  const sentenceScenes = page.match(/scene: "[^"]+"/g) ?? [];
  const dialogueTitles = page.match(/title: "[^"]+"/g) ?? [];
  const speakerButtons = page.match(/<SpeakerButton text=/g) ?? [];

  assert.ok(sentenceScenes.length >= 15, "10 sentences and 5 dialogues each have a scene");
  assert.equal(dialogueTitles.length, 5);
  assert.equal(speakerButtons.length, 2, "reusable speech buttons cover sentence and dialogue lists");
  assert.match(page, /mode: "natural"/);
  assert.match(speech, /new SpeechSynthesisUtterance\(text\)/);
  assert.match(speech, /speechSynthesis\s*\.getVoices\(\)/);
  assert.match(speech, /addEventListener\("voiceschanged"/);
  assert.match(speech, /language\.startsWith\("en-us"\)/);
  assert.match(speech, /language\.startsWith\("en-gb"\)/);
  assert.match(speech, /"samantha"/);
  assert.match(speech, /"ava"/);
  assert.match(speech, /"google us english"/);
  assert.match(speech, /"female"/);
  assert.match(speech, /utterance\.rate = mode === "word" \? 0\.8 : 0\.95/);
  assert.match(speech, /utterance\.pitch = mode === "word" \? 1\.05 : 1/);
  assert.match(speech, /utterance\.volume = 1/);
  assert.match(speech, /speechSynthesis\.speak\(utterance\)/);
  assert.match(speech, /export function speakChinese\(text: string\)/);
  assert.match(speech, /language\.startsWith\("zh-cn"\)/);
  assert.match(speech, /utterance\.lang = voice\?\.lang \?\? "zh-CN"/);
  assert.match(speech, /refreshChineseVoices\(\);[\s\S]*window\.speechSynthesis\.cancel\(\)/);
  assert.match(wordsModule, /className="word-visual"[\s\S]*speakChineseWord\(currentWord\.chinese/);
  assert.match(wordsModule, /className="word-chinese"[\s\S]*speakChineseWord\(currentWord\.chinese/);
  assert.match(wordsModule, /className="word-title-button"[\s\S]*speakWord\(currentWord\.word/);
  assert.match(page, /serviceWorker\.register\(/);
  assert.match(page, /new URL\("sw\.js", appBaseUrl\)/);
  assert.match(page, /scope: appBaseUrl\.pathname/);
  assert.match(page, /type: "CACHE_URLS"/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 420px\)/);
});

test("speaks Chinese with a zh-CN voice and falls back safely", async () => {
  const { prepareEnglishVoices, speakChinese, speakEnglish } = await import("../app/speech.ts");
  const spoken = [];
  let cancelCount = 0;
  let voices = [
    { lang: "en-US", name: "Samantha" },
    { lang: "zh-TW", name: "Ting-Ting" },
    { lang: "zh-CN", name: "Microsoft Xiaoxiao" },
  ];

  class MockSpeechSynthesisUtterance {
    constructor(text) {
      this.text = text;
      this.lang = "";
      this.voice = null;
    }
  }

  globalThis.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => voices,
      addEventListener() {},
      removeEventListener() {},
      cancel() {
        cancelCount += 1;
      },
      speak(utterance) {
        spoken.push(utterance);
      },
    },
  };

  const stopWatchingVoices = prepareEnglishVoices();

  try {
    speakEnglish("apple", { mode: "word" });
    speakChinese("苹果");

    assert.equal(spoken[0].text, "apple");
    assert.equal(spoken[0].lang, "en-US");
    assert.equal(spoken[1].text, "苹果");
    assert.equal(spoken[1].lang, "zh-CN");
    assert.equal(spoken[1].voice.name, "Microsoft Xiaoxiao");

    voices = [{ lang: "en-US", name: "Samantha" }];
    speakChinese("香蕉");

    assert.equal(spoken[2].text, "香蕉");
    assert.equal(spoken[2].lang, "zh-CN");
    assert.equal(spoken[2].voice, null);
    assert.equal(cancelCount, 3, "every new utterance cancels unfinished speech first");
  } finally {
    stopWatchingVoices();
    delete globalThis.window;
    delete globalThis.SpeechSynthesisUtterance;
  }
});

test("provides a valid standalone PWA manifest and install icons", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../public/manifest.json", import.meta.url), "utf8"),
  );

  assert.equal(manifest.name, "轻松英语");
  assert.equal(manifest.short_name, "轻松英语");
  assert.equal(manifest.id, "./");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.theme_color, "#0f513f");
  assert.deepEqual(
    manifest.icons.map((icon) => icon.sizes),
    ["192x192", "512x512"],
  );

  for (const icon of ["icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
    const bytes = await readFile(new URL(`../public/${icon}`, import.meta.url));
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  }

  await Promise.all([
    access(new URL("../dist/client/manifest.json", import.meta.url)),
    access(new URL("../dist/client/sw.js", import.meta.url)),
    access(new URL("../dist/client/icon-192.png", import.meta.url)),
    access(new URL("../dist/client/icon-512.png", import.meta.url)),
  ]);
});

test("service worker caches the app shell and returns the homepage offline", async () => {
  const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
  const listeners = new Map();
  const storedResponses = new Map();

  const normalizeKey = (value) => {
    if (typeof value === "string") return value;
    return new URL(value.url).pathname;
  };

  const cache = {
    async addAll(urls) {
      for (const url of urls) {
        storedResponses.set(url, new Response(`cached:${url}`));
      }
    },
    async add(url) {
      storedResponses.set(normalizeKey(url), new Response(`cached:${normalizeKey(url)}`));
    },
    async put(key, response) {
      storedResponses.set(normalizeKey(key), response);
    },
  };

  const appScope = `https://easy-english.example${pagesBasePath}/`;
  const appHome = `${pagesBasePath}/`;
  const context = vm.createContext({
    URL,
    Promise,
    Response,
    console,
    fetch: async () => new Response("online", { status: 200 }),
    caches: {
      async open() {
        return cache;
      },
      async keys() {
        return ["easy-english-old"];
      },
      async delete() {
        return true;
      },
      async match(key) {
        return storedResponses.get(normalizeKey(key));
      },
    },
    self: {
      location: { origin: "https://easy-english.example" },
      registration: { scope: appScope },
      clients: { claim: async () => undefined },
      skipWaiting() {},
      addEventListener(type, handler) {
        listeners.set(type, handler);
      },
    },
  });

  vm.runInContext(source, context);
  assert.deepEqual(
    [...listeners.keys()].sort(),
    ["activate", "fetch", "install", "message"],
  );

  let installWork;
  listeners.get("install")({ waitUntil(promise) { installWork = promise; } });
  await installWork;
  assert.ok(storedResponses.has(appHome));
  assert.ok(storedResponses.has(`${pagesBasePath}/manifest.json`));

  let onlineResponse;
  listeners.get("fetch")({
    request: {
      method: "GET",
      mode: "navigate",
      url: appScope,
    },
    respondWith(promise) { onlineResponse = promise; },
  });

  assert.equal(await (await onlineResponse).text(), "online");
  assert.equal(
    await storedResponses.get(appHome).clone().text(),
    "online",
    "an online reopen must replace the cached homepage with the latest deployment",
  );

  let messageWork;
  listeners.get("message")({
    data: { type: "CACHE_URLS", urls: ["/app.css", "https://outside.example/no.js"] },
    waitUntil(promise) { messageWork = promise; },
  });
  await messageWork;
  assert.ok(storedResponses.has("/app.css"));
  assert.equal(storedResponses.has("/no.js"), false);

  context.fetch = async () => {
    throw new Error("offline");
  };

  let offlineResponse;
  listeners.get("fetch")({
    request: {
      method: "GET",
      mode: "navigate",
      url: appScope,
    },
    respondWith(promise) { offlineResponse = promise; },
  });

  const response = await offlineResponse;
  assert.equal(await response.text(), "online");
});
