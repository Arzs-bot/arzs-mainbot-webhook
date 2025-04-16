import { google } from 'googleapis';
import { getOAuth2Client } from './sheetsOAuth.js';

export async function writeToSheet(event, reply) {
  const auth = await getOAuth2Client();
  const sheets = google.sheets({ version: 'v4', auth });

  const values = [
    [new Date().toISOString(), event.source.userId, event.message.text, reply.text],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: '訊息紀錄!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}