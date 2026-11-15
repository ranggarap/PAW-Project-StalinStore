const geminiConfig = require('../config/gemini');
const produkModel = require('../models/produkModel');
const { formatRupiah } = require('../utils/formatter');

// Topik-topik yang jelas di luar domain aplikasi toko hardware
const OUT_OF_CONTEXT_KEYWORDS = [
    'resep', 'masak', 'kue', 'makanan', 'minuman manis',
    'buatkan saya kode', 'bikin game', 'source code game', 'coding game',
    'python script', 'javascript game', 'hack', 'ddos', 'exploit',
    'politik', 'presiden', 'pilkada', 'pemilu', 'partai',
    'puisi', 'lirik lagu', 'pantun cinta', 'ramalan zodiak',
    'cuaca hari ini', 'obat sakit', 'penyakit', 'dokter'
];

// Kata kunci negosiasi harga (Non-Goal F-05 PRD)
const NEGOTIATION_KEYWORDS = [
    'bisa nego', 'bisa ditawar', 'kurang gak', 'kurangin harganya',
    'diskon khusus dong', 'tawar', 'nego tipis', 'bisa turun harga', 'potong harga'
];

/**
 * Service untuk menangani logika komunikasi dengan Google Gemini API
 * serta penyiapan Grounding Context dari database aplikasi
 */
class GeminiService {

    /**
     * Membangun context database katalog secara dinamis
     */
    async buildCatalogContext() {
        const products = await produkModel.getAll();
        
        const catalogSummary = products.map(p => {
            return `- [ID: ${p.id}] ${p.nama} | Kategori: ${p.kategori} | Harga: ${formatRupiah(p.harga)} | Status: ${p.stok ? 'Tersedia' : 'HABIS (Stok 0)'} | Kondisi: ${p.kondisi} | Lokasi: ${p.lokasi} | Deskripsi: ${p.deskripsi}`;
        }).join('\n');

        return `
DAFTAR INVENTARIS PRODUK HARDWARE STALIN STORE (SUMBER DATA DATABASE AKTIF):
${catalogSummary}
Kontak Admin Resmi: ${geminiConfig.adminName} (WhatsApp: ${geminiConfig.adminWhatsApp})
`;
    }

    /**
     * Membangun System Instruction lengkap dengan batasan / AI Guardrails
     */
    buildSystemInstruction(catalogContext) {
        return `Anda adalah "Stalin Store AI Assistant (Mobile Web)", asisten kecerdasan buatan resmi toko komputer dan hardware "Stalin Store" yang berbasis di D.I. Yogyakarta (Sleman, Depok, Kota Yogyakarta, Bantul).
Produk ini dikembangkan oleh tim PPAW: Rangga Fadhilah Akbar (20240140211), Muhammad Choirul Rizal (20240140213), Andy Zaky Zein (20240140209), dan Sheillo Agra Putratama (20240140249).

TUGAS UTAMA DAN TUJUAN PRODUK (PRD COMPLIANCE):
1. Merespons pertanyaan pelanggan secara instan 24/7 di luar jam operasional toko (terutama pelanggan malam hari).
2. Membantu pelanggan mencari produk, mengecek ketersediaan stok, memberikan panduan perakitan PC (PC Builder), serta memberikan rekomendasi produk pengganti jika barang yang dicari kosong.

${catalogContext}

ATURAN DAN BATASAN KETAT (GUARDRAILS & NON-GOALS):
1. HANYA MENJAWAB TOPIK STALIN STORE:
   Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan hardware komputer, laptop, komponen PC, aksesoris gaming, cek stok barang, rekomendasi spesifikasi, dan panduan rakit PC dari Stalin Store.
2. TOLAK PERTANYAAN DI LUAR KONTEKS:
   Jika pengguna menanyakan hal di luar toko hardware (misalnya meminta kode program/game, resep masakan, politik, kesehatan, puisi, obrolan umum non-hardware), TOLAK DENGAN SOPAN dan arahkan kembali ke katalog hardware Stalin Store.
   Contoh penolakan: "Maaf, sebagai asisten resmi Stalin Store, saya hanya dapat membantu konsultasi seputar hardware komputer, stok barang, dan perakitan PC di toko kami. Apakah ada komponen atau laptop yang sedang Anda cari?"
3. NON-GOAL: TIDAK MENYEDIAKAN TAWAR-MENAWAR (NEGOSIASI HARGA):
   Jika pengguna mencoba menawar harga atau meminta negosiasi harga, tolak secara sopan dan jelaskan bahwa seluruh harga produk di Stalin Store sudah terstandarisasi NETT / harga pas yang bersaing dan bergaransi.
4. CEK STOK & SMART SUBSTITUTION (US-02):
   Jika pengguna menanyakan barang yang statusnya "HABIS (Stok 0)" (seperti PC Gaming Core i5 ID 3 atau Mouse Logitech ID 8), jelaskan bahwa barang tersebut saat ini sedang habis, lalu SEGERA REKOMENDASIKAN produk alternatif yang "Tersedia" di katalog dengan kegunaan atau kelas harga sebanding.
5. PANDUAN RAKIT PC (PC BUILDER LOGIC - US-03):
   Jika pengguna meminta panduan merakit PC dengan budget tertentu (misalnya 5 Juta, 10 Juta, 15 Juta), susun rekomendasi komponen dari katalog kami (Processor, RAM, VGA, Monitor, Aksesoris) yang kompatibel dan total harganya tidak melebihi budget pengguna.
6. ANTI-HALUSINASI & DATA RESMI:
   JANGAN mengarang produk yang tidak ada di inventaris katalog di atas. Jika data tidak ada, sampaikan apa adanya dan tawarkan bantuan admin via WhatsApp: ${geminiConfig.adminWhatsApp}.
7. KARTU PRODUK INTERAKTIF (US-05):
   Ketika Anda merekomendasikan produk tertentu, selalu sertakan tag format khusus [PRODUCT_CARD: id] di dalam balasan Anda (contoh: [PRODUCT_CARD: 1] atau [PRODUCT_CARD: 2]). Frontend akan secara otomatis merender kartu produk interaktif dari tag ini.
8. GAYA KOMUNIKASI:
   Ramah, profesional, ringkas, mudah dipahami di layar smartphone (Mobile Web), menggunakan Bahasa Indonesia yang baik.
`;
    }

    /**
     * Memproses pertanyaan pengguna dan menghasilkan respons dari Gemini
     * @param {string} userMessage - Pesan dari pengguna
     */
    async generateResponse(userMessage) {
        const trimmed = userMessage.trim();

        // 1. Backend Guardrail: Deteksi pertanyaan di luar konteks sebelum panggil API
        const isOutOfContext = OUT_OF_CONTEXT_KEYWORDS.some(kw => trimmed.toLowerCase().includes(kw));
        if (isOutOfContext) {
            return {
                reply: 'Maaf, sebagai asisten resmi Stalin Store, fokus saya terbatas pada informasi katalog komputer, laptop, komponen PC, dan panduan perakitan PC di toko kami. Apakah ada hardware yang bisa saya bantu carikan untuk Anda?',
                products: [],
                guardrailBlocked: true
            };
        }

        // 2. Backend Guardrail: Deteksi tawar-menawar harga (Non-Goal PRD)
        const isNegotiation = NEGOTIATION_KEYWORDS.some(kw => trimmed.toLowerCase().includes(kw));
        if (isNegotiation) {
            return {
                reply: 'Mohon maaf, saat ini Stalin Store menerapkan kebijakan harga pas (nett) terstandarisasi demi transparansi dan kualitas garansi resmi seluruh produk kami. Namun, kami siap membantu mencarikan opsi hardware lain yang sesuai dengan budget Anda! Ingin rekomendasi produk di kisaran harga berapa?',
                products: [],
                guardrailBlocked: false
            };
        }

        // 3. Ambil context database terbaru
        const catalogContext = await this.buildCatalogContext();
        const systemInstruction = this.buildSystemInstruction(catalogContext);
        const allProducts = await produkModel.getAll();

        // 4. Jika Gemini API Key sudah terkonfigurasi, panggil Google Gemini REST API
        if (geminiConfig.isConfigured) {
            try {
                const response = await this.callGeminiApi(trimmed, systemInstruction);
                if (response && response.trim() !== '') {
                    const { cleanReply, referencedProducts } = this.extractProductCards(response, allProducts);
                    return {
                        reply: cleanReply,
                        products: referencedProducts,
                        source: 'gemini'
                    };
                }
            } catch (apiErr) {
                console.warn(`[GEMINI SERVICE WARNING] Panggilan API Gemini gagal/timeout: ${apiErr.message}. Beralih ke Intelligent Fallback Engine.`);
            }
        }

        // 5. Intelligent Fallback Engine (Mitigasi Risiko PRD: AI Down/Timeout/Offline)
        return this.runIntelligentFallback(trimmed, allProducts);
    }

    /**
     * Panggilan langsung ke endpoint REST API resmi Google Gemini
     */
    async callGeminiApi(userMessage, systemInstruction) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiConfig.model}:generateContent?key=${geminiConfig.apiKey}`;

        const payload = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ],
            systemInstruction: {
                role: 'system',
                parts: [{ text: systemInstruction }]
            },
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 800
            }
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), geminiConfig.timeoutMs);

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(`HTTP ${res.status}: ${errorData}`);
            }

            const json = await res.json();
            const candidate = json.candidates?.[0];
            const text = candidate?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('Respons Gemini kosong');
            }

            return text;
        } catch (err) {
            clearTimeout(timeoutId);
            if (err.name === 'AbortError') {
                throw new Error(`Timeout: Panggilan Gemini melebihi ${geminiConfig.timeoutMs}ms`);
            }
            throw err;
        }
    }

    /**
     * Ekstraksi tag [PRODUCT_CARD: <id>] dari respons teks dan kumpulkan objek produknya
     */
    extractProductCards(text, allProducts) {
        const regex = /\[PRODUCT_CARD:\s*(\d+)\]/gi;
        const productIds = new Set();
        let match;

        while ((match = regex.exec(text)) !== null) {
            productIds.add(Number(match[1]));
        }

        const referencedProducts = allProducts.filter(p => productIds.has(p.id));
        
        // Hapus tag [PRODUCT_CARD: id] dari teks agar tampilan chat tetap bersih
        const cleanReply = text.replace(/\[PRODUCT_CARD:\s*\d+\]/gi, '').trim();

        return {
            cleanReply,
            referencedProducts
        };
    }

    /**
     * Fallback Engine Cerdas berbasis Database Grounding (Sesuai Mitigasi Risiko PRD)
     */
    runIntelligentFallback(message, allProducts) {
        const q = message.toLowerCase();

        // Skenario A: Cek Stok Barang Spesifik / Substitusi Produk Kosong (US-02)
        if (q.includes('mouse') || q.includes('logitech') || q.includes('superlight')) {
            const mouse = allProducts.find(p => p.id === 8);
            const keyboard = allProducts.find(p => p.id === 6);
            return {
                reply: `Untuk produk **${mouse.nama}**, mohon maaf saat ini statusnya sedang **HABIS (Terjual)** di database toko kami.\n\nSebagai alternatif aksesoris gaming yang tersedia, kami merekomendasikan **${keyboard.nama}** yang siap kirim atau COD di Sleman/Yogyakarta!\n\n[PRODUCT_CARD: 8]\n[PRODUCT_CARD: 6]`,
                products: [mouse, keyboard],
                source: 'fallback_substitution'
            };
        }

        if (q.includes('pc gaming') || (q.includes('komputer') && q.includes('fullset'))) {
            const pcItem = allProducts.find(p => p.id === 3);
            const vgaItem = allProducts.find(p => p.id === 2);
            const cpuItem = allProducts.find(p => p.id === 7);
            return {
                reply: `Untuk unit **${pcItem.nama}** saat ini statusnya sedang **HABIS (Terjual)**.\n\nBagi Anda yang ingin merakit PC baru, Anda dapat mengombinasikan komponen kencang kami yang sedang TERSEDIA: **${cpuItem.nama}** dan **${vgaItem.nama}**!\n\n[PRODUCT_CARD: 3]\n[PRODUCT_CARD: 7]`,
                products: [pcItem, cpuItem],
                source: 'fallback_substitution'
            };
        }

        // Skenario B: Panduan Rakit PC Sesuai Budget (US-03)
        if (q.includes('rakit pc') || q.includes('rakit') || q.includes('budget')) {
            const ram = allProducts.find(p => p.id === 4);
            const cpu = allProducts.find(p => p.id === 7);
            const monitor = allProducts.find(p => p.id === 5);

            return {
                reply: `Halo Kak! Tentu, untuk panduan rakit PC di Stalin Store, kami memiliki rekomendasi part berkualitas dan saling kompatibel:\n\n1. **Processor:** ${cpu.nama} (${formatRupiah(cpu.harga)}) - Kencang untuk gaming & rendering.\n2. **Memory RAM:** ${ram.nama} (${formatRupiah(ram.harga)}) - 32GB RGB responsif.\n3. **Monitor Visual:** ${monitor.nama} (${formatRupiah(monitor.harga)}) - Layar 34 inch 144Hz.\n\nSeluruh komponen di atas tersedia dan bergaransi resmi di toko kami. Silakan cek kartu produk di bawah ini untuk melihat detail lengkapnya!`,
                products: [cpu, ram, monitor],
                source: 'fallback_pc_builder'
            };
        }

        // Skenario C: Tanya Laptop
        if (q.includes('laptop') || q.includes('rog') || q.includes('asus')) {
            const laptop = allProducts.find(p => p.id === 1);
            return {
                reply: `Stalin Store saat ini menyediakan laptop gaming unggulan: **${laptop.nama}** dengan harga ${formatRupiah(laptop.harga)} dalam kondisi bekas mulus 98% terawat.\n\nUnit berstatus **TERSEDIA** dan siap COD wilayah Sleman, D.I. Yogyakarta.`,
                products: [laptop],
                source: 'fallback_catalog'
            };
        }

        // Skenario D: Tanya VGA / Kartu Grafis
        if (q.includes('vga') || q.includes('gpu') || q.includes('rtx')) {
            const vga = allProducts.find(p => p.id === 2);
            return {
                reply: `Kami menyediakan kartu grafis **${vga.nama}** seharga ${formatRupiah(vga.harga)} kondisi BARU Brand New In Box (BNIB) dengan garansi resmi 3 tahun. Siap libas gaming 4K dan AI rendering!`,
                products: [vga],
                source: 'fallback_catalog'
            };
        }

        // Skenario E: Tanya Seluruh Produk / Stok Katalog
        if (q.includes('produk') || q.includes('katalog') || q.includes('apa saja') || q.includes('stok')) {
            const available = allProducts.filter(p => p.stok).slice(0, 4);
            return {
                reply: `Halo! Di Stalin Store saat ini tersedia berbagai pilihan hardware komputer berkualitas:\n\n` +
                       available.map(p => `• **${p.nama}** - ${formatRupiah(p.harga)} (${p.kondisi})`).join('\n') +
                       `\n\nAda yang menarik perhatian Anda? Anda bisa langsung melihat detailnya pada kartu di bawah ini.`,
                products: available,
                source: 'fallback_catalog'
            };
        }

        // Skenario F: Sapaan Umum (US-01: Respon cepat < 2 detik)
        if (q.includes('halo') || q.includes('hai') || q.includes('selamat malam') || q.includes('pagi') || q.includes('sore') || q.includes('bantuan') || q.length < 10) {
            const samples = allProducts.slice(0, 3);
            return {
                reply: `Halo! Selamat datang di **Stalin Store AI Assistant (Mobile Web)** 🤖.\n\nSaya siap membantu Anda 24 jam untuk konsultasi hardware, cek ketersediaan stok, rekomendasi pengganti part kosong, hingga panduan merakit PC impian Anda.\n\nApa yang sedang Anda butuhkan malam ini? Silakan pilih tombol cepat di bawah atau ketik langsung pertanyaan Anda!`,
                products: samples,
                source: 'fallback_greeting'
            };
        }

        // Default: Jawaban cerdas terarah dengan tawaran bantuan WhatsApp Admin (Mitigasi Risiko PRD)
        const sampleAds = allProducts.filter(p => p.stok).slice(0, 2);
        return {
            reply: `Terima kasih telah bertanya di Stalin Store! Terkait pertanyaan Anda "${message}", kami memiliki beragam komponen PC, laptop, monitor, dan aksesoris yang siap melengkapi kebutuhan komputasi Anda.\n\nJika membutuhkan konfirmasi teknis khusus atau ingin transaksi langsung, Anda juga dapat menghubungi admin toko kami, **${geminiConfig.adminName}**, melalui WhatsApp di **${geminiConfig.adminWhatsApp}**.`,
            products: sampleAds,
            source: 'fallback_general'
        };
    }
}

module.exports = new GeminiService();
