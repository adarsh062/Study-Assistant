import React from 'react';
import ProgressIndicator from './ProgressIndicator';
import Button from './Button';

/**
 * QuizQuestion component.
 * Renders a single multiple-choice question with 4 options, selection state,
 * immediate answer evaluation, and next-step actions.
 *
 * @param {Object} props
 * @param {{ question: string, options: string[], answer: string }} props.questionItem
 * @param {number} props.questionIndex - 0-indexed position
 * @param {number} props.totalQuestions - Total questions in current quiz run
 * @param {string|null} props.selectedOption - Currently selected option
 * @param {boolean} props.isSubmitted - Whether the answer has been submitted
 * @param {(option: string) => void} props.onSelectOption - Option selection handler
 * @param {() => void} props.onSubmit - Submit answer handler
 * @param {() => void} props.onNext - Proceed to next question / results handler
 */
export default function QuizQuestion({
  questionItem,
  questionIndex,
  totalQuestions,
  selectedOption,
  isSubmitted,
  onSelectOption,
  onSubmit,
  onNext,
}) {
  if (!questionItem || !Array.isArray(questionItem.options)) {
    return (
      <div className="quiz-empty-fallback" role="alert">
        <p>Question data is unavailable or invalid.</p>
      </div>
    );
  }

  const { question, options, answer } = questionItem;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const isCorrect = isSubmitted && selectedOption === answer;

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="quiz-question-container">
      {/* Progress Bar & Counter */}
      <ProgressIndicator
        current={questionIndex + 1}
        total={totalQuestions}
        label="Question"
      />

      {/* Question Card */}
      <div className="quiz-card">
        <div className="quiz-card-header">
          <span className="quiz-badge">Multiple Choice</span>
        </div>

        <h3 className="quiz-prompt">{question}</h3>

        {/* Options List */}
        <div
          className="quiz-options-grid"
          role="radiogroup"
          aria-label={`Options for question: ${question}`}
        >
          {options.map((option, index) => {
            const letter = optionLetters[index] || (index + 1);
            const isSelected = selectedOption === option;
            const isAnswerOption = isSubmitted && option === answer;
            const isWrongSelection = isSubmitted && isSelected && option !== answer;

            let optionClassName = 'quiz-option-btn';
            if (isSelected) optionClassName += ' is-selected';
            if (isAnswerOption) optionClassName += ' is-correct';
            if (isWrongSelection) optionClassName += ' is-wrong';

            return (
              <button
                key={`${index}-${option}`}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isSubmitted}
                className={optionClassName}
                onClick={() => onSelectOption(option)}
              >
                <span className="option-letter-badge">{letter}</span>
                <span className="option-text">{option}</span>

                {/* Visual Status Indicator after submission */}
                {isAnswerOption && (
                  <span className="option-status-icon status-correct" title="Correct Answer">
                    ✓
                  </span>
                )}
                {isWrongSelection && (
                  <span className="option-status-icon status-wrong" title="Your Answer (Incorrect)">
                    ✗
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Submission Feedback */}
        {isSubmitted && (
          <div
            className={`quiz-feedback-banner ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}
            role="status"
            aria-live="polite"
          >
            <div className="feedback-content">
              {isCorrect ? (
                <>
                  <span className="feedback-icon">✓</span>
                  <div>
                    <strong className="feedback-title">Correct!</strong>
                    <p className="feedback-subtitle">Great job, your answer is spot on.</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="feedback-icon">✗</span>
                  <div>
                    <strong className="feedback-title">Incorrect</strong>
                    <p className="feedback-subtitle">
                      The correct answer is: <strong>{answer}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="quiz-card-actions">
          {!isSubmitted ? (
            <Button
              variant="primary"
              onClick={onSubmit}
              disabled={!selectedOption}
              aria-label="Submit your answer"
              className="quiz-action-btn"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={onNext}
              aria-label={isLastQuestion ? 'View quiz results' : 'Proceed to next question'}
              className="quiz-action-btn"
            >
              {isLastQuestion ? 'View Results →' : 'Next Question →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
