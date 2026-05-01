/**
 * leaderboardSystem.js
 * Manages per-level leaderboards (highest streak, highest score).
 * Note: These are stubbed functions that should be called within Firebase context.
 */

import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

/**
 * Updates the leaderboard for a specific level.
 * @param {string|number} level - The level ID
 * @param {Object} runData - { score: number, streak: number, username: string }
 */
export const updateLeaderboard = async (level, runData) => {
  if (!auth.currentUser) return;
  try {
    const levelRef = doc(db, 'leaderboards', `level_${level}`);
    const userLeaderboardRef = doc(collection(levelRef, 'players'), auth.currentUser.uid);
    
    const snap = await getDoc(userLeaderboardRef);
    if (snap.exists()) {
      const existingData = snap.data();
      // Update only if the new score or streak is higher
      let updates = {};
      if (runData.score > existingData.score) updates.score = runData.score;
      if (runData.streak > existingData.streak) updates.streak = runData.streak;
      
      if (Object.keys(updates).length > 0) {
        updates.lastUpdated = new Date().toISOString();
        updates.username = runData.username || existingData.username;
        await updateDoc(userLeaderboardRef, updates);
      }
    } else {
      await setDoc(userLeaderboardRef, {
        username: runData.username || 'Guest',
        score: runData.score,
        streak: runData.streak,
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
};

/**
 * Gets top players for a level, sorted by highest streak, then highest score.
 * @param {string|number} level 
 * @returns {Array} Array of player objects
 */
export const getTopPlayers = async (level) => {
  try {
    const playersRef = collection(db, 'leaderboards', `level_${level}`, 'players');
    // Firebase requires composite indexes for multiple orderBys, so we sort by streak primarily
    const q = query(playersRef, orderBy('streak', 'desc'), orderBy('score', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    
    let topPlayers = [];
    querySnapshot.forEach((doc) => {
      topPlayers.push(doc.data());
    });
    return topPlayers;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
