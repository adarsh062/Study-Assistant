import React from 'react';

/**
 * Header component displays the app branding, badge, and value proposition.
 */
export default function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo-badge" aria-hidden="true">
          <svg
            className="header-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div className="header-title-container">
          <div className="header-title-row">
            <h1 className="header-title">Student Assistant</h1>
            <span className="header-tag-badge">AI Assistant</span>
          </div>
        </div>
      </div>
      <p className="header-subtitle">
        Transform free-form notes and topics into verified flashcards and self-scoring quizzes in seconds.
      </p>
    </header>
  );
}

