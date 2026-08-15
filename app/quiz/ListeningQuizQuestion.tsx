import type { ListeningQuizQuestionData, QuizWord } from "./quiz-logic";

type ListeningQuizQuestionProps = {
  question: ListeningQuizQuestionData;
  selectedAnswerId: string | null;
  onAnswer: (answer: QuizWord) => void;
  onReplay: () => void;
  onContinue: () => void;
  isLastQuestion: boolean;
};

function imageOptionClassName(
  answerId: string,
  correctAnswerId: string,
  selectedAnswerId: string | null,
) {
  if (selectedAnswerId === null) return "listening-image-option";
  if (answerId === correctAnswerId) return "listening-image-option correct-answer";
  if (answerId === selectedAnswerId) return "listening-image-option selected-mistake";
  return "listening-image-option muted-answer";
}

export default function ListeningQuizQuestion({
  question,
  selectedAnswerId,
  onAnswer,
  onReplay,
  onContinue,
  isLastQuestion,
}: ListeningQuizQuestionProps) {
  const correctAnswer = question.word;
  const isCorrect = selectedAnswerId === correctAnswer.id;

  return (
    <article className="quiz-question-card listening-question-card" aria-labelledby="listening-question-heading">
      <div className="listening-question-prompt">
        <span aria-hidden="true">👂</span>
        <h2 id="listening-question-heading">听一听，选出正确图片</h2>
      </div>

      <button className="listening-replay-button" type="button" onClick={onReplay}>
        🔊 再听一次
      </button>

      <div className="listening-image-options" aria-label="请选择正确图片">
        {question.options.map((answer, index) => (
          <button
            className={imageOptionClassName(answer.id, correctAnswer.id, selectedAnswerId)}
            type="button"
            key={answer.id}
            onClick={() => onAnswer(answer)}
            disabled={selectedAnswerId !== null}
            aria-label={`图片选项 ${index + 1}`}
          >
            {/* Answer text stays hidden until feedback is shown. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={answer.image}
              alt=""
              width="640"
              height="640"
              decoding="async"
            />
            {selectedAnswerId !== null && answer.id === correctAnswer.id && (
              <span className="listening-option-mark" aria-hidden="true">✅</span>
            )}
            {selectedAnswerId !== null &&
              answer.id === selectedAnswerId &&
              answer.id !== correctAnswer.id && (
                <span className="listening-option-mark" aria-hidden="true">❌</span>
              )}
          </button>
        ))}
      </div>

      <div className="quiz-feedback listening-feedback" aria-live="polite">
        {selectedAnswerId !== null && (
          <div className={isCorrect ? "quiz-feedback-message correct" : "quiz-feedback-message try-again"}>
            <span className="quiz-feedback-icon" aria-hidden="true">{isCorrect ? "✅" : "❌"}</span>
            {isCorrect && <strong>答对啦！</strong>}
            <div className="listening-answer-reveal">
              <strong lang="en">{correctAnswer.word}</strong>
              <span>{correctAnswer.chinese}</span>
              <small lang="en">{correctAnswer.phonetic}</small>
            </div>
            {!isCorrect && (
              <div className="quiz-feedback-actions">
                <button type="button" onClick={onReplay}>🔊 再听一次</button>
                <button className="next" type="button" onClick={onContinue}>
                  {isLastQuestion ? "看看成绩" : "下一题"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
