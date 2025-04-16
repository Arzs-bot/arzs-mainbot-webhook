import { middleware } from '@line/bot-sdk';
import { handleMainBotEvent } from '../utils/mainHandler.js';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  const middlewareFn = middleware(config);
  await new Promise((resolve, reject) => middlewareFn(req, res, err => (err ? reject(err) : resolve())));
  const results = await Promise.all(req.body.events.map(handleMainBotEvent));
  res.json(results);
}