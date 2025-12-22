const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- THE FIX: POWERFUL CORS SETTINGS ---
app.use(cors({
    origin: '*', // Allows any website to talk to your backend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// The Gate
app.post('/api/chat', async (req, res) => {
  try {
    const { userPrompt } = req.body;
    
    if (!userPrompt) {
        return res.status(400).json({ error: "No prompt provided" });
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: userPrompt }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Render Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});