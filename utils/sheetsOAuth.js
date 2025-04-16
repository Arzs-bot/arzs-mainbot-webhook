import { google } from 'googleapis';

export async function getOAuth2Client() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  });

  return await auth.getClient();
}