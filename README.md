# Master Math 🧮

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![Expo](https://img.shields.io/badge/platform-Expo-black.svg)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/database-Firebase-orange.svg)](https://firebase.google.com/)

**Master Math** adalah aplikasi mobile edukasi berbasis permainan yang dirancang untuk melatih kecepatan dan ketepatan berhitung pengguna. Dibangun menggunakan **React Native (Expo)** dan **Firebase**, aplikasi ini menawarkan pengalaman belajar matematika yang seru dan kompetitif.

## ✨ Fitur Utama

*   **🎮 Gameplay Imersif:** Mode permainan menantang dengan sistem waktu dan nyawa.
*   **🏆 Leaderboard Terpadu:** Pantau peringkat Anda dalam mode Global maupun mode Tantangan Harian.
*   **📦 Gudang Soal (Question Warehouse):** Kumpulan soal latihan dari berbagai kategori (Pertambahan, Perkalian, Aljabar, hingga Kalkulus) dengan fitur pindah tampilan (Grid & List).
*   **💪 Mode Latihan:** Latih kemampuan Anda tanpa tekanan waktu dengan cara penyelesaian yang lengkap.
*   **👤 Profil Kustom:** Personalisasi akun Anda dan pantau riwayat skor tertinggi.
*   **💎 UI Premium:** Desain modern dengan gaya **Dark Glassmorphism** yang elegan dan nyaman di mata.

## 🚀 Teknologi yang Digunakan

*   **Frontend:** React Native (Expo)
*   **State Management:** React Hooks
*   **Database & Auth:** Firebase Firestore & Firebase Authentication
*   **UI Framework:** React Native Paper & Expo Linear Gradient
*   **Navigation:** React Navigation (Stack & Tabs)

## 🛠️ Cara Instalasi & Menjalankan

1.  **Clone Repositori:**
    ```bash
    git clone https://github.com/IndraMahayana/Master-Math.git
    cd Master-Math
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install
    ```

3.  **Konfigurasi Firebase:**
    Buat file `src/firebaseConfig.js` dan masukkan konfigurasi Firebase Anda (pastikan file ini tidak di-track oleh git).

4.  **Jalankan Aplikasi:**
    ```bash
    # Untuk menjalankan di web
    npm run web

    # Untuk menjalankan di Android/iOS (memerlukan Expo Go)
    npm run start
    ```

## 📁 Struktur Proyek

```text
Master-Math/
├── Assets/             # Aset gambar dan media
├── src/
│   ├── components/     # Komponen UI yang dapat digunakan kembali
│   ├── screens/        # Layar utama aplikasi (Home, Login, Gameplay, dll)
│   ├── utils/          # Fungsi pembantu dan penyimpanan
│   └── firebaseConfig.js # Konfigurasi Firebase (Diabaikan git)
├── App.js              # Entry point aplikasi & konfigurasi navigasi
└── app.json            # Konfigurasi Expo
```

## 🔐 Keamanan

Informasi mengenai kebijakan keamanan kami dapat ditemukan di [SECURITY.md](SECURITY.md).

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---
Dibuat dengan ❤️ oleh [Indra Mahayana](https://github.com/IndraMahayana)
