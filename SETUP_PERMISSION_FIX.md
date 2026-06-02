# 🔧 Perbaikan Permission Error

Ada 2 masalah dan solusinya:

## **Masalah 1: MODULE_TYPELESS_PACKAGE_JSON Warning** ✅ FIXED

Sudah ditambahkan `"type": "module"` ke [package.json](package.json)

---

## **Masalah 2: PERMISSION_DENIED Error**

Firestore rules tidak mengizinkan anonymous user untuk write. Ada **2 solusi**:

### **Solusi A: Update Firestore Rules (REKOMENDASI)**

Script setup memerlukan permissions untuk create collections. Anda perlu temporary update rules di Firebase Console:

#### Langkah:

1. **Buka Firebase Console**
   - https://console.firebase.google.com
   - Pilih project `master-math-a2a11`
   - Klik **Firestore Database** → Tab **Rules**

2. **Ganti dengan rules ini (TEMPORARY untuk setup):**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Temporary: Allow setup collections
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

3. **Klik "Publikasikan"**

4. **Jalankan setup script:**

   ```powershell
   node scripts/setupDatabase.js
   ```

5. **Setelah setup selesai, ganti kembali dengan rules aman:**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users
       match /users/{userId} {
         allow read: if request.auth.uid == userId || request.auth != null;
         allow write: if request.auth.uid == userId;
         allow read: if true;
       }

       // Leaderboards - Semua bisa baca, hanya auth bisa write
       match /leaderboards/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Challenges
       match /challenges/{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }

       // Game History
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

6. **Klik "Publikasikan" lagi**

---

### **Solusi B: Gunakan Service Account (Advanced)**

Jika ingin lebih secure dan otomatis:

1. Buat service account dari Firebase Console
2. Download JSON key
3. Update script untuk use service account

Tapi ini lebih kompleks, recommend Solusi A.

---

## **Quick Steps untuk Setup Sukses**

```
1. Update Firestore Rules ke TEMPORARY (allow all read/write)
2. Run: node scripts/setupDatabase.js
3. Tunggu sampai ✅ Success
4. Update Firestore Rules kembali ke SECURE
```

---

## **Jika Masih Error:**

❌ **Error: "Missing or insufficient permissions"**
→ Pastikan rules sudah "allow read, write: if true;" sebelum run

❌ **Error: "Failed to get document"**
→ Check internet connection

❌ **Script timeout**
→ Firestore sedang busy, coba lagi dalam 5 menit

---

Setelah rules update, jalankan lagi:

```powershell
node scripts/setupDatabase.js
```

Sukses! 🚀
