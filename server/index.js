import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * POST /api/generate-study-set
 * Receives user notes/topic and requests Groq LLM to generate structured study data.
 */
app.post('/api/generate-study-set', async (req, res) => {
  const { input } = req.body;

  // Validate request body
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid request: "input" is required and must not be empty.',
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({
      error: 'GROQ_API_KEY is not configured on the server. Please check your .env file.',
    });
  }

  const systemPrompt = `You are an expert educational study assistant. Given the user's study notes or topic, generate a comprehensive, high-quality study set.
You MUST respond ONLY with a valid JSON object matching this exact schema:
{
  "title": "A concise, engaging title for the study set",
  "flashcards": [
    {
      "question": "Clear concept question or key term",
      "answer": "Accurate, concise explanation or definition"
    }
  ],
  "quiz": [
    {
      "question": "Multiple choice question testing understanding",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The exact matching correct option from options"
    }
  ]
}
Generate between 3 to 6 flashcards and 3 to 5 multiple-choice quiz questions. Return pure JSON only without any markdown wrap or extra commentary.`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input.trim() },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.text();
      console.error('Groq API Error Response:', groqResponse.status, errorData);
      return res.status(groqResponse.status).json({
        error: `Groq API Error (${groqResponse.status}): ${errorData || groqResponse.statusText}`,
      });
    }

    const data = await groqResponse.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      return res.status(502).json({
        error: 'No content received from AI provider.',
      });
    }

    // Parse the JSON string from the AI response
    let parsedStudySet;
    try {
      parsedStudySet = JSON.parse(rawContent);
    } catch (parseError) {
      console.error('Failed to parse AI JSON response:', rawContent);
      return res.status(502).json({
        error: 'Failed to parse AI response into JSON format.',
      });
    }

    // Return structured study set
    return res.status(200).json(parsedStudySet);
  } catch (err) {
    console.error('Server error during study set generation:', err);
    return res.status(500).json({
      error: `Internal server error: ${err.message || 'Unknown error'}`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Study Assistant backend server listening on http://localhost:${PORT}`);
});
