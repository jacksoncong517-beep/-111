import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Proxy endpoint for OpenAI API (keeps API key server-side)
app.post('/api/chat', async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  try {
    const systemPrompt = req.body.system || '';
    const messages = req.body.messages || [];

    // OpenAI format: system message goes as first message with role "system"
    const openaiMessages = [];
    if (systemPrompt) {
      openaiMessages.push({ role: 'system', content: systemPrompt });
    }
    openaiMessages.push(...messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: req.body.model || 'gpt-4o',
        max_tokens: req.body.max_tokens || 2048,
        messages: openaiMessages,
      }),
    });

    const data = await response.json();

    // Convert OpenAI response format to match frontend expectations
    if (data.choices && data.choices[0]) {
      res.json({
        content: [{ type: 'text', text: data.choices[0].message.content }],
      });
    } else {
      res.json({ content: [{ type: 'text', text: data.error?.message || '请求失败' }] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static files from Vite build
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Actuarial Copilot Pro running on port ${PORT}`);
});
