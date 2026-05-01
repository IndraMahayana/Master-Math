/**
 * challengeSystem.js
 * Handles the Hybrid Unlock System (Unlock by Score OR by Challenge).
 */

import { getRequiredScore } from './progressionSystem';

/**
 * Evaluates if a level is unlocked.
 * A level is unlocked if the player's total score >= requiredScore OR if they completed the challenge of the previous level.
 * @param {Object} playerData - { score: number, completedChallenges: string[] }
 * @param {Object} levelData - { id: string|number }
 * @returns {boolean}
 */
export const isLevelUnlocked = (playerData, levelData) => {
  const levelNum = parseInt(levelData.id, 10);
  if (levelNum === 1) return true;

  const requiredScore = getRequiredScore(levelNum);
  const playerScore = playerData?.score || 0;

  // Condition 1: Player has enough total score
  if (playerScore >= requiredScore) {
    return true;
  }

  // Condition 2: Player has completed the challenge for the previous level
  // Since challenge is "Selesaikan tanpa salah", the challenge ID can be represented as `perfect_level_${levelNum - 1}`
  const prevLevelChallengeId = `perfect_level_${levelNum - 1}`;
  const completedChallenges = playerData?.completedChallenges || [];

  if (completedChallenges.includes(prevLevelChallengeId)) {
    return true;
  }

  return false;
};
