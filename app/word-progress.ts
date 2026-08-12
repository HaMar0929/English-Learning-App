"use client";

export type WordLearningState = {
  favorite: boolean;
  mastered: boolean;
};

export type WordProgress = Record<string, WordLearningState>;

type WordProgressField = keyof WordLearningState;

const STORAGE_KEY = "english-learning-word-progress-v1";

const emptyWordState: WordLearningState = {
  favorite: false,
  mastered: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseWordProgress(value: string | null): WordProgress {
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).flatMap(([wordId, state]) => {
        if (!isRecord(state)) return [];

        return [[
          wordId,
          {
            favorite: state.favorite === true,
            mastered: state.mastered === true,
          },
        ]];
      }),
    );
  } catch {
    return {};
  }
}

export function loadWordProgress(): WordProgress {
  if (typeof window === "undefined") return {};

  try {
    return parseWordProgress(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return {};
  }
}

export function saveWordProgress(progress: WordProgress) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function getWordLearningState(
  progress: WordProgress,
  wordId: string,
): WordLearningState {
  return progress[wordId] ?? emptyWordState;
}

export function toggleWordProgress(
  progress: WordProgress,
  wordId: string,
  field: WordProgressField,
): WordProgress {
  const current = getWordLearningState(progress, wordId);

  return {
    ...progress,
    [wordId]: {
      ...current,
      [field]: !current[field],
    },
  };
}
