import React from 'react';
import Home from './pages/Home';

/**
 * Root Application Component
 */
export default function App() {
  return (
    <div className="app-container">
      <Home />
      <footer className="app-footer">
        <p>Study-assistant &bull; Frontend Internship Assignment</p>
      </footer>
    </div>
  );
}
