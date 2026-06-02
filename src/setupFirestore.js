import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// ================= USERS =================
export async function createTestUser() {
  await setDoc(doc(db, "users", "test_user"), {
    uid: "test_user",
    email: "test@example.com",
    username: "Indra",
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
      bestStreak: 0
    }
  });

  console.log("Users collection created");
}

// ================= LEADERBOARDS =================
export async function createLeaderboard() {
  await setDoc(doc(db, "leaderboards", "level_1"), {
    levelId: 1,
    createdAt: serverTimestamp()
  });

  await setDoc(
    doc(db, "leaderboards", "level_1", "players", "test_user"),
    {
      uid: "test_user",
      username: "Indra",
      score: 1000,
      streak: 5,
      totalCorrect: 20,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    }
  );

  console.log("Leaderboard collection created");
}

// ================= GAME HISTORY =================
export async function createGameHistory() {
  await addDoc(collection(db, "gameHistory"), {
    uid: "test_user",
    username: "Indra",
    levelId: "5",
    mode: "sudden_death",
    score: 1500,
    streak: 10,
    totalQuestions: 20,
    correctAnswers: 18,
    accuracy: 90,
    gameTime: 120,
    isWon: true,
    reason: "win",
    createdAt: serverTimestamp()
  });

  console.log("Game history created");
}

// ================= CHALLENGES =================
export async function createChallenges() {
  await setDoc(doc(db, "challenges", "daily_1"), {
    type: "daily",
    title: "Daily Math Challenge",
    description: "Solve 20 random math problems!",
    active: true,
    targetScore: 5000,
    levelRange: [1, 45],
    createdAt: serverTimestamp()
  });

  await setDoc(doc(db, "challenges", "weekly_1"), {
    type: "weekly",
    title: "Weekly Master Challenge",
    description: "Compete with others!",
    active: true,
    targetScore: 50000,
    levelRange: [1, 45],
    createdAt: serverTimestamp()
  });

  console.log("Challenges collection created");
}

// ================= RUN ALL =================
export async function setupFirestore() {
  try {
    await createTestUser();
    await createLeaderboard();
    await createGameHistory();
    await createChallenges();

    console.log("ALL COLLECTIONS CREATED");
  } catch (error) {
    console.error(error);
  }
}