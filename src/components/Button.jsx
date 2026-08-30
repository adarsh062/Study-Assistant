import React from 'react';

/**
 * Reusable Button component with variant, disabled state, and click handler support.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label / content
 * @param {() => void} [props.onClick] - Click handler function
 * @param {boolean} [props.disabled] - Disabled state
 * @param {string} [props.type] - HTML button type ('button' | 'submit' | 'reset')
 * @param {string} [props.className] - Additional CSS classes
 */
export default function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-primary ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
