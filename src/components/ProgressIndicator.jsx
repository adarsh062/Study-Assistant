import React from 'react';

/**
 * Reusable ProgressIndicator component.
 * Displays step numbers, progress bar, and completion state.
 *
 * @param {Object} props
 * @param {number} props.current - Current item index (1-indexed)
 * @param {number} props.total - Total number of items
 * @param {string} [props.label] - Label prefix (default: 'Card')
 */
export default function ProgressIndicator({ current, total, label = 'Card' }) {
  const safeTotal = Math.max(1, total || 1);
  const safeCurrent = Math.min(Math.max(1, current || 1), safeTotal);
  const percentage = Math.round((safeCurrent / safeTotal) * 100);
  const isComplete = safeCurrent === safeTotal;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label" aria-live="polite">
          <strong className="progress-current">{label} {safeCurrent}</strong> / {safeTotal}
        </span>
        {isComplete ? (
          <span className="progress-badge progress-badge-complete">
            ✓ Final {label}
          </span>
        ) : (
          <span className="progress-percentage">{percentage}%</span>
        )}
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={safeCurrent}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-valuetext={`${label} ${safeCurrent} of ${safeTotal}`}
      >
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
