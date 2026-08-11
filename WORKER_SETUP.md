# Celestia — Cloudflare Worker Setup Guide (Data Gate)

This is the piece that makes the registration/approval system actually
protect your astrology database, instead of just gating a nicer-looking
screen. Do this **after** completing `FIREBASE_SETUP.md` steps 1-6 (you need
your Firebase project ID before this will work).

**No credit card required.** Cloudflare Workers' free plan (100,000
requests/day) doesn't ask for payment details to sign up or deploy.

Takes about 15-20 minutes.

## What this does

- Your real database (18 datasets, ~8.5MB — `PLANETARY_DB`, `HOUSE_DB`, etc.)
  is uploaded once into Cloudflare KV storage, a private key-value store.
- The Worker (`worker.js`) is a small server function: on every request, it
  verifies (a) the caller has a genuine, signature-valid Firebase sign-in
  token for a specific email, and (b) that email's Firestore status is
  `"approved"`. Only then does it return the data.
- `database.js` and `database_extra.js` no longer exist as public files on
  GitHub Pages — they've been moved to `non-github/` (gitignored, kept only
  as your local source-of-truth for regenerating the data later).

## 1. Create a free Cloudflare account

1. Go to https://dash.cloudflare.com/sign-up and sign up with your email
   (no card needed for the Workers Free plan).
2. Verify your email if prompted.

## 2. Install Wrangler (Cloudflare's CLI) and log in

Open a terminal in the `cloudflare-worker/` folder (inside `Celestia/`) and run:

```
npm install
npx wrangler login
```

This opens a browser tab to authorize Wrangler against your Cloudflare
account — no separate password to manage.

## 3. Create the KV namespace (where the data lives)

```
npx wrangler kv namespace create CELESTIA_KV
```

This prints something like:

```
{ binding = "CELESTIA_KV", id = "abcd1234...", ... }
```

Copy that `id` value into `wrangler.toml` in this folder, replacing
`PASTE_KV_NAMESPACE_ID_HERE`.

## 4. Fill in wrangler.toml

Open `wrangler.toml` and set:

- `FIREBASE_PROJECT_ID` — same `projectId` value from `../firebase-config.js`.
- `ALLOWED_ORIGIN` — your exact GitHub Pages URL origin, e.g.
  `https://yourusername.github.io` (no trailing slash, no path — just the
  scheme + host).

## 5. Upload the database into KV

The data is already prepared in `kv-data/*.json` (one file per dataset) and
bundled into `kv-data/_bulk.json` for a one-shot upload. From the
`cloudflare-worker/` folder:

```
npx wrangler kv bulk put kv-data/_bulk.json --namespace-id=YOUR_KV_NAMESPACE_ID
```

(Use the same `id` from step 3.) This uploads all 18 datasets (~8.5MB) in one
command. You should see 18 keys succeed.

**If you ever regenerate `database.js`/`database_extra.js`** (e.g. after
editing `Planetary.xlsx` and re-running `extract_db.py`), re-run the
extraction + this upload again — ask me and I'll regenerate `kv-data/` for
you from the updated files, then you just re-run this one command.

## 6. Deploy the Worker

```
npx wrangler deploy
```

This prints your live Worker URL, something like:

```
https://celestia-data-gate.yoursubdomain.workers.dev
```

## 7. Wire the URL back into the site

Copy that URL into `CELESTIA_WORKER_URL` in `../firebase-config.js`
(replacing `PASTE_WORKER_URL_HERE`).

The site's Content-Security-Policy already allows `https://*.workers.dev` in
`connect-src`, so no further edits are needed there unless you later attach a
custom domain to the Worker (in which case add that exact domain to the CSP
`connect-src` in `index.html`).

## 8. Test the Worker directly (optional sanity check)

```
curl -i https://YOUR-WORKER-URL.workers.dev
```

Expect `401` with `{"error":"missing bearer token"}` — that confirms the
Worker is live and rejecting unauthenticated requests, which is exactly what
it should do. The real end-to-end test is in `FIREBASE_SETUP.md` step 9
(register → approve → auto-unlock in the browser).

## Notes

- **Nothing here can incur a charge.** The Worker uses no paid Cloudflare
  features, and KV storage/reads for a small app like this stay well inside
  the free plan's daily limits (100,000 requests/day, 1GB KV storage).
- **No secrets stored in the Worker.** It doesn't need a Firebase service
  account key — it verifies tokens using Google's public keys and reads
  Firestore's already-public "check one registration's status" endpoint, so
  there's nothing sensitive to leak from the Worker's config.
- **Re-deploying after code changes:** if you ever edit `worker.js`, just run
  `npx wrangler deploy` again from `cloudflare-worker/`.
- **kv-data/ is gitignored on purpose** — it's the actual proprietary content.
  Keep it on your machine only; it's not needed after the upload in step 5
  succeeds (KV is now the live source the Worker reads from).
