"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { wordCategories, type WordCategory, type WordItem } from "./data/words";
import { speakEnglish, stopSpeech as cancelSpeech } from "./speech";

type WordsView = "categories" | "learning" | "complete";

function speakWord(word: string, onSpeakingChange: (speaking: boolean) => void) {
  speakEnglish(word, {
    mode: "word",
    onStart: () => onSpeakingChange(true),
    onEnd: () => onSpeakingChange(false),
  });
}

function WordVisual({ item }: { item: WordItem }) {
  if (item.type === "color") {
    return (
      <div
        className={`word-color-swatch${item.word === "white" ? " light" : ""}`}
        style={{ backgroundColor: item.color }}
        role="img"
        aria-label={`${item.chinese}色块`}
      />
    );
  }

  if (item.image) {
    return (
      <div
        className="word-image"
        style={{ backgroundImage: `url(${item.image})` }}
        role="img"
        aria-label={item.chinese}
      />
    );
  }

  return (
    <span className="word-emoji" role="img" aria-label={item.chinese}>
      {item.emoji}
    </span>
  );
}

export default function WordsModule() {
  const [view, setView] = useState<WordsView>("categories");
  const [category, setCategory] = useState<WordCategory | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => cancelSpeech();
  }, []);

  function stopSpeech() {
    cancelSpeech();
    setIsSpeaking(false);
  }

  function startCategory(nextCategory: WordCategory) {
    stopSpeech();
    setCategory(nextCategory);
    setWordIndex(0);
    setView("learning");
  }

  function returnToCategories() {
    stopSpeech();
    setView("categories");
    setCategory(null);
    setWordIndex(0);
  }

  function showPrevious() {
    stopSpeech();
    setWordIndex((current) => Math.max(0, current - 1));
  }

  function showNext() {
    if (!category) return;
    stopSpeech();
    if (wordIndex === category.words.length - 1) {
      setView("complete");
      return;
    }
    setWordIndex((current) => current + 1);
  }

  if (view === "categories") {
    return (
      <section className="words-section" aria-labelledby="words-heading">
        <div className="section-heading words-heading">
          <div>
            <p className="section-kicker">WORDS</p>
            <h2 id="words-heading">单词学习</h2>
          </div>
          <p>选择一个喜欢的分类，一次学一个单词。</p>
        </div>

        <div className="category-grid">
          {wordCategories.map((item) => (
            <button
              className="category-card"
              key={item.id}
              type="button"
              onClick={() => startCategory(item)}
              style={{ "--category-color": item.color } as CSSProperties}
              aria-label={`学习${item.nameZh}单词，${item.words.length}个`}
            >
              <span className="category-icon" aria-hidden="true">{item.emoji}</span>
              <span className="category-copy">
                <strong>{item.nameZh}</strong>
                <span>{item.name}</span>
              </span>
              <span className="category-total">{item.words.length} 个</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  if (!category) return null;

  if (view === "complete") {
    return (
      <section className="completion-card" aria-labelledby="completion-heading">
        <div className="completion-confetti" aria-hidden="true">🎉</div>
        <p className="completion-kicker">GOOD JOB!</p>
        <h2 id="completion-heading">太棒了！</h2>
        <p className="completion-message">
          <strong>{category.name}</strong> 学习完成
        </p>
        <div className="completion-actions">
          <button type="button" className="word-primary-button" onClick={() => startCategory(category)}>
            再学一次
          </button>
          <button type="button" className="word-secondary-button" onClick={returnToCategories}>
            返回单词分类
          </button>
        </div>
      </section>
    );
  }

  const currentWord = category.words[wordIndex];

  return (
    <section className="word-learning" aria-labelledby="current-word">
      <header className="word-learning-header">
        <div>
          <p>{category.nameZh}</p>
          <h2>{category.name}</h2>
        </div>
        <span className="word-progress" aria-label={`第 ${wordIndex + 1} 个，共 ${category.words.length} 个`}>
          {wordIndex + 1} / {category.words.length}
        </span>
      </header>

      <article className="word-study-card">
        <div className="word-visual" style={{ "--category-color": category.color } as CSSProperties}>
          <WordVisual item={currentWord} />
        </div>
        <button
          id="current-word"
          className="word-title-button"
          type="button"
          onClick={() => speakWord(currentWord.word, setIsSpeaking)}
          aria-label={`播放发音：${currentWord.word}`}
        >
          {currentWord.word}
          <span aria-hidden="true">🔊</span>
        </button>
        <p className="word-chinese">{currentWord.chinese}</p>
        <button
          className="word-speak-button"
          type="button"
          onClick={() => speakWord(currentWord.word, setIsSpeaking)}
        >
          <span aria-hidden="true">{isSpeaking ? "🔉" : "🔊"}</span>
          {isSpeaking ? "正在播放" : "听发音"}
        </button>
      </article>

      <div className="word-navigation">
        <button type="button" onClick={showPrevious} disabled={wordIndex === 0}>
          <span aria-hidden="true">◀</span> 上一个
        </button>
        <button type="button" className="next" onClick={showNext}>
          {wordIndex === category.words.length - 1 ? "完成" : "下一个"} <span aria-hidden="true">▶</span>
        </button>
      </div>
      <button type="button" className="back-to-categories" onClick={returnToCategories}>
        返回分类
      </button>
    </section>
  );
}
