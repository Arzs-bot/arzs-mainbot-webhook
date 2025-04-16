export async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return null;

  const userMessage = event.message.text;
  const replyText = `GPT 回覆：你說的是「${userMessage}」對吧？`;
  return { type: 'text', text: replyText };
}