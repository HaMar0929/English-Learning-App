"use client";

import { useEffect, useRef, useState } from "react";
import { speakEnglish, stopSpeech } from "../speech";
import ListeningQuizQuestion from "./ListeningQuizQuestion";
import QuizProgress from "./QuizProgress";
import QuizResult from "./QuizResult";
import {
  createListeningQuizRound,
  type ListeningQuizQuestionData,
  type QuizAnswerResult,
  type QuizWord,
} from "./quiz-logic";

type ListeningQuizModuleProps = {
  onReturnToLearning: () => void;
};

export default function ListeningQuizModule({ onReturnToLearning }: ListeningQuizModuleProps) {
  const [questions, setQuestions] = useState<ListeningQuizQuestionData[]>(() => createListeningQuizRound());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [results, setResults] = useState<QuizAnswerResult[]>([]);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearFeedbackTimer() {
    if (feedbackTimer.current !== null) {
      clearTimeout(feedbackTimer.current);
      feedbackTimer.current = null;
    }
  }

  function playWord(word: string) {
    speakEnglish(word, { mode: "word" });
  }

  useEffect(() => {
    if (isComplete) return;

    const word = questions[questionIndex]?.word.word;
    if (!word) return;

    const autoplayTimer = window.setTimeout(() => playWord(word), 180);

    return () => {
      window.clearTimeout(autoplayTimer);
      stopSpeech();
    };
  }, [isComplete, questionIndex, questions]);

  useEffect(() => {
    return () => {
      clearFeedbackTimer();
      stopSpeech();
    };
  }, []);

  function goToNextQuestion() {
    clearFeedbackTimer();
    stopSpeech();
    setSelectedAnswerId(null);

    if (questionIndex === questions.length - 1) {
      setIsComplete(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
  }

  function answerQuestion(answer: QuizWord) {
    if (selectedAnswerId !== null) return;

    const currentQuestion = questions[questionIndex];
    const correct = answer.id === currentQuestion.word.id;

    setSelectedAnswerId(answer.id);
    setResults((current) => [
      ...current,
      {
        word: currentQuestion.word,
        selectedAnswer: answer.word,
        correct,
      },
    ]);

    if (correct) {
      setStreak((current) => current + 1);
      playWord(currentQuestion.word.word);
      feedbackTimer.current = setTimeout(goToNextQuestion, 1300);
    } else {
      setStreak(0);
    }
  }

  function restartQuiz() {
    clearFeedbackTimer();
    stopSpeech();
    setQuestions(createListeningQuizRound());
    setQuestionIndex(0);
    setSelectedAnswerId(null);
    setResults([]);
    setStreak(0);
    setIsComplete(false);
  }

  function returnToLearning() {
    clearFeedbackTimer();
    stopSpeech();
    onReturnToLearning();
  }

  if (isComplete) {
    return (
      <QuizResult
        results={results}
        onRestart={restartQuiz}
        onReturnToLearning={returnToLearning}
        onSpeak={playWord}
      />
    );
  }

  const currentQuestion = questions[questionIndex];

  return (
    <section className="quiz-module listening-quiz-module" aria-label="听音选图">
      <div className="quiz-heading">
        <div>
          <p className="section-kicker">LISTEN &amp; CHOOSE</p>
          <h2>听音选图</h2>
        </div>
        <button type="button" onClick={returnToLearning}>返回学习</button>
      </div>
      <QuizProgress
        current={questionIndex + 1}
        total={questions.length}
        streak={streak}
      />
      <ListeningQuizQuestion
        question={currentQuestion}
        selectedAnswerId={selectedAnswerId}
        onAnswer={answerQuestion}
        onReplay={() => playWord(currentQuestion.word.word)}
        onContinue={goToNextQuestion}
        isLastQuestion={questionIndex === questions.length - 1}
      />
    </section>
  );
}
