// Celestia — Firebase Bootstrap (ES module)
// -----------------------------------------------------------------------------
// Loaded as <script type="module"> AFTER firebase-config.js. Initializes the
// Firebase app, Firestore, and Auth, then exposes a small, stable surface on
// window.CelestiaFirebase so the classic (non-module) scripts auth.js and
// admin.js can use Firebase without themselves being modules.
//
// Dispatches a 'celestia-firebase-ready' event on `window` once ready (or
// 'celestia-firebase-error' if init fails), since module scripts execute
// asynchronously relative to classic scripts and auth.js/admin.js need to
// wait for this before touching window.CelestiaFirebase.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    collection,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

try {
    if (typeof CELESTIA_FIREBASE_CONFIG === "undefined") {
        throw new Error("CELESTIA_FIREBASE_CONFIG is missing — make sure firebase-config.js loads before firebase-init.js");
    }

    const app = initializeApp(CELESTIA_FIREBASE_CONFIG);
    const db = getFirestore(app);
    const auth = getAuth(app);

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    window.CelestiaFirebase = {
        db,
        auth,
        adminEmail: typeof CELESTIA_ADMIN_EMAIL !== "undefined" ? CELESTIA_ADMIN_EMAIL : null,
        doc,
        getDoc,
        setDoc,
        updateDoc,
        onSnapshot,
        collection,
        query,
        orderBy,
        serverTimestamp,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        sendSignInLinkToEmail,
        isSignInWithEmailLink,
        signInWithEmailLink,
        workerUrl: typeof CELESTIA_WORKER_URL !== "undefined" ? CELESTIA_WORKER_URL : null,
        // Shared helpers so auth.js / admin.js don't duplicate this logic.
        normalizeEmail(raw) {
            return (raw || "").trim().toLowerCase();
        },
        isValidEmail(raw) {
            return EMAIL_RE.test((raw || "").trim());
        },
        // Firestore doc IDs can't contain '/'; emails never do, so this is
        // just a defensive strip in case of stray whitespace/control chars.
        emailToDocId(raw) {
            return this.normalizeEmail(raw).replace(/\//g, "");
        }
    };

    window.dispatchEvent(new CustomEvent("celestia-firebase-ready"));
} catch (err) {
    console.error("[Celestia] Firebase failed to initialize:", err);
    window.dispatchEvent(new CustomEvent("celestia-firebase-error", { detail: err }));
}
