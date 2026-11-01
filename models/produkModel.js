// Model Produk Hardware Stalin Store (OLX Classifieds Style)
const produkData = [
    {
        id: 1,
        nama: "Laptop ASUS ROG Strix SCAR 15 Core i9 RTX 3070Ti",
        kategori: "Laptop",
        harga: 21500000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
        lokasi: "Sleman, D.I. Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: "Bekas",
        deskripsi: "Kondisi mulus 98%, pemakaian pribadi untuk editing & gaming ringan. Kelengkapan fullset original box, charger, manual.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Sleman, D.I. Yogyakarta"
        }
    },
    {
        id: 2,
        nama: "VGA Card NVIDIA GeForce RTX 4070 Ti Super 16GB GDDR6X",
        kategori: "Komponen PC",
        harga: 14850000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
        lokasi: "Depok, Sleman",
        waktu_post: "Kemarin",
        kondisi: "Baru",
        deskripsi: "Barang Brand New In Box (BNIB), garansi resmi distributor 3 tahun. Siap untuk gaming 4K dan rendering AI.",
        penjual: {
            id: 2,
            nama: "Stalin Official Store",
            no_hp: "0811-2233-4455",
            lokasi: "Depok, Sleman"
        }
    },
    {
        id: 3,
        nama: "PC Gaming Fullset Core i5 Gen 12 + RTX 3060 12GB Siap Libas Game",
        kategori: "Komputer",
        harga: 11200000,
        stok: false,
        gambar: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80",
        lokasi: "Kota Yogyakarta",
        waktu_post: "3 hari yang lalu",
        kondisi: "Bekas",
        deskripsi: "Spek lengkap: i5-12400F, RTX 3060 12GB, RAM 16GB, SSD NVMe 512GB, PSU 650W Bronze. Sudah terpasang Windows 11.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Kota Yogyakarta"
        }
    },
    {
        id: 4,
        nama: "RAM Corsair Vengeance RGB PRO 32GB (2x16GB) DDR4 3600MHz",
        kategori: "Komponen PC",
        harga: 1450000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
        lokasi: "Bantul, D.I. Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: "Bekas",
        deskripsi: "Kondisi normal tes MemTest86 100% pass tanpa error. Lampu RGB sinkron iCUE. Lifetime warranty.",
        penjual: {
            id: 3,
            nama: "Dian Komputer",
            no_hp: "0877-9988-1122",
            lokasi: "Bantul, D.I. Yogyakarta"
        }
    },
    {
        id: 5,
        nama: "Monitor Gaming Xiaomi Curved 34 Inch WQHD 144Hz FreeSync",
        kategori: "Monitor",
        harga: 4650000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        lokasi: "Sleman, D.I. Yogyakarta",
        waktu_post: "2 hari yang lalu",
        kondisi: "Baru",
        deskripsi: "Layar lengkung 1500R sinematik, resolusi tajam 3440x1440 WQHD, refresh rate 144Hz. No dead pixel garansi toko.",
        penjual: {
            id: 2,
            nama: "Stalin Official Store",
            no_hp: "0811-2233-4455",
            lokasi: "Sleman, D.I. Yogyakarta"
        }
    },
    {
        id: 6,
        nama: "Keyboard Mechanical Keychron K2 Wireless RGB Gateron Brown",
        kategori: "Aksesoris Gaming",
        harga: 1100000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
        lokasi: "Kota Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: "Bekas",
        deskripsi: "Switch Gateron Brown tactile empuk, Bluetooth 5.1 lancar konek ke Mac/Windows, baterai 4000mAh awet berminggu-minggu.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Kota Yogyakarta"
        }
    },
    {
        id: 7,
        nama: "Processor AMD Ryzen 7 7800X3D Box Garansi Resmi",
        kategori: "Komponen PC",
        harga: 6450000,
        stok: true,
        gambar: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
        lokasi: "Mlati, Sleman",
        waktu_post: "Kemarin",
        kondisi: "Baru",
        deskripsi: "Prosesor gaming kencang nomor 1 dengan 3D V-Cache teknologi. Segel dus aman garansi resmi 3 tahun.",
        penjual: {
            id: 3,
            nama: "Dian Komputer",
            no_hp: "0877-9988-1122",
            lokasi: "Mlati, Sleman"
        }
    },
    {
        id: 8,
        nama: "Mouse Gaming Wireless Logitech G Pro X Superlight White",
        kategori: "Aksesoris Gaming",
        harga: 1250000,
        stok: false,
        gambar: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
        lokasi: "Sleman, D.I. Yogyakarta",
        waktu_post: "4 hari yang lalu",
        kondisi: "Bekas",
        deskripsi: "Sensor HERO 25K, bobot super ringan di bawah 63 gram. Masih berfungsi normal 100%, batre awet, no double click.",
        penjual: {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: "Sleman, D.I. Yogyakarta"
        }
    }
];

// Helper: Cari berdasarkan ID
produkData.getById = function(id) {
    return this.find(item => item.id === Number(id));
};

// Helper: Filter berdasarkan Pencarian, Kategori, dan Lokasi
produkData.search = function({ q, kategori, lokasi }) {
    return this.filter(item => {
        let matchQuery = true;
        let matchKategori = true;
        let matchLokasi = true;

        if (q && q.trim() !== '') {
            const queryStr = q.trim().toLowerCase();
            matchQuery = item.nama.toLowerCase().includes(queryStr) ||
                         item.kategori.toLowerCase().includes(queryStr) ||
                         (item.deskripsi && item.deskripsi.toLowerCase().includes(queryStr));
        }

        if (kategori && kategori !== 'Semua Kategori' && kategori.trim() !== '') {
            matchKategori = item.kategori.toLowerCase() === kategori.trim().toLowerCase();
        }

        if (lokasi && lokasi !== 'Semua Lokasi' && lokasi.trim() !== '') {
            matchLokasi = item.lokasi.toLowerCase().includes(lokasi.trim().toLowerCase());
        }

        return matchQuery && matchKategori && matchLokasi;
    });
};

// Helper: Tambah produk baru (fitur + JUAL)
produkData.create = function(newProduct) {
    const nextId = this.length > 0 ? Math.max(...this.map(p => p.id)) + 1 : 1;
    const item = {
        id: nextId,
        nama: newProduct.nama,
        kategori: newProduct.kategori || "Komponen PC",
        harga: Number(newProduct.harga) || 0,
        stok: true,
        gambar: newProduct.gambar && newProduct.gambar.trim() !== '' 
            ? newProduct.gambar.trim() 
            : "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
        lokasi: newProduct.lokasi || "Sleman, D.I. Yogyakarta",
        waktu_post: "Hari ini",
        kondisi: newProduct.kondisi || "Bekas",
        deskripsi: newProduct.deskripsi || "Kondisi hardware terawat dan siap pakai.",
        penjual: newProduct.penjual || {
            id: 1,
            nama: "Budi Hartono",
            no_hp: "0812-3456-7890",
            lokasi: newProduct.lokasi || "Sleman, D.I. Yogyakarta"
        }
    };
    this.unshift(item); // Masukkan paling atas (terbaru)
    return item;
};

// Helper: Toggle status stok / terjual
produkData.toggleStok = function(id) {
    const item = this.getById(id);
    if (item) {
        item.stok = !item.stok;
        return item;
    }
    return null;
};

// Helper: Ambil produk milik user tertentu
produkData.getByUserId = function(userId) {
    return this.filter(item => item.penjual && item.penjual.id === Number(userId));
};

module.exports = produkData;
