const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 180;
const MAX_TEXT_LENGTH = 5000;
const MAX_HTML_LENGTH = 12000;

function doPost(event) {
  try {
    const payload = JSON.parse((event && event.postData && event.postData.contents) || '{}');
    const configuredSecret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!configuredSecret || !safeEqual(String(payload.secret || ''), configuredSecret)) {
      return jsonResponse({ ok: false, message: 'Unauthorized.' });
    }

    const to = normalizeEmail(payload.to);
    const replyTo = payload.replyTo ? normalizeEmail(payload.replyTo) : '';
    const subject = clean(payload.subject, MAX_SUBJECT_LENGTH, false);
    const text = clean(payload.text, MAX_TEXT_LENGTH, true);
    const html = clean(payload.html, MAX_HTML_LENGTH, true);
    if (!isEmail(to) || (replyTo && !isEmail(replyTo)) || !subject || !text || !html) {
      return jsonResponse({ ok: false, message: 'Invalid email request.' });
    }

    const options = { to: to, subject: subject, body: text, htmlBody: html, name: 'John Aaron Portfolio' };
    if (replyTo) options.replyTo = replyTo;
    MailApp.sendEmail(options);
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, message: 'Email delivery failed.' });
  }
}

function authorizeMailer() {
  return MailApp.getRemainingDailyQuota();
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, MAX_EMAIL_LENGTH + 1);
}

function isEmail(value) {
  return value.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value, limit, preserveNewlines) {
  const source = String(value || '').slice(0, limit + 1);
  let result = '';
  for (let index = 0; index < source.length; index += 1) {
    const code = source.charCodeAt(index);
    if (code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)) result += source[index];
  }
  result = result.trim();
  if (!preserveNewlines) result = result.replace(/[\r\n]+/g, ' ').replace(/[ \t]+/g, ' ');
  return result.length <= limit ? result : '';
}

function safeEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
