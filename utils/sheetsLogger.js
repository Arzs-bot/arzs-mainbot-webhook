import { google } from 'googleapis';
import { getOAuth2Client } from './sheetsOAuth.js';

export async function appendToSheet({ timestamp, source, userId, content, gptReply, tokens, cost }) {
  const auth = await getOAuth2Client();
  const sheets = google.sheets({ version: 'v4', auth });
  const values = [[timestamp, source, userId, content, gptReply, tokens, cost]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: '訊息紀錄!A:G',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  });
}