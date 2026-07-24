// Celestia Access Gate + Admin Login Notification
// -------------------------------------------------------------------------
// IMPORTANT LIMITATION: Celestia is a static, client-side page with no
// server. This gate is a lightweight visitor filter, NOT strong security.
// The password is compared against a SHA-256 hash stored below (not
// plaintext), but anyone who opens browser DevTools can read this file's
// source, see the hash, and brute-force or intercept it. Use this to keep
// casual/accidental visitors out — not to protect sensitive data.
//
// To change the password: open any browser console and run:
//   crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-new-password'))
//     .then(buf => console.log(Array.from(new Uint8Array(buf))
//       .map(b => b.toString(16).padStart(2, '0')).join('')));
// then replace AUTH_PASSWORD_HASH below with the printed 64-character value.

const AUTH_PASSWORD_HASH = 'ba184282d3250dc69fd2cfe6adfa1feb8aa2001c0ecd00f6b39b69819d2e0122'; // celestia2026
const AUTH_SESSION_KEY = 'celestia_authenticated';

// --- EmailJS admin login-notification config ---
// Fill these in after creating a free EmailJS account (see setup guide
// provided separately). Leave any of them blank to disable the email
// notification without breaking the login gate itself.
const EMAILJS_PUBLIC_KEY = '';
const EMAILJS_SERVICE_ID = '';
const EMAILJS_TEMPLATE_ID = '';
const ADMIN_NOTIFY_EMAIL = 'pla_y_girl@hotmail.com';

async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function notifyAdminOfLogin() {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        console.info('[Celestia] EmailJS ยังไม่ได้ตั้งค่า — ข้ามการแจ้งเตือนอีเมล admin');
        return;
    }
    if (typeof emailjs === 'undefined') {
        console.warn('[Celestia] โหลด EmailJS SDK ไม่สำเร็จ — ข้ามการแจ้งเตือนอีเมล admin');
        return;
    }
    const params = {
        to_email: ADMIN_NOTIFY_EMAIL,
        login_time: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
        user_agent: navigator.userAgent,
        page_url: window.location.href
    };
    try {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
            .then(() => console.info('[Celestia] แจ้งเตือน admin สำเร็จ'))
            .catch(err => console.warn('[Celestia] แจ้งเตือน admin ไม่สำเร็จ:', err));
    } catch (err) {
        console.warn('[Celestia] แจ้งเตือน admin ไม่สำเร็จ:', err);
    }
}

function unlockApp() {
    const overlay = document.getElementById('auth-overlay');
    if (overlay) {
        overlay.classList.add('auth-overlay-hidden');
        setTimeout(() => overlay.remove(), 400);
    }
    document.body.classList.remove('auth-locked');
}

function showAuthError(msg) {
    const errEl = document.getElementById('auth-error');
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
    }
    const input = document.getElementById('auth-password-input');
    if (input) {
        input.classList.add('auth-input-shake');
        setTimeout(() => input.classList.remove('auth-input-shake'), 400);
        input.select();
    }
}

async function attemptLogin() {
    const input = document.getElementById('auth-password-input');
    const btn = document.getElementById('auth-submit-btn');
    if (!input) return;
    const value = input.value;
    if (!value) {
        showAuthError('กรุณากรอกรหัสผ่าน');
        return;
    }
    if (btn) btn.disabled = true;
    try {
        const hash = await sha256Hex(value);
        if (hash === AUTH_PASSWORD_HASH) {
            try {
                sessionStorage.setItem(AUTH_SESSION_KEY, '1');
            } catch (e) { /* sessionStorage unavailable (e.g. private mode) — non-fatal */ }
            unlockApp();
            notifyAdminOfLogin();
        } else {
            showAuthError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
        }
    } finally {
        if (btn) btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let alreadyAuthed = false;
    try {
        alreadyAuthed = sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
    } catch (e) { /* ignore */ }

    if (alreadyAuthed) {
        unlockApp();
        return;
    }

    const form = document.getElementById('auth-form');
    const input = document.getElementById('auth-password-input');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            attemptLogin();
        });
    }
    if (input) {
        input.focus();
    }
});
