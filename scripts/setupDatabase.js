#!/usr/bin/env node

/**
 * Script untuk setup Firebase Firestore Collections
 *
 * Cara menjalankan:
 * 1. Buka terminal di VS Code (Ctrl+`)
 * 2. Pastikan di folder root project
 * 3. Jalankan: node scripts/setupDatabase.js
 *
 * PENTING: Pastikan sudah login ke Firebase terlebih dahulu!
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDGTT4n9fk1CDdcapnih9LtTui3oAl5OHc",
  authDomain: "master-math-a2a11.firebaseapp.com",
  projectId: "master-math-a2a11",
  storageBucket: "master-math-a2a11.appspot.com",
  messagingSenderId: "89603759343",
  appId: "1:89603759343:web:1cef71b0385d3fccc28f1a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("\n🔥 Firebase Setup Script");
console.log("========================\n");

// ================= SETUP FUNCTIONS =================

async function setupUsers() {
  console.log("📝 Setting up users collection...");
  try {
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
    console.log("   ✅ Users collection ready\n");
  } catch (error) {
    console.error("   ❌ Error:", error.message, "\n");
    throw error;
  }
}

async function setupLeaderboards() {
  console.log("📝 Setting up leaderboards collection...");
  try {
    const batch = writeBatch(db);

    // Create 45 levels
    for (let level = 1; level <= 45; level++) {
      const levelDocRef = doc(db, "leaderboards", `level_${level}`);
      batch.set(levelDocRef, {
        levelId: level,
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();

    // Add test player to level_1
    await setDoc(doc(db, "leaderboards", "level_1", "players", "test_user"), {
      uid: "test_user",
      username: "Test User",
      score: 0,
      streak: 0,
      totalCorrect: 0,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    });

    console.log("   ✅ Leaderboards collection ready (45 levels)\n");
  } catch (error) {
    console.error("   ❌ Error:", error.message, "\n");
    throw error;
  }
}

async function setupGameHistory() {
  console.log("📝 Setting up gameHistory collection...");
  try {
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
    console.log("   ✅ GameHistory collection ready\n");
  } catch (error) {
    console.error("   ❌ Error:", error.message, "\n");
    throw error;
  }
}

async function setupChallenges() {
  console.log("📝 Setting up challenges collection...");
  try {
    await setDoc(doc(db, "challenges", "daily_1"), {
      type: "daily",
      title: "Daily Math Challenge",
      description: "Solve 20 random math problems!",
      active: true,
      targetScore: 5000,
      levelRange: [1, 45],
      createdAt: serverTimestamp(),
    });

    await setDoc(doc(db, "challenges", "weekly_1"), {
      type: "weekly",
      title: "Weekly Master Challenge",
      description: "Compete with others!",
      active: true,
      targetScore: 50000,
      levelRange: [1, 45],
      createdAt: serverTimestamp(),
    });

    console.log("   ✅ Challenges collection ready\n");
  } catch (error) {
    console.error("   ❌ Error:", error.message, "\n");
    throw error;
  }
}

async function setupChallengeAttempts() {
  console.log("📝 Setting up challengeAttempts collection...");
  try {
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
    console.log("   ✅ ChallengeAttempts collection ready\n");
  } catch (error) {
    console.error("   ❌ Error:", error.message, "\n");
    throw error;
  }
}

// ================= MAIN EXECUTION =================

async function main() {
  try {
    console.log("⏳ Initializing Firebase collections...\n");

    await setupUsers();
    await setupLeaderboards();
    await setupGameHistory();
    await setupChallenges();
    await setupChallengeAttempts();

    console.log("════════════════════════════════════════");
    console.log("✅ ✅ ✅ Setup Complete! ✅ ✅ ✅");
    console.log("════════════════════════════════════════\n");
    console.log("📊 Collections yang telah dibuat:");
    console.log("   • users");
    console.log("   • leaderboards (45 levels)");
    console.log("   • gameHistory");
    console.log("   • challenges");
    console.log("   • challengeAttempts\n");
    console.log("🔗 Verifikasi di Firebase Console:");
    console.log(
      "   https://console.firebase.google.com/project/master-math-a2a11\n",
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.error("\nMungkin karena:");
    console.error("   • Collections sudah ada (aman, tidak ada yang dihapus)");
    console.error("   • Network connection error");
    console.error("   • Firebase credentials error\n");

    process.exit(1);
  }
}

main();
