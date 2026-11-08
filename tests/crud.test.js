// ========================================================
// SCRIPT PENGUJIAN OTOMATIS CRUD (IN-PROCESS DISPATCH)
// Menguji REST API CRUD & Frontend Web Forms (Create, Read, Update, Delete)
// ========================================================

const { EventEmitter } = require('events');
const { Readable } = require('stream');
const app = require('../app');
const { sessionStore } = require('../middlewares/auth');

// Daftarkan session pengujian
const TEST_SID = 'test_authenticated_sid_123';
sessionStore.set(TEST_SID, {
    id: TEST_SID,
    user: {
        id: 1,
        nama: "Budi Hartono",
        email: "user@stalinstore.com",
        no_hp: "0812-3456-7890",
        lokasi: "Sleman, D.I. Yogyakarta",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        bergabung: "Januari 2024"
    },
    flash: null,
    createdAt: Date.now()
});

function makeRequest(method, url, body = null, isForm = false) {
    return new Promise((resolve, reject) => {
        let bodyStr = '';
        if (body) {
            if (isForm) {
                const params = new URLSearchParams();
                for (const [k, v] of Object.entries(body)) {
                    params.append(k, v);
                }
                bodyStr = params.toString();
            } else {
                bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
            }
        }

        let sent = false;
        const req = new Readable({
            read() {
                if (bodyStr && !sent) {
                    sent = true;
                    this.push(bodyStr);
                } else {
                    this.push(null);
                }
            }
        });

        req.method = method;
        req.url = url;
        req.originalUrl = url;
        req.headers = {
            'content-type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
            'content-length': Buffer.byteLength(bodyStr),
            'cookie': `stalin_session=${TEST_SID}`,
            host: 'localhost:4000'
        };
        req.query = {};
        req.params = {};

        // Parse query params
        if (url.includes('?')) {
            const [base, queryStr] = url.split('?');
            req.url = base;
            req.path = base;
            const sp = new URLSearchParams(queryStr);
            for (const [k, v] of sp.entries()) {
                req.query[k] = v;
            }
        }

        const res = new EventEmitter();
        res.statusCode = 200;
        res.headers = {};
        res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
        res.getHeader = (k) => res.headers[k.toLowerCase()];
        res.status = (code) => { res.statusCode = code; return res; };

        let resData = '';
        res.write = (chunk) => {
            if (chunk) resData += chunk.toString();
            return true;
        };
        res.end = (chunk) => {
            if (chunk) resData += chunk.toString();
            let parsed = resData;
            try {
                parsed = JSON.parse(resData);
            } catch (e) {}
            resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: parsed,
                raw: resData
            });
        };

        res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        };

        res.send = (data) => {
            if (typeof data === 'object') {
                return res.json(data);
            }
            res.end(data);
        };

        res.redirect = (redirectUrl) => {
            res.statusCode = 302;
            res.setHeader('Location', redirectUrl);
            res.end(`Redirecting to ${redirectUrl}`);
        };

        res.render = (view, options) => {
            app.render(view, { ...res.locals, ...options }, (err, html) => {
                if (err) return reject(err);
                res.setHeader('Content-Type', 'text/html');
                res.end(html);
            });
        };

        res.locals = {};

        try {
            app(req, res, (err) => {
                if (err) reject(err);
                else resolve({ statusCode: 404, raw: 'Not Found' });
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function runTests() {
    console.log('\n======================================================');
    console.log('🧪 PENGUJIAN OTOMATIS LENGKAP: REST API & FRONTEND CRUD');
    console.log('======================================================\n');

    let passed = 0;
    let failed = 0;

    function assert(desc, condition) {
        if (condition) {
            console.log(`  ✅ [PASS] ${desc}`);
            passed++;
        } else {
            console.error(`  ❌ [FAIL] ${desc}`);
            failed++;
        }
    }

    try {
        // === BAGIAN 1: PENGUJIAN REST API BACKEND ===
        console.log('--- [BAGIAN 1: REST API BACKEND CRUD] ---');

        // 1. GET /api/status
        console.log('[1/10] Menguji GET /api/status...');
        const resStatus = await makeRequest('GET', '/api/status');
        assert('Status 200 OK', resStatus.statusCode === 200);
        assert('Status bernilai "ok"', resStatus.body && resStatus.body.status === 'ok');
        assert('Menyediakan status database', Boolean(resStatus.body.database));

        // 2. GET /api/produk (READ ALL)
        console.log('\n[2/10] Menguji GET /api/produk (READ ALL)...');
        const resProduk = await makeRequest('GET', '/api/produk');
        assert('Status 200 OK', resProduk.statusCode === 200);
        assert('Response JSON sukses = true', resProduk.body && resProduk.body.sukses === true);
        assert('Array produk berisi data dari database', Array.isArray(resProduk.body.data) && resProduk.body.data.length > 0);
        console.log(`        -> Terbaca ${resProduk.body.data.length} produk di database.`);

        // 3. GET /api/produk/:id (READ DETAIL)
        console.log('\n[3/10] Menguji GET /api/produk/1 (READ DETAIL)...');
        const resDetail = await makeRequest('GET', '/api/produk/1');
        assert('Status 200 OK', resDetail.statusCode === 200);
        assert('ID produk yang diambil = 1', resDetail.body && resDetail.body.data && resDetail.body.data.id === 1);

        // 4. POST /api/produk (CREATE API)
        console.log('\n[4/10] Menguji POST /api/produk (CREATE API)...');
        const newProductPayload = {
            nama: "Webcam Logitech C922 Pro Stream Full HD 1080p",
            kategori: "Aksesoris Gaming",
            harga: 1250000,
            kondisi: "Baru",
            lokasi: "Sleman, D.I. Yogyakarta",
            gambar: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80",
            deskripsi: "Webcam kualitas tinggi 60 fps dengan tripod untuk streaming.",
            stok: true
        };
        const resCreate = await makeRequest('POST', '/api/produk', newProductPayload);
        assert('Status 201 Created', resCreate.statusCode === 201);
        assert('Response sukses = true', resCreate.body && resCreate.body.sukses === true);
        const createdId = resCreate.body && resCreate.body.data && resCreate.body.data.id;
        assert('Data baru mendapatkan ID tersimpan di database', Boolean(createdId));

        // 5. PUT /api/produk/:id (UPDATE API)
        console.log(`\n[5/10] Menguji PUT /api/produk/${createdId} (UPDATE API)...`);
        const updatePayload = {
            nama: "Webcam Logitech C922 Pro Stream (HARGA TURUN)",
            harga: 1100000,
            kondisi: "Baru",
            deskripsi: "Harga diperbarui via PUT request API."
        };
        const resUpdate = await makeRequest('PUT', `/api/produk/${createdId}`, updatePayload);
        assert('Status 200 OK', resUpdate.statusCode === 200);
        assert('Nama berhasil diperbarui di database', resUpdate.body.data.nama === updatePayload.nama);

        // 6. DELETE /api/produk/:id (DELETE API)
        console.log(`\n[6/10] Menguji DELETE /api/produk/${createdId} (DELETE API)...`);
        const resDelete = await makeRequest('DELETE', `/api/produk/${createdId}`);
        assert('Status 200 OK', resDelete.statusCode === 200);
        assert('Response delete sukses = true', resDelete.body && resDelete.body.sukses === true);

        // Verifikasi 404
        const resAfterDelete = await makeRequest('GET', `/api/produk/${createdId}`);
        assert('GET produk yang sudah dihapus menghasilkan 404 Not Found', resAfterDelete.statusCode === 404);

        // === BAGIAN 2: PENGUJIAN FRONTEND WEB CRUD ===
        console.log('\n--- [BAGIAN 2: FRONTEND WEB CRUD VIA BROWSER / EJS] ---');

        // 7. Frontend Create via Form POST /jual
        console.log('\n[7/10] Menguji Frontend CREATE Form: POST /jual...');
        const formJualBody = {
            nama: "Kursi Gaming Secretlab TITAN Evo 2024 Black",
            kategori: "Aksesoris Gaming",
            harga: "6500000",
            kondisi: "Bekas",
            lokasi: "Sleman, D.I. Yogyakarta",
            gambar: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80",
            deskripsi: "Kursi ergonomis empuk premium busa cold-cure."
        };
        const resPostJual = await makeRequest('POST', '/jual', formJualBody, true);
        assert('POST /jual redirect ke halaman produk (302 Redirect)', resPostJual.statusCode === 302);
        const redirectUrl = resPostJual.headers.location;
        assert('Redirect URL mengarah ke /produk/:id', Boolean(redirectUrl && redirectUrl.startsWith('/produk/')));
        const webCreatedId = redirectUrl ? redirectUrl.replace('/produk/', '') : null;
        console.log(`        -> Produk baru berhasil dibuat via Form Web dengan ID #${webCreatedId}`);

        // 8. Frontend Update via Form POST /produk/:id/edit
        console.log(`\n[8/10] Menguji Frontend UPDATE Form: POST /produk/${webCreatedId}/edit...`);
        const formEditBody = {
            nama: "Kursi Gaming Secretlab TITAN Evo 2024 (SUDAH TERMASUK BANTAL)",
            kategori: "Aksesoris Gaming",
            harga: "6200000",
            kondisi: "Bekas",
            lokasi: "Sleman, D.I. Yogyakarta",
            gambar: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=600&q=80",
            deskripsi: "Deskripsi diperbarui via Form Edit Web.",
            stok: "true"
        };
        const resPostEdit = await makeRequest('POST', `/produk/${webCreatedId}/edit`, formEditBody, true);
        assert('POST /produk/:id/edit redirect (302 Redirect)', resPostEdit.statusCode === 302);

        // Verifikasi perubahan tersimpan di database
        const resVerifyUpdate = await makeRequest('GET', `/api/produk/${webCreatedId}`);
        assert('Data terupdate tercermin di database', resVerifyUpdate.body.data.nama === formEditBody.nama);
        assert('Harga terupdate tercermin di database', resVerifyUpdate.body.data.harga === Number(formEditBody.harga));

        // 9. Frontend Toggle Stok: POST /produk/:id/toggle-stok
        console.log(`\n[9/10] Menguji Frontend TOGGLE STOK: POST /produk/${webCreatedId}/toggle-stok...`);
        const resToggle = await makeRequest('POST', `/produk/${webCreatedId}/toggle-stok`);
        assert('Toggle stok redirect (302 Redirect)', resToggle.statusCode === 302);
        const resVerifyToggle = await makeRequest('GET', `/api/produk/${webCreatedId}`);
        assert('Status stok berubah di database', resVerifyToggle.body.data.stok === false);

        // 10. Frontend Delete via Button Form: POST /produk/:id/delete
        console.log(`\n[10/10] Menguji Frontend DELETE Form: POST /produk/${webCreatedId}/delete...`);
        const resPostDelete = await makeRequest('POST', `/produk/${webCreatedId}/delete`);
        assert('Hapus produk redirect ke katalog (302 Redirect)', resPostDelete.statusCode === 302);

        // Verifikasi terhapus dari database
        const resVerifyDelete = await makeRequest('GET', `/api/produk/${webCreatedId}`);
        assert('Produk terhapus dari database (404)', resVerifyDelete.statusCode === 404);

        console.log('\n======================================================');
        console.log(`🏁 SELURUH PENGUJIAN SELESAI: ${passed} PASS, ${failed} FAIL`);
        console.log('======================================================\n');

        process.exit(failed > 0 ? 1 : 0);
    } catch (err) {
        console.error('Test Error:', err);
        process.exit(1);
    }
}

setTimeout(() => {
    runTests();
}, 500);
