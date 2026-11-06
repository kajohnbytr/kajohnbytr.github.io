const CODE_TTL_SECONDS = 600
const CODE_COOLDOWN_SECONDS = 60
const MAX_VERIFY_ATTEMPTS = 5
const MAX_BODY_BYTES = 12_000

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const cors = corsHeaders(request, env)

    if (request.method === 'OPTIONS') {
      return cors ? new Response(null, { status: 204, headers: cors }) : json({ message: 'Origin not allowed.' }, 403)
    }
    if (!cors) return json({ message: 'Origin not allowed.' }, 403)
    if (request.method === 'GET' && url.pathname === '/api/health') return json({ ok: true }, 200, cors)
    if (request.method !== 'POST') return json({ message: 'Not found.' }, 404, cors)

    try {
      const data = await readJson(request)
      if (data.website) return json({ message: 'Request rejected.' }, 400, cors)
      if (url.pathname === '/api/request-code') return requestCode(request, data, env, cors)
      if (url.pathname === '/api/submit-message') return submitMessage(request, data, env, cors)
      return json({ message: 'Not found.' }, 404, cors)
    } catch (error) {
      if (error instanceof PublicError) return json({ message: error.message }, error.status, cors)
      console.error('Contact Worker error:', error instanceof Error ? error.message : 'Unknown error')
      return json({ message: 'The contact service is temporarily unavailable.' }, 500, cors)
    }
  },
}

async function requestCode(request, data, env, cors) {
  requireConfiguration(env)
  const email = normalizeEmail(data.email)
  if (!isEmail(email)) throw new PublicError('Enter a valid email address.', 400)

  const ipHash = await sha256(request.headers.get('CF-Connecting-IP') || 'unknown')
  const cooldownKey = `cooldown:${await sha256(email)}`
  if (await env.VERIFY_CODES.get(cooldownKey)) throw new PublicError('Please wait one minute before requesting another code.', 429)
  await enforceHourlyLimit(env, `request-ip:${ipHash}`, 10)

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0')
  const emailKey = await sha256(email)
  const codeHash = await sha256(`${email}:${code}:${env.OTP_PEPPER}`)
  await env.VERIFY_CODES.put(`verify:${emailKey}`, JSON.stringify({ codeHash, attempts: 0, expiresAt: Date.now() + CODE_TTL_SECONDS * 1000 }), { expirationTtl: CODE_TTL_SECONDS })
  await env.VERIFY_CODES.put(cooldownKey, '1', { expirationTtl: CODE_COOLDOWN_SECONDS })

  const safeCode = escapeHtml(code)
  await sendEmail(env, {
    to: email,
    subject: 'Your portfolio contact verification code',
    text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#0f172a"><h2>Verify your email</h2><p>Use this code to send your portfolio message:</p><p style="font-size:32px;font-weight:800;letter-spacing:8px">${safeCode}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p></div>`,
  })
  return json({ message: 'Verification code sent.' }, 200, cors)
}

async function submitMessage(request, data, env, cors) {
  requireConfiguration(env)
  const fields = validateMessage(data)
  const emailKey = await sha256(fields.email)
  const verificationKey = `verify:${emailKey}`
  const record = await env.VERIFY_CODES.get(verificationKey, 'json')
  if (!record) throw new PublicError('The verification code is invalid or expired. Request a new code.', 400)
  const remainingTtl = Math.floor((Number(record.expiresAt) - Date.now()) / 1000)
  if (!Number.isFinite(remainingTtl) || remainingTtl <= 0) {
    await env.VERIFY_CODES.delete(verificationKey)
    throw new PublicError('The verification code is invalid or expired. Request a new code.', 400)
  }
  if ((record.attempts || 0) >= MAX_VERIFY_ATTEMPTS) {
    await env.VERIFY_CODES.delete(verificationKey)
    throw new PublicError('Too many incorrect attempts. Request a new code.', 429)
  }

  const submittedHash = await sha256(`${fields.email}:${fields.verificationCode}:${env.OTP_PEPPER}`)
  if (!constantTimeEqual(record.codeHash, submittedHash)) {
    await env.VERIFY_CODES.put(verificationKey, JSON.stringify({ ...record, attempts: (record.attempts || 0) + 1 }), { expirationTtl: remainingTtl })
    throw new PublicError('The verification code is incorrect.', 400)
  }

  const ipHash = await sha256(request.headers.get('CF-Connecting-IP') || 'unknown')
  await enforceHourlyLimit(env, `submit-ip:${ipHash}`, 5)
  const name = escapeHtml(fields.name)
  const email = escapeHtml(fields.email)
  const subject = escapeHtml(fields.subject)
  const message = escapeHtml(fields.message).replace(/\n/g, '<br>')
  await sendEmail(env, {
    to: env.CONTACT_TO,
    replyTo: fields.email,
    subject: `Verified portfolio inquiry: ${fields.subject}`,
    text: `Verified sender: ${fields.name} <${fields.email}>\nSubject: ${fields.subject}\n\n${fields.message}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:24px;color:#0f172a"><h2>Verified portfolio inquiry</h2><p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subject}</p><hr><p style="line-height:1.7">${message}</p></div>`,
  })
  await env.VERIFY_CODES.delete(verificationKey)
  return json({ message: 'Message sent successfully.' }, 200, cors)
}

function validateMessage(data) {
  const name = clean(data.name)
  const email = normalizeEmail(data.email)
  const subject = clean(data.subject)
  const message = clean(data.message, true)
  const verificationCode = String(data.verificationCode || '').trim()
  if (!/^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,79}$/u.test(name)) throw new PublicError('Enter a valid name.', 400)
  if (!isEmail(email)) throw new PublicError('Enter a valid email address.', 400)
  if (subject.length < 3 || subject.length > 120 || /[\r\n]/.test(subject)) throw new PublicError('Enter a valid subject.', 400)
  if (message.length < 10 || message.length > 2000) throw new PublicError('Enter a message using 10-2000 characters.', 400)
  if (!/^\d{6}$/.test(verificationCode)) throw new PublicError('Enter the six-digit verification code.', 400)
  if ([name, subject, message].some(isSuspicious)) throw new PublicError('Remove unsafe markup, code, or excessive links.', 400)
  return { name, email, subject, message, verificationCode }
}

async function readJson(request) {
  const contentLength = Number(request.headers.get('Content-Length') || 0)
  if (contentLength > MAX_BODY_BYTES) throw new PublicError('Request is too large.', 413)
  const text = await request.text()
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) throw new PublicError('Request is too large.', 413)
  try { return JSON.parse(text) } catch { throw new PublicError('Invalid request.', 400) }
}

async function enforceHourlyLimit(env, key, limit) {
  const count = Number(await env.VERIFY_CODES.get(key) || 0)
  if (count >= limit) throw new PublicError('Too many requests. Please try again later.', 429)
  await env.VERIFY_CODES.put(key, String(count + 1), { expirationTtl: 3600 })
}

async function sendEmail(env, { to, subject, text, html, replyTo }) {
  const response = await fetch(env.GAS_WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret: env.GAS_SHARED_SECRET, to, subject, text, html, replyTo: replyTo || '' }),
    redirect: 'follow',
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    console.error('Google Apps Script rejected email:', response.status)
    throw new PublicError('Email delivery failed. Please try again later.', 502)
  }
  if (!result?.ok) throw new PublicError(result?.message || 'Email delivery failed. Please try again later.', 502)
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin')
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean)
  if (!origin || !allowed.includes(origin)) return null
  return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' }
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders } })
}

function clean(value, preserveNewlines = false) {
  const cleaned = [...String(value || '')].filter((character) => {
    const code = character.charCodeAt(0)
    return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127)
  }).join('').trim()
  return preserveNewlines ? cleaned.replace(/\r\n/g, '\n') : cleaned.replace(/[ \t]+/g, ' ')
}
function normalizeEmail(value) { return clean(value).toLowerCase() }
function isEmail(value) { return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) }
function isSuspicious(value) { return /<\s*script|javascript\s*:|data\s*:\s*text\/html|on(?:error|load|click)\s*=|\b(?:union\s+select|drop\s+table)\b/i.test(value) || (value.match(/https?:\/\//gi) || []).length > 3 }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]) }
async function sha256(value) { const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)); return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('') }
function constantTimeEqual(left, right) { if (typeof left !== 'string' || left.length !== right.length) return false; let mismatch = 0; for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index); return mismatch === 0 }
function requireConfiguration(env) { if (!env.VERIFY_CODES || !env.GAS_WEB_APP_URL || !env.GAS_SHARED_SECRET || !env.OTP_PEPPER || !env.CONTACT_TO) throw new Error('Worker is missing required configuration.') }

class PublicError extends Error {
  constructor(message, status) { super(message); this.status = status }
}
