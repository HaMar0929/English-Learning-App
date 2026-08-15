import type { QuizQuestionData } from "./quiz-logic";

type QuizQuestionProps = {
  question: QuizQuestionData;
  selectedAnswer: string | null;
  onAnswer: (answer: string) => void;
  onReplay: () => void;
  onContinue: () => void;
  isLastQuestion: boolean;
};

function answerClassName(
  answer: string,
  correctAnswer: string,
  selectedAnswer: string | null,
) {
  if (selectedAnswer === null) return "quiz-answer-button";
  if (answer === correctAnswer) return "quiz-answer-button correct-answer";
  if (answer === selectedAnswer) return "quiz-answer-button selected-mistake";
  return "quiz-answer-button muted-answer";
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  onReplay,
  onContinue,
  isLastQuestion,
}: QuizQuestionProps) {
  const correctAnswer = question.word.word;
  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <article className="quiz-question-card" aria-labelledby="quiz-question-heading">
      <h2 id="quiz-question-heading">这是什么单词？</h2>
      <div className="quiz-picture">
        {/* Existing local WebP assets are used directly and remain Pages-path safe. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={question.word.image}
          alt={question.word.chinese}
          width="640"
          height="640"
          decoding="async"
        />
      </div>

      <div className="quiz-answers" aria-label="请选择英文答案">
        {question.options.map((answer) => (
          <button
            className={answerClassName(answer, correctAnswer, selectedAnswer)}
            type="button"
            lang="en"
            key={answer}
            onClick={() => onAnswer(answer)}
            disabled={selectedAnswer !== null}
          >
            {answer}
          </button>
        ))}
      </div>

      <div className="quiz-feedback" aria-live="polite">
        {selectedAnswer !== null && isCorrect ? (
          <div className="quiz-feedback-message correct">
            <span className="quiz-feedback-icon" aria-hidden="true">✅</span>
            <strong>答对啦！</strong>
          </div>
        ) : selectedAnswer !== null ? (
          <div className="quiz-feedback-message try-again">
            <span className="quiz-feedback-icon" aria-hidden="true">❌</span>
            <p>正确答案是 <strong lang="en">{correctAnswer}</strong></p>
            <div className="quiz-feedback-actions">
              <button type="button" onClick={onReplay}>🔊 再听一次</button>
              <button className="next" type="button" onClick={onContinue}>
                {isLastQuestion ? "看看成绩" : "下一题"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
