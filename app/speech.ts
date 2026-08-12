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

let englishVoices: SpeechSynthesisVoice[] = [];
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

function watchForVoices() {
  if (isWatchingVoices) return;

  isWatchingVoices = true;
  refreshEnglishVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshEnglishVoices);
}

export function prepareEnglishVoices() {
  if (!("speechSynthesis" in window)) return () => undefined;

  watchForVoices();
  return () => {
    window.speechSynthesis.removeEventListener("voiceschanged", refreshEnglishVoices);
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
