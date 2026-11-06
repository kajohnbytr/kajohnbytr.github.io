# Free contact verification setup: Cloudflare + Google Apps Script

No purchased domain is required. The portfolio stays on GitHub Pages, a free Cloudflare Worker validates requests and codes, and Google Apps Script sends email through `aronjunio02@gmail.com`.

## What the system does

1. A visitor enters an email and requests a code.
2. The Cloudflare Worker creates a six-digit code, stores only its hash, and asks Google Apps Script to email it.
3. The visitor enters the code and submits the form.
4. After verification, Apps Script emails the message to `aronjunio02@gmail.com` with the verified visitor set as Reply-To.

Google personal accounts currently have an Apps Script limit of 100 email recipients per day. A code email and a delivered contact message each consume one recipient from that quota.

## 1. Create the Google Apps Script

1. Open <https://script.google.com> while signed in to `aronjunio02@gmail.com`.
2. Click **New project** and name it `Portfolio Contact Mailer`.
3. Replace the contents of `Code.gs` with the repository file `google-apps-script/Code.gs`.
4. Open **Project Settings**, enable **Show "appsscript.json" manifest file in editor**, then replace that manifest with `google-apps-script/appsscript.json`.
5. In **Project Settings > Script Properties**, add:
   - Property: `SHARED_SECRET`
   - Value: a long random secret of at least 32 characters
6. Keep this value private. You will enter the exact same value into Cloudflare later.

## 2. Authorize and deploy Apps Script

1. In the script editor, select `authorizeMailer` and click **Run**.
2. Review and approve the requested send-email permission.
3. Click **Deploy > New deployment**.
4. Select **Web app**.
5. Set **Execute as** to **Me**.
6. Set **Who has access** to **Anyone**.
7. Click **Deploy**.
8. Copy the Web App URL ending in `/exec`. Do not use the `/dev` test URL.

The endpoint must be reachable so Cloudflare can call it, but requests are rejected unless they contain the private shared secret.

## 3. Create Cloudflare KV storage

From PowerShell in the repository:

```powershell
cd worker
npm install
npx wrangler login
npx wrangler kv namespace create VERIFY_CODES
npx wrangler kv namespace create VERIFY_CODES --preview
```

Copy the generated IDs into `id` and `preview_id` in `worker/wrangler.toml`.

## 4. Add Cloudflare secrets

Run these commands from the `worker` directory:

```powershell
npx wrangler secret put GAS_WEB_APP_URL
npx wrangler secret put GAS_SHARED_SECRET
npx wrangler secret put OTP_PEPPER
```

- For `GAS_WEB_APP_URL`, paste the Apps Script `/exec` URL.
- For `GAS_SHARED_SECRET`, paste the exact `SHARED_SECRET` stored in Apps Script.
- For `OTP_PEPPER`, use a different random value of at least 32 characters.

Never put these values in `wrangler.toml`, a `VITE_` variable, or Git. Browser-side `VITE_` values are public.

## 5. Deploy the Worker

```powershell
npm run deploy
```

Copy the resulting URL, similar to:

```text
https://portfolio-contact-verification.YOUR-SUBDOMAIN.workers.dev
```

The `workers.dev` subdomain is free and no custom domain is needed.

## 6. Connect local development

Copy `.env.example` to `.env.local`, then set:

```env
VITE_CONTACT_API_URL=https://portfolio-contact-verification.YOUR-SUBDOMAIN.workers.dev
```

Run `npm run dev` from the repository root.

## 7. Connect GitHub Pages

1. Open the GitHub repository.
2. Go to **Settings > Secrets and variables > Actions > Variables**.
3. Create `VITE_CONTACT_API_URL` and use the deployed Worker URL as its value.
4. Push to `main`. The Pages workflow supplies this URL during the build.

The Worker URL is public configuration. Only the Apps Script URL, shared secret, and OTP pepper must remain in Cloudflare secrets.

## 8. Test everything

1. Open the deployed portfolio.
2. Enter an email you control and click **Send code**.
3. Confirm the code arrives from `aronjunio02@gmail.com`.
4. Enter the code and send a test message.
5. Confirm the message reaches `aronjunio02@gmail.com`.
6. Click Reply and confirm the recipient is the verified visitor address.
7. Try an incorrect code and confirm it is rejected.

Codes expire after 10 minutes, permit five attempts, and are stored only as salted hashes. The Worker also applies origin checks, payload limits, request cooldowns, IP throttling, a honeypot, and server-side validation.

## Updating Apps Script later

Editing `Code.gs` does not automatically update the deployed Web App version. After any change:

1. Open **Deploy > Manage deployments**.
2. Edit the existing deployment.
3. Select **New version**.
4. Click **Deploy**.

The `/exec` URL normally remains unchanged when the existing deployment is updated.
