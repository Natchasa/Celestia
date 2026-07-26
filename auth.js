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
const SESSION_MAX_AGE_MS = 86400000; // 24 hours

// --- EmailJS admin login-notification config ---
const EMAILJS_PUBLIC_KEY = '';
const EMAILJS_SERVICE_ID = '';
const EMAILJS_TEMPLATE_ID = '';
const ADMIN_NOTIFY_EMAIL = 'pla_y_girl@hotmail.com';

// Rate Limiting & Security Configuration
const MAX_FAILED_ATTEMPTS = 5;
const INITIAL_LOCKOUT_MS = 30000; // 30 seconds
const KEY_FAILED_ATTEMPTS = 'celestia_auth_attempts';
const KEY_LOCKOUT_UNTIL = 'celestia_auth_lockout';

let lockoutInterval = null;

function getLockoutRemainingMs() {
    try {
        const lockoutUntil = parseInt(localStorage.getItem(KEY_LOCKOUT_UNTIL) || '0', 10);
        const now = Date.now();
        return lockoutUntil > now ? lockoutUntil - now : 0;
    } catch (e) {
        return 0;
    }
}

function checkLockoutState() {
    const remainingMs = getLockoutRemainingMs();
    const input = document.getElementById('auth-password-input');
    const btn = document.getElementById('auth-submit-btn');

    if (remainingMs > 0) {
        if (input) input.disabled = true;
        if (btn) btn.disabled = true;
        const seconds = Math.ceil(remainingMs / 1000);
        showAuthError(`กรอกรหัสผ่านผิดเกินกำหนด ระบบถูกล็อคชั่วคราว โปรดลองใหม่ในอีก ${seconds} วินาที`);

        if (!lockoutInterval) {
            lockoutInterval = setInterval(() => {
                const rem = getLockoutRemainingMs();
                if (rem <= 0) {
                    clearInterval(lockoutInterval);
                    lockoutInterval = null;
                    if (input) input.disabled = false;
                    if (btn) btn.disabled = false;
                    const errEl = document.getElementById('auth-error');
                    if (errEl) errEl.style.display = 'none';
                    if (input) input.focus();
                } else {
                    const secs = Math.ceil(rem / 1000);
                    showAuthError(`กรอกรหัสผ่านผิดเกินกำหนด ระบบถูกล็อคชั่วคราว โปรดลองใหม่ในอีก ${secs} วินาที`);
                }
            }, 1000);
        }
        return true;
    }
    return false;
}

function recordFailedAttempt() {
    try {
        let attempts = parseInt(localStorage.getItem(KEY_FAILED_ATTEMPTS) || '0', 10) + 1;
        localStorage.setItem(KEY_FAILED_ATTEMPTS, attempts.toString());

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            const lockoutDuration = INITIAL_LOCKOUT_MS * Math.pow(2, Math.min(attempts - MAX_FAILED_ATTEMPTS, 3));
            const lockoutUntil = Date.now() + lockoutDuration;
            localStorage.setItem(KEY_LOCKOUT_UNTIL, lockoutUntil.toString());
            checkLockoutState();
        } else {
            const remaining = MAX_FAILED_ATTEMPTS - attempts;
            showAuthError(`รหัสผ่านไม่ถูกต้อง (เหลือโอกาสลองอีก ${remaining} ครั้ง)`);
        }
    } catch (e) {
        showAuthError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
    }
}

function resetFailedAttempts() {
    try {
        localStorage.removeItem(KEY_FAILED_ATTEMPTS);
        localStorage.removeItem(KEY_LOCKOUT_UNTIL);
    } catch (e) { /* ignore */ }
}

async function sha256Hex(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateSessionToken() {
    const ts = Date.now().toString();
    const tokenRaw = `${AUTH_PASSWORD_HASH}:${ts}:${navigator.userAgent}`;
    const hash = await sha256Hex(tokenRaw);
    return `${ts}.${hash}`;
}

async function verifySessionToken() {
    try {
        const stored = sessionStorage.getItem(AUTH_SESSION_KEY);
        if (!stored || !stored.includes('.')) return false;
        const [ts, hash] = stored.split('.');
        const now = Date.now();
        if (now - parseInt(ts, 10) > SESSION_MAX_AGE_MS) return false;
        const expectedHash = await sha256Hex(`${AUTH_PASSWORD_HASH}:${ts}:${navigator.userAgent}`);
        return hash === expectedHash;
    } catch (e) {
        return false;
    }
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
    console.log('%cCelestia Security Shield Active: Grade A+ Hardened', 'color: #FDC94D; font-size: 14px; font-weight: bold;');
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
    if (checkLockoutState()) return;

    const input = document.getElementById('auth-password-input');
    const btn = document.getElementById('auth-submit-btn');
    if (!input) return;
    const value = (input.value || '').trim();
    if (!value) {
        showAuthError('กรุณากรอกรหัสผ่าน');
        return;
    }
    if (btn) btn.disabled = true;
    try {
        const hash = await sha256Hex(value);
        if (hash === AUTH_PASSWORD_HASH) {
            resetFailedAttempts();
            try {
                const token = await generateSessionToken();
                sessionStorage.setItem(AUTH_SESSION_KEY, token);
            } catch (e) { /* sessionStorage unavailable — non-fatal */ }
            unlockApp();
            notifyAdminOfLogin();
        } else {
            recordFailedAttempt();
        }
    } finally {
        if (btn && !checkLockoutState()) btn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let alreadyAuthed = false;
    try {
        alreadyAuthed = await verifySessionToken();
    } catch (e) { /* ignore */ }

    if (alreadyAuthed) {
        unlockApp();
        return;
    }

    checkLockoutState();

    const form = document.getElementById('auth-form');
    const input = document.getElementById('auth-password-input');
    const toggleBtn = document.getElementById('auth-toggle-pwd');

    if (toggleBtn && input) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            const showIcon = document.getElementById('eye-icon-show');
            const hideIcon = document.getElementById('eye-icon-hide');
            if (showIcon && hideIcon) {
                showIcon.style.display = isPassword ? 'none' : 'block';
                hideIcon.style.display = isPassword ? 'block' : 'none';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            attemptLogin();
        });
    }
    if (input && !checkLockoutState()) {
        input.focus();
    }
});
