import type { QuizAnswerResult } from "./quiz-logic";
import { countCorrectAnswers, getQuizEncouragement } from "./quiz-logic";

type QuizResultProps = {
  results: QuizAnswerResult[];
  onRestart: () => void;
  onReturnToLearning: () => void;
  onSpeak: (word: string) => void;
};

export default function QuizResult({
  results,
  onRestart,
  onReturnToLearning,
  onSpeak,
}: QuizResultProps) {
  const correctAnswers = countCorrectAnswers(results);
  const incorrectAnswers = results.filter((result) => !result.correct);

  return (
    <section className="quiz-result" aria-labelledby="quiz-result-heading">
      <div className="quiz-result-summary">
        <span className="quiz-result-icon" aria-hidden="true">🎉</span>
        <p className="completion-kicker">QUIZ COMPLETE</p>
        <h2 id="quiz-result-heading">本轮完成！</h2>
        <p className="quiz-score">答对 <strong>{correctAnswers}</strong> / {results.length}</p>
        <p className="quiz-encouragement">{getQuizEncouragement(correctAnswers)}</p>
        <div className="quiz-result-actions">
          <button className="word-primary-button" type="button" onClick={onRestart}>
            再玩一次
          </button>
          <button className="word-secondary-button" type="button" onClick={onReturnToLearning}>
            返回学习
          </button>
        </div>
      </div>

      {incorrectAnswers.length > 0 && (
        <section className="quiz-review" aria-labelledby="quiz-review-heading">
          <div className="quiz-review-heading">
            <div>
              <p className="section-kicker">REVIEW</p>
              <h3 id="quiz-review-heading">这几个再看看</h3>
            </div>
            <span>{incorrectAnswers.length} 个</span>
          </div>
          <div className="quiz-review-grid">
            {incorrectAnswers.map(({ word }) => (
              <article className="quiz-review-card" key={word.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={word.image}
                  alt={word.chinese}
                  width="640"
                  height="640"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <strong lang="en">{word.word}</strong>
                  <span>{word.chinese}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSpeak(word.word)}
                  aria-label={`播放发音：${word.word}`}
                >
                  🔊 <span>发音</span>
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
