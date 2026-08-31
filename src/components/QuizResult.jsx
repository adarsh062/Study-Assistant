import React from 'react';
import Button from './Button';

/**
 * QuizResult component.
 * Displays final score summary, performance percentage, missed question analysis,
 * and retry/study navigation actions.
 *
 * @param {Object} props
 * @param {number} props.score - Number of correctly answered questions
 * @param {number} props.totalQuestions - Total questions in this round
 * @param {Array<Object>} props.wrongQuestions - List of question items answered incorrectly
 * @param {() => void} props.onRetryWrong - Handler to retry only incorrect questions
 * @param {() => void} props.onRestartFull - Handler to restart entire quiz
 * @param {() => void} props.onStudyFlashcards - Handler to navigate to flashcards mode
 */
export default function QuizResult({
  score,
  totalQuestions,
  wrongQuestions = [],
  onRetryWrong,
  onRestartFull,
  onStudyFlashcards,
}) {
  const safeTotal = Math.max(1, totalQuestions || 1);
  const percentage = Math.round((score / safeTotal) * 100);
  const wrongCount = wrongQuestions.length;
  const isPerfectScore = score === safeTotal && wrongCount === 0;

  return (
    <div className="quiz-result-container" aria-label="Quiz Results Summary">
      {/* Result Hero Header */}
      <div className="quiz-result-hero">
        <div className="result-score-circle">
          <span className="result-score-num">{score}</span>
          <span className="result-score-divider">/</span>
          <span className="result-score-total">{safeTotal}</span>
        </div>

        <div className="result-score-details">
          <span className="result-percentage-badge">{percentage}% Score</span>
          <h3 className="result-headline">
            {isPerfectScore
              ? '🎉 Outstanding! Perfect Score!'
              : percentage >= 70
              ? '👏 Great Job! Solid Understanding.'
              : '📚 Good Practice! Keep Going.'}
          </h3>

          <p className="result-subhead">
            {isPerfectScore ? (
              <span className="text-success-bold">Perfect score! No questions to retry.</span>
            ) : (
              <span>
                <strong>{wrongCount}</strong> {wrongCount === 1 ? 'question needs' : 'questions need'} review.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="quiz-result-actions">
        {wrongCount > 0 && (
          <Button
            variant="primary"
            onClick={onRetryWrong}
            aria-label={`Retry ${wrongCount} missed questions`}
          >
            Retry Wrong Answers ({wrongCount})
          </Button>
        )}

        <Button
          variant={wrongCount === 0 ? 'primary' : 'outline'}
          onClick={onRestartFull}
          aria-label="Restart full quiz from the beginning"
        >
          ↺ Restart Full Quiz
        </Button>

        <Button
          variant="secondary"
          onClick={onStudyFlashcards}
          aria-label="Return to Flashcards study mode"
        >
          🗂️ Study Flashcards
        </Button>
      </div>

      {/* Missed Questions Review Section */}
      {wrongCount > 0 && (
        <div className="missed-questions-section">
          <h4 className="missed-questions-title">Questions to Review ({wrongCount})</h4>
          <div className="missed-questions-list">
            {wrongQuestions.map((item, idx) => (
              <div key={idx} className="missed-question-card">
                <div className="missed-q-header">
                  <span className="missed-q-number">Review #{idx + 1}</span>
                </div>
                <p className="missed-q-prompt">{item.question}</p>
                <div className="missed-q-answer">
                  <span className="answer-label">Correct Answer:</span>
                  <span className="answer-value">{item.answer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
