import fetch from 'node-fetch';
import { appendToSheet } from './sheetsLogger.js';

export async function handleMainBotEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const input = event.message.text;
  const userId = event.source.userId;

  const prompt = [
    { role: 'system', content: '你是 ARZS 客服助理，請用簡潔、友善、專業的語氣回答客戶訊息。' },
    { role: 'user', content: input }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: prompt
    })
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || '抱歉，稍後再回覆您';

  const tokens = data.usage?.total_tokens || 150;
  const cost = (tokens / 1000 * 0.0005).toFixed(6);

  await appendToSheet({
    timestamp: new Date().toISOString(),
    source: "主帳號",
    userId,
    content: input,
    gptReply: reply,
    tokens,
    cost
  });

  return { type: "text", text: reply };
}