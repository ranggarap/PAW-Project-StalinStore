const userModel = require('../models/userModel');
const produkModel = require('../models/produkModel');
const { formatRupiah } = require('../utils/formatter');

// Halaman Login
const getLoginPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    const redirectUrl = req.query.redirect || '/';
    res.render('login', {
        title: 'Login Akun - Stalin Store',
        redirectUrl,
        error: null
    });
};

// Proses Login
const postLogin = async (req, res) => {
    try {
        const { email, password, redirectUrl } = req.body;
        const user = await userModel.findByEmail(email);

        if (!user || user.password !== password) {
            return res.render('login', {
                title: 'Login Akun - Stalin Store',
                redirectUrl: redirectUrl || '/',
                error: 'Email atau password yang Anda masukkan salah! (Coba: user@stalinstore.com / password123)'
            });
        }

        // Set user di session
        req.session.user = {
            id: user.id,
            nama: user.nama,
            email: user.email,
            no_hp: user.no_hp,
            lokasi: user.lokasi,
            bio: user.bio,
            avatar: user.avatar,
            bergabung: user.bergabung
        };

        req.session.flash = {
            type: 'success',
            message: `Selamat datang kembali, ${user.nama}!`
        };

        res.redirect(redirectUrl || '/profile');
    } catch (err) {
        console.error('Error postLogin:', err);
        res.render('login', {
            title: 'Login Akun - Stalin Store',
            redirectUrl: '/',
            error: 'Terjadi kesalahan sistem saat proses login.'
        });
    }
};

// Halaman Pendaftaran Akun
const getRegisterPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/profile');
    }
    res.render('register', {
        title: 'Daftar Akun Baru - Stalin Store',
        error: null
    });
};

// Proses Pendaftaran Akun
const postRegister = async (req, res) => {
    try {
        const { nama, email, password, no_hp, lokasi } = req.body;

        if (!nama || !email || !password) {
            return res.render('register', {
                title: 'Daftar Akun Baru - Stalin Store',
                error: 'Mohon isi seluruh field wajib (Nama, Email, dan Password)!'
            });
        }

        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.render('register', {
                title: 'Daftar Akun Baru - Stalin Store',
                error: 'Email ini sudah terdaftar. Silakan gunakan email lain atau login langsung.'
            });
        }

        const newUser = await userModel.createUser({
            nama,
            email,
            password,
            no_hp,
            lokasi
        });

        // Otomatis login setelah daftar
        req.session.user = newUser;
        req.session.flash = {
            type: 'success',
            message: 'Akun berhasil dibuat! Selamat datang di Stalin Store.'
        };

        res.redirect('/profile');
    } catch (err) {
        console.error('Error postRegister:', err);
        res.render('register', {
            title: 'Daftar Akun Baru - Stalin Store',
            error: 'Terjadi kesalahan sistem saat proses registrasi.'
        });
    }
};

// Proses Logout
const getLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

// Halaman Profil Akun Saya
const getProfilePage = async (req, res) => {
    try {
        const currentUser = req.session.user;
        const userAds = await produkModel.getByUserId(currentUser.id);

        res.render('profile', {
            title: `Profil Saya - ${currentUser.nama}`,
            profileUser: currentUser,
            userAds,
            formatRupiah,
            message: null
        });
    } catch (err) {
        console.error('Error getProfilePage:', err);
        res.redirect('/');
    }
};

// Update Data Profil
const postUpdateProfile = async (req, res) => {
    try {
        const currentUser = req.session.user;
        const { nama, no_hp, lokasi, bio } = req.body;

        const updated = await userModel.updateProfile(currentUser.id, {
            nama,
            no_hp,
            lokasi,
            bio
        });

        if (updated) {
            req.session.user = updated;
        }

        const userAds = await produkModel.getByUserId(currentUser.id);

        res.render('profile', {
            title: `Profil Saya - ${(updated || currentUser).nama}`,
            profileUser: updated || currentUser,
            userAds,
            formatRupiah,
            message: 'Profil berhasil diperbarui di database!'
        });
    } catch (err) {
        console.error('Error postUpdateProfile:', err);
        res.redirect('/profile');
    }
};

module.exports = {
    getLoginPage,
    postLogin,
    getRegisterPage,
    postRegister,
    getLogout,
    getProfilePage,
    postUpdateProfile
};
