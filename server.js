import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// 可用的 OpenAI / ChatGPT 模型白名单
const ALLOWED_MODELS = new Set([
  'gpt-4o',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4o-mini',
]);

function normalizeMessages(messages = []) {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((m) => m && typeof m === 'object')
    .map((m) => {
      const role = ['system', 'user', 'assistant'].includes(m.role) ? m.role : 'user';

      // 兼容前端可能传来的 Anthropic/OpenAI 混合 content 结构
      let content = m.content;
      if (Array.isArray(content)) {
        content = content
          .map((item) => {
            if (typeof item === 'string') return item;
            if (item?.type === 'text') return item.text || '';
            return '';
          })
          .join('\n');
      }

      if (typeof content !== 'string') {
        content = String(content ?? '');
      }

      return { role, content };
    })
    .filter((m) => m.content.trim().length > 0);
}

app.post('/api/chat', async (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY not configured',
      content: [{ type: 'text', text: '服务器未配置 OPENAI_API_KEY。' }],
    });
  }

  try {
    const systemPrompt = typeof req.body.system === 'string' ? req.body.system : '';
    const messages = normalizeMessages(req.body.messages || []);

    // 强制使用 ChatGPT 模型，忽略前端传来的 claude-sonnet-* 等非法模型名
    const requestedModel = typeof req.body.model === 'string' ? req.body.model : '';
    const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : 'gpt-4o-mini';

    const openaiMessages = [];
    if (systemPrompt.trim()) {
      openaiMessages.push({ role: 'system', content: systemPrompt.trim() });
    }
    openaiMessages.push(...messages);

    if (openaiMessages.length === 0) {
      return res.status(400).json({
        error: 'No valid messages provided',
        content: [{ type: 'text', text: '没有收到可用的消息内容。' }],
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: openaiMessages,
        max_tokens: Number.isFinite(req.body.max_tokens) ? req.body.max_tokens : 2048,
        temperature: typeof req.body.temperature === 'number' ? req.body.temperature : 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'OpenAI request failed',
        content: [{
          type: 'text',
          text: `OpenAI 请求失败：${data?.error?.message || '未知错误'}`,
        }],
      });
    }

    const text = data?.choices?.[0]?.message?.content;

    return res.json({
      provider: 'openai',
      model,
      content: [{ type: 'text', text: text || '模型未返回内容。' }],
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
      content: [{ type: 'text', text: `服务器错误：${err.message}` }],
    });
  }
});

app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Actuarial Copilot Pro running on port ${PORT}`);
});
