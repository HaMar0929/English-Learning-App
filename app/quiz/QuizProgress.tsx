type QuizProgressProps = {
  current: number;
  total: number;
  streak: number;
};

export default function QuizProgress({
  current,
  total,
  streak,
}: QuizProgressProps) {
  const progress = Math.min((current / total) * 100, 100);

  return (
    <header className="quiz-progress" aria-label={`测验进度：第 ${current} 题，共 ${total} 题`}>
      <div className="quiz-progress-meta">
        <strong>{current} / {total}</strong>
        <span className={streak > 0 ? "quiz-streak active" : "quiz-streak"}>
          <span aria-hidden="true">🔥</span> 连续答对 {streak} 题
        </span>
      </div>
      <div
        className="quiz-progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
