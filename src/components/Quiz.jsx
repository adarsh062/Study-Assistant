import React, { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';

/**
 * Quiz component.
 * Manages active quiz questions, step-by-step navigation, answer verification,
 * score calculation, missed question tracking, and selective retries.
 *
 * @param {Object} props
 * @param {Array<{ question: string, options: string[], answer: string }>} props.questions - Validated quiz items
 * @param {() => void} props.onStudyFlashcards - Callback to switch to Flashcards mode
 */
export default function Quiz({ questions = [], onStudyFlashcards }) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset quiz state whenever the study set's initial questions change
  useEffect(() => {
    setActiveQuestions(questions || []);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongQuestions([]);
    setIsCompleted(false);
  }, [questions]);

  // Handle empty or missing questions gracefully
  if (!activeQuestions || activeQuestions.length === 0) {
    return (
      <div className="empty-state-notice" role="alert">
        <p>No quiz questions available for this study set.</p>
      </div>
    );
  }

  const currentQuestionItem = activeQuestions[currentIndex];

  const handleSelectOption = (option) => {
    if (isSubmitted) return; // Prevent changing selection after submission
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQuestionItem.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, currentQuestionItem]);
    }
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRetryWrong = () => {
    if (wrongQuestions.length === 0) return;

    // Start a new quiz session with ONLY the previously incorrect questions
    setActiveQuestions([...wrongQuestions]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongQuestions([]);
    setIsCompleted(false);
  };

  const handleRestartFull = () => {
    // Restart full quiz from original initial questions
    setActiveQuestions(questions || []);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setWrongQuestions([]);
    setIsCompleted(false);
  };

  return (
    <div className="quiz-mode-panel">
      {!isCompleted ? (
        <QuizQuestion
          questionItem={currentQuestionItem}
          questionIndex={currentIndex}
          totalQuestions={activeQuestions.length}
          selectedOption={selectedOption}
          isSubmitted={isSubmitted}
          onSelectOption={handleSelectOption}
          onSubmit={handleSubmit}
          onNext={handleNext}
        />
      ) : (
        <QuizResult
          score={score}
          totalQuestions={activeQuestions.length}
          wrongQuestions={wrongQuestions}
          onRetryWrong={handleRetryWrong}
          onRestartFull={handleRestartFull}
          onStudyFlashcards={onStudyFlashcards}
        />
      )}
    </div>
  );
}
