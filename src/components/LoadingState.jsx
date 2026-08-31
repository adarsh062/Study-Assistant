import React, { useState, useEffect } from 'react';

/**
 * LoadingState component.
 * Displays dynamic progressive loading status messages and animated skeleton placeholders
 * to provide a responsive, engaging experience while AI generates study content.
 */
export default function LoadingState() {
  const loadingSteps = [
    { title: 'Analyzing your notes...', subtitle: 'Understanding key concepts and terminology' },
    { title: 'Creating your study set...', subtitle: 'Synthesizing concise, high-yield definitions' },
    { title: 'Generating flashcards and quiz questions...', subtitle: 'Drafting multiple-choice questions and options' },
    { title: 'Finalizing structure...', subtitle: 'Verifying questions, answers, and data schema' },
  ];

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [loadingSteps.length]);

  const currentStep = loadingSteps[stepIndex];

  return (
    <section
      className="loading-card"
      role="status"
      aria-live="polite"
      aria-label="Generating study set in progress"
    >
      <div className="loading-spinner-wrapper">
        <div className="loading-pulse-ring" aria-hidden="true" />
        <svg className="loading-spinner-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            className="spinner-circle"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="spinner-path"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      <div className="loading-content">
        <h3 className="loading-title">{currentStep.title}</h3>
        <p className="loading-subtitle">{currentStep.subtitle}</p>
      </div>

      <div className="loading-skeleton-grid" aria-hidden="true">
        <div className="skeleton-bar skeleton-bar-long" />
        <div className="skeleton-bar skeleton-bar-medium" />
        <div className="skeleton-bar skeleton-bar-short" />
      </div>
    </section>
  );
}
