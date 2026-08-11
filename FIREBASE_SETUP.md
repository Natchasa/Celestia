# Celestia — Firebase Registration/Approval Setup Guide

This turns Celestia's old shared-password gate into a real access-control
system: visitors register and verify their email → you approve/reject them
from a private admin page → **only approved, verified visitors ever receive
the actual astrology database**, served through a Cloudflare Worker gate
(see `WORKER_SETUP.md` — do that guide too, it's the other half of this
system).

One-time setup takes about 30-40 minutes total across both guides. You only
do this once.

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click **Add project**, name it e.g. `celestia-registration`, and finish the
   wizard (Google Analytics is optional — you can turn it off).
3. This stays on the free **Spark plan** — nothing in this guide requires
   Blaze/billing or a credit card.

## 2. Register a Web App

1. On the project overview page, click the **`</>`** (Web) icon.
2. Give it a nickname, e.g. `Celestia Web`. You do **not** need Firebase
   Hosting — GitHub Pages already hosts the site.
3. Firebase shows a `firebaseConfig` object. Copy each value into
   `firebase-config.js` (in this folder) — replace the `PASTE_...` placeholders.

## 3. Turn on Firestore (the database)

1. Left sidebar → **Build → Firestore Database → Create database**.
2. Pick a region close to Thailand, e.g. `asia-southeast1`.
3. Choose **Production mode** (we provide our own rules in the next step).

## 4. Paste in the security rules

1. Left sidebar → **Firestore Database → Rules** tab.
2. Delete the default contents and paste in everything from `firestore.rules`
   (in this folder).
3. Click **Publish**.

These rules mean: anyone can check the status of *their own* registration by
email, only you (the admin) can see the full list or approve/reject anyone,
and a visitor can only create their own request as "pending" — they can never
approve themselves.

## 5. Turn on sign-in methods

1. Left sidebar → **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Email/Password** (this is for *your*
   admin login only — `admin.html` uses it).
3. Also enable **Email link (passwordless sign-in)** — this is what visitors
   use. Toggle it on and save. No extra cost, free up to 50,000 monthly
   active users on the Spark plan.
4. Go to the **Settings** tab (within Authentication) → **Authorized
   domains** → **Add domain** → add your GitHub Pages domain, e.g.
   `yourusername.github.io` (no `https://`, no trailing slash, no path).
   Without this, Firebase will refuse to send/complete sign-in links from
   your live site.

## 6. Create your admin login

1. Still in **Authentication → Users** tab → **Add user**.
2. Email: `pla_y_girl@hotmail.com` (or whichever email you want to log into
   `admin.html` with). Password: choose something only you know.
3. Make sure `CELESTIA_ADMIN_EMAIL` in `firebase-config.js` matches this email
   exactly — the security rules check against that value.

## 7. Now do the Cloudflare Worker setup

Open **`WORKER_SETUP.md`** in this folder and complete it before testing —
without a deployed Worker + `CELESTIA_WORKER_URL` filled in, approved
visitors will get stuck on "โหลดข้อมูลไม่สำเร็จ" after approval.

## 8. Upload to GitHub

Push the whole `Celestia` folder to your GitHub repo as usual. Double-check
`.gitignore` — it now also excludes `cloudflare-worker/kv-data/` (the
proprietary database, pre-formatted for KV upload) so it never reaches the
public repo. `firestore.rules` doesn't need to be on GitHub either (it only
matters inside the Firebase Console, step 4) but there's no harm keeping it
as documentation.

## 9. Try it end-to-end

1. Open your live GitHub Pages URL in a private/incognito window. Register
   with a test email you can actually receive mail at.
2. You'll land on "ส่งลิงก์ยืนยันไปที่..." — check that inbox, click the
   sign-in link. You'll be returned to the site and land on "รออนุมัติ".
3. Open `yoursite.github.io/.../admin.html`, log in with the admin
   email/password from step 6. You should see the test registration. Click
   **อนุมัติ (Approve)**.
4. Switch back to the incognito window — within a few seconds it should show
   "กำลังโหลดข้อมูล..." then unlock the full app with no refresh needed.

## Notes

- **Free tier is plenty.** Firestore's free quota (Spark plan) is ~50,000
  reads and ~20,000 writes per day, and Email Link sign-in is free to 50,000
  monthly active users — far more than this app needs.
- **The `firebaseConfig` values are not secret.** It's normal and expected for
  them to be visible in your public GitHub repo / browser source. The actual
  access control lives in the Firestore rules (step 4), the Authentication
  setup (steps 5-6), and the Cloudflare Worker (`WORKER_SETUP.md`).
- **EmailJS notification (optional).** If you want an extra email to land in
  your inbox the moment someone registers (on top of checking admin.html),
  fill in `EMAILJS_PUBLIC_KEY` / `EMAILJS_SERVICE_ID` / `EMAILJS_TEMPLATE_ID`
  in `auth.js`. If left blank, registration still works fine.
- **Changing the admin password later:** Firebase Console → Authentication →
  Users → the row for your admin account → the "⋮" menu → Reset password.
- **If a test email never arrives:** check spam, and double-check the
  Authorized domains step (5.4) — a missing domain is the most common cause
  of silently-failing sign-in links.
