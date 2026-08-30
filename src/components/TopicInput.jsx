import React from 'react';

/**
 * TopicInput component encapsulates the notes textarea, character counter,
 * and quick starter examples to help users understand what to paste.
 *
 * @param {Object} props
 * @param {string} props.value - Current textarea text
 * @param {(value: string) => void} props.onChange - Handler called when text changes
 * @param {string} [props.placeholder] - Textarea placeholder text
 * @param {Array<string>} [props.examples] - List of quick example prompt titles/snippets
 * @param {(example: string) => void} [props.onSelectExample] - Handler when an example is clicked
 */
export default function TopicInput({
  value,
  onChange,
  placeholder = 'Paste your lecture notes, study outline, or enter a topic (e.g., Photosynthesis and cellular respiration)...',
  examples = [
    'Photosynthesis and light reactions',
    'React useEffect lifecycle & cleanup',
    'OSI 7-Layer Networking Model',
  ],
  onSelectExample,
}) {
  const characterCount = value.length;

  return (
    <div className="input-group">
      <div className="input-label-row">
        <label htmlFor="study-topic-input" className="input-label">
          Notes or Topic
        </label>
        <span className="character-count" aria-live="polite">
          {characterCount.toLocaleString()} {characterCount === 1 ? 'character' : 'characters'}
        </span>
      </div>

      <textarea
        id="study-topic-input"
        className="topic-textarea"
        rows={7}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {examples && examples.length > 0 && (
        <div className="example-section">
          <p className="example-header">💡 Or try a quick example topic:</p>
          <div className="example-chips">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                className="example-chip"
                onClick={() => onSelectExample && onSelectExample(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
