# FunPark Kazakhstan

A client-side React storefront for playground and fitness equipment. The project uses Vite for development and production builds; it does not include a backend or require a database.

## Requirements

- Node.js 20.19.x or Node.js 22.12 or newer
- npm (included with Node.js)

## Local development

1. Open a terminal in the project directory.
2. Install the locked dependencies:

   ```sh
   npm ci
   ```

3. Optionally create a local environment file. In PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   No environment variables are required for local development.

4. Start the development server:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Production build and preview

Build the static site into `dist/`:

```sh
npm run build
```

Serve that build locally:

```sh
npm run start
```

The preview is available at [http://localhost:3000](http://localhost:3000). For production hosting, deploy the contents of `dist/` to a static web host.

## Environment variables

The storefront has no required environment variables. The Vite config accepts these optional variables for production builds:

| Variable | Purpose |
| --- | --- |
| `VITE_LEAD_ENDPOINT` | URL of the Telegram relay worker that receives form submissions. See [Telegram notifications for forms](#telegram-notifications-for-forms). |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for price list requests. See [WhatsApp price list requests](#whatsapp-price-list-requests). |
| `TEMPLATE_BANNER_SCRIPT_URL` | URL of a script to inject into the production page. |
| `TEMPLATE_REDIRECT_URL` | Value supplied to that script as its `template-redirect-url` attribute. |

Both values must be set for the script to be injected. Leave them blank for ordinary local or production builds. Vite reads them from `.env` files and the process environment.

## WhatsApp price list requests

The price list form in the hero opens WhatsApp (app or web) with a pre-filled message, in the visitor's language, containing their name and phone number. The visitor taps Send, so the request arrives from their own WhatsApp account. No server or API key is involved.

The receiving number is set with `VITE_WHATSAPP_NUMBER` (digits only, with country code, e.g. `77011234567`). When it is not set, the test number `77024883117` is used. Rebuild after changing it.

## Telegram notifications for forms

The contact, newsletter and play space quote forms send submissions to a Telegram chat through a small Cloudflare Worker in `worker/`. The worker keeps the bot token secret; the website only knows the worker's URL.

1. **Create the bot.** In Telegram, message [@BotFather](https://t.me/BotFather), send `/newbot`, and copy the token it gives you.
2. **Choose the chat.** Add the bot to the group that should receive leads (or start a private chat with it) and send any message there. Then open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and copy the `chat.id` value (group ids start with `-`).
3. **Deploy the worker** (requires a free Cloudflare account):

   ```sh
   cd worker
   npx wrangler@4 login
   npx wrangler@4 secret put TELEGRAM_BOT_TOKEN
   npx wrangler@4 secret put TELEGRAM_CHAT_ID
   npx wrangler@4 deploy
   ```

   The deploy prints a URL such as `https://funpark-leads.<account>.workers.dev`. If the site is served from another domain, add it to `ALLOWED_ORIGINS` in `worker/wrangler.toml` and deploy again.
4. **Point the site at the worker.** Set `VITE_LEAD_ENDPOINT` to that URL in a `.env` file, then rebuild with `npm run build` and upload the new `dist/`.

Without `VITE_LEAD_ENDPOINT` the forms work as before but nothing is sent. If the worker or Telegram is unreachable, visitors see a "could not send" message and their input is kept so they can retry.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Vite development server. |
| `npm run build` | Generate `public/llms.txt` and build the static site into `dist/`. |
| `npm run start` | Preview the production build locally. |
| `npm run lint` | Run ESLint. |

## Project structure

- `src/` — React application, pages, contexts, hooks, and UI components.
- `plugins/` — Vite development plugins for visual editing and embedded previews.
- `public/` — Static assets and crawl metadata.
- `tools/` — Build-time scripts.

Cart and wishlist data are stored in the browser's local storage. Product imagery is loaded from an external CDN, so an internet connection is needed to display those images.
