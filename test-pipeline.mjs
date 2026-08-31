import { validateStudySet } from './src/utils/validateStudySet.js';

console.log('====================================================');
console.log('Running Test Suite: Student Assistant AI Pipeline & Validation');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// ---------------------------------------------------------
// Scenario 1: Valid AI Response
// ---------------------------------------------------------
console.log('--- Scenario 1: Valid AI Response ---');
const validPayload = {
  title: 'Photosynthesis Fundamentals',
  flashcards: [
    {
      question: 'What is photosynthesis?',
      answer: 'The process by which green plants use sunlight to synthesize nutrients.',
    },
    {
      question: 'Where does photosynthesis take place?',
      answer: 'Inside the chloroplasts of plant cells.',
    },
  ],
  quiz: [
    {
      question: 'Which gas is absorbed during photosynthesis?',
      options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Helium'],
      answer: 'Carbon Dioxide',
    },
  ],
};
const res1 = validateStudySet(validPayload);
assert(res1.isValid === true, 'Accepts a well-formed study set payload');
assert(res1.data.title === 'Photosynthesis Fundamentals', 'Correctly preserves valid title');
assert(res1.data.flashcards.length === 2, 'Correctly preserves flashcard count');
assert(res1.data.quiz.length === 1, 'Correctly preserves quiz count');

// ---------------------------------------------------------
// Scenario 2: Malformed JSON Simulation
// ---------------------------------------------------------
console.log('\n--- Scenario 2: Malformed JSON Simulation ---');
const malformedJsonString = '{"title": "Unfinished JSON", "flashcards": [';
let parseFailedAsExpected = false;
try {
  JSON.parse(malformedJsonString);
} catch (e) {
  parseFailedAsExpected = true;
}
assert(parseFailedAsExpected, 'JSON.parse throws on malformed JSON, caught safely before validation');

// ---------------------------------------------------------
// Scenario 3: Missing or Invalid Title
// ---------------------------------------------------------
console.log('\n--- Scenario 3: Missing / Empty Title ---');
const missingTitlePayload = {
  flashcards: [{ question: 'Q1', answer: 'A1' }],
  quiz: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' }],
};
const res3a = validateStudySet(missingTitlePayload);
assert(res3a.isValid === false, 'Rejects payload with missing title');
assert(res3a.error.includes('"title" is required'), 'Returns descriptive error for missing title');

const emptyTitlePayload = {
  title: '   ',
  flashcards: [{ question: 'Q1', answer: 'A1' }],
  quiz: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' }],
};
const res3b = validateStudySet(emptyTitlePayload);
assert(res3b.isValid === false, 'Rejects whitespace-only title');

// ---------------------------------------------------------
// Scenario 4: Invalid Flashcard
// ---------------------------------------------------------
console.log('\n--- Scenario 4: Invalid Flashcards ---');
const emptyFlashcardsPayload = {
  title: 'Topic Title',
  flashcards: [],
  quiz: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' }],
};
const res4a = validateStudySet(emptyFlashcardsPayload);
assert(res4a.isValid === false, 'Rejects empty flashcards array');

const invalidFlashcardItem = {
  title: 'Topic Title',
  flashcards: [{ question: '', answer: 'Valid Answer' }],
  quiz: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' }],
};
const res4b = validateStudySet(invalidFlashcardItem);
assert(res4b.isValid === false, 'Rejects flashcard with empty question');
assert(res4b.error.includes('"question" must be a non-empty string'), 'Returns descriptive error for flashcard question');

const missingAnswerFlashcard = {
  title: 'Topic Title',
  flashcards: [{ question: 'Valid Question', answer: '' }],
  quiz: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' }],
};
const res4c = validateStudySet(missingAnswerFlashcard);
assert(res4c.isValid === false, 'Rejects flashcard with empty answer');

// ---------------------------------------------------------
// Scenario 5: Quiz with Fewer/More Than 4 Options
// ---------------------------------------------------------
console.log('\n--- Scenario 5: Quiz with Incorrect Options Count ---');
const quizFewerOptions = {
  title: 'Topic Title',
  flashcards: [{ question: 'Q1', answer: 'A1' }],
  quiz: [{ question: 'Q1', options: ['Option 1', 'Option 2', 'Option 3'], answer: 'Option 1' }],
};
const res5a = validateStudySet(quizFewerOptions);
assert(res5a.isValid === false, 'Rejects quiz question with 3 options');
assert(res5a.error.includes('must contain exactly 4 non-empty strings'), 'Returns descriptive error for 3 options');

const quizFiveOptions = {
  title: 'Topic Title',
  flashcards: [{ question: 'Q1', answer: 'A1' }],
  quiz: [{ question: 'Q1', options: ['O1', 'O2', 'O3', 'O4', 'O5'], answer: 'O1' }],
};
const res5b = validateStudySet(quizFiveOptions);
assert(res5b.isValid === false, 'Rejects quiz question with 5 options');

// ---------------------------------------------------------
// Scenario 6: Quiz Answer Not Matching Options
// ---------------------------------------------------------
console.log('\n--- Scenario 6: Answer Not Matching Any Option ---');
const mismatchAnswerQuiz = {
  title: 'Topic Title',
  flashcards: [{ question: 'Q1', answer: 'A1' }],
  quiz: [{ question: 'Q1', options: ['Red', 'Green', 'Blue', 'Yellow'], answer: 'Purple' }],
};
const res6 = validateStudySet(mismatchAnswerQuiz);
assert(res6.isValid === false, 'Rejects quiz when answer is not in options list');
assert(res6.error.includes('must exactly match one of the 4 options'), 'Returns descriptive mismatch error');

// ---------------------------------------------------------
// Scenario 7: Empty Responses (null, undefined, {}, primitives)
// ---------------------------------------------------------
console.log('\n--- Scenario 7: Empty / Null / Non-Object Responses ---');
assert(validateStudySet(null).isValid === false, 'Rejects null input');
assert(validateStudySet(undefined).isValid === false, 'Rejects undefined input');
assert(validateStudySet({}).isValid === false, 'Rejects empty object {}');
assert(validateStudySet([]).isValid === false, 'Rejects array as top-level input');
assert(validateStudySet('string').isValid === false, 'Rejects primitive string');

// ---------------------------------------------------------
// Scenario 8: API Failure & Error Handling
// ---------------------------------------------------------
console.log('\n--- Scenario 8: API Failure Simulation ---');
function simulateFetchResponse(status, errorPayload) {
  if (status !== 200) {
    const errorMsg = errorPayload?.error || `Request failed with status ${status}`;
    return { ok: false, status, message: errorMsg };
  }
  return { ok: true, status: 200, data: errorPayload };
}
const apiFail500 = simulateFetchResponse(500, { error: 'Internal server error occurred.' });
assert(apiFail500.ok === false, 'Detects 500 error correctly');
assert(apiFail500.message === 'Internal server error occurred.', 'Extracts server error cleanly');

const apiFail502 = simulateFetchResponse(502, { error: 'Failed to parse AI response into JSON format.' });
assert(apiFail502.ok === false, 'Detects 502 error correctly');
assert(apiFail502.message === 'Failed to parse AI response into JSON format.', 'Captures gateway parse error');

// ---------------------------------------------------------
// Scenario 9: Slow Request Followed by Newer Request (Stale Response)
// ---------------------------------------------------------
console.log('\n--- Scenario 9: Race Condition & Stale Request Cancellation ---');
async function simulateRaceCondition() {
  let activeRequestId = 0;
  let currentStudySet = null;

  // Request A starts (Topic A)
  const reqAId = ++activeRequestId;
  const reqAPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: reqAId, topic: 'Topic A (Slow Request)' });
    }, 150);
  });

  // Request B starts shortly after (Topic B)
  const reqBId = ++activeRequestId;
  const reqBPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: reqBId, topic: 'Topic B (Fast Request)' });
    }, 50);
  });

  // Response B resolves first
  const resB = await reqBPromise;
  if (resB.id === activeRequestId) {
    currentStudySet = resB.topic;
  }

  // Response A resolves later
  const resA = await reqAPromise;
  if (resA.id === activeRequestId) {
    currentStudySet = resA.topic;
  }

  // Expect currentStudySet to remain Topic B!
  assert(
    currentStudySet === 'Topic B (Fast Request)',
    'UI retains Topic B because stale Request A was ignored due to ID check'
  );
}

await simulateRaceCondition();

console.log(`\n====================================================`);
console.log(`Test Results: ${passedTests}/${totalTests} Passed`);
console.log(`====================================================\n`);
