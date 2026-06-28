'use strict'

// Netlify Function: notify-dismiss
// Called when a user dismisses the announcement modal.
// Sends an email to the site owner via Resend.
//
// Required env vars (set in Netlify dashboard):
//   RESEND_API_KEY — from resend.com (free tier: 100 emails/day)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('RESEND_API_KEY not set')
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Not configured' }) }
  }

  let body = {}
  try { body = JSON.parse(event.body || '{}') } catch {}

  const ip =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    'unknown'

  // Best-effort geo lookup from IP (free, no key needed)
  let geo = ''
  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
    if (geoRes.ok) {
      const g = await geoRes.json()
      if (g.city) geo = `${g.city}, ${g.region}, ${g.country_name}`
    }
  } catch {}

  const {
    userAgent = 'unknown',
    timezone  = 'unknown',
    screen    = 'unknown',
    language  = 'unknown',
    timestamp = new Date().toISOString(),
    announcementId = 'unknown',
  } = body

  const html = `
    <h2 style="font-family:sans-serif;color:#ff2d78;">Modal Dismissed</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Announcement</td><td><strong>${announcementId}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Time</td><td>${new Date(timestamp).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' })} CT</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">IP</td><td>${ip}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Location</td><td>${geo || 'unavailable'}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Timezone</td><td>${timezone}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Screen</td><td>${screen}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Language</td><td>${language}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#888;">Browser</td><td style="font-size:12px;color:#555;">${userAgent}</td></tr>
    </table>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'World Cup Pool <onboarding@resend.dev>',
      to: 'drinkingtheink@gmail.com',
      subject: `Pool Party: someone saw the announcement`,
      html,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
    return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Email failed' }) }
  }

  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) }
}
