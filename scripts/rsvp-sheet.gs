/**
 * RSVP collector for the Abey & Asha wedding invitation.
 *
 * Paste this into a new Apps Script project (script.new, or Extensions → Apps Script
 * from the sheet), then deploy it as a Web app: Execute as "Me", Who has access "Anyone".
 * Each reply from the invitation website is added as a row on the sheet's first tab.
 */

// "Abey & Asha Wedding RSVPs" in Google Drive.
const SHEET_ID = '1jsMjUry6Hf9kJUxKqmGsJ9USIkf-iwm-QGc-Od-Q9YE';

// Optional: put an email address here to get an email for every reply.
// Leave it empty ('') if the sheet alone is enough.
const NOTIFY_EMAIL = '';

const HEADERS = ['Received', 'Name', 'Response', 'Guests attending'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};

    // Hidden field that people never see; automated spam bots fill it in.
    if (p.website) return json({ result: 'ok' });

    const name = clean(p.guestName, 120);
    const attending = p.attendance === 'yes';
    const response = attending ? 'Joyfully accepts' : p.attendance === 'no' ? 'Regretfully declines' : '';
    if (!name || !response) return json({ result: 'error', message: 'Name and response are required.' });

    const guests = attending ? Math.max(1, Math.min(50, parseInt(p.guestCount, 10) || 1)) : 0;
    getSheet().appendRow([new Date(), name, response, guests]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, `Wedding RSVP: ${name} (${response})`,
        `${name} ${attending ? `joyfully accepts, ${guests} attending` : 'regretfully declines'}.`);
    }
    return json({ result: 'ok' });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web app URL in a browser shows this, which confirms the deployment works.
function doGet() {
  return ContentService.createTextOutput('RSVP collector is running.');
}

function getSheet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  if (sheet.getFrozenRows() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trims and limits text, and stops a value being read as a spreadsheet formula.
function clean(value, max) {
  const text = String(value || '').trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
