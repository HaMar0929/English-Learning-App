import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the English learning homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>轻松英语 \| 日常英语入门<\/title>/);
  assert.match(html, /轻松开口说英语/);
  assert.match(html, /英语句子/);
  assert.match(html, /简单对话/);
  assert.match(html, /Good morning!/);
  assert.match(html, /Have a nice day!/);
  assert.match(html, /播放发音/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
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
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /@media \(max-width: 420px\)/);
});
