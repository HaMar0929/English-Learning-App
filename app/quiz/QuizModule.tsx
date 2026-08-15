"use client";

import { useEffect, useRef, useState } from "react";
import { speakEnglish, stopSpeech } from "../speech";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import {
  createQuizRound,
  type QuizAnswerResult,
  type QuizQuestionData,
} from "./quiz-logic";

type QuizModuleProps = {
  onReturnToLearning: () => void;
};

export default function QuizModule({ onReturnToLearning }: QuizModuleProps) {
  const [questions, setQuestions] = useState<QuizQuestionData[]>(() => createQuizRound());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
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

  useEffect(() => {
    return () => {
      clearFeedbackTimer();
      stopSpeech();
    };
  }, []);

  function playWord(word: string) {
    speakEnglish(word, { mode: "word" });
  }

  function goToNextQuestion() {
    clearFeedbackTimer();
    stopSpeech();
    setSelectedAnswer(null);

    if (questionIndex === questions.length - 1) {
      setIsComplete(true);
      return;
    }

    setQuestionIndex((current) => current + 1);
  }

  function answerQuestion(answer: string) {
    if (selectedAnswer !== null) return;

    const currentQuestion = questions[questionIndex];
    const correct = answer === currentQuestion.word.word;

    setSelectedAnswer(answer);
    setResults((current) => [
      ...current,
      {
        word: currentQuestion.word,
        selectedAnswer: answer,
        correct,
      },
    ]);

    if (correct) {
      setStreak((current) => current + 1);
      playWord(currentQuestion.word.word);
      feedbackTimer.current = setTimeout(goToNextQuestion, 1100);
    } else {
      setStreak(0);
    }
  }

  function restartQuiz() {
    clearFeedbackTimer();
    stopSpeech();
    setQuestions(createQuizRound());
    setQuestionIndex(0);
    setSelectedAnswer(null);
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
    <section className="quiz-module" aria-label="单词小测验">
      <div className="quiz-heading">
        <div>
          <p className="section-kicker">WORD QUIZ</p>
          <h2>单词小测验</h2>
        </div>
        <button type="button" onClick={returnToLearning}>返回学习</button>
      </div>
      <QuizProgress
        current={questionIndex + 1}
        total={questions.length}
        streak={streak}
      />
      <QuizQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        onAnswer={answerQuestion}
        onReplay={() => playWord(currentQuestion.word.word)}
        onContinue={goToNextQuestion}
        isLastQuestion={questionIndex === questions.length - 1}
      />
    </section>
  );
}
