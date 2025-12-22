const express = require('express');
const OpenAI = require('openai');
require('dotenv').config(); // This connects to your .env file

const app = express();
app.use(express.json()); // This allows the server to read JSON sent from your frontend

// 1. Setup the OpenRouter client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.SITE_URL,
    "X-Title": process.env.SITE_NAME,
  }
});

// 2. Create the API Route
app.post('/api/chat', async (req, res) => {
  try {
    const { userPrompt } = req.body; // Getting the message from your frontend

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // You can change the model here
      messages: [
        { role: "user", content: userPrompt }
      ],
    });

    // Send the AI response back to your frontend
    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3. Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});