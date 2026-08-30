import React, { useState } from 'react';
import Header from '../components/Header';
import TopicInput from '../components/TopicInput';
import Button from '../components/Button';

/**
 * Home page for Study Assistant (Part 1 Foundation).
 * Handles user input state, validation, and simulated generation feedback.
 */
export default function Home() {
  const [topicText, setTopicText] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [submittedTopic, setSubmittedTopic] = useState('');

  // Disable button if input is empty or contains only whitespace
  const isInputEmpty = topicText.trim().length === 0;

  const handleGenerate = () => {
    if (isInputEmpty) return;
    setSubmittedTopic(topicText.trim());
    setIsGenerated(true);
  };

  const handleSelectExample = (example) => {
    setTopicText(example);
  };

  return (
    <div className="main-content">
      <Header />

      <main className="study-card">
        <TopicInput
          value={topicText}
          onChange={(newText) => {
            setTopicText(newText);
            if (isGenerated) setIsGenerated(false);
          }}
          onSelectExample={handleSelectExample}
        />

        <div className="card-actions">
          <Button
            onClick={handleGenerate}
            disabled={isInputEmpty}
            aria-label="Generate Study Set"
          >
            Generate Study Set
          </Button>
        </div>
      </main>

      {/* Temporary placeholder simulating the generation output (Part 1 only) */}
      {isGenerated && (
        <section className="placeholder-container" aria-live="polite">
          <div className="placeholder-status-badge">
            ✓ Ready for Part 2 Integration
          </div>
          <h2 className="placeholder-title">Study Set Simulation Active</h2>
          <p className="placeholder-desc">
            Received input for <strong>&ldquo;{submittedTopic.slice(0, 60)}{submittedTopic.length > 60 ? '...' : ''}&rdquo;</strong>.
            In upcoming parts, flashcards and interactive quizzes will be generated automatically.
          </p>
        </section>
      )}
    </div>
  );
}
