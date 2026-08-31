import React from 'react';

/**
 * EmptyState component.
 * Displays an inviting initial preview explaining how Student Assistant works
 * before a study set has been generated.
 */
export default function EmptyState() {
  const features = [
    {
      icon: '🗂️',
      title: 'Interactive Flashcards',
      description: 'Flip between key concept definitions with full keyboard accessibility.',
    },
    {
      icon: '📝',
      title: 'Adaptive Quizzes',
      description: 'Multiple-choice questions with immediate feedback and explanation.',
    },
    {
      icon: '🎯',
      title: 'Targeted Review',
      description: 'Isolate and retry questions you missed without regenerating the study set.',
    },
  ];

  return (
    <section className="empty-state-card" aria-label="Feature overview">
      <div className="empty-state-header">
        <span className="empty-state-badge">How It Works</span>
        <h2 className="empty-state-title">Ready to Boost Your Study Session</h2>
        <p className="empty-state-subtitle">
          Type or paste your notes above, or click one of the quick example topics to generate interactive flashcards and a self-scoring quiz.
        </p>
      </div>

      <div className="empty-features-grid">
        {features.map((item, index) => (
          <div key={index} className="empty-feature-item">
            <span className="empty-feature-icon" aria-hidden="true">{item.icon}</span>
            <div className="empty-feature-text">
              <h3 className="empty-feature-title">{item.title}</h3>
              <p className="empty-feature-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
