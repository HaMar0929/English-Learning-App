import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const pagesBasePath = process.env.PAGES_BASE_PATH ?? "";
const deployedUrl = (path) => `${pagesBasePath}${path}`;

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

test("provides all six word categories and 60 independently stored words", async () => {
  const data = await readFile(new URL("../app/data/words.ts", import.meta.url), "utf8");
  const wordsModule = await readFile(new URL("../app/WordsModule.tsx", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  const categoryIds = [...data.matchAll(/id: "(animals|fruits|colors|family|things|body)"/g)]
    .map((match) => match[1]);
  const wordEntries = data.match(/\{ word: "[^"]+", chinese: "[^"]+", emoji: "[^"]*"/g) ?? [];

  assert.deepEqual(categoryIds, ["animals", "fruits", "colors", "family", "things", "body"]);
  assert.equal(wordEntries.length, 60);
  assert.match(data, /image: item\.image \?\? null/);
  assert.match(data, /type: item\.type \?\? "emoji"/);
  assert.match(data, /type: "color"/);
  assert.match(page, /type Section = "sentences" \| "dialogues" \| "words"/);
  assert.match(wordsModule, /window\.speechSynthesis\.cancel\(\)/);
  assert.match(wordsModule, /utterance\.lang = "en-US"/);
  assert.match(wordsModule, /onClick=\{\(\) => speakWord\(currentWord\.word/);
  assert.match(wordsModule, /wordIndex === category\.words\.length - 1/);
  assert.match(wordsModule, /setView\("complete"\)/);
  assert.match(wordsModule, /返回单词分类/);
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
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  const sentenceScenes = page.match(/scene: "[^"]+"/g) ?? [];
  const dialogueTitles = page.match(/title: "[^"]+"/g) ?? [];
  const speakerButtons = page.match(/<SpeakerButton text=/g) ?? [];

  assert.ok(sentenceScenes.length >= 15, "10 sentences and 5 dialogues each have a scene");
  assert.equal(dialogueTitles.length, 5);
  assert.equal(speakerButtons.length, 2, "reusable speech buttons cover sentence and dialogue lists");
  assert.match(page, /SpeechSynthesisUtterance/);
  assert.match(page, /speechSynthesis\.speak/);
  assert.match(page, /utterance\.rate = 0\.82/);
  assert.match(page, /serviceWorker\.register\(/);
  assert.match(page, /new URL\("sw\.js", appBaseUrl\)/);
  assert.match(page, /scope: appBaseUrl\.pathname/);
  assert.match(page, /type: "CACHE_URLS"/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 420px\)/);
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
  assert.equal(await response.text(), `cached:${appHome}`);
});
