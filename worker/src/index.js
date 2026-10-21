// FunPark.kz lead relay: receives form submissions from the website and
// forwards them to a Telegram chat. The bot token never reaches the browser.
//
// Secrets (set with `npx wrangler secret put <NAME>`):
//   TELEGRAM_BOT_TOKEN  token from @BotFather
//   TELEGRAM_CHAT_ID    chat, group or channel id that receives the messages
// Vars (wrangler.toml):
//   ALLOWED_ORIGINS     comma-separated site origins allowed to submit

const MAX_BODY_BYTES = 10_000;
const LANGUAGES = ['en', 'ru', 'kk', 'zh'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Each field: [label, kind, maxLength, required]
const FORMS = {
  contact: {
    title: '✉️ Contact form',
    fields: {
      name: ['Name', 'text', 100, true],
      email: ['Email', 'email', 200, true],
      message: ['Message', 'text', 2000, true]
    }
  },
  quote: {
    title: '🧮 Play space quote',
    fields: {
      items: ['Equipment', 'list', 200, true],
      total: ['Estimated total', 'text', 30, true]
    }
  },
  newsletter: {
    title: '📰 Newsletter signup',
    fields: {
      email: ['Email', 'email', 200, true]
    }
  }
};

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const json = (body, status, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  });

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin'
});

// Returns the cleaned value, or null if the field is invalid
const cleanField = (raw, [, kind, maxLength, required]) => {
  if (raw === undefined || raw === null || raw === '') {
    return required ? null : '';
  }
  if (kind === 'list') {
    if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) return null;
    const items = raw.map(item => (typeof item === 'string' ? item.trim() : ''));
    return items.every(item => item && item.length <= maxLength) ? items : null;
  }
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (value.length > maxLength || (required && !value)) return null;
  if (kind === 'email' && !EMAIL_RE.test(value)) return null;
  return value;
};

const formatMessage = (form, values, language) => {
  const lines = [`<b>${form.title}</b>`, ''];
  for (const [key, field] of Object.entries(form.fields)) {
    const value = values[key];
    if (!value || value.length === 0) continue;
    if (Array.isArray(value)) {
      lines.push(`<b>${field[0]}:</b>`);
      value.forEach(item => lines.push(`• ${escapeHtml(item)}`));
    } else {
      lines.push(`<b>${field[0]}:</b> ${escapeHtml(value)}`);
    }
  }
  if (language) lines.push('', `<i>Site language: ${language}</i>`);
  return lines.join('\n');
};

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    if (!allowed.includes(origin)) {
      return json({ ok: false, error: 'origin_not_allowed' }, 403);
    }
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, cors);
    }
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return json({ ok: false, error: 'not_configured' }, 500, cors);
    }

    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'too_large' }, 413, cors);
    }
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ ok: false, error: 'invalid_json' }, 400, cors);
    }

    // Honeypot: real visitors never see or fill this field
    if (body.website) {
      return json({ ok: true }, 200, cors);
    }

    const form = FORMS[body.type];
    if (!form) {
      return json({ ok: false, error: 'unknown_form' }, 400, cors);
    }

    const values = {};
    for (const [key, field] of Object.entries(form.fields)) {
      const value = cleanField(body[key], field);
      if (value === null) {
        return json({ ok: false, error: 'invalid_field', field: key }, 400, cors);
      }
      values[key] = value;
    }
    const language = LANGUAGES.includes(body.language) ? body.language : '';

    const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: formatMessage(form, values, language),
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    if (!telegram.ok) {
      console.error('Telegram error', telegram.status, await telegram.text());
      return json({ ok: false, error: 'delivery_failed' }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  }
};
