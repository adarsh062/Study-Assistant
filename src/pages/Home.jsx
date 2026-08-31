import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import TopicInput from '../components/TopicInput';
import Button from '../components/Button';
import StudySet from '../components/StudySet';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { validateStudySet } from '../utils/validateStudySet';

/**
 * Home page for Study Assistant.
 * Handles user input state, API communication with the backend,
 * request lifecycle & stale response cancellation, structured schema validation,
 * error handling, and structured study set presentation.
 */
export default function Home() {
  const [topicText, setTopicText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studySet, setStudySet] = useState(null);

  // Track the current active request ID to ignore stale out-of-order responses
  const activeRequestIdRef = useRef(0);
  // Track the AbortController to cancel in-flight HTTP requests when a new one begins
  const abortControllerRef = useRef(null);

  // Cleanup pending requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Disable button if input is empty, whitespace-only, or currently loading
  const isInputEmpty = topicText.trim().length === 0;

  const handleGenerate = async () => {
    if (isInputEmpty || isLoading) return;

    // Abort any ongoing request before initiating a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Set up new AbortController and increment request ID
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentRequestId = ++activeRequestIdRef.current;

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
        signal: controller.signal,
      });

      // Stale request check
      if (currentRequestId !== activeRequestIdRef.current) {
        return;
      }

      // Safe JSON parsing to handle malformed JSON
      const rawText = await response.text();
      let parsedData;
      try {
        parsedData = rawText ? JSON.parse(rawText) : null;
      } catch (jsonErr) {
        if (import.meta.env.DEV) {
          console.error('[Student Assistant] Malformed JSON response received:', rawText, jsonErr);
        }
        throw new Error('Received an unreadable response from the server. Please try again.');
      }

      // Check HTTP status errors
      if (!response.ok) {
        const serverErrorMessage = parsedData?.error || `Request failed with status ${response.status}.`;
        throw new Error(serverErrorMessage);
      }

      // Handle completely empty response body
      if (!parsedData) {
        throw new Error('The server returned an empty response. Please try again.');
      }

      // Validate the data against our central study set schema
      const validation = validateStudySet(parsedData);
      if (!validation.isValid) {
        if (import.meta.env.DEV) {
          console.error('[Student Assistant] Response failed schema validation:', validation.error, parsedData);
        }
        throw new Error(
          'The AI generated an incomplete or invalid study set structure. Please retry generating.'
        );
      }

      // Only update state if this is still the active request
      if (currentRequestId === activeRequestIdRef.current) {
        setStudySet(validation.data);
      }
    } catch (err) {
      // If the request was intentionally aborted (e.g. user initiated newer request), ignore silently
      if (err.name === 'AbortError') {
        return;
      }

      // Ignore errors from stale superseded requests
      if (currentRequestId !== activeRequestIdRef.current) {
        return;
      }

      if (import.meta.env.DEV) {
        console.error('[Student Assistant] Error generating study set:', err);
      }

      setError(
        err.message || 'Unable to connect to the backend server. Please check your connection and retry.'
      );
    } finally {
      // Only reset loading if this is the active request
      if (currentRequestId === activeRequestIdRef.current) {
        setIsLoading(false);
      }
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
          <div className="error-icon-wrapper" aria-hidden="true">
            <svg
              className="error-icon"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="error-content">
            <h3 className="error-title">Generation Error</h3>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <Button
                variant="outline"
                onClick={handleGenerate}
                disabled={isLoading || isInputEmpty}
                aria-label="Retry generating study set"
                className="error-retry-btn"
              >
                ↺ Try Again
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Progressive Loading Experience */}
      {isLoading && <LoadingState />}

      {/* Interactive Study Set (Flashcards & Quiz) */}
      {!isLoading && studySet && <StudySet studySet={studySet} />}

      {/* Initial Empty State before generation */}
      {!isLoading && !studySet && !error && <EmptyState />}
    </div>
  );
}
