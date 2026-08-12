// Celestia Access Gate — Email-Link Verified Registration + Admin Approval
// + Worker-Gated Data Load (Firebase + Cloudflare Worker)
// -------------------------------------------------------------------------
// Flow:
//   1. Visitor enters email -> a "pending" request is written to Firestore
//      (registrations/{email}) so the admin sees it in admin.html right away,
//      AND a real Firebase "email link" sign-in email is sent to that inbox.
//   2. Visitor must click that link (proves they actually own the inbox) to
//      complete sign-in and receive a genuine Firebase Auth session.
//   3. Once signed in, this page listens in real time for the admin's
//      approve/reject decision.
//   4. Only once BOTH (a) signed in via the email link and (b) status =
//      approved are true, this page calls the Cloudflare Worker with a
//      Firebase ID token to fetch the actual protected astrology database.
//      The Worker re-verifies both conditions server-side before releasing
//      anything — nothing sensitive is ever sent to a browser that hasn't
//      cleared both checks.
//
// Requires firebase-config.js and firebase-init.js (type="module") to be
// loaded before this script. See FIREBASE_SETUP.md and WORKER_SETUP.md.

const EMAIL_FOR_SIGNIN_KEY = 'celestia_email_for_signin';
const REG_COOLDOWN_KEY = 'celestia_reg_last_submit';
const SUBMIT_COOLDOWN_MS = 15000; // 15 seconds between registration/resend attempts

// --- EmailJS admin registration-notification config (optional) ---
// Leave blank to skip automatic email pings — you can still see/approve
// requests in admin.html either way.
const EMAILJS_PUBLIC_KEY = '';
const EMAILJS_SERVICE_ID = '';
const EMAILJS_TEMPLATE_ID = '';
const ADMIN_NOTIFY_EMAIL = 'pla_y_girl@hotmail.com';

let unsubscribeStatusListener = null;
let pendingLinkCompletion = false; // true when the link was opened without a locally-remembered email

function $(id) {
    return document.getElementById(id);
}

function showPanel(name) {
    ['loading', 'register', 'checkemail', 'pending', 'rejected', 'unlocking', 'dataerror'].forEach((p) => {
        const el = $(`auth-panel-${p}`);
        if (el) el.style.display = (p === name) ? 'block' : 'none';
    });
}

function setRegisterError(msg) {
    const errEl = $('auth-register-error');
    if (errEl) {
        errEl.textContent = msg || '';
        errEl.style.display = msg ? 'block' : 'none';
    }
    const input = $('auth-email-input');
    if (input && msg) {
        input.classList.add('auth-input-shake');
        setTimeout(() => input.classList.remove('auth-input-shake'), 400);
    }
}

function unlockApp() {
    const overlay = $('auth-overlay');
    if (overlay) {
        overlay.classList.add('auth-overlay-hidden');
        setTimeout(() => overlay.remove(), 400);
    }
    document.body.classList.remove('auth-locked');
    console.log('%cCelestia: Access approved', 'color: #FDC94D; font-size: 14px; font-weight: bold;');
}

// Sends the Firebase sign-in link via the Cloudflare Worker's /send-link
// endpoint (which uses Brevo) instead of Firebase Auth's own mailer — the
// built-in mailer is capped at 5 emails/day on the free Spark plan, which
// this project hit during testing. See EMAIL_SENDING.md and
// cloudflare-worker/worker.js's /send-link handler.
async function sendSignInLinkViaWorker(email) {
    const fb = window.CelestiaFirebase;
    if (!fb.workerUrl || fb.workerUrl.indexOf('PASTE_') === 0) {
        throw new Error('ยังไม่ได้ตั้งค่า CELESTIA_WORKER_URL ใน firebase-config.js');
    }
    const res = await fetch(`${fb.workerUrl}/send-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            // Same value the old client-side sendSignInLinkToEmail() used —
            // makes sure the emailed link lands back on THIS exact page
            // (e.g. .../Celestia/), not just the bare github.io origin.
            continueUrl: window.location.origin + window.location.pathname
        })
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `ส่งอีเมลไม่สำเร็จ (HTTP ${res.status})`);
    }
}

function loadAppScript() {
    return new Promise((resolve, reject) => {
        if (window.__celestiaAppLoaded) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'app.js?v=202';
        s.onload = () => { window.__celestiaAppLoaded = true; resolve(); };
        s.onerror = () => reject(new Error('โหลด app.js ไม่สำเร็จ'));
        document.body.appendChild(s);
    });
}

async function finalizeUnlock(user) {
    showPanel('unlocking');
    const fb = window.CelestiaFirebase;
    try {
        if (!fb.workerUrl || fb.workerUrl.indexOf('PASTE_') === 0) {
            throw new Error('ยังไม่ได้ตั้งค่า CELESTIA_WORKER_URL ใน firebase-config.js');
        }
        const idToken = await user.getIdToken();
        const res = await fetch(fb.workerUrl, {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        if (!res.ok) throw new Error(`โหลดข้อมูลไม่สำเร็จ (HTTP ${res.status})`);
        const data = await res.json();
        Object.keys(data).forEach((key) => { window[key] = data[key]; });
        await loadAppScript();
        unlockApp();
    } catch (err) {
        console.error('[Celestia] ปลดล็อกไม่สำเร็จ:', err);
        showPanel('dataerror');
    }
}

function waitForFirebase() {
    if (window.CelestiaFirebase) return Promise.resolve(true);
    return new Promise((resolve) => {
        function cleanup() {
            window.removeEventListener('celestia-firebase-ready', onReady);
            window.removeEventListener('celestia-firebase-error', onError);
        }
        function onReady() { cleanup(); resolve(true); }
        function onError() { cleanup(); resolve(false); }
        window.addEventListener('celestia-firebase-ready', onReady, { once: true });
        window.addEventListener('celestia-firebase-error', onError, { once: true });
    });
}

function notifyAdminOfRegistration(email) {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        console.info('[Celestia] EmailJS ยังไม่ได้ตั้งค่า — ข้ามการแจ้งเตือนอีเมล admin (เช็คคำขอได้ที่ admin.html)');
        return;
    }
    if (typeof emailjs === 'undefined') {
        console.warn('[Celestia] โหลด EmailJS SDK ไม่สำเร็จ — ข้ามการแจ้งเตือนอีเมล admin');
        return;
    }
    const params = {
        to_email: ADMIN_NOTIFY_EMAIL,
        registrant_email: email,
        requested_time: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
        user_agent: navigator.userAgent,
        page_url: window.location.href
    };
    try {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
            .then(() => console.info('[Celestia] แจ้งเตือน admin สำเร็จ'))
            .catch((err) => console.warn('[Celestia] แจ้งเตือน admin ไม่สำเร็จ:', err));
    } catch (err) {
        console.warn('[Celestia] แจ้งเตือน admin ไม่สำเร็จ:', err);
    }
}

function attachStatusListener(email) {
    const fb = window.CelestiaFirebase;
    if (unsubscribeStatusListener) {
        unsubscribeStatusListener();
        unsubscribeStatusListener = null;
    }
    const ref = fb.doc(fb.db, 'registrations', fb.emailToDocId(email));
    unsubscribeStatusListener = fb.onSnapshot(
        ref,
        (snap) => {
            if (!snap.exists()) {
                showPanel('register');
                return;
            }
            const data = snap.data();
            if (data.status === 'approved') {
                const user = fb.auth.currentUser;
                if (user) {
                    finalizeUnlock(user);
                } else {
                    const el = $('auth-pending-email');
                    if (el) el.textContent = email;
                    showPanel('pending');
                }
            } else if (data.status === 'rejected') {
                const el = $('auth-rejected-email');
                if (el) el.textContent = email;
                showPanel('rejected');
            } else {
                const el = $('auth-pending-email');
                if (el) el.textContent = email;
                showPanel('pending');
            }
        },
        (err) => {
            console.error('[Celestia] เช็คสถานะการลงทะเบียนไม่สำเร็จ:', err);
            showPanel('register');
            setRegisterError('เชื่อมต่อระบบตรวจสอบสถานะไม่สำเร็จ กรุณาลองใหม่');
        }
    );
}

function isOnCooldown() {
    let last = 0;
    try { last = parseInt(localStorage.getItem(REG_COOLDOWN_KEY) || '0', 10); } catch (e) { /* ignore */ }
    return (Date.now() - last) < SUBMIT_COOLDOWN_MS;
}

function markCooldown() {
    try { localStorage.setItem(REG_COOLDOWN_KEY, Date.now().toString()); } catch (e) { /* ignore */ }
}

async function submitRegistration(rawEmail) {
    const fb = window.CelestiaFirebase;
    if (!fb) {
        setRegisterError('ไม่สามารถเชื่อมต่อระบบได้ในขณะนี้ กรุณาลองใหม่ภายหลัง');
        return;
    }

    const email = fb.normalizeEmail(rawEmail);
    if (!fb.isValidEmail(email)) {
        setRegisterError('กรุณากรอกอีเมลให้ถูกต้อง');
        return;
    }

    if (isOnCooldown()) {
        setRegisterError('กรุณารอสักครู่ก่อนลองใหม่อีกครั้ง');
        return;
    }

    const btn = $('auth-register-btn');
    if (btn) btn.disabled = true;
    setRegisterError('');

    try {
        // 1) Upsert the pending request so the admin sees it immediately,
        //    independent of whether/when the visitor clicks the email link.
        const ref = fb.doc(fb.db, 'registrations', fb.emailToDocId(email));
        const existing = await fb.getDoc(ref);
        if (!existing.exists()) {
            await fb.setDoc(ref, {
                email,
                status: 'pending',
                requestedAt: fb.serverTimestamp(),
                userAgent: navigator.userAgent
            });
            notifyAdminOfRegistration(email);
        }

        // 2) Send the real sign-in link to that inbox — via our own Worker
        //    endpoint (Brevo) rather than Firebase's rate-limited mailer.
        await sendSignInLinkViaWorker(email);
        try { localStorage.setItem(EMAIL_FOR_SIGNIN_KEY, email); } catch (e) { /* ignore */ }
        markCooldown();

        const el = $('auth-checkemail-email');
        if (el) el.textContent = email;
        showPanel('checkemail');
    } catch (err) {
        console.error('[Celestia] ลงทะเบียนไม่สำเร็จ:', err);
        setRegisterError('ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่ภายหลัง');
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function resendLink() {
    const fb = window.CelestiaFirebase;
    let email = null;
    try { email = localStorage.getItem(EMAIL_FOR_SIGNIN_KEY); } catch (e) { /* ignore */ }
    if (!fb || !email) return;

    if (isOnCooldown()) return;

    try {
        await sendSignInLinkViaWorker(email);
        markCooldown();
    } catch (err) {
        console.error('[Celestia] ส่งลิงก์ใหม่ไม่สำเร็จ:', err);
    }
}

function changeEmail() {
    if (unsubscribeStatusListener) {
        unsubscribeStatusListener();
        unsubscribeStatusListener = null;
    }
    try { localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY); } catch (e) { /* ignore */ }
    pendingLinkCompletion = false;

    const fb = window.CelestiaFirebase;
    if (fb && fb.auth && fb.auth.currentUser) {
        fb.signOut(fb.auth).catch(() => { /* ignore */ });
    }

    setRegisterError('');
    showPanel('register');
    const input = $('auth-email-input');
    if (input) {
        input.value = '';
        input.focus();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    showPanel('loading');

    const form = $('auth-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = $('auth-email-input');
            const rawEmail = input ? input.value : '';

            if (pendingLinkCompletion) {
                // Link was opened without a locally-remembered email (e.g. a
                // different browser/device than where they registered).
                // Complete sign-in with the email they just typed instead of
                // sending a brand new link.
                const fb = window.CelestiaFirebase;
                const email = fb.normalizeEmail(rawEmail);
                if (!fb.isValidEmail(email)) {
                    setRegisterError('กรุณากรอกอีเมลให้ถูกต้อง');
                    return;
                }
                try {
                    await fb.signInWithEmailLink(fb.auth, email, window.location.href);
                    pendingLinkCompletion = false;
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (err) {
                    console.error('[Celestia] ยืนยันลิงก์ไม่สำเร็จ:', err);
                    setRegisterError('ยืนยันไม่สำเร็จ อีเมลอาจไม่ตรงกับที่ลงทะเบียนไว้ หรือลิงก์หมดอายุ');
                }
                return;
            }

            submitRegistration(rawEmail);
        });
    }

    [$('auth-change-email-btn'), $('auth-rejected-change-btn'), $('auth-checkemail-change-btn')].forEach((btn) => {
        if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); changeEmail(); });
    });

    const resendBtn = $('auth-resend-btn');
    if (resendBtn) resendBtn.addEventListener('click', (e) => { e.preventDefault(); resendLink(); });

    const firebaseReady = await waitForFirebase();
    if (!firebaseReady) {
        showPanel('register');
        setRegisterError('ไม่สามารถเชื่อมต่อระบบได้ในขณะนี้ กรุณาลองรีเฟรชหน้านี้อีกครั้ง');
        return;
    }
    const fb = window.CelestiaFirebase;

    // Drive the UI off Firebase's own auth session — this reacts both to a
    // returning already-signed-in visitor AND to sign-in completing below.
    fb.onAuthStateChanged(fb.auth, (user) => {
        if (!user) {
            let awaitingEmail = null;
            try { awaitingEmail = localStorage.getItem(EMAIL_FOR_SIGNIN_KEY); } catch (e) { /* ignore */ }
            if (awaitingEmail && !pendingLinkCompletion) {
                const el = $('auth-checkemail-email');
                if (el) el.textContent = awaitingEmail;
                showPanel('checkemail');
            } else if (!pendingLinkCompletion) {
                showPanel('register');
            }
            return;
        }
        const email = (user.email || '').trim().toLowerCase();
        attachStatusListener(email);
    });

    // If this page load IS the visitor clicking their email link, complete
    // sign-in now (this will trigger onAuthStateChanged above on success).
    if (fb.isSignInWithEmailLink(fb.auth, window.location.href)) {
        let email = null;
        try { email = localStorage.getItem(EMAIL_FOR_SIGNIN_KEY); } catch (e) { /* ignore */ }

        if (!email) {
            pendingLinkCompletion = true;
            showPanel('register');
            setRegisterError('กรุณากรอกอีเมลเดิมอีกครั้งเพื่อยืนยันการเข้าสู่ระบบ (เปิดลิงก์นี้จากเบราว์เซอร์/อุปกรณ์อื่น)');
        } else {
            try {
                await fb.signInWithEmailLink(fb.auth, email, window.location.href);
                try { localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY); } catch (e) { /* ignore */ }
            } catch (err) {
                console.error('[Celestia] ยืนยันลิงก์ไม่สำเร็จ:', err);
                showPanel('register');
                setRegisterError('ลิงก์ยืนยันหมดอายุหรือไม่ถูกต้อง กรุณาลงทะเบียนใหม่');
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});
