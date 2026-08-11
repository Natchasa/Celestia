// Celestia Data Gate — Cloudflare Worker
// -------------------------------------------------------------------------
// This is the ONLY place the actual astrology database (18 datasets stored
// in KV — see kv-data/) is ever assembled and sent to a browser. Unlike the
// old design where database.js/database_extra.js were plain static files
// anyone could download regardless of login state, this Worker only
// releases the data to a request that:
//
//   1. Presents a Firebase Auth ID token (proves the caller really owns the
//      email they signed in with — Firebase Email Link sign-in requires
//      clicking a link sent to that literal inbox).
//   2. Has a Firestore registrations/{email} document with status =
//      "approved" (set by you, the admin, in admin.html).
//
// Both checks happen server-side on every request — nothing is cached
// client-side, and no data is served to a request that fails either check.
//
// See WORKER_SETUP.md for how to deploy this (free Cloudflare account, no
// credit card required for the plan this uses).

// The 18 dataset keys uploaded to KV — must match kv-data/*.json filenames
// (minus the .json extension) exactly. See cloudflare-worker/kv-data/_manifest.json.
const DATASET_KEYS = [
    'PLANETARY_DB', 'HOUSE_DB', 'ASTEROID_DB', 'ASTEROID_SIGN_DB',
    'HOUSE_OVERVIEW_DB', 'HOUSE_GROUPS_DB', 'TRANSIT_DB', 'ASPECT_DB',
    'COMBINATION_DB', 'ZODIAC_SIGN_DB', 'PLANET_SIGN_DB', 'ASPECT_COOKBOOK_DB',
    'RULERSHIP_DB', 'HOUSE_RULER_TRANSIT_DB', 'HOUSE_RULER_COMB_DB',
    'PLANET_KEY_PRINCIPLE_DB', 'PLANET_HOUSE_RULER_DB', 'ASTROCARTOGRAPHY_DB'
];

const FIREBASE_JWK_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

function corsHeaders(origin) {
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Vary': 'Origin'
    };
}

function jsonResponse(obj, status, origin) {
    return new Response(JSON.stringify(obj), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'private, no-store',
            ...corsHeaders(origin)
        }
    });
}

function base64UrlToUint8Array(b64url) {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(b64url.length + (4 - (b64url.length % 4)) % 4, '=');
    const raw = atob(b64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
}

function base64UrlToJson(b64url) {
    const bytes = base64UrlToUint8Array(b64url);
    const text = new TextDecoder('utf-8').decode(bytes);
    return JSON.parse(text);
}

let cachedJwks = null;
let cachedJwksAt = 0;
const JWKS_CACHE_MS = 60 * 60 * 1000; // 1 hour

async function getFirebaseJwks() {
    const now = Date.now();
    if (cachedJwks && (now - cachedJwksAt) < JWKS_CACHE_MS) return cachedJwks;
    const res = await fetch(FIREBASE_JWK_URL);
    if (!res.ok) throw new Error('ไม่สามารถโหลด Firebase public keys ได้');
    const data = await res.json();
    cachedJwks = data.keys || [];
    cachedJwksAt = now;
    return cachedJwks;
}

// Verifies a Firebase Auth ID token: signature (RS256 via Google's published
// JWKS) + standard claims (iss/aud/exp). Returns the verified email on
// success, or throws on any failure.
async function verifyFirebaseIdToken(idToken, projectId) {
    const parts = idToken.split('.');
    if (parts.length !== 3) throw new Error('รูปแบบ token ไม่ถูกต้อง');
    const [headerB64, payloadB64, sigB64] = parts;

    const header = base64UrlToJson(headerB64);
    const payload = base64UrlToJson(payloadB64);

    if (header.alg !== 'RS256') throw new Error('algorithm ไม่รองรับ');

    const jwks = await getFirebaseJwks();
    const jwk = jwks.find((k) => k.kid === header.kid);
    if (!jwk) throw new Error('ไม่พบ key ที่ตรงกับ token นี้');

    const cryptoKey = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
    );

    const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(sigB64);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, signature, signingInput);
    if (!valid) throw new Error('ลายเซ็น token ไม่ถูกต้อง');

    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < nowSec) throw new Error('token หมดอายุ');
    if (payload.aud !== projectId) throw new Error('aud ไม่ตรงกับโปรเจกต์');
    if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error('iss ไม่ถูกต้อง');
    if (!payload.email) throw new Error('token ไม่มี email');

    return payload.email.trim().toLowerCase();
}

async function isEmailApproved(email, projectId) {
    const docId = encodeURIComponent(email);
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/registrations/${docId}`;
    const res = await fetch(url);
    if (res.status === 404) return false;
    if (!res.ok) throw new Error('ตรวจสอบสถานะการอนุมัติไม่สำเร็จ');
    const doc = await res.json();
    const status = doc && doc.fields && doc.fields.status && doc.fields.status.stringValue;
    return status === 'approved';
}

async function buildDataResponseBody(kv) {
    // Fetch all 18 KV keys in parallel instead of one-at-a-time — this is the
    // main lever on load time (each kv.get() is its own round-trip; doing
    // them sequentially added up to several seconds on the full ~8.5MB set).
    const values = await Promise.all(DATASET_KEYS.map((key) => kv.get(key)));
    const parts = DATASET_KEYS.map((key, i) => {
        const raw = values[i];
        if (raw === null) throw new Error(`ไม่พบข้อมูลใน KV: ${key} (ยังไม่ได้ upload หรือ key ชื่อไม่ตรงกัน)`);
        return `"${key}":${raw}`;
    });
    return `{${parts.join(',')}}`;
}

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';
        const allowedOrigin = env.ALLOWED_ORIGIN || '';

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
        }

        if (request.method !== 'GET') {
            return jsonResponse({ error: 'method not allowed' }, 405, allowedOrigin);
        }

        // Only serve the configured origin — cheap extra guard on top of CORS
        // (CORS alone doesn't stop non-browser callers, but this keeps casual
        // cross-site fetches from other pages from succeeding in a browser).
        if (allowedOrigin && origin && origin !== allowedOrigin) {
            return jsonResponse({ error: 'origin not allowed' }, 403, allowedOrigin);
        }

        try {
            const authHeader = request.headers.get('Authorization') || '';
            const match = /^Bearer (.+)$/.exec(authHeader);
            if (!match) return jsonResponse({ error: 'missing bearer token' }, 401, allowedOrigin);

            if (!env.FIREBASE_PROJECT_ID) {
                return jsonResponse({ error: 'worker misconfigured: FIREBASE_PROJECT_ID missing' }, 500, allowedOrigin);
            }

            const email = await verifyFirebaseIdToken(match[1], env.FIREBASE_PROJECT_ID);
            const approved = await isEmailApproved(email, env.FIREBASE_PROJECT_ID);
            if (!approved) {
                return jsonResponse({ error: 'not approved' }, 403, allowedOrigin);
            }

            const body = await buildDataResponseBody(env.CELESTIA_KV);
            return new Response(body, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Cache-Control': 'private, no-store',
                    ...corsHeaders(allowedOrigin)
                }
            });
        } catch (err) {
            console.error('[Celestia Worker] error:', err && err.message);
            return jsonResponse({ error: 'unauthorized' }, 401, allowedOrigin);
        }
    }
};
