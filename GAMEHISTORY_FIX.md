# 🎮 Fix Game History Collection

Jika riwayat permainan masih tidak muncul, ikuti langkah-langkah ini:

## ✅ Langkah 1: Update Firestore Security Rules

1. **Buka Firebase Console** → Pilih project `master-math-a2a11`
2. Klik **Firestore Database** → Tab **"Rules"**
3. **Ganti seluruh rules** dengan kode ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - User bisa read/write data mereka sendiri
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth != null;
      allow write: if request.auth.uid == userId;
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

    // Game History - Authenticated user bisa read/write
    match /gameHistory/{gameId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.uid;
    }

    // Challenge Attempts
    match /challengeAttempts/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Klik **"Publikasikan"** (Publish) - tunggu sampai berhasil ✅

---

## ✅ Langkah 2: Buat Index untuk Query (Jika Ada Error)

Jika di konsol muncul error "Firestore requires an index", ikuti link otomatis Firebase atau:

1. Di tab **"Firestore Database"** → **"Indexes"**
2. Klik **"Create Index"**
3. Isi:
   - **Collection**: `gameHistory`
   - **Fields to index**:
     - `uid` (Ascending)
     - `createdAt` (Descending)
4. Klik **"Create"** - tunggu sampai status **"Enabled"** ✅

---

## ✅ Langkah 3: Clear Browser Cache & Reload

1. **F12** → **Application** → **IndexedDB** → **master-math-a2a11** → Hapus semuanya
2. Reload aplikasi
3. Buka DevTools Console (F12)
4. Mainkan 1 game sampai selesai
5. Lihat console logs untuk debug:
   - `✅ Game saved to gameHistory:` ← data tersimpan
   - `📊 Game History Query Result:` ← data dimuat dari ProfileScreen

---

## 🧪 Testing Checklist

- [ ] Rules sudah di-publish
- [ ] Index sudah "Enabled" status
- [ ] Browser cache sudah di-clear
- [ ] Sudah test play 1 game
- [ ] Lihat console untuk confirm save & load
- [ ] Riwayat permainan muncul di ProfileScreen ✅

---

## 💡 Debug Tips

Jika masih error, check console untuk pesan error seperti:

- `permission-denied` → Rules masih belum update
- `firestore-requires-index` → Buat index sesuai langkah 2
- `INTERNAL` → Ada bug di kode (check logs detail)
