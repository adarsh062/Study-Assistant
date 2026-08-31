import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const apiKey = process.env.GROQ_API_KEY;
  console.log('Testing Groq with key:', apiKey ? 'Key found (length: ' + apiKey.length + ')' : 'No key');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        {
          role: 'system',
          content: 'You are an educational study assistant. Respond ONLY with valid JSON in this schema:\n{"title": "string", "flashcards": [{"question": "string", "answer": "string"}], "quiz": [{"question": "string", "options": ["string", "string", "string", "string"], "answer": "string"}]}\nDo not include markdown code block markers or explanation.'
        },
        { role: 'user', content: 'Photosynthesis and cellular respiration basics' },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Content:\n', data.choices?.[0]?.message?.content);
}

run();
