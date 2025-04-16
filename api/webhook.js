
const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { userId, message } = req.body;

  const gptReply = "這是模擬 GPT 回覆";
  const tokens = 120;
  const cost = 0.00006;

  await fetch("https://script.google.com/macros/s/AKfycbxila_RYe8-AnUgUzNUTHkYsdZFzxElpGrPkWRsPZgH2YVRwbpDVdBGpiF_iajqnp0R/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "log",
      data: {
        source: "主帳號",
        userId,
        message,
        gptReply,
        tokens,
        cost
      }
    })
  });

  res.status(200).json({ message: gptReply });
};
