const db = require('../config/database');

// Memory Data Store sebagai cadangan aman untuk User
let localUsers = [
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

function formatUserRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        nama: row.nama,
        email: row.email,
        password: row.password,
        no_hp: row.no_hp || "0812-0000-0000",
        lokasi: row.lokasi || "Sleman, D.I. Yogyakarta",
        bio: row.bio || "Pengguna aktif marketplace Stalin Store.",
        avatar: row.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.nama)}`,
        bergabung: row.bergabung || "November 2026",
        created_at: row.created_at
    };
}

const userModel = {
    async findByEmail(email) {
        if (!email) return null;
        const normalized = email.trim().toLowerCase();

        if (db.isConnected) {
            try {
                const res = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [normalized]);
                if (res.rows.length > 0) {
                    return formatUserRow(res.rows[0]);
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in findByEmail]:', err.message);
            }
        }

        const found = localUsers.find(u => u.email.toLowerCase() === normalized);
        return found ? { ...found } : null;
    },

    async findById(id) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        if (db.isConnected) {
            try {
                const res = await db.query('SELECT * FROM users WHERE id = $1', [numId]);
                if (res.rows.length > 0) {
                    return formatUserRow(res.rows[0]);
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in findById]:', err.message);
            }
        }

        const found = localUsers.find(u => u.id === numId);
        return found ? { ...found } : null;
    },

    async createUser({ nama, email, password, no_hp, lokasi, bio }) {
        const trimmedNama = (nama || '').trim();
        const trimmedEmail = (email || '').trim().toLowerCase();
        const trimmedHp = no_hp ? no_hp.trim() : "0812-0000-0000";
        const trimmedLokasi = lokasi || "Sleman, D.I. Yogyakarta";
        const trimmedBio = bio || "Pengguna aktif marketplace Stalin Store.";
        const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedNama)}`;
        const bergabung = "November 2026";

        if (db.isConnected) {
            try {
                const sql = `
                    INSERT INTO users (nama, email, password, no_hp, lokasi, bio, avatar, bergabung)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING *
                `;
                const params = [trimmedNama, trimmedEmail, password, trimmedHp, trimmedLokasi, trimmedBio, avatar, bergabung];
                const res = await db.query(sql, params);
                return formatUserRow(res.rows[0]);
            } catch (err) {
                console.error('[DATABASE ERROR in createUser]:', err.message);
            }
        }

        // Fallback Create User
        const nextId = localUsers.length > 0 ? Math.max(...localUsers.map(u => u.id)) + 1 : 1;
        const newUser = {
            id: nextId,
            nama: trimmedNama,
            email: trimmedEmail,
            password,
            no_hp: trimmedHp,
            lokasi: trimmedLokasi,
            bio: trimmedBio,
            avatar,
            bergabung
        };
        localUsers.push(newUser);
        return newUser;
    },

    async updateProfile(id, data) {
        const numId = Number(id);
        if (isNaN(numId)) return null;

        if (db.isConnected) {
            try {
                const current = await this.findById(numId);
                if (!current) return null;

                const nama = data.nama ? data.nama.trim() : current.nama;
                const no_hp = data.no_hp ? data.no_hp.trim() : current.no_hp;
                const lokasi = data.lokasi ? data.lokasi.trim() : current.lokasi;
                const bio = data.bio !== undefined ? data.bio.trim() : current.bio;

                const sql = `
                    UPDATE users
                    SET nama = $1, no_hp = $2, lokasi = $3, bio = $4
                    WHERE id = $5
                    RETURNING *
                `;
                const res = await db.query(sql, [nama, no_hp, lokasi, bio, numId]);
                if (res.rows.length > 0) {
                    return formatUserRow(res.rows[0]);
                }
                return null;
            } catch (err) {
                console.error('[DATABASE ERROR in updateProfile]:', err.message);
            }
        }

        // Fallback Update
        const user = localUsers.find(u => u.id === numId);
        if (!user) return null;
        if (data.nama) user.nama = data.nama.trim();
        if (data.no_hp) user.no_hp = data.no_hp.trim();
        if (data.lokasi) user.lokasi = data.lokasi.trim();
        if (data.bio !== undefined) user.bio = data.bio.trim();
        return { ...user };
    }
};

module.exports = userModel;
