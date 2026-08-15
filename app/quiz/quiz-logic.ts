import { wordCategories, type WordItem } from "../data/words.ts";

export const QUIZ_LENGTH = 10;
export const QUIZ_OPTION_COUNT = 3;

export type QuizWord = WordItem & { image: string };

export type QuizQuestionData = {
  id: string;
  word: QuizWord;
  options: string[];
};

export type QuizAnswerResult = {
  word: QuizWord;
  selectedAnswer: string;
  correct: boolean;
};

type RandomSource = () => number;

function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function getImageQuizWords(): QuizWord[] {
  return wordCategories
    .flatMap((category) => category.words)
    .filter((word): word is QuizWord => typeof word.image === "string");
}

export function createQuizRound(
  sourceWords: readonly QuizWord[] = getImageQuizWords(),
  random: RandomSource = Math.random,
): QuizQuestionData[] {
  const uniqueWords = [...new Map(sourceWords.map((word) => [word.id, word])).values()];
  const uniqueAnswerWords = [
    ...new Map(sourceWords.map((word) => [word.word, word])).values(),
  ];

  if (uniqueWords.length < QUIZ_LENGTH) {
    throw new Error(`A quiz round needs at least ${QUIZ_LENGTH} image words.`);
  }

  if (uniqueAnswerWords.length < QUIZ_OPTION_COUNT) {
    throw new Error(`A quiz question needs ${QUIZ_OPTION_COUNT} unique answers.`);
  }

  return shuffle(uniqueWords, random)
    .slice(0, QUIZ_LENGTH)
    .map((word) => {
      const wrongAnswers = shuffle(
        uniqueAnswerWords.filter((candidate) => candidate.word !== word.word),
        random,
      )
        .slice(0, QUIZ_OPTION_COUNT - 1)
        .map((candidate) => candidate.word);

      return {
        id: word.id,
        word,
        options: shuffle([word.word, ...wrongAnswers], random),
      };
    });
}

export function countCorrectAnswers(results: readonly QuizAnswerResult[]): number {
  return results.filter((result) => result.correct).length;
}

export function getQuizEncouragement(correctAnswers: number): string {
  if (correctAnswers === QUIZ_LENGTH) return "太棒啦！🌟";
  if (correctAnswers >= 8) return "真厉害！👏";
  if (correctAnswers >= 5) return "继续加油！💪";
  return "再玩一次吧！😊";
}
