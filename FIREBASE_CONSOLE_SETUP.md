# 🔥 Tutorial Firebase Console - Membuat Collections

## Langkah 1: Buka Firebase Console

1. Pergi ke https://console.firebase.google.com
2. Pilih project **"master-math-a2a11"**
3. Di menu kiri, pilih **"Firestore Database"**

---

## Langkah 2: Buat Collection `users`

### Step A: Klik "Mulai koleksi"

- Klik tombol **"Mulai koleksi"** atau **"Create collection"**
- Masukkan nama koleksi: `users`
- Klik **"Next"**

### Step B: Tambahkan dokumen pertama (optional)

- Document ID: `(auto)` - biarkan Firebase auto-generate
- Klik **"Auto-generate ID"**
- Tambahkan field pertama:
  - Field name: `email`
  - Type: `String`
  - Value: `test@example.com`
- Klik **"Save"**

**Struktur users collection:**

```
/users/{userId}/
├── uid: string
├── email: string
├── username: string
├── score: number
├── level: number
├── completedLevels: array
├── completedChallenges: array
├── photoURL: string
├── createdAt: timestamp
├── lastLoginDate: string
├── totalCoins: number
├── achievements: array
└── stats: map
    ├── totalGamesPlayed: number
    ├── totalCorrect: number
    ├── totalWrong: number
    ├── averageAccuracy: number
    └── bestStreak: number
```

---

## Langkah 3: Buat Collection `leaderboards`

### Step A: Buat collection leaderboards

- Klik **"Create collection"**
- Nama: `leaderboards`
- Klik **"Next"**

### Step B: Buat dokumen untuk level 1

- Document ID: `level_1`
- Tambahkan field:
  - `levelId`: number, value: `1`
  - `createdAt`: timestamp, value: (current time)
- Klik **"Save"**

**Catatan:** Collections untuk leaderboard akan auto-create saat app pertama kali update scores. Format dokumentnya:

```
/leaderboards/level_1/players/{userId}
├── uid: string
├── username: string
├── score: number
├── streak: number
├── totalCorrect: number
├── createdAt: timestamp
└── lastUpdated: timestamp
```

---

## Langkah 4: Buat Collection `gameHistory`

### Step A: Buat collection

- Klik **"Create collection"**
- Nama: `gameHistory`
- Klik **"Next"**

### Step B: Tambahkan dokumen (optional untuk testing)

- Biarkan auto-generate ID
- Tambahkan fields:
  ```
  uid: "user123"
  username: "testuser"
  levelId: "5"
  mode: "sudden_death"
  score: 1500
  streak: 10
  totalQuestions: 20
  correctAnswers: 18
  accuracy: 90
  gameTime: 120
  isWon: true
  reason: "win"
  createdAt: (timestamp)
  ```

**Struktur:**

```
/gameHistory/{docId}
├── uid: string
├── username: string
├── levelId: string
├── mode: string (sudden_death|lives|20_questions)
├── score: number
├── streak: number
├── totalQuestions: number
├── correctAnswers: number
├── accuracy: number
├── gameTime: number
├── isWon: boolean
├── reason: string
└── createdAt: timestamp
```

---

## Langkah 5: Buat Collection `challenges`

### Step A: Buat collection

- Klik **"Create collection"**
- Nama: `challenges`
- Klik **"Next"**

### Step B: Buat dokumen "daily_1"

- Document ID: `daily_1`
- Tambahkan fields:
  ```
  type: "daily"
  title: "Daily Math Challenge"
  description: "Solve 20 random math problems!"
  active: true
  targetScore: 5000
  levelRange: array [1, 45]
  createdAt: (timestamp)
  ```

### Step C: Buat dokumen "weekly_1"

- Document ID: `weekly_1`
- Tambahkan fields:
  ```
  type: "weekly"
  title: "Weekly Master Challenge"
  description: "Compete with others!"
  active: true
  targetScore: 50000
  levelRange: array [1, 45]
  createdAt: (timestamp)
  ```

**Struktur:**

```
/challenges/{challengeId}
├── type: string (daily|weekly)
├── title: string
├── description: string
├── active: boolean
├── targetScore: number
├── levelRange: array [min, max]
└── createdAt: timestamp

/challenges/{challengeId}/participants/{userId}
├── uid: string
├── username: string
├── lastScore: number
├── bestScore: number
├── bestStreak: number
├── attempts: number
├── firstAttempt: timestamp
└── lastAttempt: timestamp
```

---

## Langkah 6: Setup Firestore Security Rules

### Step A: Buka Security Rules

- Di Firestore Database, klik tab **"Rules"**
- Hapus semua yang ada
- Paste kode berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - User bisa read/write data mereka sendiri
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth != null;
      allow write: if request.auth.uid == userId;
      allow read: if true; // Leaderboard data bisa dibaca semua
    }

    // Leaderboards - Semua bisa baca, hanya user terauth bisa write
    match /leaderboards/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Challenges - Semua bisa baca
    match /challenges/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Game History - Hanya user sendiri bisa baca
    match /gameHistory/{gameId} {
      allow read, write: if request.auth.uid == resource.data.uid;
    }

    // Challenge Attempts
    match /challengeAttempts/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step B: Klik "Publikasikan"

- Setelah paste kode, klik **"Publikasikan"** (Publish)
- Tunggu sampai selesai

---

## Langkah 7: Verifikasi Firestore Indexes (Jika Diperlukan)

### Jika ada warning tentang indexes:

1. Klik notifikasi "Create index" yang muncul
2. Klik **"Buat indeks"** untuk composite indexes
3. Firestore akan membuat indexnya otomatis

**Indexes yang mungkin dibutuhkan:**

```
Collection: users
- Score descending (untuk leaderboard)

Collection: leaderboards/level_X/players
- Score descending (untuk level leaderboard)

Collection: challenges/challenge_id/participants
- bestScore descending (untuk challenge leaderboard)
```

---

## Langkah 8: Test Koneksi

1. **Login ke aplikasi** dengan email/password
2. **Buka Firestore Console**
3. Klik collection **"users"**
4. **Cari user Anda** - harus muncul dokumen baru dengan ID = uid
5. **Verifikasi data:**
   - username ada ✓
   - email ada ✓
   - score ada ✓
   - level ada ✓

Jika berhasil ✅, Firebase sekarang ready!

---

## Quick Reference - Collections Structure

```
master-math-a2a11/
├── users/
│   └── {userId}/ (auto-created saat login)
│       ├── uid
│       ├── email
│       ├── username
│       ├── score
│       ├── level
│       ├── completedLevels
│       ├── createdAt
│       └── stats/
├── leaderboards/
│   ├── level_1/
│   │   └── players/ (auto-created saat save game)
│   │       └── {userId}/
│   └── level_2/ ... level_45/
├── challenges/
│   ├── daily_1/
│   │   └── participants/ (auto-created saat ambil challenge)
│   └── weekly_1/
├── gameHistory/
│   └── {docId}/ (auto-created saat game selesai)
└── challengeAttempts/
    └── {docId}/ (auto-created saat ambil challenge)
```

---

## Troubleshooting

### ❌ Error "Permission denied"

**Solusi:**

1. Pastikan user sudah login
2. Buka Firebase Console → Rules
3. Pastikan rules sudah benar (langkah 6)
4. Klik "Publikasikan" ulang

### ❌ Data tidak muncul setelah login

**Solusi:**

1. Pastikan user document ada di `users/{userId}`
2. Cek rules - mungkin blocked
3. Lihat browser console untuk error messages
4. Try logout dan login ulang

### ❌ Collection tidak ada

**Solusi:**

1. Collections auto-create saat data pertama kali disimpan
2. Jika ingin manual, ikuti langkah 2-5 di atas
3. Pastikan spelling benar (case-sensitive)

---

## 🎯 Setelah Setup Selesai

✅ Collections sudah siap
✅ Security Rules sudah aman
✅ Firebase Console sudah verifikasi

**Selanjutnya:**

- Login/Register seharusnya bisa dengan data sync
- Semua screens akan otomatis mendapat data real-time
- Game results akan tersimpan otomatis

Ready untuk test! 🚀
