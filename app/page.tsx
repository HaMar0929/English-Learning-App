"use client";

import { useEffect, useState } from "react";
import ListeningQuizModule from "./quiz/ListeningQuizModule";
import QuizModule from "./quiz/QuizModule";
import WordsModule from "./WordsModule";
import { prepareEnglishVoices, speakEnglish, stopSpeech } from "./speech";

export const dynamic = "force-static";

type Section = "sentences" | "dialogues" | "words" | "quiz" | "listening";

type Sentence = {
  english: string;
  chinese: string;
  scene: string;
};

type DialogueLine = {
  speaker: "A" | "B";
  english: string;
  chinese: string;
};

type Dialogue = {
  title: string;
  scene: string;
  lines: DialogueLine[];
};

const sentences: Sentence[] = [
  {
    english: "Good morning!",
    chinese: "早上好！",
    scene: "早晨见到家人、朋友或同事时。",
  },
  {
    english: "How are you?",
    chinese: "你好吗？",
    scene: "见面后简单问候对方。",
  },
  {
    english: "I'm fine, thank you.",
    chinese: "我很好，谢谢你。",
    scene: "回应别人对你的问候。",
  },
  {
    english: "Nice to meet you.",
    chinese: "很高兴认识你。",
    scene: "第一次与别人见面时。",
  },
  {
    english: "Could you help me?",
    chinese: "你能帮帮我吗？",
    scene: "礼貌地请求别人帮助。",
  },
  {
    english: "How much is this?",
    chinese: "这个多少钱？",
    scene: "在商店询问商品价格。",
  },
  {
    english: "Where is the restroom?",
    chinese: "洗手间在哪里？",
    scene: "在商场、餐厅或车站问路。",
  },
  {
    english: "I'd like a cup of coffee, please.",
    chinese: "请给我一杯咖啡。",
    scene: "在咖啡店或餐厅点单。",
  },
  {
    english: "See you tomorrow.",
    chinese: "明天见。",
    scene: "告别并约定第二天再见。",
  },
  {
    english: "Have a nice day!",
    chinese: "祝你今天愉快！",
    scene: "结束交谈时送上友好祝福。",
  },
];

const dialogues: Dialogue[] = [
  {
    title: "见面问候",
    scene: "在学校或公司遇见朋友",
    lines: [
      { speaker: "A", english: "Hi! How are you?", chinese: "嗨！你好吗？" },
      { speaker: "B", english: "I'm good, thanks. And you?", chinese: "我很好，谢谢。你呢？" },
      { speaker: "A", english: "I'm great!", chinese: "我也很好！" },
    ],
  },
  {
    title: "咖啡店点单",
    scene: "在咖啡店买饮品",
    lines: [
      { speaker: "A", english: "What would you like?", chinese: "您想要什么？" },
      { speaker: "B", english: "A cup of coffee, please.", chinese: "请给我一杯咖啡。" },
      { speaker: "A", english: "Sure. Anything else?", chinese: "好的。还需要别的吗？" },
      { speaker: "B", english: "No, thank you.", chinese: "不用了，谢谢。" },
    ],
  },
  {
    title: "询问时间",
    scene: "向身边的人询问时间",
    lines: [
      { speaker: "A", english: "Excuse me, what time is it?", chinese: "打扰一下，现在几点？" },
      { speaker: "B", english: "It's three o'clock.", chinese: "现在三点。" },
      { speaker: "A", english: "Thank you!", chinese: "谢谢！" },
      { speaker: "B", english: "You're welcome.", chinese: "不客气。" },
    ],
  },
  {
    title: "商店购物",
    scene: "在服装店挑选衣服",
    lines: [
      { speaker: "A", english: "Can I help you?", chinese: "需要我帮忙吗？" },
      { speaker: "B", english: "Yes. How much is this shirt?", chinese: "需要。这件衬衫多少钱？" },
      { speaker: "A", english: "It's twenty dollars.", chinese: "二十美元。" },
      { speaker: "B", english: "I'll take it.", chinese: "我要了。" },
    ],
  },
  {
    title: "告别回家",
    scene: "一天结束后与朋友告别",
    lines: [
      { speaker: "A", english: "I have to go home now.", chinese: "我现在得回家了。" },
      { speaker: "B", english: "Okay. See you tomorrow!", chinese: "好的。明天见！" },
      { speaker: "A", english: "See you. Have a nice evening!", chinese: "再见。祝你晚上愉快！" },
    ],
  },
];

function SpeakerButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  function speak() {
    speakEnglish(text, {
      mode: "natural",
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }

  return (
    <button
      className="speaker-button"
      type="button"
      onClick={speak}
      aria-label={`播放发音：${text}`}
      title="播放英文发音"
    >
      <span aria-hidden="true" className="speaker-icon">
        {isSpeaking ? "◼" : "▶"}
      </span>
      {isSpeaking ? "正在播放" : "播放发音"}
    </button>
  );
}

export default function Home() {
  const [section, setSection] = useState<Section>("sentences");

  useEffect(() => prepareEnglishVoices(), []);

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let cancelled = false;

    async function prepareOfflineUse() {
      const appBaseUrl = new URL(".", document.baseURI);
      const registration = await navigator.serviceWorker.register(
        new URL("sw.js", appBaseUrl),
        {
          scope: appBaseUrl.pathname,
        },
      );
      await navigator.serviceWorker.ready;

      if (cancelled || !registration.active) return;

      const loadedResources = performance
        .getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => new URL(url).origin === window.location.origin);

      registration.active.postMessage({
        type: "CACHE_URLS",
        urls: [window.location.href, ...loadedResources],
      });
    }

    prepareOfflineUse().catch((error) => {
      console.warn("离线缓存准备失败：", error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function selectSection(nextSection: Section) {
    stopSpeech();
    setSection(nextSection);
  }

  return (
    <main>
      <header className="hero">
        <div className="hero-inner">
          <div className="brand-mark" aria-hidden="true">Aa</div>
          <div>
            <p className="eyebrow">Everyday English · 日常英语</p>
            <h1>轻松开口说英语</h1>
            <p className="hero-copy">从简单、实用的句子开始。看翻译，听发音，跟着读一遍。</p>
          </div>
        </div>
      </header>

      <div className="page-shell">
        <nav className="tabs" aria-label="学习内容切换">
          <button
            type="button"
            className={section === "sentences" ? "tab active" : "tab"}
            onClick={() => selectSection("sentences")}
            aria-pressed={section === "sentences"}
          >
            <span className="tab-label">英语句子</span>
            <span className="tab-count">10 句</span>
          </button>
          <button
            type="button"
            className={section === "dialogues" ? "tab active" : "tab"}
            onClick={() => selectSection("dialogues")}
            aria-pressed={section === "dialogues"}
          >
            <span className="tab-label">简单对话</span>
            <span className="tab-count">5 组</span>
          </button>
          <button
            type="button"
            className={section === "words" ? "tab words-tab active" : "tab words-tab"}
            onClick={() => selectSection("words")}
            aria-pressed={section === "words"}
          >
            <span className="tab-icon" aria-hidden="true">🔤</span>
            <span className="tab-label">单词学习 <small>Words</small></span>
            <span className="tab-count">160 词</span>
          </button>
          <button
            type="button"
            className={section === "quiz" ? "tab quiz-tab active" : "tab quiz-tab"}
            onClick={() => selectSection("quiz")}
            aria-pressed={section === "quiz"}
          >
            <span className="tab-icon" aria-hidden="true">🎯</span>
            <span className="tab-label">单词小测验 <small>Quiz</small></span>
            <span className="tab-count">10 题</span>
          </button>
          <button
            type="button"
            className={section === "listening" ? "tab listening-tab active" : "tab listening-tab"}
            onClick={() => selectSection("listening")}
            aria-pressed={section === "listening"}
          >
            <span className="tab-icon" aria-hidden="true">🔊</span>
            <span className="tab-label">听音选图 <small>Listen</small></span>
            <span className="tab-count">10 题</span>
          </button>
        </nav>

        {section === "listening" ? (
          <ListeningQuizModule onReturnToLearning={() => selectSection("words")} />
        ) : section === "quiz" ? (
          <QuizModule onReturnToLearning={() => selectSection("words")} />
        ) : section === "words" ? (
          <WordsModule />
        ) : section === "sentences" ? (
          <section aria-labelledby="sentences-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">DAILY SENTENCES</p>
                <h2 id="sentences-heading">常用英语句子</h2>
              </div>
              <p>点击播放，听清楚后跟读 2～3 遍。</p>
            </div>

            <div className="sentence-grid">
              {sentences.map((sentence, index) => (
                <article className="sentence-card" key={sentence.english}>
                  <div className="card-topline">
                    <span className="number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="scene-label">使用场景</span>
                  </div>
                  <p className="english">{sentence.english}</p>
                  <p className="chinese">{sentence.chinese}</p>
                  <p className="scene">{sentence.scene}</p>
                  <SpeakerButton text={sentence.english} />
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section aria-labelledby="dialogues-heading">
            <div className="section-heading">
              <div>
                <p className="section-kicker">MINI DIALOGUES</p>
                <h2 id="dialogues-heading">简单日常对话</h2>
              </div>
              <p>先听单句，再分别扮演 A 和 B 练习。</p>
            </div>

            <div className="dialogue-list">
              {dialogues.map((dialogue, index) => (
                <article className="dialogue-card" key={dialogue.title}>
                  <header className="dialogue-header">
                    <span className="dialogue-number">对话 {index + 1}</span>
                    <div>
                      <h3>{dialogue.title}</h3>
                      <p>{dialogue.scene}</p>
                    </div>
                  </header>
                  <div className="dialogue-lines">
                    {dialogue.lines.map((line, lineIndex) => (
                      <div className={`dialogue-line speaker-${line.speaker.toLowerCase()}`} key={`${line.english}-${lineIndex}`}>
                        <span className="speaker-badge" aria-label={`角色 ${line.speaker}`}>{line.speaker}</span>
                        <div className="line-copy">
                          <p className="dialogue-english">{line.english}</p>
                          <p className="dialogue-chinese">{line.chinese}</p>
                        </div>
                        <SpeakerButton text={line.english} />
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <footer>
          <p>每天练习一点点，开口会越来越自然。</p>
        </footer>
      </div>
    </main>
  );
}
