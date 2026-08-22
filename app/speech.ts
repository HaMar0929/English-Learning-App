"use client";

type SpeechMode = "word" | "natural";

type SpeakOptions = {
  mode: SpeechMode;
  onStart?: () => void;
  onEnd?: () => void;
};

const preferredVoiceNames = [
  "samantha",
  "ava",
  "google us english",
  "female",
];

const preferredChineseVoiceNames = [
  "xiaoxiao",
  "huihui",
  "yaoyao",
  "ting-ting",
  "mandarin",
  "普通话",
];

let englishVoices: SpeechSynthesisVoice[] = [];
let chineseVoices: SpeechSynthesisVoice[] = [];
let isWatchingVoices = false;

function isEnglishVoice(voice: SpeechSynthesisVoice) {
  return voice.lang.toLowerCase().startsWith("en");
}

function languagePriority(voice: SpeechSynthesisVoice) {
  const language = voice.lang.toLowerCase();

  if (language.startsWith("en-us")) return 0;
  if (language.startsWith("en-gb")) return 1;
  return 2;
}

function namePriority(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  const preferredIndex = preferredVoiceNames.findIndex((preferredName) =>
    name.includes(preferredName),
  );

  return preferredIndex === -1 ? preferredVoiceNames.length : preferredIndex;
}

function isChineseVoice(voice: SpeechSynthesisVoice) {
  const language = voice.lang.toLowerCase();
  return language.startsWith("zh") || language.startsWith("cmn");
}

function chineseLanguagePriority(voice: SpeechSynthesisVoice) {
  const language = voice.lang.toLowerCase();

  if (language.startsWith("zh-cn") || language.startsWith("cmn-cn")) return 0;
  if (language.startsWith("zh-hans")) return 1;
  return 2;
}

function chineseNamePriority(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  const preferredIndex = preferredChineseVoiceNames.findIndex((preferredName) =>
    name.includes(preferredName),
  );

  return preferredIndex === -1
    ? preferredChineseVoiceNames.length
    : preferredIndex;
}

function refreshEnglishVoices() {
  englishVoices = window.speechSynthesis
    .getVoices()
    .filter(isEnglishVoice)
    .sort((first, second) => {
      return (
        languagePriority(first) - languagePriority(second) ||
        namePriority(first) - namePriority(second)
      );
    });
}

function refreshChineseVoices() {
  chineseVoices = window.speechSynthesis
    .getVoices()
    .filter(isChineseVoice)
    .sort((first, second) => {
      return (
        chineseLanguagePriority(first) - chineseLanguagePriority(second) ||
        chineseNamePriority(first) - chineseNamePriority(second)
      );
    });
}

function watchForVoices() {
  if (isWatchingVoices) return;

  isWatchingVoices = true;
  refreshEnglishVoices();
  refreshChineseVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshEnglishVoices);
  window.speechSynthesis.addEventListener("voiceschanged", refreshChineseVoices);
}

export function prepareEnglishVoices() {
  if (!("speechSynthesis" in window)) return () => undefined;

  watchForVoices();
  return () => {
    window.speechSynthesis.removeEventListener("voiceschanged", refreshEnglishVoices);
    window.speechSynthesis.removeEventListener("voiceschanged", refreshChineseVoices);
    isWatchingVoices = false;
  };
}

export function stopSpeech() {
  window.speechSynthesis?.cancel();
}

export function speakEnglish(text: string, { mode, onStart, onEnd }: SpeakOptions) {
  if (!("speechSynthesis" in window)) return;

  watchForVoices();
  refreshEnglishVoices();
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = englishVoices[0] ?? null;

  utterance.lang = voice?.lang ?? "en-US";
  utterance.voice = voice;
  utterance.rate = mode === "word" ? 0.8 : 0.95;
  utterance.pitch = mode === "word" ? 1.05 : 1;
  utterance.volume = 1;
  utterance.onstart = onStart ?? null;
  utterance.onend = onEnd ?? null;
  utterance.onerror = onEnd ?? null;
  window.speechSynthesis.speak(utterance);
}

export function speakChinese(text: string) {
  if (!("speechSynthesis" in window)) return;

  watchForVoices();
  refreshChineseVoices();
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = chineseVoices[0] ?? null;

  utterance.lang = voice?.lang ?? "zh-CN";
  utterance.voice = voice;
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}
