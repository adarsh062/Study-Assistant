/**
 * Central validation layer for StudyMate study sets.
 * Validates the structure and constraints of AI-generated study set data
 * before it is accepted into the application state.
 *
 * Expected Schema:
 * {
 *   title: string (non-empty),
 *   flashcards: Array<{ question: string (non-empty), answer: string (non-empty) }> (non-empty),
 *   quiz: Array<{
 *     question: string (non-empty),
 *     options: [string, string, string, string] (exactly 4 non-empty strings),
 *     answer: string (non-empty, exactly matches one of options)
 *   }> (non-empty)
 * }
 *
 * @param {any} data - Raw data to validate
 * @returns {{ isValid: boolean, error: string | null, data: object | null }}
 */
export function validateStudySet(data) {
  // Reject null, undefined, primitives, arrays as root
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {
      isValid: false,
      error: 'Invalid response: Study set data must be a non-empty object.',
      data: null,
    };
  }

  // Reject empty objects
  if (Object.keys(data).length === 0) {
    return {
      isValid: false,
      error: 'Invalid response: Study set data is empty.',
      data: null,
    };
  }

  // 1. Validate 'title'
  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    return {
      isValid: false,
      error: 'Invalid study set: "title" is required and must be a non-empty string.',
      data: null,
    };
  }

  // 2. Validate 'flashcards' array
  if (!Array.isArray(data.flashcards)) {
    return {
      isValid: false,
      error: 'Invalid study set: "flashcards" is required and must be an array.',
      data: null,
    };
  }

  if (data.flashcards.length === 0) {
    return {
      isValid: false,
      error: 'Invalid study set: "flashcards" array must contain at least one item.',
      data: null,
    };
  }

  // Validate each flashcard item
  const sanitizedFlashcards = [];
  for (let i = 0; i < data.flashcards.length; i++) {
    const card = data.flashcards[i];

    if (!card || typeof card !== 'object' || Array.isArray(card)) {
      return {
        isValid: false,
        error: `Invalid flashcard at index ${i}: item must be a valid object.`,
        data: null,
      };
    }

    if (typeof card.question !== 'string' || card.question.trim().length === 0) {
      return {
        isValid: false,
        error: `Invalid flashcard at index ${i}: "question" must be a non-empty string.`,
        data: null,
      };
    }

    if (typeof card.answer !== 'string' || card.answer.trim().length === 0) {
      return {
        isValid: false,
        error: `Invalid flashcard at index ${i}: "answer" must be a non-empty string.`,
        data: null,
      };
    }

    sanitizedFlashcards.push({
      question: card.question.trim(),
      answer: card.answer.trim(),
    });
  }

  // 3. Validate 'quiz' array
  if (!Array.isArray(data.quiz)) {
    return {
      isValid: false,
      error: 'Invalid study set: "quiz" is required and must be an array.',
      data: null,
    };
  }

  if (data.quiz.length === 0) {
    return {
      isValid: false,
      error: 'Invalid study set: "quiz" array must contain at least one item.',
      data: null,
    };
  }

  // Validate each quiz question item
  const sanitizedQuiz = [];
  for (let i = 0; i < data.quiz.length; i++) {
    const item = data.quiz[i];

    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return {
        isValid: false,
        error: `Invalid quiz question at index ${i}: item must be a valid object.`,
        data: null,
      };
    }

    if (typeof item.question !== 'string' || item.question.trim().length === 0) {
      return {
        isValid: false,
        error: `Invalid quiz question at index ${i}: "question" must be a non-empty string.`,
        data: null,
      };
    }

    if (
      !Array.isArray(item.options) ||
      item.options.length !== 4 ||
      !item.options.every((opt) => typeof opt === 'string' && opt.trim().length > 0)
    ) {
      return {
        isValid: false,
        error: `Invalid quiz question at index ${i}: "options" must contain exactly 4 non-empty strings.`,
        data: null,
      };
    }

    if (typeof item.answer !== 'string' || item.answer.trim().length === 0) {
      return {
        isValid: false,
        error: `Invalid quiz question at index ${i}: "answer" must be a non-empty string.`,
        data: null,
      };
    }

    const trimmedAnswer = item.answer.trim();
    const trimmedOptions = item.options.map((opt) => opt.trim());

    // Check if the answer exactly matches one of the options
    if (!trimmedOptions.includes(trimmedAnswer)) {
      return {
        isValid: false,
        error: `Invalid quiz question at index ${i}: "answer" ("${trimmedAnswer}") must exactly match one of the 4 options.`,
        data: null,
      };
    }

    sanitizedQuiz.push({
      question: item.question.trim(),
      options: trimmedOptions,
      answer: trimmedAnswer,
    });
  }

  return {
    isValid: true,
    error: null,
    data: {
      title: data.title.trim(),
      flashcards: sanitizedFlashcards,
      quiz: sanitizedQuiz,
    },
  };
}

export default validateStudySet;
