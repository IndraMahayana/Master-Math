# 🚀 Cara Membuat Firebase Collections dari VS Code

Ada **2 cara** untuk membuat collections dari VS Code tanpa perlu manual di Firebase Console:

---

## **Cara 1: Menjalankan Script Setup (RECOMMENDED)**

### Langkah:

1. **Buka Terminal di VS Code**
   - Tekan `Ctrl + `` (backtick) atau `View → Terminal`

2. **Pastikan di folder root project:**

   ```powershell
   cd "c:\Users\indra\Documents\TI UNMAS\Tugas Kuliah\Semester 4\MOBILE PROGGRAMING\Master Math"
   ```

3. **Jalankan setup script:**

   ```powershell
   node scripts/setupDatabase.mjs
   ```

4. **Tunggu sampai selesai** (sekitar 5-10 detik)

Output yang sukses:

```
🔥 Firebase Setup Script
========================

📝 Setting up users collection...
   ✅ Users collection ready

📝 Setting up leaderboards collection...
   ✅ Leaderboards collection ready (45 levels)

📝 Setting up gameHistory collection...
   ✅ GameHistory collection ready

📝 Setting up challenges collection...
   ✅ Challenges collection ready

📝 Setting up challengeAttempts collection...
   ✅ ChallengeAttempts collection ready

════════════════════════════════════════
✅ ✅ ✅ Setup Complete! ✅ ✅ ✅
════════════════════════════════════════
```

5. **Verifikasi di Firebase Console:**
   - Buka https://console.firebase.google.com
   - Pilih project `master-math-a2a11`
   - Klik Firestore Database
   - Lihat semua collections sudah ada ✓

---

## **Cara 2: Memanggil Fungsi dari App (Alternative)**

Jika ingin setup pertama kali saat app dijalankan:

### A. Edit `App.js`:

```javascript
import { initializeAllCollections } from "./src/setupInitialize";

export default function App() {
  useEffect(() => {
    // Jalankan setup saat app pertama kali
    initializeAllCollections().then(success => {
      if (success) {
        console.log("Firebase siap!");
      }
    });
  }, []);

  return (
    // ... rest of app
  );
}
```

### B. Atau buat button untuk manual setup:

```javascript
import { initializeAllCollections } from "./src/setupInitialize";

export function SettingsScreen() {
  const handleSetupDatabase = async () => {
    console.log("Setting up database...");
    const success = await initializeAllCollections();
    if (success) {
      Alert.alert("Success", "Database setup complete!");
    }
  };

  return (
    <View>
      <Button
        title="Setup Firebase Collections"
        onPress={handleSetupDatabase}
      />
    </View>
  );
}
```

---

## **Collections yang Dibuat**

### 1️⃣ **users** Collection

Menyimpan data user individual:

```
/users/{userId}
├── uid: string
├── email: string
├── username: string
├── score: number
├── level: number
├── completedLevels: array
├── stats: {
│   ├── totalGamesPlayed: number
│   ├── totalCorrect: number
│   └── bestStreak: number
├── createdAt: timestamp
└── ...
```

### 2️⃣ **leaderboards** Collection

45 documents (level_1 sampai level_45) dengan subcollection players:

```
/leaderboards/level_1
├── levelId: number
├── createdAt: timestamp
└── players/{userId}
    ├── uid: string
    ├── username: string
    ├── score: number
    └── streak: number
```

### 3️⃣ **gameHistory** Collection

Riwayat setiap game yang dimainkan:

```
/gameHistory/{docId}
├── uid: string
├── username: string
├── levelId: string
├── mode: string (practice|sudden_death|lives|20_questions)
├── score: number
├── accuracy: number
├── isWon: boolean
└── createdAt: timestamp
```

### 4️⃣ **challenges** Collection

Daily dan weekly challenges:

```
/challenges/daily_1
├── type: string (daily|weekly)
├── title: string
├── description: string
├── active: boolean
├── targetScore: number
├── levelRange: [1, 45]
└── createdAt: timestamp

/challenges/daily_1/participants/{userId}
├── uid: string
├── username: string
├── lastScore: number
├── bestScore: number
└── attempts: number
```

### 5️⃣ **challengeAttempts** Collection

Tracking setiap attempt challenge:

```
/challengeAttempts/{docId}
├── uid: string
├── challengeId: string
├── score: number
├── streak: number
├── accuracy: number
├── isCompleted: boolean
└── createdAt: timestamp
```

---

## **Jika Error**

### ❌ "Cannot find module 'firebase/app'"

**Solusi:** Install Firebase packages

```powershell
npm install firebase
```

### ❌ "Permission denied" di Firestore

**Solusi:** Update Firestore Rules:

1. Buka Firebase Console → Firestore Database → Rules
2. Paste rules dari `FIREBASE_CONSOLE_SETUP.md` (Langkah 6)
3. Klik "Publish"

### ❌ Collections sudah ada

**Status:** AMAN ✅ Script akan skip collections yang sudah ada, tidak ada yang dihapus

---

## **Quick Command Cheat Sheet**

```powershell
# Setup database sekali saja
node scripts/setupDatabase.mjs

# Jika ingin reset (hapus manual dari Firebase Console dulu)
# Buka https://console.firebase.google.com
# Hapus collections yang ada, lalu run script lagi
```

---

## **Struktur File yang Dibuat**

```
Master Math/
├── scripts/
│   └── setupDatabase.mjs      ← Script untuk setup (.mjs = ES Module)
├── src/
│   ├── firebaseConfig.js      ← Config Firebase
│   ├── setupInitialize.js     ← Functions untuk setup
│   └── ...
└── ...
```

---

## ✅ Setelah Setup Berhasil

1. ✅ Semua collections sudah di Firestore
2. ✅ Documents template sudah ada untuk testing
3. ✅ Siap untuk login/register dan game dimulai
4. ✅ Real-time data sync sudah aktif

🎉 **Database Anda siap!**
