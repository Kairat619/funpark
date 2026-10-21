// Sends a form submission to the Telegram relay worker (see worker/).
// Resolves when the message was delivered; throws otherwise.
// Without VITE_LEAD_ENDPOINT (e.g. local development) nothing is sent.
const endpoint = import.meta.env.VITE_LEAD_ENDPOINT;

export const isLeadDeliveryConfigured = Boolean(endpoint);

export async function sendLead(type, data, { website = '' } = {}) {
  if (!endpoint) {
    if (import.meta.env.DEV) {
      console.info('[sendLead] VITE_LEAD_ENDPOINT not set; skipped', type, data);
    }
    return;
  }

  // LanguageContext keeps <html lang> in sync with the selected language
  const language = document.documentElement.lang || 'ru';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, language, website, ...data })
  });

  if (!response.ok) {
    throw new Error(`Lead delivery failed (${response.status})`);
  }
}
