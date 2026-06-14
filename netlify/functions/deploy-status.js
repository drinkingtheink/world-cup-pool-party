'use strict'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function json(statusCode, body) {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  const { NETLIFY_ACCESS_TOKEN, NETLIFY_SITE_ID } = process.env
  if (!NETLIFY_ACCESS_TOKEN || !NETLIFY_SITE_ID) {
    return json(500, { error: 'Missing NETLIFY_ACCESS_TOKEN or NETLIFY_SITE_ID' })
  }

  try {
    const res = await fetch(
      `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys?per_page=1`,
      { headers: { Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}` } }
    )
    if (!res.ok) throw new Error(`Netlify API error: ${res.status}`)
    const [latest] = await res.json()
    if (!latest) return json(200, { state: 'unknown' })
    return json(200, { state: latest.state, createdAt: latest.created_at, id: latest.id })
  } catch (err) {
    return json(500, { error: err.message })
  }
}
