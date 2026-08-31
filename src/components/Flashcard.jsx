import React from 'react';

/**
 * Flashcard component.
 * Displays front (question) and back (answer) with accessible flip interaction.
 *
 * @param {Object} props
 * @param {{ question: string, answer: string }} props.card - Flashcard data
 * @param {boolean} props.isFlipped - Current flipped state
 * @param {() => void} props.onFlip - Flip toggle callback
 * @param {number} [props.cardIndex] - 0-indexed card position for accessibility label
 * @param {number} [props.totalCards] - Total cards count
 */
export default function Flashcard({
  card,
  isFlipped = false,
  onFlip,
  cardIndex = 0,
  totalCards = 1,
}) {
  if (!card || typeof card !== 'object') {
    return (
      <div className="flashcard-empty-fallback" role="alert">
        <p>No flashcard data available.</p>
      </div>
    );
  }

  const handleKeyDown = (e) => {
    // Enable flipping via Space or Enter
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onFlip?.();
    }
  };

  return (
    <div className="flashcard-wrapper">
      <div
        className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`Flashcard ${cardIndex + 1} of ${totalCards}. Currently showing ${
          isFlipped ? 'answer' : 'question'
        }. Press Space or Enter to flip.`}
      >
        <div className="flashcard-inner">
          {/* FRONT: Question */}
          <div className="flashcard-face flashcard-front" aria-hidden={isFlipped}>
            <div className="flashcard-header">
              <span className="card-type-badge badge-question">Question</span>
              <span className="card-hint">
                <svg className="hint-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.75a.75.75 0 00-.75.75v4.482a.75.75 0 001.5 0v-2.032l.317.317a7 7 0 0011.71-3.136.75.75 0 00-1.215-.636zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312.311H11.77a.75.75 0 000 1.5h4.482a.75.75 0 00.75-.75V2.689a.75.75 0 00-1.5 0v2.032l-.317-.317a7 7 0 00-11.71 3.136.75.75 0 001.215.636z" clipRule="evenodd" />
                </svg>
                Click or press Space to flip
              </span>
            </div>

            <div className="flashcard-body">
              <p className="flashcard-text question-text">
                {card.question || 'No question provided'}
              </p>
            </div>

            <div className="flashcard-footer">
              <span className="flip-prompt">Show Answer →</span>
            </div>
          </div>

          {/* BACK: Answer */}
          <div className="flashcard-face flashcard-back" aria-hidden={!isFlipped}>
            <div className="flashcard-header">
              <span className="card-type-badge badge-answer">Answer</span>
              <span className="card-hint">
                <svg className="hint-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.75a.75.75 0 00-.75.75v4.482a.75.75 0 001.5 0v-2.032l.317.317a7 7 0 0011.71-3.136.75.75 0 00-1.215-.636zM4.688 8.576a5.5 5.5 0 019.201-2.466l.312.311H11.77a.75.75 0 000 1.5h4.482a.75.75 0 00.75-.75V2.689a.75.75 0 00-1.5 0v2.032l-.317-.317a7 7 0 00-11.71 3.136.75.75 0 001.215.636z" clipRule="evenodd" />
                </svg>
                Click or press Space to flip
              </span>
            </div>

            <div className="flashcard-body">
              <p className="flashcard-text answer-text">
                {card.answer || 'No answer provided'}
              </p>
            </div>

            <div className="flashcard-footer">
              <span className="flip-prompt">← Show Question</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
