// Celestia — Firebase Project Configuration
// -----------------------------------------------------------------------------
// This file holds the Firebase Web App config. These values are NOT secret —
// Firebase's client config is safe to expose in public source code (this is
// normal and expected for Firebase web apps). The real security boundary is
// the Firestore Security Rules you paste into the Firebase Console — see
// firestore.rules and FIREBASE_SETUP.md in this same folder.
//
// HOW TO FILL THIS IN (one-time setup, ~15-20 minutes):
//   1. Go to https://console.firebase.google.com and create a new project
//      (e.g. "celestia-registration"). Google Analytics is optional — you can
//      skip it.
//   2. In the project, click the </> (Web) icon to register a new Web App
//      (e.g. name it "Celestia Web"). You do NOT need Firebase Hosting —
//      GitHub Pages already hosts the site.
//   3. Firebase will show you a `firebaseConfig` object. Copy each value into
//      CELESTIA_FIREBASE_CONFIG below.
//   4. In the left sidebar, go to Build > Firestore Database > Create database.
//      Choose a region close to Thailand (e.g. asia-southeast1) and start in
//      "production mode" (we supply our own rules in firestore.rules).
//   5. In the left sidebar, go to Build > Authentication > Get started >
//      Sign-in method > enable "Email/Password".
//      Then go to the "Users" tab > Add user > enter your admin email
//      (pla_y_girl@hotmail.com) and choose a password. This is the ONLY
//      account that can approve/reject registrations via admin.html.
//   6. Update ADMIN_EMAIL below to match exactly the email you used in step 5.
//   7. Go to Firestore Database > Rules, and paste in the contents of
//      firestore.rules (in this folder), then click "Publish".
//
// Full walkthrough: see FIREBASE_SETUP.md in this same folder.

const CELESTIA_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBmlQjMHMtu657xh8gzAgoghEuA1-3e-os",
    authDomain: "celestia-registration.firebaseapp.com",
    projectId: "celestia-registration",
    storageBucket: "celestia-registration.firebasestorage.app",
    messagingSenderId: "806625771853",
    appId: "1:806625771853:web:63bc260b56c385c9823704"
};

// The only email allowed to approve/reject registrations in admin.html.
// Must exactly match the Firebase Authentication user you create in step 5 above.
const CELESTIA_ADMIN_EMAIL = "pla_y_girl@hotmail.com";

// The deployed Cloudflare Worker URL that gates the actual astrology
// database (see cloudflare-worker/ + WORKER_SETUP.md). Looks like
// "https://celestia-data-gate.YOUR-SUBDOMAIN.workers.dev" after `wrangler deploy`.
const CELESTIA_WORKER_URL = "https://celestia-data-gate.pla-y-girl.workers.dev";
