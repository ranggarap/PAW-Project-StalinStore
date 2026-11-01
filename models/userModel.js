// Model Pengguna (User / Akun Stalin Store)
const users = [
    {
        id: 1,
        nama: "Budi Hartono",
        email: "user@stalinstore.com",
        password: "password123",
        no_hp: "0812-3456-7890",
        lokasi: "Sleman, D.I. Yogyakarta",
        bio: "Kolektor dan penjual hardware komputer bekas & baru terpercaya di Yogyakarta.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
        bergabung: "Januari 2024"
    }
];

const findByEmail = (email) => {
    return users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
};

const findById = (id) => {
    return users.find(u => u.id === Number(id));
};

const createUser = ({ nama, email, password, no_hp, lokasi, bio }) => {
    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        no_hp: no_hp ? no_hp.trim() : "0812-0000-0000",
        lokasi: lokasi || "Sleman, D.I. Yogyakarta",
        bio: bio || "Pengguna aktif marketplace Stalin Store.",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nama)}`,
        bergabung: "November 2026"
    };
    users.push(newUser);
    return newUser;
};

const updateProfile = (id, data) => {
    const user = findById(id);
    if (!user) return null;
    if (data.nama) user.nama = data.nama.trim();
    if (data.no_hp) user.no_hp = data.no_hp.trim();
    if (data.lokasi) user.lokasi = data.lokasi.trim();
    if (data.bio) user.bio = data.bio.trim();
    return user;
};

module.exports = {
    users,
    findByEmail,
    findById,
    createUser,
    updateProfile
};
