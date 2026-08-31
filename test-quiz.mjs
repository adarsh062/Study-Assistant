console.log('====================================================');
console.log('Running Test Suite: Student Assistant Quiz Logic & Flow');
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

// Mock Quiz Questions
const mockQuizQuestions = [
  {
    question: 'What does CPU stand for?',
    options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Core Processing Utility'],
    answer: 'Central Processing Unit',
  },
  {
    question: 'Which data structure follows FIFO?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    answer: 'Queue',
  },
  {
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
    answer: 'O(log n)',
  },
];

// ---------------------------------------------------------
// Scenario 1: Normal Quiz Flow & Score Tracking
// ---------------------------------------------------------
console.log('--- Scenario 1: Normal Quiz Flow & Score Tracking ---');

function simulateQuizRun(questions, userAnswers) {
  let score = 0;
  const wrongQuestions = [];

  questions.forEach((q, idx) => {
    const selected = userAnswers[idx];
    if (selected === q.answer) {
      score++;
    } else {
      wrongQuestions.push(q);
    }
  });

  const percentage = Math.round((score / questions.length) * 100);
  return { score, total: questions.length, percentage, wrongQuestions };
}

// User gets Q1 and Q3 correct, Q2 wrong
const result1 = simulateQuizRun(mockQuizQuestions, [
  'Central Processing Unit', // correct
  'Stack',                    // incorrect (correct: Queue)
  'O(log n)',                 // correct
]);

assert(result1.score === 2, 'Calculates score accurately (2 out of 3)');
assert(result1.percentage === 67, 'Calculates percentage correctly (67%)');
assert(result1.wrongQuestions.length === 1, 'Tracks exactly 1 wrong question');
assert(result1.wrongQuestions[0].question === 'Which data structure follows FIFO?', 'Stores the full question object for missed question');
assert(result1.wrongQuestions[0].answer === 'Queue', 'Preserves original correct answer for review');

// ---------------------------------------------------------
// Scenario 2: Retry Wrong Answers Flow
// ---------------------------------------------------------
console.log('\n--- Scenario 2: Retry Wrong Answers Flow ---');
const retryQuestions = [...result1.wrongQuestions];
assert(retryQuestions.length === 1, 'Retry set contains only previously missed questions');

// User now answers the missed question correctly on retry
const retryResult = simulateQuizRun(retryQuestions, ['Queue']);
assert(retryResult.score === 1, 'Scores 100% on retrying wrong questions');
assert(retryResult.wrongQuestions.length === 0, 'No wrong questions remain after successful retry');

// ---------------------------------------------------------
// Scenario 3: Perfect Score Flow (No Wrong Answers)
// ---------------------------------------------------------
console.log('\n--- Scenario 3: Perfect Score Flow ---');
const perfectResult = simulateQuizRun(mockQuizQuestions, [
  'Central Processing Unit',
  'Queue',
  'O(log n)',
]);

assert(perfectResult.score === 3, 'Scores 3/3 on perfect run');
assert(perfectResult.percentage === 100, 'Calculates 100%');
assert(perfectResult.wrongQuestions.length === 0, 'Zero wrong questions tracked');
const isPerfect = perfectResult.score === perfectResult.total && perfectResult.wrongQuestions.length === 0;
assert(isPerfect === true, 'Correctly flags perfect score state with no retry required');

// ---------------------------------------------------------
// Scenario 4: All Wrong Answers Flow
// ---------------------------------------------------------
console.log('\n--- Scenario 4: All Wrong Answers Flow ---');
const allWrongResult = simulateQuizRun(mockQuizQuestions, [
  'Central Process Unit',
  'Stack',
  'O(n)',
]);

assert(allWrongResult.score === 0, 'Calculates 0/3 for all incorrect answers');
assert(allWrongResult.percentage === 0, 'Calculates 0%');
assert(allWrongResult.wrongQuestions.length === 3, 'Captures all 3 questions for review');

console.log(`\n====================================================`);
console.log(`Test Results: ${passedTests}/${totalTests} Passed`);
console.log(`====================================================\n`);
