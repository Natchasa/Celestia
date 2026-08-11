// Celestia Admin Dashboard
// -------------------------------------------------------------------------
// Email/password sign-in (restricted by Firestore rules + CELESTIA_ADMIN_EMAIL)
// to view and approve/reject visitor registration requests in real time.
//
// NOTE on revocation: if you reject/revoke someone who is CURRENTLY looking
// at an already-unlocked tab of index.html, that tab stays unlocked until
// they close/reload it — the change only takes effect on their next page
// load. This mirrors the "lightweight gate, not strong security" posture of
// the original password gate.

function $(id) {
    return document.getElementById(id);
}

let registrationsUnsub = null;

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

function setLoginError(msg) {
    const el = $('admin-login-error');
    if (el) {
        el.textContent = msg || '';
        el.style.display = msg ? 'block' : 'none';
    }
}

function showLogin() {
    $('admin-login-wrap').style.display = 'flex';
    $('admin-dashboard').style.display = 'none';
    if (registrationsUnsub) { registrationsUnsub(); registrationsUnsub = null; }
}

function showDashboard() {
    $('admin-login-wrap').style.display = 'none';
    $('admin-dashboard').style.display = 'block';
}

function formatTimestamp(ts) {
    if (!ts || typeof ts.toDate !== 'function') return 'เพิ่งส่งคำขอ';
    try {
        return ts.toDate().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
        return '-';
    }
}

function badgeFor(status) {
    if (status === 'approved') return '<span class="admin-badge admin-badge-approved">อนุมัติแล้ว</span>';
    if (status === 'rejected') return '<span class="admin-badge admin-badge-rejected">ปฏิเสธแล้ว</span>';
    return '<span class="admin-badge admin-badge-pending">รอตรวจสอบ</span>';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
}

async function setStatus(fb, docId, newStatus, btn) {
    if (btn) btn.disabled = true;
    try {
        const ref = fb.doc(fb.db, 'registrations', docId);
        await fb.updateDoc(ref, {
            status: newStatus,
            [`${newStatus}At`]: fb.serverTimestamp(),
            [`${newStatus}By`]: fb.auth.currentUser ? fb.auth.currentUser.email : null
        });
    } catch (err) {
        console.error('[Celestia Admin] อัปเดตสถานะไม่สำเร็จ:', err);
        alert('อัปเดตสถานะไม่สำเร็จ: ' + (err && err.message ? err.message : 'unknown error'));
    } finally {
        if (btn) btn.disabled = false;
    }
}

function renderList(fb, docs) {
    const container = $('admin-list-container');
    if (!docs.length) {
        container.innerHTML = '<p class="admin-empty">ยังไม่มีคำขอลงทะเบียน</p>';
        return;
    }

    const wrap = document.createElement('div');
    wrap.className = 'admin-list';

    docs.forEach((snap) => {
        const data = snap.data();
        const status = data.status || 'pending';
        const row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML = `
            <div class="admin-row-info">
                <div class="admin-row-email">${escapeHtml(data.email)}</div>
                <div class="admin-row-meta">ส่งคำขอเมื่อ ${escapeHtml(formatTimestamp(data.requestedAt))}</div>
                ${badgeFor(status)}
            </div>
            <div class="admin-row-actions">
                <button type="button" class="admin-btn admin-btn-approve" data-action="approved" ${status === 'approved' ? 'disabled' : ''}>อนุมัติ</button>
                <button type="button" class="admin-btn admin-btn-reject" data-action="rejected" ${status === 'rejected' ? 'disabled' : ''}>ปฏิเสธ</button>
            </div>
        `;
        row.querySelectorAll('button[data-action]').forEach((btn) => {
            btn.addEventListener('click', () => setStatus(fb, snap.id, btn.getAttribute('data-action'), btn));
        });
        wrap.appendChild(row);
    });

    container.innerHTML = '';
    container.appendChild(wrap);
}

function startRegistrationsListener(fb) {
    if (registrationsUnsub) registrationsUnsub();
    const q = fb.query(fb.collection(fb.db, 'registrations'), fb.orderBy('requestedAt', 'desc'));
    registrationsUnsub = fb.onSnapshot(
        q,
        (snapshot) => renderList(fb, snapshot.docs),
        (err) => {
            console.error('[Celestia Admin] โหลดรายการไม่สำเร็จ:', err);
            $('admin-list-container').innerHTML = '<p class="admin-empty">โหลดรายการไม่สำเร็จ — ตรวจสอบว่าบัญชีนี้ตรงกับ CELESTIA_ADMIN_EMAIL และ Firestore Rules ถูกตั้งค่าแล้ว</p>';
        }
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    const ok = await waitForFirebase();
    if (!ok) {
        setLoginError('ไม่สามารถเชื่อมต่อ Firebase ได้ — ตรวจสอบ firebase-config.js');
        return;
    }
    const fb = window.CelestiaFirebase;

    const loginForm = $('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            setLoginError('');
            const email = ($('admin-email-input').value || '').trim();
            const password = $('admin-password-input').value || '';
            const btn = $('admin-login-btn');
            if (btn) btn.disabled = true;
            try {
                await fb.signInWithEmailAndPassword(fb.auth, email, password);
            } catch (err) {
                console.error('[Celestia Admin] เข้าสู่ระบบไม่สำเร็จ:', err);
                setLoginError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมล/รหัสผ่าน');
            } finally {
                if (btn) btn.disabled = false;
            }
        });
    }

    const logoutBtn = $('admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => fb.signOut(fb.auth));
    }

    fb.onAuthStateChanged(fb.auth, (user) => {
        if (!user) {
            showLogin();
            return;
        }
        const adminEmail = (fb.adminEmail || '').trim().toLowerCase();
        const userEmail = (user.email || '').trim().toLowerCase();
        if (adminEmail && userEmail !== adminEmail) {
            setLoginError('บัญชีนี้ไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแล');
            fb.signOut(fb.auth);
            return;
        }
        showDashboard();
        startRegistrationsListener(fb);
    });
});
