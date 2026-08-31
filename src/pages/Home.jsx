import React, { useState } from 'react';
import Header from '../components/Header';
import TopicInput from '../components/TopicInput';
import Button from '../components/Button';

/**
 * Home page for Study Assistant (Part 2 Backend AI Integration).
 * Handles user input state, API communication with the backend,
 * loading/error states, and structured JSON verification.
 */
export default function Home() {
  const [topicText, setTopicText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studySet, setStudySet] = useState(null);

  // Disable button if input is empty, whitespace-only, or currently loading
  const isInputEmpty = topicText.trim().length === 0;

  const handleGenerate = async () => {
    if (isInputEmpty || isLoading) return;

    setIsLoading(true);
    setError(null);
    setStudySet(null);

    try {
      const response = await fetch('/api/generate-study-set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: topicText.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`);
      }

      setStudySet(data);
    } catch (err) {
      console.error('Error generating study set:', err);
      setError(
        err.message || 'Unable to connect to the backend server. Please make sure the backend is running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectExample = (example) => {
    if (isLoading) return;
    setTopicText(example);
    setError(null);
  };

  return (
    <div className="main-content">
      <Header />

      <main className="study-card">
        <TopicInput
          value={topicText}
          onChange={(newText) => {
            setTopicText(newText);
            if (error) setError(null);
          }}
          onSelectExample={handleSelectExample}
        />

        <div className="card-actions">
          <Button
            onClick={handleGenerate}
            disabled={isInputEmpty}
            isLoading={isLoading}
            aria-label="Generate Study Set"
          >
            Generate Study Set
          </Button>
        </div>
      </main>

      {/* Error alert message */}
      {error && (
        <section className="error-banner" role="alert">
          <svg
            className="error-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <div className="error-content">
            <h3 className="error-title">Generation Error</h3>
            <p className="error-message">{error}</p>
          </div>
        </section>
      )}

      {/* Part 2 Developer-friendly preview of the structured JSON response */}
      {studySet && (
        <section className="result-container" aria-live="polite">
          <div className="result-header">
            <div className="result-title-group">
              <span className="result-badge">✓ Backend AI Integration Verified</span>
              <h2 className="result-title">{studySet.title || 'Generated Study Set'}</h2>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{studySet.flashcards?.length || 0}</div>
              <div className="stat-label">Flashcards Generated</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{studySet.quiz?.length || 0}</div>
              <div className="stat-label">Quiz Questions Generated</div>
            </div>
          </div>

          <div className="json-viewer-header">
            <span className="json-viewer-label">Structured JSON Payload (Developer Preview)</span>
          </div>
          <pre className="json-viewer">
            <code>{JSON.stringify(studySet, null, 2)}</code>
          </pre>
        </section>
      )}
    </div>
  );
}
