import React from 'react';

/**
 * Reusable Button component with variant, disabled, and loading state support.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label / content
 * @param {() => void} [props.onClick] - Click handler function
 * @param {boolean} [props.disabled] - Disabled state
 * @param {boolean} [props.isLoading] - Loading indicator state
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} [props.variant] - Button style variant
 * @param {string} [props.type] - HTML button type ('button' | 'submit' | 'reset')
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  type = 'button',
  className = '',
  ...rest
}) {
  const variantClass = variant ? `btn-${variant}` : 'btn-primary';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="btn-spinner" aria-hidden="true">
          <svg className="spinner-icon" viewBox="0 0 24 24" fill="none">
            <circle
              className="spinner-circle"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="spinner-path"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      <span>{isLoading ? 'Generating Study Set...' : children}</span>
    </button>
  );
}
