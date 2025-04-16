export const config = {
  api: {
    bodyParser: false, // ❌ 停用自動解析
  }
};

const fetch = require("node-fetch");

function bufferToString(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", err => reject(err));
  });
}

async function callGPT(message) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    temperature: 0.7
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`OpenAI Error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const raw = await bufferToString(req);
    const parsed = raw ? JSON.parse(raw) : {};

    const { userId, message } = parsed;

    if (!userId || !message) {
      return res.status(200).json({ message: "LINE webhook verified (parsed fallback)" });
    }

    const gpt = await callGPT(message);
    const reply = gpt.choices[0].message.content;
    const usage = gpt.usage || { total_tokens: 0 };
    const tokens = usage.total_tokens;
    const cost = (tokens / 1000 * 0.0005).toFixed(6);

    await fetch("https://script.google.com/macros/s/AKfycbxila_RYe8-AnUgUzNUTHkYsdZFzxElpGrPkWRsPZgH2YVRwbpDVdBGpiF_iajqnp0R/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "log",
        data: {
          source: "主帳號",
          userId,
          message,
          gptReply: reply,
          tokens,
          cost
        }
      })
    });

    res.status(200).json({ reply });
  } catch (err) {
    console.error("GPT error:", err);
    res.status(200).json({ error: err.message }); // 仍回 200 給 LINE
  }
};
