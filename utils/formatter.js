// Memformat angka menjadi format mata uang Rupiah (contoh: Rp 15.000.000)
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Number(number) || 0);
};

// Memformat waktu saat ini ke format ISO string (untuk Middleware & API)
const formatDate = () => {
    return new Date().toISOString();
};

// Format tanggal lokal ramah pengguna (contoh: 01 Nov 2026)
const formatTanggalLokal = (date = new Date()) => {
    try {
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date(date));
    } catch {
        return "Hari ini";
    }
};

module.exports = {
    formatRupiah,
    formatDate,
    formatTanggalLokal
};
