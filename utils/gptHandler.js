import fetch from 'node-fetch';

export async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return null;

  const userMessage = event.message.text;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是 ARZS 品牌的客服助理，請用清楚、有禮、實用的方式回答客戶問題。" },
        { role: "user", content: userMessage }
      ]
    })
  });

  const data = await response.json();
  const replyText = data.choices?.[0]?.message?.content || "⚠️ GPT 無回覆";
  return { type: 'text', text: replyText };
}