// Middleware Session & Otentikasi Sederhana Tanpa Dependensi Tambahan
const config = require('../config/appConfig');
const crypto = require('crypto');

// In-memory store untuk session
const sessionStore = new Map();

// Helper parsing cookies dari header
const parseCookies = (cookieHeader) => {
    const list = {};
    if (!cookieHeader) return list;
    cookieHeader.split(';').forEach(cookie => {
        let [name, ...rest] = cookie.split('=');
        name = name?.trim();
        if (!name) return;
        const value = rest.join('=').trim();
        list[name] = decodeURIComponent(value);
    });
    return list;
};

// Middleware session utama
const sessionMiddleware = (req, res, next) => {
    const cookies = parseCookies(req.headers.cookie);
    let sid = cookies.stalin_session;

    if (!sid || !sessionStore.has(sid)) {
        sid = crypto.randomBytes(16).toString('hex');
        sessionStore.set(sid, {
            id: sid,
            user: null,
            flash: null,
            createdAt: Date.now()
        });
        // Pasang cookie di browser
        res.setHeader('Set-Cookie', `stalin_session=${sid}; Path=/; HttpOnly; SameSite=Lax`);
    }

    const sessionData = sessionStore.get(sid);
    req.session = {
        get user() {
            return sessionData.user;
        },
        set user(val) {
            sessionData.user = val;
        },
        get flash() {
            const msg = sessionData.flash;
            sessionData.flash = null; // Auto-clear once read
            return msg;
        },
        set flash(val) {
            sessionData.flash = val;
        },
        destroy: () => {
            sessionStore.delete(sid);
            res.setHeader('Set-Cookie', `stalin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
        }
    };

    // Variabel global untuk seluruh view EJS
    res.locals.user = req.session.user;
    res.locals.flash = req.session.flash;
    res.locals.categories = config.categories;
    res.locals.locations = config.locations;
    res.locals.appName = config.appName;
    res.locals.currentPath = req.path;

    next();
};

// Middleware untuk membatasi route yang membutuhkan login
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        req.session.flash = {
            type: 'warning',
            message: 'Silakan login terlebih dahulu untuk mengakses halaman ini.'
        };
        return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
    next();
};

module.exports = {
    sessionMiddleware,
    requireAuth
};
