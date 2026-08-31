import React, { useState, useEffect } from 'react';
import Flashcard from './Flashcard';
import ProgressIndicator from './ProgressIndicator';
import Button from './Button';

/**
 * StudySet component.
 * Manages the active mode (Flashcards / Quiz), flashcard navigation,
 * flip states, boundaries, and keyboard shortcuts.
 *
 * @param {Object} props
 * @param {Object} props.studySet - Validated study set payload { title, flashcards, quiz }
 */
export default function StudySet({ studySet }) {
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = Array.isArray(studySet?.flashcards) ? studySet.flashcards : [];
  const quiz = Array.isArray(studySet?.quiz) ? studySet.quiz : [];
  const totalCards = flashcards.length;

  // Reset navigation and flip state whenever a new study set is loaded
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [studySet]);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false); // Reset flip state for previous card
    }
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false); // Reset flip state for next card
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (!studySet) {
    return null;
  }

  const currentCard = flashcards[currentIndex];
  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === totalCards - 1;

  return (
    <section className="study-set-container" aria-label="Study Set Viewer">
      {/* Title & Mode Switcher Bar */}
      <header className="study-set-header">
        <div className="study-set-title-group">
          <span className="study-set-badge">Generated Study Set</span>
          <h2 className="study-set-title">{studySet.title || 'Untitled Study Set'}</h2>
        </div>

        {/* Tab / Mode Switcher */}
        <nav className="mode-tabs" role="tablist" aria-label="Study modes">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'flashcards'}
            aria-controls="flashcards-panel"
            id="flashcards-tab"
            className={`mode-tab ${activeTab === 'flashcards' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('flashcards')}
          >
            <span className="tab-icon">🗂️</span>
            Flashcards
            <span className="tab-count">{totalCards}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'quiz'}
            aria-controls="quiz-panel"
            id="quiz-tab"
            className={`mode-tab ${activeTab === 'quiz' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <span className="tab-icon">📝</span>
            Quiz
            <span className="tab-count">{quiz.length}</span>
          </button>
        </nav>
      </header>

      {/* FLASHCARDS PANEL */}
      {activeTab === 'flashcards' && (
        <div
          id="flashcards-panel"
          role="tabpanel"
          aria-labelledby="flashcards-tab"
          className="study-mode-panel"
        >
          {totalCards === 0 ? (
            <div className="empty-state-notice" role="alert">
              <p>No flashcards are available in this study set.</p>
            </div>
          ) : (
            <>
              {/* Progress Indicator */}
              <ProgressIndicator
                current={currentIndex + 1}
                total={totalCards}
                label="Card"
              />

              {/* Flashcard Component */}
              <Flashcard
                card={currentCard}
                isFlipped={isFlipped}
                onFlip={handleFlip}
                cardIndex={currentIndex}
                totalCards={totalCards}
              />

              {/* Navigation & Action Controls */}
              <div className="flashcard-controls">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={isFirstCard}
                  aria-label="Previous flashcard"
                >
                  ← Previous
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleFlip}
                  aria-label={isFlipped ? 'Show question' : 'Show answer'}
                >
                  {isFlipped ? 'Show Question' : 'Flip Card'}
                </Button>

                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={isLastCard}
                  aria-label="Next flashcard"
                >
                  Next →
                </Button>
              </div>

              {/* End of cards completion callout */}
              {isLastCard && (
                <aside className="completion-callout" role="status" aria-live="polite">
                  <div className="completion-callout-content">
                    <span className="completion-icon" aria-hidden="true">🎉</span>
                    <div className="completion-text">
                      <strong className="completion-title">You've reached the final card!</strong>
                      <p className="completion-subtitle">
                        Great work! You reviewed all {totalCards} flashcards in this set.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="completion-restart-btn"
                    onClick={handleRestart}
                    aria-label="Review all cards again from the beginning"
                  >
                    ↺ Review Again
                  </Button>
                </aside>
              )}
            </>
          )}
        </div>
      )}

      {/* QUIZ PANEL (Prepared for upcoming step) */}
      {activeTab === 'quiz' && (
        <div
          id="quiz-panel"
          role="tabpanel"
          aria-labelledby="quiz-tab"
          className="study-mode-panel quiz-preview-panel"
        >
          <div className="quiz-placeholder-card">
            <span className="placeholder-icon">📝</span>
            <h3 className="placeholder-title">Quiz Mode Ready</h3>
            <p className="placeholder-desc">
              This study set includes <strong>{quiz.length} verified multiple-choice questions</strong> ready to test your knowledge.
            </p>
            <div className="quiz-summary-badges">
              <span className="summary-badge">{quiz.length} Questions</span>
              <span className="summary-badge">4 Options Per Question</span>
              <span className="summary-badge">Instant Verification</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
