import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Inisialisasi semua collections dan documents di Firestore
 * Jalankan sekali saja untuk setup database
 */

// ================= HELPER FUNCTIONS =================

async function initializeUsersCollection() {
  console.log("📝 Membuat collection 'users'...");
  try {
    // Dokumen template untuk testing
    await setDoc(doc(db, "users", "test_user"), {
      uid: "test_user",
      email: "test@example.com",
      username: "Test User",
      score: 0,
      level: 1,
      completedLevels: [],
      completedChallenges: [],
      photoURL: "",
      createdAt: serverTimestamp(),
      lastLoginDate: new Date().toISOString(),
      totalCoins: 0,
      achievements: [],
      stats: {
        totalGamesPlayed: 0,
        totalCorrect: 0,
        totalWrong: 0,
        averageAccuracy: 0,
        bestStreak: 0,
      },
    });
    console.log("✅ Collection 'users' berhasil dibuat");
  } catch (error) {
    console.error("❌ Error creating users collection:", error);
    throw error;
  }
}

async function initializeLeaderboardsCollection() {
  console.log("📝 Membuat collection 'leaderboards'...");
  try {
    // Buat dokumen untuk setiap level (1-45)
    const batch = writeBatch(db);

    for (let level = 1; level <= 45; level++) {
      const levelDocRef = doc(db, "leaderboards", `level_${level}`);
      batch.set(levelDocRef, {
        levelId: level,
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();

    // Tambahkan test data untuk level_1
    await setDoc(doc(db, "leaderboards", "level_1", "players", "test_user"), {
      uid: "test_user",
      username: "Test User",
      score: 0,
      streak: 0,
      totalCorrect: 0,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });

    console.log("✅ Collection 'leaderboards' berhasil dibuat (45 levels)");
  } catch (error) {
    console.error("❌ Error creating leaderboards collection:", error);
    throw error;
  }
}

async function initializeGameHistoryCollection() {
  console.log("📝 Membuat collection 'gameHistory'...");
  try {
    // Template document untuk testing
    await addDoc(collection(db, "gameHistory"), {
      uid: "test_user",
      username: "Test User",
      levelId: "1",
      mode: "practice",
      score: 0,
      streak: 0,
      totalQuestions: 0,
      correctAnswers: 0,
      accuracy: 0,
      gameTime: 0,
      isWon: false,
      reason: "test",
      createdAt: serverTimestamp(),
    });
    console.log("✅ Collection 'gameHistory' berhasil dibuat");
  } catch (error) {
    console.error("❌ Error creating gameHistory collection:", error);
    throw error;
  }
}

async function initializeChallengesCollection() {
  console.log("📝 Membuat collection 'challenges'...");
  try {
    // Daily challenge
    await setDoc(doc(db, "challenges", "daily_1"), {
      type: "daily",
      title: "Daily Math Challenge",
      description: "Solve 20 random math problems!",
      active: true,
      targetScore: 5000,
      levelRange: [1, 45],
      createdAt: serverTimestamp(),
    });

    // Weekly challenge
    await setDoc(doc(db, "challenges", "weekly_1"), {
      type: "weekly",
      title: "Weekly Master Challenge",
      description: "Compete with others!",
      active: true,
      targetScore: 50000,
      levelRange: [1, 45],
      createdAt: serverTimestamp(),
    });

    console.log("✅ Collection 'challenges' berhasil dibuat");
  } catch (error) {
    console.error("❌ Error creating challenges collection:", error);
    throw error;
  }
}

async function initializeChallengeAttemptsCollection() {
  console.log("📝 Membuat collection 'challengeAttempts'...");
  try {
    // Template document
    await addDoc(collection(db, "challengeAttempts"), {
      uid: "test_user",
      challengeId: "daily_1",
      score: 0,
      streak: 0,
      totalCorrect: 0,
      accuracy: 0,
      isCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Collection 'challengeAttempts' berhasil dibuat");
  } catch (error) {
    console.error("❌ Error creating challengeAttempts collection:", error);
    throw error;
  }
}

// ================= MAIN INITIALIZATION =================

export async function initializeAllCollections() {
  console.log("\n🚀 Memulai inisialisasi Firebase Collections...\n");

  try {
    await initializeUsersCollection();
    await initializeLeaderboardsCollection();
    await initializeGameHistoryCollection();
    await initializeChallengesCollection();
    await initializeChallengeAttemptsCollection();

    console.log("\n✅ ✅ ✅ Semua collections berhasil dibuat! ✅ ✅ ✅\n");
    console.log("Sekarang buka Firebase Console untuk verifikasi:");
    console.log(
      "https://console.firebase.google.com/project/master-math-a2a11/firestore/data",
    );

    return true;
  } catch (error) {
    console.error("\n❌ Error during initialization:", error);
    return false;
  }
}

// Jalankan jika dipanggil langsung
// initializeAllCollections();
