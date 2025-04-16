import { middleware } from '@line/bot-sdk';
import { handleEvent } from '../utils/gptHandler.js';
import { writeToSheet } from '../utils/sheetsHandler.js';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const middlewareFn = middleware(config);

  await new Promise((resolve, reject) => {
    middlewareFn(req, res, (err) => (err ? reject(err) : resolve()));
  });

  const events = req.body.events;
  const results = await Promise.all(events.map(async (event) => {
    const reply = await handleEvent(event);
    await writeToSheet(event, reply);
    return reply;
  }));

  res.json(results);
}