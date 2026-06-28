'use strict'

// Netlify Function: notify-dismiss
// Called when a user dismisses the announcement modal.
// Logs visitor info — view in Netlify dashboard → Functions → notify-dismiss → Logs.

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

  let body = {}
  try { body = JSON.parse(event.body || '{}') } catch {}

  const ip =
    event.headers['x-forwarded-for']?.split(',')[0].trim() ||
    event.headers['client-ip'] ||
    'unknown'

  // Best-effort geo lookup from IP (free, no key needed)
  let geo = 'unavailable'
  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
    if (geoRes.ok) {
      const g = await geoRes.json()
      if (g.city) geo = `${g.city}, ${g.region}, ${g.country_name}`
    }
  } catch {}

  const {
    userAgent      = 'unknown',
    timezone       = 'unknown',
    screen         = 'unknown',
    language       = 'unknown',
    timestamp      = new Date().toISOString(),
    announcementId = 'unknown',
  } = body

  const timeStr = new Date(timestamp).toLocaleString('en-US', {
    timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short',
  })

  console.log([
    `[modal-dismiss] ${announcementId}`,
    `  time:     ${timeStr} CT`,
    `  ip:       ${ip}`,
    `  location: ${geo}`,
    `  timezone: ${timezone}`,
    `  screen:   ${screen}`,
    `  language: ${language}`,
    `  browser:  ${userAgent}`,
  ].join('\n'))

  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) }
}
